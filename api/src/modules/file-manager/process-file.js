const fs = require('fs'),
  path = require('path'),
  util = require('util'),
  Multer = require('multer'),
  maxSize = 2 * 1024 * 1024,
  crypto = require('../../utils/crypto'),
  io = require('../../utils/io')


const memoryStorageMulter = Multer({
  storage: Multer.memoryStorage(),
  limits: { fileSize: maxSize },
}).single('file')

const diskStorageMulter = Multer({
  storage: Multer.diskStorage({
    destination: async function (req, file, callback) {
      req.app.locals.configs.upload_path = req.app.locals.configs.upload_path || 'uploads'
      if (!fs.existsSync(req.app.locals.configs.upload_path)) await fs.mkdirSync(req.app.locals.configs.upload_path)
      callback(null, req.app.locals.configs.upload_path)
    },
    filename: function (req, file, callback) {
      if (req.app.locals.configs.upload_rename === 'true') {
        const ext = io.getExtention(file.originalname)
        callback(null, crypto.NewGuid() + ext)
      } else callback(null, file.originalname)
    }
  }),
  limits: { fileSize: maxSize },
}).single('file')


const memoryStorage = util.promisify(memoryStorageMulter)
const diskStorage = util.promisify(diskStorageMulter)
module.exports = { memoryStorage, diskStorage }