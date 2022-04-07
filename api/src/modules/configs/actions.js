const MConfigs = require('./model')
module.exports.get = async function () {
  const rs = await MConfigs.find()
  if (rs) return rs
  else return []
}