const io = require('../utils/io')
const multer = require('multer')

const name = 'file-manager'
module.exports.name = name

const storage = multer.diskStorage({
  destination: async function (req, file, cb) {
    const create_dir = await io.createDir({ dir: req.headers.path })
    cb(null, create_dir.path)
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
})
module.exports.storage = storage

const upload = multer({ storage: storage }).array('file-upload')
module.exports.upload = upload

module.exports.get = async function (req, res, next) {
  try {
    const result = 'File manager'
    if (result) res.status(201).json(result).end()
    else res.status(404).json({ msg: 'exist', params: 'data' }).end()
  } catch (e) {
    return res.status(500).send('invalid')
  }
}

module.exports.post = async function (req, res, next) {
  try {
    const result = []// await dbapi.create(body)
    for (const e of req.files) {
      result.push({
        path: req.headers.path,
        size: e.size,
        originalname: e.filename,
        filename: `${req.headers.path}/${e.filename}`,
        extension: io.getExtention(e.filename),
        mimetype: e.mimetype
      })
    }
    if (result) res.status(201).json(result).end()
    else res.status(404).json({ msg: 'exist', params: 'data' }).end()
  } catch (e) {
    return res.status(500).send('invalid')
  }
}
