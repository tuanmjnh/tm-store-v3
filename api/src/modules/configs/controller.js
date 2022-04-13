const MConfigs = require('./model')
const AConfigs = require('./actions')
module.exports.name = MConfigs.collection.collectionName
module.exports.get = async function (req, res, next) {
  try {
    req.query.page = req.query.page ? parseInt(req.query.page) : 1
    req.query.rowsPerPage = req.query.rowsPerPage ? parseInt(req.query.rowsPerPage) : 10
    let conditions = {}
    if (req.query.filter) {
      conditions.$and = []
      conditions.$and.push({
        $or: [
          { key: new RegExp(req.query.filter, 'i') },
          { value: new RegExp(req.query.filter, 'i') }
        ]
      })
    }
    if (!req.query.sortBy) req.query.sortBy = 'key'
    req.query.rowsNumber = (await AConfigs.get(conditions)).length
    const rs = await AConfigs.get(conditions)
      .skip((req.query.page - 1) * req.query.rowsPerPage)
      .limit(req.query.rowsPerPage)
      .sort({ [(req.query.sortBy) || 'orders']: req.query.descending === 'true' ? -1 : 1 }) // 1 ASC, -1 DESC
      .exec()
    return res.status(200).json({ rowsNumber: req.query.rowsNumber, data: rs });
  } catch (e) {
    console.log(e)
    return res.status(500).send('invalid')
  }
}

module.exports.exist = async function (req, res, next) {
  try {
    if (!req.query.key) return res.status(404).send('exist')
    const rs = await AConfigs.exist(req.query.key)
    if (rs) return res.status(200).json(true)
    else return res.status(200).json(false)
  } catch (e) {
    return res.status(500).json('invalid')
  }
}

module.exports.post = async function (req, res, next) {
  try {
    if (!req.body || Object.keys(req.body).length < 1) return res.status(500).send('invalid')
    const exist = await MConfigs.findOne({ key: new RegExp(req.body.key, 'i') })
    if (exist) return res.status(500).send('exist')
    const data = new MConfigs({
      key: req.body.key,
      value: req.body.value
    })
    const rs = await data.save()
    if (rs) {
      AConfigs.init(req.app)
      return res.status(200).json(rs)
    } else return res.status(200).json(null)
  } catch (e) {
    return res.status(500).send('invalid')
  }
}

module.exports.put = async function (req, res, next) {
  try {
    if (!req.body || !req.body._id || !req.body.key || !req.body.value)
      return res.status(500).send('invalid')
    const rs = await MConfigs.updateOne(
      { _id: req.body._id },
      {
        $set: {
          key: req.body.key,
          value: req.body.value
        }
      })
    if (rs) {
      AConfigs.init(req.app)
      return res.status(202).json(rs)
    } else return res.status(202).json(null)
  } catch (e) {
    return res.status(500).send('invalid')
  }
}

module.exports.patch = async function (req, res, next) {
  try {
    return res.status(203).json(null)
  } catch (e) {
    return res.status(500).send('invalid')
  }
}