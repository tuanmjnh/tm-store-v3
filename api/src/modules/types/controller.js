const mongoose = require('mongoose'),
  MTypes = require('./model'),
  pagination = require('../../utils/pagination'),
  Request = require('../../utils/Request'),
  Logger = require('../../services/logger')

module.exports.name = MTypes.collection.collectionName
module.exports.get = async function (req, res, next) {
  try {
    let conditions = { $and: [{ flag: req.query.flag ? parseInt(req.query.flag) : 1 }] }
    if (req.query.key) conditions.$and.push({ key: req.query.key })
    if (req.query.filter) {
      conditions.$and.push({
        $or: [
          { name: new RegExp(req.query.filter, 'i') },
          { 'meta.title': new RegExp(req.query.filter, 'i') }
        ]
      })
    }
    if (!req.query.sortBy) req.query.sortBy = 'orders'
    req.query.rowsNumber = await MTypes.where(conditions).countDocuments()
    const options = {
      skip: (parseInt(req.query.page) - 1) * parseInt(req.query.rowsPerPage),
      limit: parseInt(req.query.rowsPerPage),
      sort: { key: 1, [req.query.sortBy || 'orders']: req.query.descending === 'true' ? -1 : 1 } // 1 ASC, -1 DESC
    }
    MTypes.find(conditions, null, options, function (e, rs) {
      if (e) return res.status(500).send(e)
      // if (!rs) return res.status(404).send('No data exist!')
      return res.status(200).json({ rowsNumber: req.query.rowsNumber, data: rs })
    })
  } catch (e) {
    return res.status(500).send('invalid')
  }
}

module.exports.getAll = async function (req, res, next) {
  try {
    // localLog.set({
    //   request: req,
    //   CollectionName: MTypes.collection.collectionName,
    //   collectionID: 'CID',
    //   method: 'insert'
    // })
    // const log = localLog.get('')
    // console.log(log)
    // console.log(req.app.locals.configs)
    let conditions = { $and: [{ flag: req.query.flag ? parseInt(req.query.flag) : 1 }] }
    MTypes.find(conditions, (e, rs) => {
      if (e) return res.status(500).send(e)
      // if (!rs) return res.status(404).send('No data exist!')
      return res.status(200).json(rs)
    })
  } catch (e) {
    return res.status(500).send('invalid')
  }
}

module.exports.find = async function (req, res, next) {
  try {
    if (req.query._id) {
      if (!mongoose.Types.ObjectId.isValid(req.query._id)) return res.status(500).send('invalid')
      MTypes.findById(req.query._id, (e, rs) => {
        if (e) return res.status(500).send(e)
        if (!rs) return res.status(404).send('no_exist')
        return res.status(200).json(rs)
      })
    } else if (req.query.key) {
      MTypes.findOne({ key: req.query.key }, (e, rs) => {
        if (e) return res.status(500).send(e)
        if (!rs) return res.status(404).send('no_exist')
        return res.status(200).json(rs)
      })
    }
  } catch (e) {
    return res.status(500).send('invalid')
  }
}

module.exports.getKey = async function (req, res, next) {
  try {
    MTypes.distinct('key', { key: new RegExp(req.query.key, 'i') }, (e, rs) => {
      if (e) return res.status(500).send(e)
      const rowsNumber = rs.length
      // req.query.page = req.query.page ? req.query.page : 1
      // req.query.rowsPerPage = req.query.rowsPerPage ? req.query.rowsPerPage : 5
      if (req.query.page && req.query.rowsPerPage) {
        return res.status(200).json(pagination.get(rs, parseInt(req.query.page), parseInt(req.query.rowsPerPage)))
      } else {
        return res.status(200).json({ rowsNumber: rowsNumber, data: rs })
      }
    })
  } catch (e) {
    return res.status(500).send('invalid')
  }
}

// module.exports.getKey = async function (req, res, next) {
//   try {
//     const conditions = {}
//     if (req.query.key) conditions.key = `/${req.query.key}/`
//     const countDocuments = await MTypes.where(conditions).countDocuments()
//     const qry = MTypes.aggregate([
//       { $match: conditions },
//       {
//         $sort: {
//           [req.query.sortBy || 'key']: req.query.descending === 'true' ? -1 : 1,
//         },
//       },
//       {
//         $project: {
//           _id: 0,
//           key: 1,
//         },
//       },
//       // {
//       //   $replaceRoot: {
//       //     newRoot: '$key',
//       //   },
//       // },
//     ])
//     const page = parseInt(req.query.page)
//     const rowsPerPage = parseInt(req.query.rowsPerPage)
//     if (page && rowsPerPage) qry.skip((page - 1) * rowsPerPage).limit(rowsPerPage)
//     const rs = await qry.exec()
//     return res.status(200).json({ rowsNumber: countDocuments, data: rs })
//   } catch (e) {
//     console.log(e)
//     return res.status(500).send('invalid')
//   }
// }

module.exports.getMeta = async function (req, res, next) {
  try {
    const conditions = req.query.key
      ? { 'meta.key': new RegExp(req.query.filter, 'i') }
      : { 'meta.value': new RegExp(req.query.filter, 'i') }
    const qry = MTypes.distinct(req.query.key ? 'meta.key' : 'meta.value', conditions, (e, rs) => {
      if (e) return res.status(500).send(e)
      const rowsNumber = rs.length
      // req.query.page = req.query.page ? req.query.page : 1
      // req.query.rowsPerPage = req.query.rowsPerPage ? req.query.rowsPerPage : 5
      if (req.query.page && req.query.rowsPerPage) {
        return res.status(200).json(pagination.get(rs, parseInt(req.query.page), parseInt(req.query.rowsPerPage)))
      } else {
        return res.status(200).json({ rowsNumber: rowsNumber, data: rs })
      }
    })

    // req.query.page = req.query.page ? req.query.page : 1
    // req.query.rowsPerPage = req.query.rowsPerPage ? req.query.rowsPerPage : 5
    // qry.skip((req.query.page - 1) * req.query.rowsPerPage).limit(req.query.rowsPerPage)
    // console.log(await qry.exec())

    // const rs = await MTypes.aggregate([
    //   { $group: { _id: '$meta.key' } },
    //   { $skip: 3 },
    //   { $limit: 5 },
    // ])
    // return res.status(200).json({ data: rs })
  } catch (e) {
    // console.log(e)
    return res.status(500).send('invalid')
  }
}

module.exports.post = async function (req, res, next) {
  try {
    // if (!req.body || Object.keys(req.body).length < 1 || req.body.key.length < 1 || req.body.name.length < 1) {
    //   return res.status(500).send('invalid')
    // }
    const exist = await MTypes.findOne({ key: req.body.key, code: req.body.code })
    if (exist) return res.status(501).send('exist')
    req.body.created = { at: new Date(), by: req.verify._id, ip: Request.getIp(req) }
    const data = new MTypes(req.body)
    data.validateSync()
    const rs = await data.save()
    if (!rs) return res.status(500).send('invalid')
    //Set Logger
    Logger.set({ request: req, collectionName: MTypes.collection.collectionName, collectionID: rs._id, method: 'insert' })
    return res.status(201).json(rs)
  } catch (e) {
    // console.log(e)
    return res.status(500).send('invalid')
  }
}

module.exports.put = async function (req, res, next) {
  try {
    // if (!req.params.id) return res.status(500).send('Incorrect Id!')
    if (!req.body || Object.keys(req.body).length < 1) return res.status(500).send('invalid')
    const exist = await MTypes.findOne({ _id: { $nin: [req.body._id] }, key: req.body.key, code: req.body.code })
    if (exist) return res.status(501).send('exist')
    if (!mongoose.Types.ObjectId.isValid(req.body._id)) return res.status(500).send('invalid')
    const rs = await MTypes.updateOne(
      { _id: req.body._id },
      {
        $set: {
          key: req.body.key,
          code: req.body.code,
          name: req.body.name,
          desc: req.body.desc,
          meta: req.body.meta,
          orders: req.body.orders,
          flag: req.body.flag
        }
      })
    if (!rs) return res.status(500).send('invalid')
    //Set Logger
    Logger.set({ request: req, collectionName: MTypes.collection.collectionName, collectionID: req.body._id, method: 'update' })
    return res.status(202).json(rs)
  } catch (e) {
    return res.status(500).send('invalid')
  }
}

module.exports.patch = async function (req, res, next) {
  const session = await mongoose.startSession()
  const rs = { success: [], error: [] }
  await session.withTransaction(async () => {
    for await (let _id of req.body._id) {
      try {
        const exist = await MTypes.findById(_id)
        if (exist) {
          const update = await MTypes.updateOne({ _id: _id }, { $set: { flag: exist.flag === 1 ? 0 : 1 } })
          if (update) {
            rs.success.push(_id)
            //Set Logger
            Logger.set({ request: req, collectionName: MTypes.collection.collectionName, collectionID: req.body._id, method: 'flag' })
          } else rs.error.push(_id)
        }
      } catch (e) { continue }
    }
  })
  session.endSession()
  return res.status(203).json(rs)
}

module.exports.delete = async function (req, res, next) {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params._id)) return res.status(500).send('invalid')
    const rs = await MTypes.deleteOne({ _id: req.params._id })
    if (!rs) return res.status(500).send('invalid')
    //Set Logger
    Logger.set({ request: req, collectionName: MTypes.collection.collectionName, collectionID: req.params._id, method: 'delete' })
    return res.status(204).json(rs)
  } catch (e) {
    return res.status(500).send('invalid')
  }
}
