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
    const [metaData] = await bucket.file(req.params.name).getMetadata()
    res.redirect(metaData.mediaLink)

  } catch (e) {
    return res.status(500).send('invalid')
  }
}

module.exports.getAll = async (req, res, next) => {
  try {
    const [files] = await bucket.getFiles()
    let fileInfos = []

    files.forEach((file) => {
      fileInfos.push({
        name: file.name,
        url: file.metadata.mediaLink,
      })
    })

    res.status(200).send(fileInfos)
  } catch (e) {
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
    if (req.headers['upload-path'] === 'users') {
      req.headers['upload-path'] = `${req.headers['upload-path']}/${req.verify._id}`
    }
    const fileUpload = req.headers['upload-path'] ? `${req.headers['upload-path']}/${req.file.originalname}` : `${commonPath}/${req.file.originalname}`
    const blob = bucket.file(fileUpload)
    const blobStream = blob.createWriteStream({ resumable: false, })

    blobStream.on('error', (e) => { res.status(500).send({ message: e.message }) })

    blobStream.on('finish', async (data) => {
      const publicUrl = format(`https://storage.googleapis.com/${bucket.name}/${blob.name}`)
      const rs = []
      rs.push({
        originalname: req.file.originalname,
        publicUrl: publicUrl,
        size: req.file.size,
        extension: io.getExtention(req.file.originalname),
        mimetype: req.file.mimetype
      })
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
