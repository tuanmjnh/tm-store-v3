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
    let conditions = { $and: [{ flag: req.query.flag ? req.query.flag : 1 }] }
    if (req.query.filter) {
      conditions.$and.push({ code: req.query.filter })
    }
    if (req.query.startAt && req.query.endAt) {
      conditions.$and.push({ createdAt: { $gt: ISODate(req.query.startAt), $lt: ISODate(req.query.endAt) } })
    }
    if (req.query.categories) conditions.$and.push({ categories: { $in: [req.query.categories] } })
    if (!req.query.sortBy) req.query.sortBy = 'orders'
    req.query.rowsNumber = await MImports.where(conditions).countDocuments()

    const rs = await MImports.aggregate([
      { $match: conditions },
    ]).skip((parseInt(req.query.page) - 1) * parseInt(req.query.rowsPerPage))
      .limit(parseInt(req.query.rowsPerPage))
      .sort({ [(req.query.sortBy) || 'orders']: req.query.descending === 'true' ? -1 : 1 }) // 1 ASC, -1 DESC
      .exec()

    return res.status(200).json({ rowsNumber: req.query.rowsNumber, data: rs });
  } catch (e) {
    return res.status(500).send('invalid')
  }
}

// module.exports.find = async function (req, res, next) {
//   try {
//     if (!req.body || req.body.length < 1) return res.status(404).send('no_exist')
//     const rs = await MProducts.find(
//       { code: { $in: req.body } },
//       '_id code title quantity price priceDiscount priceImport priceUnit unit'
//     )
//     return res.status(200).json(rs)
//   } catch (e) {
//     return res.status(500).send('invalid')
//   }
// }

module.exports.find = async function (req, res, next) {
  try {
    if (req.query._id) {
      if (mongoose.Types.ObjectId.isValid(req.query._id)) {
        const rs = await MProducts.findById(req.query._id, '_id code title quantity price priceDiscount priceImport priceUnit unit')
        return res.status(200).json(rs)
      } else {
        return res.status(500).send('invalid')
      }
    } else if (req.query.code) {
      const rs = await MProducts.findOne({ code: req.query.code }, '_id code title quantity price priceDiscount priceImport priceUnit unit')
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
        const rs = await MProducts.where({ _id: { $in: req.body.ids } }, '_id code title quantity price priceDiscount priceImport priceUnit unit')
        return res.status(200).json(rs)
      } else if (req.body.codes) {
        const rs = await MProducts.where({ code: { $in: req.body.codes } }, '_id code title quantity price priceDiscount priceImport priceUnit unit')
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
    const total = new MImports({
      code: crypto.NewGuid('N'),
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
    // Push logs import
    Logger.set(req, name, totalSave._id, 'insert')
    // Loop item
    for await (const e of req.body) {
      // Insert new item
      if (!e._id) {
        // check categories
        // const category = await MCategories.findOne({ code: e.categories.toUpperCase() })
        // if (!category) {
        //   rs.error.push(e)
        //   continue
        // }
        // e.categories = category._id

        const product = new MProducts(e)
        // product.validate()
        const productSave = await product.save()
        if (!productSave) {
          rs.error.push(e.code)
          continue
        } else rs.success.push(e.code)
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

      // Update price import and quantity
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
