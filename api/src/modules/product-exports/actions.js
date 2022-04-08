const mongoose = require('mongoose'),
  MPExports = require('./model'),
  MPExportItems = require('./model-items'),
  MProducts = require('../products/model'),
  AProducts = require('../products/actions'),
  // crypto = require('../../utils/crypto'),
  Request = require('../../utils/Request'),
  Logger = require('../../services/logger')

module.exports.get = ({ conditions }) => {
  return MPExports.aggregate([
    { $addFields: { 'code': { $toString: '$_id' } } },
    { $match: conditions }
  ])
}

module.exports.select = ({ conditions, fields }) => {
  if (fields) {
    return MPExports.where(conditions, fields)
  } else {
    return MPExports.where(conditions)
  }
}

module.exports.getSub = ({ conditions }) => {
  const rs = MPExportItems.aggregate([
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
                { $match: { $expr: { $and: [{ $in: ['$_id', '$$categories'] }] } } },
                { $project: { _id: 0, category: '$title' } }
              ]
            }
          },
          // { $replaceRoot: { newRoot: { $mergeObjects: [{ $arrayElemAt: ['$category', 0] }, '$$ROOT'] } } },
          { $project: { _id: 0, title: '$title', code: '$code', categories: '$category.category' } }
        ]
      }
    },
    { $replaceRoot: { newRoot: { $mergeObjects: [{ $arrayElemAt: ['$product', 0] }, '$$ROOT'] } } },
    { $project: { _id: 1, product: 0 } },
    // { $project: { categories: '$categories.category' } },
    // { $replaceRoot: { newRoot: { $mergeObjects: [{ $push: { categories: '$category' } }, '$$ROOT'] } } },
  ])
  return rs
}

module.exports.insert = async ({ request, item, createdBy }) => {
  const session = await mongoose.startSession()
  const rs = { data: null, success: [], error: [] }
  await session.withTransaction(async () => {
    // Export total
    const total = new MPExports({
      // code: crypto.NewGuid('N'),
      products: item.length,
      quantities: 0,// item.sum('quantity'),
      prices: 0,//item.sum('amount'),
      // taxes: amount,//Math.round(item.sum('amount') * 0.1, 0),
      createdAt: new Date(),
      createdBy: createdBy || request.verify._id,
      createdIp: Request.getIp(request),
      flag: 1
    })
    total.validateSync()
    const totalSave = await total.save({ session: session })
    // Loop item
    for await (const e of item) {
      // Export item
      const exportItems = new MPExportItems({
        key: _id,//totalSave._id,
        product: e._id,
        price: parseInt(e.priceExport),
        quantity: parseInt(e.quantity),
        // amount: parseInt(e.priceExport) * parseInt(e.quantity)
      })
      exportItems.validateSync()
      await exportItems.save({ session: session })

      // Update price export and quantity
      await MProducts.updateOne(
        { _id: e._id },
        {
          $set: { priceExport: parseInt(e.priceExport) },
          $inc: { quantity: -parseInt(e.quantity) }
        }, { session: session })
      // fix value Export total
      totalSave.quantities = totalSave.quantities + exportItems.quantity
      totalSave.prices = totalSave.prices + (exportItems.quantity * exportItems.price)
      //Set Logger
      Logger.set({ request: request, collectionName: MProducts.collection.collectionName, collectionID: e._id, method: 'update-export' })
    }
    // fix value Export total
    await MPExports.updateOne(
      { _id: totalSave._id },
      {
        $set: {
          quantities: totalSave.quantities,
          prices: totalSave.prices,
        }
      }, { session: session })
    rs.data = totalSave
    //Set Logger
    Logger.set({ request: request, collectionName: MPExports.collection.collectionName, collectionID: totalSave._id, method: 'insert' })
  })
  session.endSession()
  return rs
}

// module.exports.put = async ({ request }) => {
//   const rs = { success: [], error: [] }
//   for await (let id of request.body.id) {
//     // Set status cancel
//     const exp = await MPExports.updateOne({ _id: id }, { $set: { flag: 0 } })
//     // Find export items
//     const exp_item = await MPExportItems.where({ key: id })
//     for await (const e of exp_item) {
//       // Update price export and quantity
//       await MProducts.updateOne({ _id: e.product }, { $inc: { quantity: +parseInt(e.quantity) } })
//     }
//     if (exp) {
//       rs.success.push(id)
//     } else rs.error.push(id)
//   }
//   return rs
// }

module.exports.cancel = async ({ request }) => {
  const session = await mongoose.startSession()
  const rs = { success: [], error: [] }
  await session.withTransaction(async () => {
    for await (let id of request.body.id) {
      // Set status cancel
      const exp = await MPExports.updateOne({ _id: id }, { $set: { flag: 0 } }, { session: session })
      // Find export items
      const exp_item = await MPExportItems.where({ key: id }).session(session)
      for await (const e of exp_item) {
        // Update price export and quantity
        await MProducts.updateOne({ _id: e.product }, { $inc: { quantity: parseInt(e.quantity) } }, { session: session })
      }
      if (exp) {
        rs.success.push(id)
      } else rs.error.push(id)
    }
  })
  session.endSession()
  return rs
}

module.exports.confirm = async ({ request }) => {
  const session = await mongoose.startSession()
  const rs = { success: [], error: [] }
  await session.withTransaction(async () => {
    for await (let id of request.body.id) {
      const update = await MPExports.updateOne({ _id: id }, { $set: { flag: 2 } }, { session: session })
      if (update) {
        rs.success.push(id)
      } else rs.error.push(id)
    }
  })
  session.endSession()
  return rs
}