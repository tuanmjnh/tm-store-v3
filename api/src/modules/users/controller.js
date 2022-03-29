const mongoose = require('mongoose'),
  AUsers = require('./actions'),
  MUsers = require('./model'),
  crypto = require('../../utils/crypto'),
  // Moment = require('moment'),
  Request = require('../../utils/Request'),
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
      if (mongoose.Types.ObjectId.isValid(req.query.id)) {
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
      } else {
        return res.status(500).send('invalid')
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
    if (!req.body || Object.keys(req.body).length < 1 || !req.body.email) {
      return res.status(500).send('invalid')
    }
    const x = await MUsers.findOne({ email: req.body.email })
    if (x) return res.status(501).send('exist')
    const password = req.body.password ? req.body.password : crypto.NewGuid().split('-')[0]
    req.body.salt = crypto.NewGuid('n')
    req.body.password = crypto.SHA256(password + req.body.salt)
    req.body.created = { at: new Date(), by: req.verify._id, ip: Request.getIp(req) }
    // req.body.dateBirth = Moment(req.body.dateBirth, 'DD/MM/YYYY')
    const data = new MUsers(req.body)
    // data.validate()
    data.save((e, rs) => {
      if (e) return res.status(500).send(e)
      rs.password = password
      // Push logs
      Logger.set(req, MUsers.collection.collectionName, rs._id, 'insert')
      return res.status(201).json(rs)
    })
  } catch (e) {
    console.log(e)
    return res.status(500).send('invalid')
  }
}

module.exports.import = async function (req, res, next) {
  if (!req.body || !req.body.length) return res.status(500).send('invalid')
  const session = await mongoose.startSession()
  session.startTransaction()
  try {
    const rs = { success: [], error: [] }
    let i = 0
    for await (const e of req.body) {
      i++
      const x = await MUsers.findOne({ username: e.username })
      if (x) {
        rs.error.push(i)
        continue
      }
      e.salt = crypto.NewGuid('n')
      e.password = crypto.SHA256(e.password + e.salt)
      e.created = { at: new Date(), by: req.verify._id, ip: Request.getIp(req) }
      const item = new MUsers(e)
      const itemSave = await item.save()
      if (itemSave) rs.success.push(i)
      else rs.error.push(i)
    }
    // commit
    await session.commitTransaction()
    session.endSession()
    return res.status(201).json(rs)
  } catch (e) {
    console.log(e)
    await session.abortTransaction()
    session.endSession()
    return res.status(500).send('invalid')
  }
}

module.exports.create = async function (req, res, next) {
  try {
    if (!req.body && !Array.isArray(req.body)) return res.status(500).send('invalid')
    if (req.body.length < 1) return res.status(500).send('Empty data!')
    const data = []
    req.body.forEach((e) => {
      data.push(new MUsers(e))
    })
    MUsers.create(data)
      .then((rs) => {
        return res.status(201).json(rs)
      })
      .catch((e) => {
        return res.status(500).send(e)
      })
  } catch (e) {
    return res.status(500).send('invalid')
  }
}

module.exports.insertOne = async function (req, res, next) {
  try {
    if (!req.body) return res.status(500).send('invalid')
    const data = new MUsers(req.body)
    data.validate()
    MUsers.collection.insertOne(data, (e, rs) => {
      if (e) return res.status(500).send(e)
      // Push logs
      Logger.set(req, MUsers.collection.collectionName, rs._id, 'insert')
      return res.status(201).json(rs)
    })
  } catch (e) {
    return res.status(500).send('invalid')
  }
}

module.exports.put = async function (req, res, next) {
  try {
    // if (!req.body._id) return res.status(500).send('invalid')
    if (!req.body || Object.keys(req.body).length < 1) return res.status(500).send('invalid')
    if (mongoose.Types.ObjectId.isValid(req.body._id)) {
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
      if (rs) {
        Logger.set(req, MUsers.collection.collectionName, req.body._id, 'update')
        return res.status(202).json(rs)
      }
      else return res.status(200).json(null)
    } else {
      return res.status(500).send('invalid')
    }
  } catch (e) {
    return res.status(500).send('invalid')
  }
}

module.exports.update = async function (req, res, next) {
  try {
    if (!req.body || Object.keys(req.body).length < 1) return res.status(500).send('invalid')
    if (mongoose.Types.ObjectId.isValid(req.body._id)) {
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
      if (rs) {
        Logger.set(req, MUsers.collection.collectionName, req.body._id, 'update')
        return res.status(202).json(rs)
      }
      else return res.status(200).json(null)
    } else {
      return res.status(500).send('invalid')
    }
  } catch (e) {
    console.log(e)
    return res.status(500).send('invalid')
  }
}

module.exports.resetPassword = async function (req, res, next) {
  try {
    if (mongoose.Types.ObjectId.isValid(req.body._id)) {
      // Find user by id
      const x = await MUsers.findById(req.body._id)
      if (!x) return res.status(404).send('no_exist')
      // Generate password
      const password = req.body.password ? req.body.password : crypto.NewGuid().split('-')[0]
      MUsers.updateOne(
        { _id: req.body._id },
        { $set: { password: crypto.SHA256(password + x.salt) } },
        (e, rs) => {
          if (e) return res.status(500).send(e)
          // Push logs
          Logger.set(req, MUsers.collection.collectionName, req.body._id, 'reset-password')
          res.status(206).json({ password: password })
        }
      )
    } else {
      return res.status(500).send('invalid')
    }
  } catch (e) {
    return res.status(500).send('invalid')
  }
}

module.exports.changePassword = async function (req, res, next) {
  try {
    // Find user by id
    const user = await MUsers.findOne({ _id: req.verify._id })
    if (!user) return res.status(404).send('no_exist')
    // check password
    if (user.password !== crypto.SHA256(req.body.oldPassword + user.salt)) { return res.status(505).json({ msg: 'wrong_password' }) }
    // set new password
    MUsers.updateOne(
      { _id: req.verify._id },
      { $set: { password: crypto.SHA256(req.body.newPassword + user.salt) } },
      (e, rs) => {
        if (e) return res.status(500).send(e)
        // Push logs
        Logger.set(req, MUsers.collection.collectionName, user._id, 'change-password')
        res.status(202).json(true)
      }
    )
  } catch (e) {
    return res.status(500).send('invalid')
  }
}

module.exports.patch = async function (req, res, next) {
  try {
    let rs = { success: [], error: [] }
    for await (let _id of req.body._id) {
      // if (!validate.isBoolean(req.body.disabled)) {
      //   rs.error.push(id)
      //   continue
      // }
      const x = await MUsers.findById(_id)
      if (x) {
        var _x = await MUsers.updateOne(
          { _id: _id },
          { $set: { enable: x.enable === true ? false : true } }
        )
        if (_x) {
          rs.success.push(_id)
          // Push logs
          Logger.set(req, MUsers.collection.collectionName, _id, x.enable === true ? 'lock' : 'unlock')
        } else rs.error.push(_id)
      }
    }
    return res.status(203).json(rs)
    // if (!validate.isBoolean(req.body.disabled)) return res.status(500).send('invalid')
    // if (mongoose.Types.ObjectId.isValid(req.params.id)) {
    //   MUsers.updateOne({ _id: req.params.id }, { $set: { disabled: req.body.disabled } }, (e, rs) => {
    //     if (e) return res.status(500).send(e)
    //     if (!rs) return res.status(404).send('no_exist')
    //     return res.status(203).json(rs)
    //   })
    // } else {
    //   return res.status(500).send('invalid')
    // }
  } catch (e) {
    return res.status(500).send('invalid')
  }
}

module.exports.verified = async function (req, res, next) {
  try {
    if (!req.body.verified) return res.status(500).send('invalid')
    if (mongoose.Types.ObjectId.isValid(req.body._id)) {
      MUsers.updateOne(
        { _id: req.body._id },
        { $set: { verified: req.body.verified === 'true' ? true : false } },
        (e, rs) => {
          if (e) return res.status(500).send(e)
          // Push logs
          Logger.set(req, MUsers.collection.collectionName, req.body._id, 'verified')
          return res.status(205).json(rs)
        }
      )
    } else {
      return res.status(500).send('invalid')
    }
  } catch (e) {
    return res.status(500).send('invalid')
  }
}

module.exports.delete = async function (req, res, next) {
  try {
    if (mongoose.Types.ObjectId.isValid(req.params._id)) {
      MUsers.deleteOne({ _id: req.params._id }, (e, rs) => {
        if (e) return res.status(500).send(e)
        // Push logs
        Logger.set(req, MUsers.collection.collectionName, req.params._id, 'delete')
        return res.status(204).json(rs)
      })
    } else {
      return res.status(500).send('invalid')
    }
  } catch (e) {
    return res.status(500).send('invalid')
  }
}
