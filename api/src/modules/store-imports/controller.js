const mongoose = require('mongoose'),
  MImports = require('./model'),
  MImportItems = require('./model-items'),
  MProducts = require('../products/model'),
  MCategories = require('../categories/model'),
  crypto = require('../../utils/crypto'),
  request = require('../../utils/request'),
  Logger = require('../../services/logger')

const name = 'store-imports'
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
      '_id code title quantity price priceDiscount priceImport priceUnit unit'
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
    const total = new MImports({
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
    // Push logs import
    Logger.set(req, name, totalSave._id, 'insert')
    // Loop item
    for await (const e of req.body) {
      // Insert new
      if (!e._id) {
        const category = await MCategories.findOne({ code: e.categories.toUpperCase() })
        if (!category) {
          rs.error.push(e)
          continue
        }
        e.categories = category._id
        //
        const product = new MProducts(e)
        // product.validate()
        const productSave = await product.save()
        if (!productSave) {
          rs.error.push(e)
          continue
        }
        e._id = productSave._id
        // Push logs product
        Logger.set(req, 'products', e._id, 'insert')
      }
      // Import item
      const items = new MImportItems({
        key: totalSave._id,
        product: e._id,
        price: parseInt(e.price),
        quantity: parseInt(e.quantity),
        amount: parseInt(e.amount)
      })
      // items.validate()
      const itemsSave = await items.save()
      if (!itemsSave) throw new Error('import item')
      MProducts.updateOne(
        { _id: e._id },
        {
          $set: { priceImport: parseInt(e.price) },
          $inc: { quantity: parseInt(e.quantity) }
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
