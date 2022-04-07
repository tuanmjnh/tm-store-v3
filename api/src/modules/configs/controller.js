const MConfigs = require('./model')
const AConfigs = require('./actions')
module.exports.name = MConfigs.collection.collectionName
module.exports.get = async function (req, res, next) {
  try {
    const rs = await AConfigs.get()
    if (rs && rs.length) return res.status(200).json(rs)
    if (rs) return res.status(200).json(rs)
    else return res.status(200).json([])
  } catch (e) {
    return res.status(500).send('invalid')
  }
}
module.exports.post = async function (req, res, next) {
  try {
    if (!req.body || Object.keys(req.body).length < 1) return res.status(500).send('invalid')
    const data = new MConfigs({
      key: req.body.key,
      value: req.body.value
    })
    const rs = await data.save()
    if (rs) return res.status(200).json(rs)
    else return res.status(200).json(null)
  } catch (e) {
    return res.status(500).send('invalid')
  }
}
module.exports.put = async function (req, res, next) {
  try {
    if (!req.body || Object.keys(req.body).length < 1) return res.status(500).send('invalid')
    const rs = MConfigs.findOneAndUpdate({ key: req.body.key }, { value: req.body.value })
    if (rs) return res.status(200).json(rs)
    else return res.status(200).json(null)
  } catch (e) {
    return res.status(500).send('invalid')
  }
}