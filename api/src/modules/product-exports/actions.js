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

module.exports.insert = async ({ request, item, createdBy, isLog, type }) => {
  const rs = { data: null, success: [], error: [] }
  isLog = isLog || true
  try {
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
    const totalSave = await total.save()

    // Push logs product export
    if (isLog) Logger.set({
      request: request,
      collectionName: MPExports.collection.collectionName,
      collectionId: totalSave._id,
      action: type || 'insert'
    })
    // Loop item
    for await (const e of item) {
      // Insert new item
      if (!e._id) {
        const productSave = await AProducts.insert({ request: request, item: e, type: 'insert-export' })
        if (productSave.error && productSave.error.length) {
          rs.error.push(e.code)
          continue
        } else rs.success.push(e.code)
        e._id = productSave.data._id // productSave.success._id
      }

      // Export item
      const exportItems = new MPExportItems({
        key: totalSave._id,
        product: e._id,
        price: parseInt(e.priceExport),
        quantity: parseInt(e.quantity),
        // amount: parseInt(e.priceExport) * parseInt(e.quantity)
      })
      // items.validate()
      await exportItems.save()
      // if (!itemsSave) throw new Error('export item')

      // Update price export and quantity
      await MProducts.updateOne(
        { _id: e._id },
        {
          $set: { priceExport: parseInt(e.priceExport) },
          $inc: { quantity: -parseInt(e.quantity) }
        }
      ).exec()
      // fix value Export total
      totalSave.quantities = totalSave.quantities + exportItems.quantity
      totalSave.prices = totalSave.prices + (exportItems.quantity * exportItems.price)
    }
    // fix value Export total
    await MPExports.updateOne(
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
