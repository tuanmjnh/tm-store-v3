const mongoose = require('mongoose'),
  MExports = require('./model'),
  MExportsItems = require('./model-items'),
  MProducts = require('../products/model'),
  MCategories = require('../categories/model'),
  crypto = require('../../utils/crypto'),
  request = require('../../utils/request'),
  Logger = require('../../services/logger')

const name = 'store-exports'
module.exports.name = name
module.exports.get = async function (req, res, next) {
  try {
    return res.status(200).json([])
  } catch (e) {
    return res.status(500).send('invalid')
  }
}

module.exports.find = async function (req, res, next) {
  try {
    if (req.query._id) {
      if (mongoose.Types.ObjectId.isValid(req.query._id)) {
        const rs = await MProducts.findById(req.query._id, '_id code title quantity price priceDiscount priceExport priceUnit unit')
        return res.status(200).json(rs)
      } else {
        return res.status(500).send('invalid')
      }
    } else if (req.query.code) {
      const rs = await MProducts.findOne({ code: req.query.code }, '_id code title quantity price priceDiscount priceExport priceUnit unit')
      return res.status(200).json(rs)
    } else return res.status(200).json(null)
  } catch (e) {
    return res.status(500).send('invalid')
  }
}

module.exports.finds = async function (req, res, next) {
  try {
    if (!req.body) return res.status(200).json([])
    else {
      if (req.body.ids) {
        const rs = await MProducts.where({ _id: { $in: req.body.ids } }, '_id code title quantity price priceDiscount priceExport priceUnit unit')
        return res.status(200).json(rs)
      } else if (req.body.codes) {
        const rs = await MProducts.where({ code: { $in: req.body.codes } }, '_id code title quantity price priceDiscount priceExport priceUnit unit')
        return res.status(200).json(rs)
      } else return res.status(200).json([])
    }
  } catch (e) {
    return res.status(500).send('invalid')
  }
}

module.exports.put = async function (req, res, next) {
  if (!req.body) return res.status(404).send('no_exist')
  if (!req.body.length) return res.status(202).json([])
  const rs = { data: null, success: [], error: [] }
  const session = await mongoose.startSession()
  session.startTransaction()
  try {
    // Import total
    const total = new MExports({
      code: crypto.NewGuid(),
      products: req.body.length,
      quantities: req.body.sum('quantity'),
      prices: req.body.sum('amount'),
      taxes: Math.round(req.body.sum('amount') * 0.1, 0),
      createdAt: new Date(),
      createdBy: req.verify._id,
      createdIp: request.getIp(req),
      flag: 1
    })
    // total.validate()
    const totalSave = await total.save()
    if (!totalSave) return res.status(500).send('invalid')
    rs.data = totalSave
    // Push logs export
    Logger.set(req, name, totalSave._id, 'insert')
    // Loop item
    for await (const e of req.body) {
      // Import item
      const items = new MExportsItems({
        key: totalSave._id,
        product: e._id,
        price: parseInt(e.price),
        quantity: parseInt(e.quantity),
        amount: parseInt(e.amount)
      })
      // items.validate()
      const itemsSave = await items.save()
      if (!itemsSave) throw new Error('export item')
      MProducts.updateOne(
        { _id: e._id },
        {
          $set: { priceExport: parseInt(e.price) },
          $inc: { quantity: -parseInt(e.quantity) }
        }
      ).exec()
    }
    // commit
    await session.commitTransaction()
    session.endSession()
    return res.status(202).json(rs)
  } catch (e) {
    console.log(e)
    await session.abortTransaction()
    session.endSession()
    return res.status(500).send('invalid')
  }
}
