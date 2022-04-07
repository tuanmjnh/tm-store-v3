const mongoose = require('mongoose'),
  MUsers = require('./model'),
  Request = require('../../utils/Request')

module.exports.get = ({ conditions }) => {
  const rs = MUsers.aggregate([
    { $match: conditions },
    {
      $lookup: {
        from: 'roles',
        let: { roles: '$roles' },
        as: 'userRoles',
        pipeline: [
          { $addFields: { 'roleId': { $toString: '$_id' } } },
          { $match: { $expr: { $and: [{ $in: ['$roleId', '$$roles'] }] } } },
          { $project: { _id: 1, key: 1, name: 1, level: 1, color: 1 } }
        ]
      }
    },
    // { $replaceRoot: { newRoot: { $mergeObjects: [{ $arrayElemAt: ['$roles', 0] }, '$$ROOT'] } } },
    // { $project: { roles: 0 } }
  ])
  return rs
}

module.exports.select = ({ conditions, fields }) => {
  if (fields) {
    return MUsers.where(conditions, fields)
  } else {
    return MUsers.where(conditions)
  }
}

module.exports.insert = async ({ request, data, createdBy, session }) => {
  const password = data.password ? data.password : crypto.NewGuid().split('-')[0]
  data.salt = crypto.NewGuid('n')
  data.password = crypto.SHA256(password + req.body.salt)
  data.created = { at: new Date(), by: createdBy || request.verify._id, ip: Request.getIp(req) }
  // req.body.dateBirth = Moment(req.body.dateBirth, 'DD/MM/YYYY')
  const data = new MUsers(data)
  data.validateSync()
  let rs = null
  if (session) rs = data.save({ session: session })
  else rs = data.save()
  if (rs) rs.password = password
  return rs
}
