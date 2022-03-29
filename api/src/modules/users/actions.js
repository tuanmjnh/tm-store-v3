const mongoose = require('mongoose'),
  MUsers = require('./model'),
  Request = require('../../utils/Request'),
  Logger = require('../../services/logger')

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

module.exports.insert = async ({ request, item, createdBy, isLog, type, session }) => {
  const rs = { data: null, success: [], error: [] }
  isLog = isLog || true
  try {
    // check object input
    if (
      !item ||
      Object.keys(item).length < 1 ||
      !item.title ||
      !item.code ||
      item.categories.length < 1
    ) {
      rs.error.push('invalid')
      return rs
    }
    // check exist code
    const findOne = await MUsers.findOne({ code: item.code })
    if (findOne) {
      rs.error.push('exist')
      return rs
    }
    // defined created
    item.created = { at: new Date(), by: createdBy || request.verify._id, ip: Request.getIp(request) }
    // defined ObjectId for array category
    // if (item.categories && Array.isArray(item.categories) && item.categories.length > 0)
    //   for (let i = 0; i < item.categories.length; i++) {
    //     item.categories[i] = mongoose.Types.ObjectId(item.categories[i])
    //   }
    // defined new Products
    const data = new MProducts(item)
    // validate data
    data.validateSync()
    // Save data
    if (session) {
      const save = await data.save({ session })
      // check error
      if (!save) rs.error.push('invalid')
      else {
        rs.data = save
        rs.success.push(save._id)
        // Push logs
        if (isLog) Logger.set({
          request: request,
          collectionName: MUsers.collection.collectionName,
          collectionId: save._id,
          action: type || 'insert'
        })
      }
    } else {
      const save = await data.save()
      // check error
      if (!save) rs.error.push('invalid')
      else {
        rs.data = save
        rs.success.push(save._id)
        // Push logs
        if (isLog) Logger.set({
          request: request,
          collectionName: MUsers.collection.collectionName,
          collectionId: save._id,
          action: type || 'insert'
        })
      }
    }
  } catch (e) {
    console.log(e)
    rs.error.push(e)
  }
  return rs
}
