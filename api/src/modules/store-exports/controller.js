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
    if (!req.body || req.body.length < 1) return res.status(404).send('no_exist')
    const rs = await MProducts.find(
      { code: { $in: req.body } },
      '_id code title quantity price priceDiscount priceExport priceUnit unit'
    )
    return res.status(200).json(rs)
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
      product: req.body.length,
      quantity: req.body.sum('quantity'),
      price: req.body.sum('amount'),
      vat: Math.round(req.body.sum('amount') * 0.1, 0),
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
