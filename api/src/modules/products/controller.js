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
    }
  } catch (e) {
    return res.status(500).send('invalid')
  }
}

module.exports.exist = async function (req, res, next) {
  try {
    if (req.query.code) {
      MProducts.findOne({ code: req.query.code.toLowerCase() }, (e, rs) => {
        if (e) return res.status(500).send(e)
        if (rs) return res.status(200).json(true)
        else return res.status(200).json(false)
      })
    }
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
    // if (
    //   !req.body ||
    //   Object.keys(req.body).length < 1 ||
    //   !req.body.title ||
    //   !req.body.code ||
    //   req.body.categories.length < 1
    // ) { return res.status(500).send('invalid') }
    const rs = await AProducts.insert({ request: req, item: req.body })
    if (rs.error && rs.error.length) return res.status(501).send(rs.error)

    // get again for type unit and unitPrice
    const conditions = { $and: [{ _id: mongoose.Types.ObjectId(rs.success[0]) }] }
    const reGet = await AProducts.get({ conditions: conditions }).exec()
    if (!reGet || reGet.length < 1) return res.status(201).json(rs.data)
    else return res.status(201).json(reGet[0])
    // else {
    //   // Push logs
    //   Logger.set(req, name, rs._id, 'insert')
    //   return res.status(201).json(rs.success)
    // }
    // const x = await MProducts.findOne({ code: req.body.code })
    // if (x) return res.status(501).send('exist')
    // req.body.created = { at: new Date(), by: req.verify._id, ip: request.getIp(req) }
    // const data = new MProducts(req.body)
    // // data.validate()
    // data.save((e, rs) => {
    //   if (e) return res.status(500).send(e)
    //   // Push logs
    //   Logger.set(req, name, rs._id, 'insert')
    //   return res.status(201).json(rs)
    // })
  } catch (e) {
    return res.status(500).send('invalid')
  }
}

module.exports.put = async function (req, res, next) {
  try {
    // if (!req.params.id) return res.status(500).send('Incorrect Id!')
    if (!req.body || Object.keys(req.body).length < 1) return res.status(500).send('invalid')
    if (mongoose.Types.ObjectId.isValid(req.body._id)) {
      MProducts.updateOne(
        { _id: req.body._id },
        {
          $set: {
            categories: req.body.categories,
            title: req.body.title,
            code: req.body.code,
            desc: req.body.desc,
            content: req.body.content,
            images: req.body.images,
            quantity: req.body.quantity,
            price: req.body.price,
            priceDiscount: req.body.priceDiscount,
            priceImport: req.body.priceImport,
            priceUnit: req.body.priceUnit,
            unit: req.body.unit,
            origin: req.body.origin,
            date: req.body.date,
            pin: req.body.pin,
            tags: req.body.tags,
            attr: req.body.attr,
            meta: req.body.meta,
            qrcode: req.body.qrcode,
            barcode: req.body.barcode,
            // start_at: req.body.start_at,
            // end_at: req.body.end_at,
            order: req.body.order,
            flag: req.body.flag
          }
        },
        (e, rs) => {
          // { multi: true, new: true },
          if (e) return res.status(500).send(e)
          // Push logs
          Logger.set(req, MProducts.collection.collectionName, req.body._id, 'update')
          return res.status(202).json(rs)
        }
      )
    } else {
      return res.status(500).send('invalid')
    }
  } catch (e) {
    console.log(e)
    return res.status(500).send('invalid')
  }
}

module.exports.patch = async function (req, res, next) {
  try {
    let rs = { success: [], error: [] }
    for await (let _id of req.body._id) {
      const x = await MProducts.findById(_id)
      if (x) {
        var _x = await MProducts.updateOne({ _id: _id }, { $set: { flag: x.flag === 1 ? 0 : 1 } })
        if (_x) {
          rs.success.push(_id)
          // Push logs
          Logger.set(req, MProducts.collection.collectionName, _id, x.flag === 1 ? 'lock' : 'unlock')
        } else rs.error.push(_id)
      }
    }
    return res.status(203).json(rs)
  } catch (e) {
    return res.status(500).send('invalid')
  }
}

module.exports.delete = async function (req, res, next) {
  try {
    if (mongoose.Types.ObjectId.isValid(req.params._id)) {
      MProducts.deleteOne({ _id: req.params._id }, (e, rs) => {
        if (e) return res.status(500).send(e)
        // Push logs
        Logger.set(req, MProducts.collection.collectionName, req.params._id, 'delete')
        return res.status(204).json(rs)
      })
    } else {
      return res.status(500).send('invalid')
    }
  } catch (e) {
    return res.status(500).send('invalid')
  }
}
