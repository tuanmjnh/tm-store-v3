const fs = require('fs'),
  path = require('path'),
  moment = require('moment'),
  requestHelper = require('../utils/Request')

//** Text Log **/
// Path Logs
const pathLog = path.join(process.env.ROOT_PATH, 'logs')
module.exports.pathLog = pathLog
// Path Now
const pathNow = `${pathLog}/${moment().format('YYYY-MM-DD')}`
module.exports.pathNow = pathNow
const checkPath = (path) => {
  if (!fs.existsSync(path)) fs.mkdirSync(path)
}
// function Logger (UserID, CollectionName, CollectionID, method, UserAgent, CreatedAt, CreatedIp) {
//   this.UID = UserID // User ID
//   this.name = CollectionName// Collection Name
//   this.id = CollectionID // Collection ID
//   this.method = method // insert
//   this.agent = UserAgent //requestHelper.getUserAgent(request)
//   this.at = CreatedAt // new Date()
//   this.ip = CreatedIp //requestHelper.getIp(request)
// }

const saveFile = ({ fileName, content }) => {
  try {
    const filePath = `${pathNow}/${fileName}.txt`
    const exist = fs.existsSync(filePath)
    fs.appendFile(filePath, `${exist ? ',' : ''}${content}`, function (e) { if (e) throw e })
    return true
  } catch (e) {
    return false
  }
}

//** Database Log **/
// module.exports.name = MLogger.collection.collectionName
const insert = async ({ request, collectionName, collectionID, method, session }) => {
  const mongoose = require('mongoose')
  const schema = new mongoose.Schema({
    UID: { type: String, required: true },
    name: { type: String, required: true },
    id: { type: String, required: true },
    method: { type: String, required: true },
    agent: { type: String, required: true },
    at: { type: Date, default: new Date() },
    ip: { type: String, required: true }
  })
  const MLogger = mongoose.model('logs', schema)

  const data = new MLogger({
    UID: request.verify._id,
    name: collectionName,
    id: collectionID,
    method: method,
    agent: requestHelper.getUserAgent(request),
    at: new Date(),
    ip: requestHelper.getIp(request)
  })
  data.validateSync()
  if (session) {
    const rs = await data.save({ session: session })
    if (rs) return true
    else return false
  } else {
    const rs = await data.save()
    if (rs) return true
    else return false
  }
}

// const a = new Logger('iidsghon352ihg', 'users', 'sdkufhi2', 'insert', 'chrome', new Date(), 'admin')
//** Actions **/
module.exports.set = async ({ request, collectionName, collectionID, method, session }) => {
  try {
    if (request.app.locals.configs.logger) {
      if (request.app.locals.configs.logger === 'db') {
        const rs = await insert({
          request: request,
          collectionName: collectionName,
          collectionID: collectionID,
          method: method,
          session: session
        })
        if (rs) return true
        else return false
      } else if (request.app.locals.configs.logger === 'txt') {
        // Check path Log
        checkPath(pathLog)
        // Check path Now
        checkPath(pathNow)
        //
        const logger = {
          UID: request.verify._id,
          name: collectionName,
          id: collectionID,
          method: method,
          agent: requestHelper.getUserAgent(request),
          at: new Date(),
          ip: requestHelper.getIp(request)
        }
        return saveFile({ fileName: collectionName, content: JSON.stringify(logger) })
      }
    } else return false
  } catch (e) {
    // console.log(e)
    return false
  }
}

module.exports.get = ({ filePath, type = 'json' }) => {
  // const _filePath = `${pathNow}/types.txt`
  const exist = fs.existsSync(filePath)
  if (exist) {
    if (type === 'json') return JSON.parse(`[${fs.readFileSync(filePath, 'utf8')}]`)
    else return `[${fs.readFileSync(filePath, 'utf8')}]`
  } else return null
}
