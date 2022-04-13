const mongoose = require('mongoose'),
  MProducts = require('./model'),
  AProducts = require('./actions'),
  pagination = require('../../utils/pagination'),
  Logger = require('../../services/logger')

module.exports.name = MProducts.collection.collectionName
module.exports.get = async function (req, res, next) {
  try {
    let conditions = { $and: [{ flag: req.query.flag ? parseInt(req.query.flag) : 1 }] }
    if (req.query.filter) {
      // conditions.$and.push({
      //   $or: [
      //     { title: new RegExp(search.normalize(req.query.filter), 'i') },
      //     { code: new RegExp(search.normalize(req.query.filter), 'i') },
      //     { origin: new RegExp(search.normalize(req.query.filter), 'i') }
      //   ]
      // })
      conditions.$and.push({ $text: { $search: req.query.filter } })
    }
    // req.query.categories = '612c8dc594b6cc2da8c47d06'
    if (req.query.categories) conditions.$and.push({ categories: { $in: [req.query.categories] } })
    if (!req.query.sortBy) req.query.sortBy = 'orders'
    if (req.query.quantity !== undefined)
      conditions.$and.push({ quantity: { $gt: parseInt(req.query.quantity) } })
    req.query.rowsNumber = (await AProducts.get({ conditions: conditions })).length
    // const options = {
    //   skip: (parseInt(req.query.page) - 1) * parseInt(req.query.rowsPerPage),
    //   limit: parseInt(req.query.rowsPerPage),
    //   sort: { [req.query.sortBy || 'orders']: req.query.descending === 'true' ? -1 : 1 } // 1 ASC, -1 DESC
    // }
    // MProducts.find(conditions, null, options, function (e, rs) {
    //   if (e) return res.status(500).send(e)
    //   // if (!rs) return res.status(404).send('No data exist!')
    //   return res.status(200).json({ rowsNumber: req.query.rowsNumber, data: rs })
    // })
    // const rs = await MProducts.aggregate([
    //   { $match: conditions },
    //   {
    //     $lookup: {
    //       from: 'types',
    //       let: { unit: { $toString: '$unit' } },
    //       as: 'units',
    //       pipeline: [
    //         { $match: { $expr: { $and: [{ $eq: ['$code', '$$unit'] }] } } },
    //         { $project: { _id: 0, unitName: '$name' } }
    //       ]
    //     }
    //   },
    //   {
    //     $lookup: {
    //       from: 'types',
    //       let: { priceUnit: { $toString: '$priceUnit' } },
    //       as: 'priceUnits',
    //       pipeline: [
    //         { $match: { $expr: { $and: [{ $eq: ['$code', '$$priceUnit'] }] } } },
    //         { $project: { _id: 0, priceUnitName: '$name' } }
    //       ]
    //     }
    //   },
    //   { $replaceRoot: { newRoot: { $mergeObjects: [{ $arrayElemAt: ['$priceUnits', 0] }, { $arrayElemAt: ['$units', 0] }, '$$ROOT'] } } },
    //   { $project: { units: 0, priceUnits: 0 } }
    // ])
    const rs = await AProducts.get({ conditions: conditions })
      .skip((parseInt(req.query.page) - 1) * parseInt(req.query.rowsPerPage))
      .limit(parseInt(req.query.rowsPerPage))
      .sort({ [(req.query.sortBy) || 'orders']: req.query.descending === 'true' ? -1 : 1 }) // 1 ASC, -1 DESC
      .exec()

    return res.status(200).json({ rowsNumber: req.query.rowsNumber, data: rs });
  } catch (e) {
    // console.log(e)
    return res.status(500).send('invalid')
  }
}
module.exports.find = async function (req, res, next) {
  try {
    if (req.query.id) {
      if (mongoose.Types.ObjectId.isValid(req.query.id)) {
        if (Array.isArray(req.query.id)) {
          const conditions = { $and: [{ _id: { $in: req.query.id } }] }
          const rs = await AProducts.get({ conditions: conditions }).exec()
          if (!rs) return res.status(404).send('no_exist')
          return res.status(200).json(rs)
        } else {
          const conditions = { $and: [{ _id: mongoose.Types.ObjectId(req.query.id) }] }
          const rs = await AProducts.get({ conditions: conditions }).exec()
          if (!rs || rs.length < 1) return res.status(404).send('no_exist')
          return res.status(200).json(rs[0])
        }
      } else {
        return res.status(500).send('invalid')
      }
    } else if (req.query.code) {
      if (Array.isArray(req.query.code)) {
        const conditions = { $and: [{ code: { $in: req.query.code } }] }
        const rs = await AProducts.get({ conditions: conditions }).exec()
        if (!rs) return res.status(404).send('no_exist')
        return res.status(200).json(rs)
      } else {
        const conditions = { $and: [{ code: req.query.code }] }
        const rs = await AProducts.get({ conditions: conditions }).exec()
        if (!rs || rs.length < 1) return res.status(404).send('no_exist')
        return res.status(200).json(rs[0])
      }
    } else if (req.query.qrcode) {
      if (Array.isArray(req.query.code)) {
        const conditions = { $or: [{ qrcode: { $in: req.query.qrcode } }, { barcode: { $in: req.query.qrcode } }] }
        const rs = await AProducts.get({ conditions: conditions }).exec()
        if (!rs) return res.status(404).send('no_exist')
        return res.status(200).json(rs)
      } else {
        const conditions = { $or: [{ qrcode: req.query.qrcode }, { barcode: req.query.qrcode }] }
        const rs = await AProducts.get({ conditions: conditions }).exec()
        if (!rs || rs.length < 1) return res.status(404).send('no_exist')
        return res.status(200).json(rs[0])
      }
    }
  } catch (e) {
    return res.status(500).send('invalid')
  }
}

module.exports.exist = async function (req, res, next) {
  try {
    if (!req.query.code) return res.status(404).send('exist')
    const rs = await AProducts.exist(req.query.code)
    if (rs) return res.status(200).json(true)
    else return res.status(200).json(false)
  } catch (e) {
    return res.status(200).json('invalid')
  }
}

module.exports.getAttr = async function (req, res, next) {
  try {
    const conditions = req.query.key
      ? { 'attr.key': new RegExp(req.query.filter, 'i') }
      : { 'attr.value': new RegExp(req.query.filter, 'i') }
    const qry = MProducts.distinct(
      req.query.key ? 'attr.key' : 'attr.value',
      conditions,
      (e, rs) => {
        if (e) return res.status(500).send(e)
        const rowsNumber = rs.length
        if (req.query.page && req.query.rowsPerPage) {
          return res.status(200).json(pagination.get(rs, parseInt(req.query.page), parseInt(req.query.rowsPerPage)))
        } else {
          return res.status(200).json({ rowsNumber: rowsNumber, data: rs })
        }
      }
    )
  } catch (e) {
    return res.status(500).send('invalid')
  }
}

module.exports.post = async function (req, res, next) {
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
    const exist = await AProducts.exist(req.query.code)
    if (exist) return res.status(501).send('exist')
    // insert
    const rs = await AProducts.insert({ request: req, item: req.body })
    if (!rs) return res.status(500).send('invalid')
    //Set Logger
    Logger.set({ request: req, collectionName: MProducts.collection.collectionName, collectionID: rs._id, method: 'insert' })
    // reGet
    const reGet = await AProducts.get({ conditions: { _id: mongoose.Types.ObjectId(rs._id) } })
    return res.status(201).json(reGet[0])
  } catch (e) {
    return res.status(500).send('invalid')
  }
}

module.exports.put = async function (req, res, next) {
  try {
    // if (!req.params.id) return res.status(500).send('Incorrect Id!')
    if (!req.body || Object.keys(req.body).length < 1) return res.status(500).send('invalid')
    if (mongoose.Types.ObjectId.isValid(req.body._id)) {
      const rs = AProducts.update({ data: req.body })
      if (!rs) return res.status(500).send('invalid')
      //Set Logger
      Logger.set({ request: req, collectionName: MProducts.collection.collectionName, collectionID: req.body._id, method: 'update' })
      return res.status(202).json(rs)
    } else return res.status(500).send('invalid')
  } catch (e) {
    // console.log(e)
    return res.status(500).send('invalid')
  }
}

module.exports.patch = async function (req, res, next) {
  const session = await mongoose.startSession()
  const rs = { success: [], error: [] }
  await session.withTransaction(async () => {
    for await (let _id of req.body._id) {
      try {
        const exist = await MProducts.findById(_id)
        if (exist) {
          var update = await MProducts.updateOne({ _id: _id }, { $set: { flag: exist.flag === 1 ? 0 : 1 } })
          if (update) {
            rs.success.push(id)
            //Set Logger
            Logger.set({ request: req, collectionName: MProducts.collection.collectionName, collectionID: req.body._id, method: 'flag' })
          } else rs.error.push(id)
        }
      } catch (e) { continue }
    }
  })
  session.endSession()
  return res.status(203).json(rs)
}

module.exports.delete = async function (req, res, next) {
  try {
    if (mongoose.Types.ObjectId.isValid(req.params._id)) {
      const rs = await MProducts.deleteOne({ _id: req.params._id })
      if (!rs) return res.status(500).send('invalid')
      //Set Logger
      Logger.set({ request: req, collectionName: MProducts.collection.collectionName, collectionID: req.params._id, method: 'delete' })
      return res.status(204).json(rs)
    } else return res.status(500).send('invalid')
  } catch (e) {
    return res.status(500).send('invalid')
  }
}
