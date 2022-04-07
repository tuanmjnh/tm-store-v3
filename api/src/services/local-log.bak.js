const fs = require('fs'),
  path = require('path'),
  moment = require('moment'),
  requestHelper = require('../utils/Request')

// function Logger (UserID, CollectionName, CollectionID, method, UserAgent, CreatedAt, CreatedIp) {
//   this.UID = UserID // User ID
//   this.name = CollectionName// Collection Name
//   this.id = CollectionID // Collection ID
//   this.method = method // insert
//   this.agent = UserAgent //requestHelper.getUserAgent(request)
//   this.at = CreatedAt // new Date()
//   this.ip = CreatedIp //requestHelper.getIp(request)

// }
// const schema = {
//   UID: '', // User ID
//   name: '', // Collection Name
//   id: '', // Collection ID
//   method: '', // insert
//   agent: '', //requestHelper.getUserAgent(request)
//   at: '', // new Date()
//   ip: '', //requestHelper.getIp(request)
// }

// Path Logs
const pathLog = path.join(process.env.ROOT_PATH, 'logs')
const checkPath = (path) => {
  if (!fs.existsSync(path)) fs.mkdirSync(path)
  // console.log(pathLog)
}
checkPath(pathLog)
// Path Now
const pathNow = `${pathLog}/${moment().format('YYYY-MM-DD')}`
checkPath(pathNow)

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

function Logger (UserID, CollectionName, CollectionID, method, UserAgent, CreatedAt, CreatedIp) {
  this.UID = UserID // User ID
  this.name = CollectionName// Collection Name
  this.id = CollectionID // Collection ID
  this.method = method // insert
  this.agent = UserAgent //requestHelper.getUserAgent(request)
  this.at = CreatedAt // new Date()
  this.ip = CreatedIp //requestHelper.getIp(request)
}

// const a = new Logger('iidsghon352ihg', 'users', 'sdkufhi2', 'insert', 'chrome', new Date(), 'admin')

module.exports.set = ({ request, CollectionName, CollectionID, method }) => {
  try {
    const logger = new Logger(request.verify._id, CollectionName, CollectionID, method, requestHelper.getUserAgent(request), new Date(), requestHelper.getIp(request))
    return saveFile({
      fileName: CollectionName,
      content: JSON.stringify(logger)
    })
  } catch (e) {
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
module.exports.pathLog = pathLog