const mongoose = require('mongoose'),
  APImports = require('./actions'),
  MPImports = require('./model'),
  MPImportItems = require('./model-items'),
  AProducts = require('../products/actions')

module.exports.name = MPImports.collection.collectionName
module.exports.get = async function (req, res, next) {
  try {
    let conditions = { $and: [{ flag: req.query.flag ? parseInt(req.query.flag) : 1 }] }
    if (req.query.filter) conditions.$and.push({ code: new RegExp(req.query.filter, 'i') })
    if (req.query.startAt && req.query.endAt) conditions.$and.push({ createdAt: { $gt: ISODate(req.query.startAt), $lt: ISODate(req.query.endAt) } })
    if (req.query.categories) conditions.$and.push({ categories: { $in: [req.query.categories] } })
    if (!req.query.sortBy) req.query.sortBy = 'createdAt'
    // req.query.rowsNumber = await MPImports.where(conditions).countDocuments()
    const rowsNumber = await APImports.get({ conditions: conditions })
    req.query.rowsNumber = rowsNumber.length
    const rs = await APImports.get({ conditions: conditions })
      .skip((parseInt(req.query.page) - 1) * parseInt(req.query.rowsPerPage))
      .limit(parseInt(req.query.rowsPerPage))
      .sort({ [(req.query.sortBy) || 'createdAt']: req.query.descending === 'true' ? -1 : 1 }) // 1 ASC, -1 DESC
      .exec()
    return res.status(200).json({ rowsNumber: req.query.rowsNumber, data: rs });
  } catch (e) {
    console.log(e)
    return res.status(500).send('invalid')
  }
}

module.exports.getSub = async function (req, res, next) {
  try {
    if (!req.query.key) return res.status(200).json(null)
    if (!mongoose.Types.ObjectId.isValid(req.query.key)) return res.status(500).send('invalid')
    let conditions = { $and: [{ key: mongoose.Types.ObjectId(req.query.key) }] }
    if (req.query.filter) {
      conditions.$and.push({ code: req.query.filter })
    }
    if (req.query.startAt && req.query.endAt) {
      conditions.$and.push({ createdAt: { $gt: ISODate(req.query.startAt), $lt: ISODate(req.query.endAt) } })
    }
    if (!req.query.sortBy) req.query.sortBy = 'createdAt'

    req.query.rowsNumber = await MPImportItems.where(conditions).countDocuments()
    req.query.page = req.query.page ? req.query.page : 1
    req.query.rowsPerPage = req.query.rowsPerPage ? req.query.rowsPerPage : req.query.rowsNumber
    req.query.descending = req.query.descending ? req.query.descending : 'false'

    const rs = await APImports.getSub({ conditions: conditions })
      .skip((parseInt(req.query.page) - 1) * parseInt(req.query.rowsPerPage))
      .limit(parseInt(req.query.rowsPerPage) || 1)
      .sort({ [(req.query.sortBy) || 'createdAt']: req.query.descending === 'true' ? -1 : 1 }) // 1 ASC, -1 DESC
      .exec()
    return res.status(200).json({ rowsNumber: req.query.rowsNumber, data: rs });
  } catch (e) {
    console.log(e)
    return res.status(500).send('invalid')
  }
}

module.exports.find = async function (req, res, next) {
  try {
    if (req.query.id) {
      if (mongoose.Types.ObjectId.isValid(req.query.id)) {
        if (Array.isArray(req.query.id)) {
          const conditions = { $and: [{ _id: { $in: req.query.id } }] }
          const rs = await APImports.get({ conditions: conditions }).exec()
          if (!rs) return res.status(404).send('no_exist')
          return res.status(200).json(rs)
        } else {
          const conditions = { $and: [{ _id: mongoose.Types.ObjectId(req.query.id) }] }
          const rs = await APImports.get({ conditions: conditions }).exec()
          if (!rs || rs.length < 1) return res.status(404).send('no_exist')
          return res.status(200).json(rs[0])
        }
      } else {
        return res.status(500).send('invalid')
      }
    } else if (req.query.code) {
      if (Array.isArray(req.query.code)) {
        const conditions = { $and: [{ code: { $in: req.query.code } }] }
        const rs = await APImports.get({ conditions: conditions }).exec()
        if (!rs) return res.status(404).send('no_exist')
        return res.status(200).json(rs)
      } else {
        const conditions = { $and: [{ code: req.query.code }] }
        const rs = await APImports.get({ conditions: conditions }).exec()
        if (!rs || rs.length < 1) return res.status(404).send('no_exist')
        return res.status(200).json(rs[0])
      }
    }
  } catch (e) {
    return res.status(500).send('invalid')
  }
}

module.exports.select = async function (req, res, next) {
  try {
    if (!req.body) return res.status(200).json([])
    else {
      if (req.body.ids) {
        const rs = await AProducts.select({
          conditions: { _id: { $in: req.body.ids } },
          fields: '_id code title quantity price priceDiscount priceImport unit'
        })
        return res.status(200).json(rs)
      } else if (req.body.codes) {
        const rs = await AProducts.select({
          conditions: { code: { $in: req.body.codes } },
          fields: '_id code title quantity price priceDiscount priceImport unit'
        })
        return res.status(200).json(rs)
      } else if (req.body.qrcode) {
        const rs = await AProducts.select({
          conditions: { $or: [{ qrcode: req.body.qrcode }, { barcode: req.body.qrcode }] },
          fields: '_id code title quantity price priceDiscount priceImport unit'
        })
        return res.status(200).json(rs)
      } else return res.status(200).json([])
    }
  } catch (e) {
    return res.status(500).send('invalid')
  }
}

module.exports.post = async (req, res, next) => {
  if (!req.body) return res.status(404).send('no_exist')
  if (!req.body.length) return res.status(202).json([])
  const rs = await APImports.insert({ request: req, item: req.body })
  if (rs.error && rs.error.length) return res.status(500).send(rs.error)
  else return res.status(200).send(rs)
}
