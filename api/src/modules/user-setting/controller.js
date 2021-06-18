const MUserSetting = require('./model')
// const mongoose = require('mongoose')

const name = 'user-setting'
module.exports.name = name
module.exports.get = async function (req, res, next) {
  try {
    const find = await MUserSetting.find({ userId: req.verify._id })
    if (find && find.length) return res.status(200).json(find[0])
    const data = new MUserSetting({ userId: req.verify._id })
    const rs = await data.save()
    if (rs) return res.status(200).json(rs)
    else return res.status(200).json([])
  } catch (e) {
    console.log(e)
    return res.status(500).send('invalid')
  }
}

module.exports.put = async function (req, res, next) {
  try {
    // if (!req.params.id) return res.status(500).send('Incorrect Id!')
    if (!req.body || Object.keys(req.body).length < 1) return res.status(500).send('invalid')
    const set = {}
    if (req.body.language) set.language = req.body.language
    if (req.body.font) set.font = req.body.font
    if (req.body.dense) set.dense = req.body.dense
    if (req.body.format) set.format = req.body.format
    if (req.body.darkMode) set.darkMode = req.body.darkMode
    if (req.body.shadow) set.shadow = req.body.shadow
    MUserSetting.updateOne(
      { userId: req.verify._id }, { $set: set }, (e, rs) => {
        // { multi: true, new: true },
        if (e) return res.status(500).send(e)
        return res.status(200).json(rs)
      }
    )
  } catch (e) {
    console.log(e)
    return res.status(500).send('invalid')
  }
}
