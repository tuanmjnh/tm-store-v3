const mongoose = require('mongoose'),
  MPImports = require('./model'),
  MPImportItems = require('./model-items'),
  MProducts = require('../products/model'),
  AProducts = require('../products/actions'),
  // crypto = require('../../utils/crypto'),
  Request = require('../../utils/Request'),
  Logger = require('../../services/logger')

module.exports.get = ({ conditions }) => {
  return MPImports.aggregate([
    { $addFields: { 'code': { $toString: '$_id' } } },
    { $match: conditions }
    // { $match: { $and: [{ code: '6208b67d0becbc8c930eb762' }] } }
  ])
}

module.exports.select = ({ conditions, fields }) => {
  if (fields) {
    return MPImports.where(conditions, fields)
  } else {
    return MPImports.where(conditions)
  }
}

module.exports.getSub = ({ conditions }) => {
  const rs = MPImportItems.aggregate([
    { $match: conditions },
    {
      $lookup: {
        from: 'products',
        let: { product: '$product' },
        as: 'product',
        pipeline: [
          { $match: { $expr: { $and: [{ $eq: ['$_id', '$$product'] }] } } },
          {
            $lookup: {
              from: 'categories',
              let: { categories: '$categories' },
              as: 'category',
              pipeline: [
                { $addFields: { 'cateId': { $toString: '$_id' } } },
                { $match: { $expr: { $and: [{ $in: ['$cateId', '$$categories'] }] } } },
                { $project: { _id: 0, category: '$title' } }
              ]
            }
          },
          { $project: { _id: 0, title: '$title', code: '$code', categories: '$category.category' } }
        ]
      }
    },
    { $replaceRoot: { newRoot: { $mergeObjects: [{ $arrayElemAt: ['$product', 0] }, '$$ROOT'] } } },
    { $project: { _id: 1, product: 0 } },
  ])
  return rs
}

module.exports.insert = async ({ request, item, createdBy }) => {
  const session = await mongoose.startSession()
  const rs = { data: null, success: [], error: [] }
  await session.withTransaction(async () => {
    // Import total
    const total = new MPImports({
      // code: crypto.NewGuid('N'),
      products: item.length,
      quantities: 0,// item.sum('quantity'),
      prices: 0,//item.sum('amount'),
      // taxes: Math.round(item.sum('amount') * 0.1, 0),
      createdAt: new Date(),
      createdBy: createdBy || request.verify._id,
      createdIp: Request.getIp(request),
      flag: 1
    })
    total.validateSync()
    const totalSave = await total.save({ session: session })
    // Loop item
    for await (const e of item) {
      // check exist code
      const exist = await AProducts.exist(e.code)
      if (!exist) {
        // Insert new item
        const productSave = await AProducts.insert({ request: request, item: e, session: session })
        if (!productSave) {
          rs.error.push(e.code)
          continue
        } else rs.success.push(e.code)
        e._id = productSave._id // productSave.success._id
        //Set Logger
        Logger.set({ request: request, collectionName: AProducts.name, collectionID: productSave._id, method: 'insert-import' })
      } else {
        // Update price import and quantity
        await MProducts.updateOne(
          { _id: e._id },
          {
            $set: { priceImport: parseInt(e.priceImport) },
            $inc: { quantity: parseInt(e.quantity) }
          }, { session: session })
        //Set Logger
        Logger.set({ request: request, collectionName: AProducts.name, collectionID: e._id, method: 'update-import' })
      }

      // Import item
      const importItems = new MPImportItems({
        key: totalSave._id,
        product: e._id,
        price: parseInt(e.priceImport),
        quantity: parseInt(e.quantity),
        // amount: parseInt(e.priceImport) * parseInt(e.quantity)//parseInt(e.amount)
      })
      // items.validate()
      await importItems.save({ session: session })
      // if (!itemsSave) throw new Error('import item')

      // fix value Import total
      totalSave.quantities = totalSave.quantities + importItems.quantity
      totalSave.prices = totalSave.prices + (importItems.quantity * importItems.price)
    }
    // fix value Import total
    await MPImports.updateOne(
      { _id: totalSave._id },
      {
        $set: {
          quantities: totalSave.quantities,
          prices: totalSave.prices,
        }
      }, { session: session })
    rs.data = totalSave
    //Set Logger
    Logger.set({ request: request, collectionName: MPImports.collection.collectionName, collectionID: totalSave._id, method: 'insert' })
  })
  session.endSession()
  return rs
}