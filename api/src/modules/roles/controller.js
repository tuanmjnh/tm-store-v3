const mongoose = require('mongoose'),
  MRoles = require('./model'),
  Request = require('../../utils/Request'),
  Logger = require('../../services/logger')

module.exports.name = MRoles.collection.collectionName
module.exports.get = async function (req, res, next) {
  try {
    let conditions = { $and: [{ flag: req.query.flag ? parseInt(req.query.flag) : 1 }] }
    if (req.query.filter) {
      conditions.$and.push({
        $or: [
          { key: new RegExp(req.query.filter, 'i') },
          { name: new RegExp(req.query.filter, 'i') }
        ]
      })
    }
    if (!req.query.sortBy) req.query.sortBy = 'level'
    req.query.rowsNumber = await MRoles.where(conditions).countDocuments()
    const options = {
      skip: (parseInt(req.query.page) - 1) * parseInt(req.query.rowsPerPage),
      limit: parseInt(req.query.rowsPerPage),
      sort: { [req.query.sortBy || 'level']: req.query.descending === 'true' ? -1 : 1 } // 1 ASC, -1 DESC
    }
    MRoles.find(conditions, null, options, function (e, rs) {
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
    MRoles.find((e, rs) => {
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
      MRoles.findById(req.query._id, (e, rs) => {
        if (e) return res.status(500).send(e)
        if (!rs) return res.status(404).send('no_exist')
        return res.status(200).json(rs)
      })
    } else if (req.query.key) {
      MRoles.findOne({ key: req.query.key }, (e, rs) => {
        if (e) return res.status(500).send(e)
        if (!rs) return res.status(404).send('no_exist')
        return res.status(200).json(rs)
      })
    }
  } catch (e) {
    return res.status(500).send('invalid')
  }
}

module.exports.post = async function (req, res, next) {
  try {
    if (
      !req.body ||
      Object.keys(req.body).length < 1 ||
      req.body.key.length < 1 ||
      req.body.name.length < 1
    ) { return res.status(500).send('invalid') }
    const exist = await MRoles.findOne({ key: req.body.key })
    if (exist) return res.status(501).send('exist')
    req.body.created = { at: new Date(), by: req.verify._id, ip: Request.getIp(req) }
    const data = new MRoles(req.body)
    data.validateSync()
    const rs = await data.save()
    if (!rs) return res.status(500).send('invalid')
    //Set Logger
    Logger.set({ request: req, collectionName: MRoles.collection.collectionName, collectionID: rs._id, method: 'insert' })
    return res.status(201).json(rs)
  } catch (e) {
    return res.status(500).send('invalid')
  }
}

module.exports.put = async function (req, res, next) {
  try {
    // if (!req.params.id) return res.status(500).send('Incorrect Id!')
    if (!req.body || Object.keys(req.body).length < 1) return res.status(500).send('invalid')
    if (!mongoose.Types.ObjectId.isValid(req.body._id)) return res.status(500).send('invalid')
    const rs = await MRoles.updateOne(
      { _id: req.body._id },
      {
        $set: {
          name: req.body.name,
          desc: req.body.desc,
          level: req.body.level,
          color: req.body.color,
          routes: req.body.routes
        }
      })
    if (!rs) return res.status(500).send('invalid')
    //Set Logger
    Logger.set({ request: req, collectionName: MRoles.collection.collectionName, collectionID: req.body._id, method: 'update' })
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
        const exist = await MRoles.findById(_id)
        if (exist) {
          var update = await MRoles.updateOne({ _id: _id }, { $set: { flag: exist.flag === 1 ? 0 : 1 } })
          if (update) {
            rs.success.push(_id)
            //Set Logger
            Logger.set({ request: req, collectionName: MRoles.collection.collectionName, collectionID: req.body._id, method: 'flag' })
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
    const rs = await MRoles.deleteOne({ _id: req.params._id })
    if (!rs) return res.status(500).send('invalid')
    //Set Logger
    Logger.set({ request: req, collectionName: MRoles.collection.collectionName, collectionID: req.params._id, method: 'delete' })
    return res.status(204).json(rs)
  } catch (e) {
    return res.status(500).send('invalid')
  }
}
