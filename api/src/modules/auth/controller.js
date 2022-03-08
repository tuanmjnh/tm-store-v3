const MUser = require('../users/model'),
  MRoles = require('../roles/model'),
  MRoutes = require('../routes/model'),
  middleware = require('../../services/middleware'),
  crypto = require('../../utils/crypto'),
  constantCommon = require('../../config/common'),
  moment = require('moment')

const name = 'auth'
module.exports.name = name
const generateRoutes_children = (routes, rolesRoutes) => {
  const rs = []
  routes.forEach((e) => {
    if (rolesRoutes.indexOf(e.name) >= 1) rs.push(e)
    else {
      if (e.children) {
        const tmp = generateRoutes(e.children, rolesRoutes)
        if (tmp.length > 0) {
          e.children = tmp
          rs.push(e)
        }
      }
    }
  })
  return rs
}
const generateRoutes = (routes, rolesRoutes, dependent = null) => {
  const rs = []
  try {
    const children = routes.filter((x) => x.dependent !== null)
    routes.forEach((e) => {
      const _dependent = e.dependent ? e.dependent.toString() : null
      if (rolesRoutes.indexOf(e.name) >= 0 && _dependent === dependent) {
        const child = generateRoutes(children, rolesRoutes, e._id.toString())
        if (child.length > 0) e.children = child
        rs.push(e)
      }
      // if (rolesRoutes.indexOf(e.name) >= 0 && e.parents !== null) {
      //   const x = routes.find(x => x._id.toString() === e.parents)
      //   if (x) {
      //     helpers.pushIfNotExist(x.children, e)
      //     helpers.pushIfNotExist(rs, x)
      //   }
      // }
    })
  } catch (e) {
    console.log(e)
  }
  return rs
}
const getAuthRoutes = async (authRoles) => {
  // Roles
  const roles = await MRoles.where({ _id: { $in: authRoles } }).sort({
    level: 1
  })
  let authRoutes = []
  roles.forEach((e) => {
    authRoutes.pushIfNotExist(e.routes)
  })
  // Routes
  // const routes = await MRoutes.where({ flag: 1 }).sort({ dependent: 1, orders: 1 })
  // console.log(routes)
  // return generateRoutes(routes, authRoutes)
  return authRoutes
}
const getConstantRoutes = async () => {
  const routes = await MRoles.distinct('routes')
  return constantCommon.routes.pushIfNotExist(routes)
}

module.exports.get = async function (req, res, next) {
  try {
    // get constant account
    let rs = constantCommon.users.find((x) => x._id === req.verify._id)
    // let routes = []
    // get database account
    if (rs) {
      // routes = await getConstantRoutes()
      rs.routes = await getConstantRoutes()
    } else {
      rs = await (await MUser.findOne({ _id: req.verify._id }))
      if (!rs) return res.status(402).json({ msg: 'token_invalid' })
      rs = rs.toJSON()
      // Routes
      rs.routes = await getAuthRoutes(rs.roles)
      // fix date
      rs.dateBirth = moment(rs.dateBirth).format('YYYY-MM-DD')
    }
    return res.status(200).json({ user: rs })
    // return res.status(200).json({ data: req.verify._id as any })
  } catch (e) {
    console.log(e)
    return res.status(500).send('invalid')
  }
}

module.exports.post = async function (req, res, next) {
  try {
    // check req data
    if (!req.body.username || !req.body.password) { return res.status(404).json({ msg: 'no_exist' }) }
    // constant account
    let rs = constantCommon.users.find(
      (x) =>
        x.username === req.body.username &&
        x.password === crypto.SHA256(req.body.password + x.salt)
    )
    // let routes = []
    if (rs) {
      rs.routes = await getConstantRoutes()
    } else {
      // throw new Error('wrong')
      rs = await MUser.findOne({ username: req.body.username })
      // not exist username
      if (!rs) return res.status(502).json({ msg: 'no_exist' })
      // check password
      if (rs.password !== crypto.SHA256(req.body.password + rs.salt)) { return res.status(503).json({ msg: 'no_exist' }) }
      // check lock
      if (!rs.enable) return res.status(504).json({ msg: 'locked' })
      // Routes
      rs = rs.toJSON()
      rs.routes = await getAuthRoutes(rs.roles)
      // fix date
      rs.dateBirth = moment(rs.dateBirth).format('YYYY-MM-DD')
      // Update last login
      await MUser.updateOne(
        { _id: rs._id },
        {
          $set: {
            lastLogin: new Date()
          }
        }
      )
    }
    // Token
    const token = middleware.sign({
      params: { _id: rs._id, code: rs.username }
    })
    if (rs) return res.status(200).json({ token, user: rs })
    else return res.status(401).json({ msg: 'wrong' })
  } catch (e) {
    console.log(e)
    return res.status(500).send('invalid')
  }
}
