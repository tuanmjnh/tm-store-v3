const mongoose = require('mongoose'),
  AUsers = require('./actions'),
  MUsers = require('./model'),
  crypto = require('../../utils/crypto'),
  // Moment = require('moment'),
  Logger = require('../../services/logger')

module.exports.name = MUsers.collection.collectionName
module.exports.get = async function (req, res, next) {
  try {
    let conditions = { $and: [{ enable: req.query.enable && req.query.enable === 'true' ? true : false }] }
    if (req.query.filter) {
      conditions.$and.push({
        $or: [
          { email: new RegExp(req.query.filter, 'i') },
          { fullName: new RegExp(req.query.filter, 'i') },
          { personNumber: new RegExp(req.query.filter, 'i') },
          { phone: new RegExp(req.query.filter, 'i') }
        ]
      })
    }
    if (req.query.group) conditions.$and.push({ group: req.query.group })
    if (!req.query.sortBy) req.query.sortBy = 'username'
    req.query.rowsNumber = (await AUsers.get({ conditions: conditions })).length
    const rs = await AUsers.get({ conditions: conditions })
      .skip((parseInt(req.query.page) - 1) * parseInt(req.query.rowsPerPage))
      .limit(parseInt(req.query.rowsPerPage))
      .sort({ [(req.query.sortBy) || 'username']: req.query.descending === 'true' ? -1 : 1 }) // 1 ASC, -1 DESC
      .exec()
    return res.status(200).json({ rowsNumber: req.query.rowsNumber, data: rs })
  } catch (e) {
    return res.status(500).send('invalid')
  }
}

module.exports.find = async function (req, res, next) {
  try {
    if (req.query.id) {
      if (!mongoose.Types.ObjectId.isValid(req.query.id)) return res.status(500).send('invalid')
      if (Array.isArray(req.query.id)) {
        const conditions = { $and: [{ _id: { $in: req.query.id } }] }
        const rs = await AUsers.get({ conditions: conditions }).exec()
        if (!rs) return res.status(404).send('no_exist')
        return res.status(200).json(rs)
      } else {
        const conditions = { $and: [{ _id: mongoose.Types.ObjectId(req.query.id) }] }
        const rs = await AUsers.get({ conditions: conditions }).exec()
        if (!rs || rs.length < 1) return res.status(404).send('no_exist')
        return res.status(200).json(rs[0])
      }
    } else if (req.query.email) {
      if (Array.isArray(req.query.email)) {
        const conditions = { $and: [{ email: { $in: req.query.email } }] }
        const rs = await AUsers.get({ conditions: conditions }).exec()
        if (!rs) return res.status(404).send('no_exist')
        return res.status(200).json(rs)
      } else {
        const conditions = { $and: [{ email: req.query.email }] }
        const rs = await AUsers.get({ conditions: conditions }).exec()
        if (!rs || rs.length < 1) return res.status(404).send('no_exist')
        return res.status(200).json(rs[0])
      }
    } else if (req.query.username) {
      if (Array.isArray(req.query.username)) {
        const conditions = { $and: [{ username: { $in: req.query.username } }] }
        const rs = await AUsers.get({ conditions: conditions }).exec()
        if (!rs) return res.status(404).send('no_exist')
        return res.status(200).json(rs)
      } else {
        const conditions = { $and: [{ username: req.query.username }] }
        const rs = await AUsers.get({ conditions: conditions }).exec()
        if (!rs || rs.length < 1) return res.status(404).send('no_exist')
        return res.status(200).json(rs[0])
      }
    }
  } catch (e) {
    return res.status(500).send('invalid')
  }
}

module.exports.post = async function (req, res, next) {
  try {
    if (!req.body || Object.keys(req.body).length < 1) return res.status(500).send('invalid')
    const exist = await MUsers.findOne({ username: req.body.username })
    if (exist) return res.status(501).send('exist')
    const rs = AUsers.insert({ request: req, data: req.body })
    if (!rs) return res.status(500).send('invalid')
    //Set Logger
    Logger.set({ request: req, collectionName: MUsers.collection.collectionName, collectionID: rs._id, method: 'insert' })
    return res.status(201).json(rs)
  } catch (e) {
    // console.log(e)
    return res.status(500).send('invalid')
  }
}

module.exports.import = async function (req, res, next) {
  if (!req.body || !req.body.length) return res.status(500).send('invalid')
  const session = await mongoose.startSession()
  const rs = { success: [], error: [] }
  await session.withTransaction(async () => {
    let i = 0
    for await (const e of req.body) {
      try {
        i++
        const exist = await MUsers.findOne({ username: e.username })
        if (exist) {
          rs.error.push(i)
          continue
        }
        const user = AUsers.insert({ request: req, data: e, session: session })
        if (user) {
          rs.success.push(i)
          //Set Logger
          Logger.set({ request: req, collectionName: MUsers.collection.collectionName, collectionID: rs._id, method: 'insert-import' })
        }
        else rs.error.push(i)
      } catch (e) { continue }
    }
  })
  session.endSession()
  return res.status(201).json(rs)
}

module.exports.put = async function (req, res, next) {
  try {
    if (!req.body || Object.keys(req.body).length < 1) return res.status(500).send('invalid')
    if (!mongoose.Types.ObjectId.isValid(req.body._id)) return res.status(500).send('invalid')
    const set = {}
    if (req.body.group) set.group = req.body.group
    if (req.body.email) set.email = req.body.email
    if (req.body.fullName) set.fullName = req.body.fullName
    if (req.body.phone) set.phone = req.body.phone
    if (req.body.personNumber) set.personNumber = req.body.personNumber
    if (req.body.region) set.region = req.body.region
    if (req.body.avatar) set.avatar = req.body.avatar
    if (req.body.dateBirth) set.dateBirth = req.body.dateBirth
    if (req.body.gender) set.gender = req.body.gender
    if (req.body.address) set.address = req.body.address
    if (req.body.roles) set.roles = req.body.roles
    if (req.body.note !== undefined) set.note = req.body.note
    const rs = await MUsers.updateOne({ _id: req.body._id }, { $set: set })
    if (!rs) return res.status(500).send('invalid')
    //Set Logger
    Logger.set({ request: req, collectionName: MUsers.collection.collectionName, collectionID: req.body._id, method: 'update' })
    return res.status(202).json(rs)
  } catch (e) {
    return res.status(500).send('invalid')
  }
}

module.exports.update = async function (req, res, next) {
  try {
    if (!req.body || Object.keys(req.body).length < 1) return res.status(500).send('invalid')
    if (!mongoose.Types.ObjectId.isValid(req.body._id)) return res.status(500).send('invalid')
    const set = {}
    if (req.body.group) set.group = req.body.group
    if (req.body.email) set.email = req.body.email
    if (req.body.fullName) set.fullName = req.body.fullName
    if (req.body.phone) set.phone = req.body.phone
    if (req.body.personNumber) set.personNumber = req.body.personNumber
    if (req.body.region) set.region = req.body.region
    if (req.body.avatar) set.avatar = req.body.avatar
    if (req.body.dateBirth) set.dateBirth = req.body.dateBirth
    if (req.body.gender) set.gender = req.body.gender
    if (req.body.address) set.address = req.body.address
    if (req.body.note !== undefined) set.note = req.body.note
    const rs = await MUsers.updateOne({ _id: req.body._id }, { $set: set })
    if (!rs) return res.status(500).send('invalid')
    //Set Logger
    Logger.set({ request: req, collectionName: MUsers.collection.collectionName, collectionID: req.body._id, method: 'update' })
    return res.status(202).json(rs)
  } catch (e) {
    return res.status(500).send('invalid')
  }
}

module.exports.resetPassword = async function (req, res, next) {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.body._id)) return res.status(500).send('invalid')
    // Find user by id
    const x = await MUsers.findById(req.body._id)
    if (!x) return res.status(404).send('no_exist')
    // Generate password
    const password = req.body.password ? req.body.password : crypto.NewGuid().split('-')[0]
    const rs = await MUsers.updateOne({ _id: req.body._id }, { $set: { password: crypto.SHA256(password + x.salt) } })
    if (!rs) return res.status(500).send('invalid')
    //Set Logger
    Logger.set({ request: req, collectionName: MUsers.collection.collectionName, collectionID: req.body._id, method: 'reset-password' })
    return res.status(206).json({ password: password })
  } catch (e) {
    return res.status(500).send('invalid')
  }
}

module.exports.changePassword = async function (req, res, next) {
  try {
    // Find user by id
    const exist = await MUsers.findOne({ _id: req.verify._id })
    if (!exist) return res.status(404).send('no_exist')
    // check password
    if (exist.password !== crypto.SHA256(req.body.oldPassword + exist.salt)) { return res.status(505).json({ msg: 'wrong_password' }) }
    // set new password
    const rs = await MUsers.updateOne({ _id: req.verify._id }, { $set: { password: crypto.SHA256(req.body.newPassword + user.salt) } })
    if (!rs) return res.status(500).send('invalid')
    //Set Logger
    Logger.set({ request: req, collectionName: MUsers.collection.collectionName, collectionID: req.body._id, method: 'change-password' })
    return res.status(202).json(true)
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
        const exist = await MUsers.findById(_id)
        if (exist) {
          const update = await MUsers.updateOne({ _id: _id }, { $set: { enable: exist.enable === true ? false : true } })
          if (update) {
            rs.success.push(_id)
            //Set Logger
            Logger.set({ request: req, collectionName: MUsers.collection.collectionName, collectionID: req.body._id, method: 'flag' })
          }
          else rs.error.push(_id)
        }
      } catch (e) { continue }
    }
  })
  session.endSession()
  return res.status(203).json(rs)
}

module.exports.verified = async function (req, res, next) {
  try {
    if (!req.body.verified) return res.status(500).send('invalid')
    if (!mongoose.Types.ObjectId.isValid(req.body._id)) return res.status(500).send('invalid')
    const rs = await MUsers.updateOne({ _id: req.body._id }, { $set: { verified: req.body.verified === 'true' ? true : false } })
    if (!rs) return res.status(500).send('invalid')
    //Set Logger
    Logger.set({ request: req, collectionName: MUsers.collection.collectionName, collectionID: req.body._id, method: 'verify' })
    return res.status(205).json(rs)
  } catch (e) {
    return res.status(500).send('invalid')
  }
}

module.exports.delete = async function (req, res, next) {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params._id)) return res.status(500).send('invalid')
    const rs = await MUsers.deleteOne({ _id: req.params._id })
    if (!rs) return res.status(500).send('invalid')
    //Set Logger
    Logger.set({ request: req, collectionName: MUsers.collection.collectionName, collectionID: req.body._id, method: 'delete' })
    return res.status(204).json(rs)
  } catch (e) {
    return res.status(500).send('invalid')
  }
}
