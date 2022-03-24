const mongoose = require('mongoose'),
  MCategories = require('./model'),
  pagination = require('../../utils/pagination'),
  Request = require('../../utils/Request'),
  Logger = require('../../services/logger')

module.exports.name = MCategories.collection.collectionName
module.exports.get = async function (req, res, next) {
  try {
    // let conditions = { $and: [{ flag: req.query.flag ? req.query.flag : 1 }] }
    let conditions = { $and: [] }
    if (req.query.flag) conditions.$and.push({ flag: parseInt(req.query.flag) })
    if (req.query.type) conditions.$and.push({ type: req.query.type })
    else conditions.$and.push({ type: 'product' })
    if (req.query.filter) {
      conditions.$and.push({
        $or: [{ title: new RegExp(req.query.filter, 'i') }]
      })
    }
    if (!req.query.sortBy) req.query.sortBy = 'orders'
    req.query.rowsNumber = await MCategories.where(conditions).countDocuments()
    const options = {
      // skip: (parseInt(req.query.page) - 1) * parseInt(req.query.rowsPerPage),
      // limit: parseInt(req.query.rowsPerPage),
      sort: { [req.query.sortBy || 'orders']: req.query.descending === 'true' ? -1 : 1 } // 1 ASC, -1 DESC
    }
    MCategories.find(conditions, null, options, function (e, rs) {
      if (e) return res.status(500).send(e)
      // if (!rs) return res.status(404).send('No data exist!')
      // console.log(rs)
      return res.status(200).json({ rowsNumber: req.query.rowsNumber, data: rs })
    })
  } catch (e) {
    return res.status(500).send('invalid')
  }
}

module.exports.find = async function (req, res, next) {
  try {
    if (req.query._id) {
      if (mongoose.Types.ObjectId.isValid(req.query._id)) {
        MCategories.findById(req.query._id, (e, rs) => {
          if (e) return res.status(500).send(e)
          if (!rs) return res.status(404).send('no_exist')
          return res.status(200).json(rs)
        })
      } else {
        return res.status(500).send('invalid')
      }
    } else if (req.query.code) {
      MCategories.findOne({ code: req.query.code }, (e, rs) => {
        if (e) return res.status(500).send(e)
        if (!rs) return res.status(404).send('no_exist')
        return res.status(200).json(rs)
      })
    }
  } catch (e) {
    return res.status(500).send('invalid')
  }
}

module.exports.exist = async function (req, res, next) {
  try {
    if (req.query.code) {
      MCategories.findOne({ code: req.query.code.toLowerCase() }, (e, rs) => {
        if (e) return res.status(500).send(e)
        if (rs) return res.status(200).json(true)
        else return res.status(200).json(false)
      })
    }
  } catch (e) {
    return res.status(500).send('invalid')
  }
}

module.exports.getMeta = async function (req, res, next) {
  try {
    const conditions = req.query.key
      ? { 'meta.key': new RegExp(req.query.filter, 'i') }
      : { 'meta.value': new RegExp(req.query.filter, 'i') }
    MCategories.distinct(req.query.key ? 'meta.key' : 'meta.value', conditions, (e, rs) => {
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
    if (!req.body || Object.keys(req.body).length < 1) {
      return res.status(500).send('invalid')
    }
    const x = await MCategories.findOne({ code: req.body.code })
    if (x) return res.status(501).send('exist')
    req.body.created = { at: new Date(), by: req.verify._id, ip: Request.getIp(req) }
    const data = new MCategories(req.body)
    // data.validate()
    data.save((e, rs) => {
      if (e) return res.status(500).send(e)
      // Push logs
      Logger.set(req, MCategories.collection.collectionName, rs._id, 'insert')
      return res.status(201).json(rs)
    })
  } catch (e) {
    return res.status(500).send('invalid')
  }
}

module.exports.put = async function (req, res, next) {
  try {
    // if (!req.params.id) return res.status(500).send('Incorrect Id!')
    if (
      !req.body ||
      Object.keys(req.body).length < 1 ||
      !req.body.type ||
      !req.body.title ||
      !req.body.code
    ) {
      return res.status(500).send('invalid')
    }
    const x = await MCategories.findOne({ _id: { $nin: [req.body._id] }, code: req.body.code })
    if (x) return res.status(501).send('exist')
    if (mongoose.Types.ObjectId.isValid(req.body._id)) {
      MCategories.updateOne(
        { _id: req.body._id },
        {
          $set: {
            type: req.body.type,
            dependent: req.body.dependent,
            level: req.body.level,
            title: req.body.title,
            code: req.body.code,
            desc: req.body.desc,
            content: req.body.content,
            url: req.body.url,
            images: req.body.images,
            quantity: req.body.quantity,
            position: req.body.position,
            tags: req.body.tags,
            icon: req.body.icon,
            color: req.body.color,
            meta: req.body.meta,
            startAt: req.body.startAt,
            endAt: req.body.endAt,
            orders: req.body.orders,
            flag: req.body.flag
          }
        },
        (e, rs) => {
          // { multi: true, new: true },
          if (e) return res.status(500).send(e)
          // Push logs
          Logger.set(req, MCategories.collection.collectionName, req.body._id, 'update')
          return res.status(202).json(rs)
        }
      )
    } else {
      return res.status(500).send('invalid')
    }
  } catch (e) {
    return res.status(500).send('invalid')
  }
}

module.exports.updateOrder = async function (req, res, next) {
  try {
    // if (!req.params.id) return res.status(500).send('Incorrect Id!')
    if (!req.body || Object.keys(req.body).length < 1 || !req.body._id) {
      return res.status(500).send('invalid')
    }
    if (!req.body.dependent) req.body.dependent = null
    if (mongoose.Types.ObjectId.isValid(req.body._id)) {
      MCategories.updateOne(
        { _id: req.body._id },
        {
          $set: {
            dependent: req.body.dependent,
            level: req.body.level,
            orders: req.body.orders
          }
        },
        (e, rs) => {
          // { multi: true, new: true },
          if (e) return res.status(500).send(e)
          // Push logs
          // logs.push(req, { user_id: req.verify._id, collection: 'roles', collection_id: req.body._id, method: 'update' })
          return res.status(202).json(rs)
        }
      )
    } else {
      return res.status(500).send('invalid')
    }
  } catch (e) {
    return res.status(500).send('invalid')
  }
}

module.exports.patch = async function (req, res, next) {
  try {
    let rs = { success: [], error: [] }
    for await (let _id of req.body._id) {
      const x = await MCategories.findById(_id)
      if (x) {
        var _x = await MCategories.updateOne(
          { _id: _id },
          { $set: { flag: x.flag === 1 ? 0 : 1 } }
        )
        if (_x) {
          rs.success.push(_id)
          // Push logs
          Logger.set(req, MCategories.collection.collectionName, _id, x.flag === 1 ? 'lock' : 'unlock')
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
      MCategories.deleteOne({ _id: req.params._id }, (e, rs) => {
        if (e) return res.status(500).send(e)
        // Push logs
        Logger.set(req, MCategories.collection.collectionName, req.params._id, 'delete')
        return res.status(204).json(rs)
      })
    } else {
      return res.status(500).send('invalid')
    }
  } catch (e) {
    return res.status(500).send('invalid')
  }
}
