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

module.exports.insert = async ({ request, item, createdBy, isLog, type }) => {
  const rs = { data: null, success: [], error: [] }
  isLog = isLog || true
  try {
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
    const totalSave = await total.save()

    // Push logs product import
    if (isLog) Logger.set({
      request: request,
      collectionName: MPImports.collection.collectionName,
      collectionId: totalSave._id,
      action: type || 'insert'
    })
    // Loop item
    for await (const e of item) {
      // Insert new item
      if (!e._id) {
        const productSave = await AProducts.insert({ request: request, item: e, type: 'insert-import' })
        if (productSave.error && productSave.error.length) {
          rs.error.push(e.code)
          continue
        } else rs.success.push(e.code)
        e._id = productSave.data._id // productSave.success._id
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
      await importItems.save()
      // if (!itemsSave) throw new Error('import item')

      // Update price import and quantity
      await MProducts.updateOne(
        { _id: e._id },
        {
          $set: { priceImport: parseInt(e.priceImport) },
          $inc: { quantity: parseInt(e.quantity) }
        }
      ).exec()
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
      }
    )
    rs.data = totalSave
    return rs
  } catch (e) {
    rs.error.push(e)
    return rs
  }
}
// module.exports.insert = async ({ request, item, createdBy, isLog, type }) => {
//   const rs = { data: null, success: [], error: [] }
//   isLog = isLog || true
//   const session = await mongoose.startSession()
//   session.startTransaction()
//   try {
//     // Import total
//     const total = new MPImports({
//       // code: crypto.NewGuid('N'),
//       products: item.length,
//       quantities: item.sum('quantity'),
//       prices: item.sum('amount'),
//       taxes: Math.round(item.sum('amount') * 0.1, 0),
//       createdAt: new Date(),
//       createdBy: createdBy || request.verify._id,
//       createdIp: Request.getIp(request),
//       flag: 1
//     })

//     total.validateSync()
//     const totalSave = await total.save({ session })

//     // if (!totalSave) return res.status(500).send('invalid')
//     rs.data = totalSave
//     // Push logs product import
//     if (isLog) Logger.set({
//       request: request,
//       collectionName: MPImports.collection.collectionName,
//       collectionId: totalSave._id,
//       action: type || 'insert',
//       session: session
//     })
//     // Loop item
//     for await (const e of item) {
//       // Insert new item
//       if (!e._id) {
//         const productSave = await AProducts.insert({ request: request, item: e, type: 'insert-import', session: session })
//         if (productSave.error && productSave.error.length) {
//           rs.error.push(e.code)
//           continue
//         } else rs.success.push(e.code)
//         e._id = productSave.data._id // productSave.success._id
//       }

//       // Import item
//       const items = new MPImportItems({
//         key: totalSave._id,
//         product: e._id,
//         price: parseInt(e.price),
//         quantity: parseInt(e.quantity),
//         amount: parseInt(e.amount)
//       })
//       // items.validate()
//       await items.save({ session })
//       // if (!itemsSave) throw new Error('import item')

//       // Update price import and quantity
//       MProducts.updateOne(
//         { _id: e._id },
//         {
//           $set: { priceImport: parseInt(e.price) },
//           $inc: { quantity: parseInt(e.quantity) }
//         },
//         { session }
//       ).exec()
//     }

//     // await Model.create({ /* payload */ }, { session })

//     // await Model.deleteOne({ /* conditions */ }, { session })

//     // await Model.updateOne({ /* conditions */ }, { /* payload */ }, { session })

//     // await Model.findByIdAndUpdate(_id, { /* payload */ }, { session })

//     // const user = new Model( /* payload */)
//     // await user.save({ session })
//     // doc = await Customer.findOne({ name: 'Test' }).session(session)
//     console.log(rs)
//     await session.commitTransaction()
//     session.endSession()
//     return rs
//   } catch (e) {
//     await session.abortTransaction()
//     session.endSession()
//     rs.error.push(e)
//     return rs
//   }
// }
