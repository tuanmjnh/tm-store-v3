const fs = require('fs'),
  path = require('path'),
  moment = require('moment'),
  requestHelper = require('../../utils/Request'),
  Logger = require('./logger'),
  MLogger = require('./model'),
  ALogger = require('./actions')

module.exports.name = MLogger.collection.collectionName
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

// const a = new Logger('iidsghon352ihg', 'users', 'sdkufhi2', 'insert', 'chrome', new Date(), 'admin')

module.exports.set = async ({ request, CollectionName, CollectionID, method, session }) => {
  try {
    if (request.app.locals.configs.logger) {
      if (request.app.locals.configs.logger === 'db') {
        const rs = await ALogger.insert({
          request: request,
          collectionName: CollectionName,
          collectionId: CollectionID,
          method: method,
          session: session
        })
        if (rs) return true
        else return false
      } else {
        const logger = new Logger(request.verify._id, CollectionName, CollectionID, method, requestHelper.getUserAgent(request), new Date(), requestHelper.getIp(request))
        return saveFile({
          fileName: CollectionName,
          content: JSON.stringify(logger)
        })
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
module.exports.pathLog = pathLog