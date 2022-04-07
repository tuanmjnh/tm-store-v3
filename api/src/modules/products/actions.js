const mongoose = require('mongoose'),
  MProducts = require('./model'),
  Request = require('../../utils/Request')

module.exports.name = MProducts.collection.collectionName

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

module.exports.select = ({ conditions, fields }) => {
  if (fields) {
    return MProducts.where(conditions, fields)
  } else {
    return MProducts.where(conditions)
  }
}

module.exports.exist = (code) => {
  const exist = await MProducts.findOne({ code: code.toUpperCase() })
  if (exist) return true
  else return false
}

module.exports.insert = async ({ request, item, createdBy, session }) => {
  let rs = null
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
  if (session) rs = await data.save({ session })
  else rs = await data.save()
  return rs
}


module.exports.update = async ({ data }) => {
  const rs = await MProducts.updateOne(
    { _id: data._id },
    {
      $set: {
        categories: data.categories,
        title: data.title,
        code: data.code,
        desc: data.desc,
        content: data.content,
        images: data.images,
        quantity: data.quantity,
        price: data.price,
        priceDiscount: data.priceDiscount,
        priceImport: data.priceImport,
        priceUnit: data.priceUnit,
        unit: data.unit,
        origin: data.origin,
        date: data.date,
        pin: data.pin,
        tags: data.tags,
        attr: data.attr,
        meta: data.meta,
        qrcode: data.qrcode,
        barcode: data.barcode,
        // start_at: data.start_at,
        // end_at: data.end_at,
        order: data.order,
        flag: data.flag
      }
    })
  if (rs) return rs
  else return null
}
