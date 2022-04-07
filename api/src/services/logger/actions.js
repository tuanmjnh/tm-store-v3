const MLogger = require('./model'),
  requestHelper = require('../../utils/Request')

module.exports.insert = async ({ request, collectionName, collectionId, action, session }) => {
  try {
    if (process.env.LOGGER) return
    if (session) {
      const data = new MLogger({
        UID: request.verify._id,
        name: collectionName,
        id: collectionId,
        method: action,
        agent: requestHelper.getUserAgent(request),
        at: new Date(),
        ip: requestHelper.getIp(request)
      })
      data.validateSync()
      const rs = await data.save({ session: session })
      if (rs) return true
      else return false
    } else {
      const data = new MLogger({
        UID: request.verify._id,
        name: collectionName,
        id: collectionId,
        method: action,
        agent: requestHelper.getUserAgent(request),
        at: new Date(),
        ip: requestHelper.getIp(request)
      })
      data.validateSync()
      const rs = await data.save()
      if (rs) return true
      else return false
    }
  } catch (e) {
    // console.log(e)
    return false
  }
}
