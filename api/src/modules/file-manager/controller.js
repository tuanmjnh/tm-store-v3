// For more information on ways to initialize Storage, please see
// https://googleapis.dev/nodejs/storage/latest/Storage.html
// Imports the Google Cloud client library
const { Storage } = require('@google-cloud/storage')
const processFile = require('./process-file')
const { format } = require('util')
const path = require('path')
io = require('../../utils/io'),
  Request = require('../../utils/Request')

const name = 'file-manager'
module.exports.name = name
const commonPath = 'common'

// Creates a client from a Google service account key
// const storage = new Storage({keyFilename: 'key.json'})
// Creates a client using Application Default Credentials
const storage = new Storage({
  keyFilename: path.join(__dirname, '../../config/storage-tm-store-4576e-8b5b9681fe8c.json'),
  // projectId: 'tm-store-4576e'
})
const bucket = storage.bucket('tm-store-4576e.appspot.com')

function getPublicUrl (bucket, name) {
  return `https://storage.googleapis.com/${bucket}/${name}`
}

module.exports.createBucket = async function (req, res, next) {
  try {
    /**
 * TODO(developer): Uncomment these variables before running the sample.
 */
    // The ID of your GCS bucket
    // const bucketName = 'your-unique-bucket-name'

    // Creates the new bucket
    const rs = await storage.createBucket(req.body.name)
    console.log(`Bucket ${req.body.name} created.`)
    if (rs) return res.status(201).json(rs)
    else return res.status(500).send('invalid')
  } catch (e) {
    console.log(e)
    return res.status(500).send('invalid')
  }
}

module.exports.get = async (req, res, next) => {
  try {
    const acceptType = req.headers['accept-type'] ? req.headers['accept-type'].split(',').map(x => x.toLowerCase()) : '*'
    const [files] = await bucket.getFiles({ prefix: req.headers['upload-path'] ? req.headers['upload-path'] : null }) // , autoPaginate: false
    const rs = []
    files.forEach(file => {
      const name = file.name.split('/')
      const extension = io.getExtention(file.name)
      if (acceptType === '*') {
        rs.push({
          name: name[name.length - 1],
          url: getPublicUrl(file.metadata.bucket, file.metadata.name),
          type: file.metadata.contentType,
          size: file.metadata.size,
          extension: extension
        })
      } else {
        if (acceptType.includes(extension)) {
          rs.push({
            name: name[name.length - 1],
            url: getPublicUrl(file.metadata.bucket, file.metadata.name),
            type: file.metadata.contentType,
            size: file.metadata.size,
            extension: extension
          })
        }
      }
    })
    return res.status(201).json(rs)
  } catch (e) {
    // console.log(e)
    return res.status(500).send('invalid')
  }
}

// module.exports.getAll = async (req, res, next) => {
//   try {
//     const [files] = await bucket.getFiles()
//     const rs = []
//     files.forEach((file) => {
//       const name = file.name.split('/')
//       rs.push({
//         name: name[name.length - 1],
//         url: getPublicUrl(file.metadata.bucket, file.metadata.name),
//         type: file.metadata.contentType,
//         size: file.metadata.size,
//         extension: io.getExtention(file.name)
//       })
//     })
//     res.status(200).send(rs)
//   } catch (e) {
//     return res.status(500).send('invalid')
//   }
// }

module.exports.find = async (req, res, next) => {
  try {
    if (!req.query.file) return res.status(500).send('invalid')
    const [file] = await bucket.file(req.query.file).getMetadata()
    const name = file.name.split('/')
    const rs = [{
      name: name[name.length - 1],
      url: getPublicUrl(file.bucket, file.name),
      type: file.contentType,
      size: file.size,
      extension: io.getExtention(file.name)
    }]
    if (file) return res.status(201).json(rs)
    // res.redirect(metaData.mediaLink)
  } catch (e) {
    console.log(e)
    return res.status(500).send('invalid')
  }
}

module.exports.post = async (req, res, next) => {
  try {
    // const image = req.file.buffer
    await processFile(req, res)
    if (!req.file) {
      return res.status(400).send({ message: 'Please upload a file!' })
    }
    const fileUpload = req.headers['upload-path'] ? `${req.headers['upload-path']}/${req.file.originalname}` : `${commonPath}/${req.file.originalname}`
    const blob = bucket.file(fileUpload)
    const blobStream = blob.createWriteStream({ resumable: false, })

    blobStream.on('error', (e) => { res.status(500).send({ message: e.message }) })

    blobStream.on('finish', async (data) => {
      const publicUrl = format(`https://storage.googleapis.com/${bucket.name}/${blob.name}`)
      const rs = {
        name: req.file.originalname,
        url: publicUrl,
        type: req.file.mimetype,
        size: req.file.size,
        extension: io.getExtention(req.file.originalname)
      }
      try {
        await bucket.file(fileUpload).makePublic()
      } catch (e) {
        console.log(e)
        // return res.status(500).send({
        //   message: `Uploaded the file successfully: ${req.file.originalname}, but public access is denied!`,
        //   url: publicUrl,
        // })
      }
      return res.status(200).json(rs)
    })
    blobStream.end(req.file.buffer)
  } catch (e) {
    // console.log(e)
    if (e.code == 'LIMIT_FILE_SIZE') {
      return res.status(500).send(e.code) // ({message: 'File size cannot be larger than 2MB!'})
    }

    // res.status(500).send({
    //   message: `Could not upload the file: ${req.file.originalname}. ${e}}`,
    // })
    return res.status(500).send('invalid')
  }
}

module.exports.put = async (req, res, next) => {
  try {
    // const image = req.file.buffer
    await processFile(req, res)
    if (!req.file) {
      return res.status(400).send({ message: 'Please upload a file!' })
    }
    if (req.headers['upload-path'] === 'users') {
      req.headers['upload-path'] = `${req.headers['upload-path']}/${req.verify._id}`
    }
    const fileUpload = req.headers['upload-path'] ? `${req.headers['upload-path']}/${req.file.originalname}` : `${commonPath}/${req.file.originalname}`
    const blob = bucket.file(fileUpload)
    const blobStream = blob.createWriteStream({ resumable: false, })

    blobStream.on('error', (e) => { res.status(500).send({ message: e.message }) })

    blobStream.on('finish', async (data) => {
      const publicUrl = format(`https://storage.googleapis.com/${bucket.name}/${blob.name}`)
      const rs = {
        name: req.file.originalname,
        url: publicUrl,
        type: req.file.mimetype,
        size: req.file.size,
        extension: io.getExtention(req.file.originalname)
      }
      try {
        await bucket.file(fileUpload).makePublic()
      } catch (e) {
        console.log(e)
        // return res.status(500).send({
        //   message: `Uploaded the file successfully: ${req.file.originalname}, but public access is denied!`,
        //   url: publicUrl,
        // })
      }
      return res.status(200).json(rs)
    })
    blobStream.end(req.file.buffer)
  } catch (e) {
    // console.log(e)
    if (e.code == 'LIMIT_FILE_SIZE') {
      return res.status(500).send(e.code) // ({message: 'File size cannot be larger than 2MB!'})
    }

    // res.status(500).send({
    //   message: `Could not upload the file: ${req.file.originalname}. ${e}}`,
    // })
    return res.status(500).send('invalid')
  }
}