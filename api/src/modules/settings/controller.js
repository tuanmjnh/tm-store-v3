const MSetting = require('./model')
module.exports.name = MSetting.collection.collectionName
module.exports.get = async function (req, res, next) {
  try {
    const rs = await MSetting.findOne({ userId: req.verify._id })
    if (rs && rs.length) return res.status(200).json(rs)
    // const data = new MSetting({ userId: req.verify._id })
    // const rs = await data.save()
    if (rs) return res.status(200).json(rs)
    else return res.status(200).json([])
  } catch (e) {
    console.log(e)
    return res.status(500).send('invalid')
  }
}

module.exports.post = async function (req, res, next) {
  try {
    // if (!req.params.id) return res.status(500).send('Incorrect Id!')
    if (!req.body || Object.keys(req.body).length < 1) return res.status(500).send('invalid')
    const exist = await MSetting.findOne({ userId: req.verify._id })
    if (exist) {
      const set = {}
      set.darkMode = req.body.darkMode ? true : false
      if (req.body.language) set.language = req.body.language
      if (req.body.unitprice) set.unitprice = req.body.unitprice
      if (req.body.font) set.font = req.body.font
      if (req.body.format) set.format = req.body.format
      if (req.body.dense) set.dense = req.body.dense
      if (req.body.shadow) set.shadow = req.body.shadow
      const rs = await MSetting.updateOne({ userId: req.verify._id }, { $set: set })
      if (rs) return res.status(200).json(set)
      else return res.status(200).json(null)
    } else {
      const data = new MSetting({ userId: req.verify._id })
      if (req.body.darkMode) data.darkMode = req.body.darkMode
      if (req.body.language) data.language = req.body.language
      if (req.body.unitprice) data.unitprice = req.body.unitprice
      if (req.body.font) data.font = req.body.font
      if (req.body.format) data.format = req.body.format
      if (req.body.dense) data.dense = req.body.dense
      if (req.body.shadow) data.shadow = req.body.shadow
      const rs = await data.save()
      if (rs) return res.status(200).json(rs)
      else return res.status(200).json(null)
    }
  } catch (e) {
    return res.status(500).send('invalid')
  }
}
