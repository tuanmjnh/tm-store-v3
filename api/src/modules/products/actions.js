const mongoose = require('mongoose'),
  MProducts = require('./model'),
  Request = require('../../utils/Request'),
  Logger = require('../../services/logger')

module.exports.get = ({ conditions }) => {
  const rs = MProducts.aggregate([
    { $match: conditions },
    {
      $lookup: {
        from: 'types',
        let: { unit: { $toString: '$unit' } },
        as: 'unitType',
        pipeline: [
          { $match: { $expr: { $eq: ['$code', '$$unit'] } } },
          { $project: { _id: 1, key: 1, code: 1, name: 1, meta: 1, orders: 1 } }
        ]
      }
    },
    { $unwind: "$unitType" },
    {
      $lookup: {
        from: 'categories',
        let: { categories: '$categories' },
        as: 'categoryList',
        pipeline: [
          { $addFields: { 'cateId': { $toString: '$_id' } } },
          { $match: { $expr: { $and: [{ $in: ['$cateId', '$$categories'] }] } } },
          { $project: { _id: 1, code: 1, title: 1, level: 1, position: 1, icon: 1, color: 1, meta: 1, orders: 1 } }
        ]
      }
    },
    // {
    //   $lookup: {
    //     from: 'types',
    //     let: { priceUnit: { $toString: '$priceUnit' } },
    //     as: 'priceUnits',
    //     pipeline: [
    //       { $match: { $expr: { $and: [{ $eq: ['$code', '$$priceUnit'] }] } } },
    //       { $project: { _id: 0, priceUnitName: '$name' } }
    //     ]
    //   }
    // },
    // { $replaceRoot: { newRoot: { $mergeObjects: [{ $arrayElemAt: ['$priceUnits', 0] }, { $arrayElemAt: ['$units', 0] }, '$$ROOT'] } } },
    // { $project: { units: 0, priceUnits: 0 } }
    // { $replaceRoot: { newRoot: { $mergeObjects: [{ $arrayElemAt: ['$units', 0] }, '$$ROOT'] } } },
    // { $replaceRoot: { newRoot: { $mergeObjects: [{ '$units': 0 }, '$$ROOT'] } } },
    // { $project: { units: 0 } }
  ])
  return rs
}


module.exports.insert = async ({ request, item, createdBy, isLog, type, session }) => {
  const rs = { data: null, success: [], error: [] }
  isLog = isLog || true
  try {
    // check object input
    if (
      !item ||
      Object.keys(item).length < 1 ||
      !item.title ||
      !item.code ||
      item.categories.length < 1
    ) {
      rs.error.push('invalid')
      return rs
    }
    // check exist code
    const findOne = await MProducts.findOne({ code: item.code })
    if (findOne) {
      rs.error.push('exist')
      return rs
    }
    // defined created
    item.created = { at: new Date(), by: createdBy || request.verify._id, ip: Request.getIp(request) }
    // defined ObjectId for array category
    // if (item.categories && Array.isArray(item.categories) && item.categories.length > 0)
    //   for (let i = 0; i < item.categories.length; i++) {
    //     item.categories[i] = mongoose.Types.ObjectId(item.categories[i])
    //   }
    // defined new Products
    const data = new MProducts(item)
    // validate data
    data.validateSync()
    // Save data
    if (session) {
      const save = await data.save({ session })
      // check error
      if (!save) rs.error.push('invalid')
      else {
        rs.data = save
        rs.success.push(save._id)
        // Push logs
        if (isLog) Logger.set({
          request: request,
          collectionName: MProducts.collection.collectionName,
          collectionId: save._id,
          action: type || 'insert'
        })
      }
    } else {
      const save = await data.save()
      // check error
      if (!save) rs.error.push('invalid')
      else {
        rs.data = save
        rs.success.push(save._id)
        // Push logs
        if (isLog) Logger.set({
          request: request,
          collectionName: MProducts.collection.collectionName,
          collectionId: save._id,
          action: type || 'insert'
        })
      }
    }
  } catch (e) {
    console.log(e)
    rs.error.push(e)
  }
  return rs
}
