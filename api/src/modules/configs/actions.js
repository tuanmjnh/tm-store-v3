const MConfigs = require('./model')

module.exports.init = (app) => {
  app.locals.configs = {}
  MConfigs.find().then(x => {
    x.forEach(e => {
      app.locals.configs[e.key] = e.value
    })
  })
}

module.exports.get = (conditions) => {
  return MConfigs.aggregate([{ $match: conditions }])
}

module.exports.exist = async (key) => {
  const exist = await MConfigs.findOne({ key: key.toLowerCase() })
  if (exist) return true
  else return false
}

