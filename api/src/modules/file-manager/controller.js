const GDrive = require('../../services/googleapis/drive'),
  processFile = require('./process-file'),
  // { Readable } = require('stream'),
  fs = require('fs'),
  name = 'file-manager'
module.exports.name = name

module.exports.get = async function (req, res, next) {
  try {
    // const files = await GDrive.getFiles()
    const rs = { req: [], files: [], nextPageToken: null }
    const params = {}
    if (req.query.page) params.page = req.query.page || 1
    if (req.query.pageSize) params.pageSize = req.query.pageSize || 10
    if (req.query.nextPageToken) params.nextPageToken = req.query.nextPageToken || null
    const uploadPath = req.headers['upload-path'] && req.headers['upload-path'] !== 'null' ? req.headers['upload-path'].split('/') : null
    const mimeType = req.headers['mime-type'] && req.headers['mime-type'] !== 'null' ? req.headers['mime-type'] : null
    let folderId = req.headers['folder-id'] && req.headers['folder-id'] !== 'null' ? req.headers['folder-id'] : null

    const folders = []
    if (uploadPath && uploadPath.length) {
      for await (const e of uploadPath) {
        const folder = await GDrive.getFolder({ name: e, rootFolderId: (folders.length ? folders[folders.length - 1].id : null) })
        if (folder) folders.push(folder)
      }
    }
    rs.folders = await GDrive.getFolders({ rootFolderId: folders[folders.length - 1].id, folderId: folderId })
    // rs.folders = await GDrive.getFolders({ rootFolder: uploadPath, folderId: folderId })
    if (!folderId && rs.folders && rs.folders.length) folderId = rs.folders[0].id
    const getFiles = await GDrive.getFiles({ folderId: folderId, mimeType: mimeType, pageSize: params.pageSize, nextPageToken: params.nextPageToken })
    if (getFiles) {
      rs.files = getFiles.files
      rs.nextPageToken = getFiles.nextPageToken
    }
    // console.log(rs)
    if (rs) return res.status(200).json(rs)
    else return res.status(200).json([])
  } catch (e) {
    // console.log(e)
    return res.status(500).send('invalid')
  }
}

module.exports.getFolders = async function (req, res, next) {
  try {
    // const files = await GDrive.getFiles()
    // console.log(files)
    const folderPath = req.headers['upload-path'] ? req.headers['upload-path'] : null
    const mimeType = req.headers['mime-type'] && req.headers['mime-type'] !== 'null' ? req.headers['mime-type'] : null
    const rs = await GDrive.getAll({ folder: folderPath, mimeType: mimeType })
    if (rs) return res.status(200).json(rs)
    else {
      // GDrive.createFolder({ name: folderPath })
      return res.status(200).json([])
    }
  } catch (e) {
    // console.log(e)
    return res.status(500).send('invalid')
  }
}

module.exports.getFiles = async function (req, res, next) {
  try {
    const rs = { files: [], nextPageToken: null }
    const params = {}
    if (req.query.page) params.page = req.query.page || 1
    if (req.query.pageSize) params.pageSize = req.query.pageSize || 10
    if (req.query.nextPageToken) params.nextPageToken = req.query.nextPageToken || null
    const folderId = req.headers['folder-id'] && req.headers['folder-id'] !== 'null' ? req.headers['folder-id'] : null
    const mimeType = req.headers['mime-type'] && req.headers['mime-type'] !== 'null' ? req.headers['mime-type'] : null
    const getFiles = await GDrive.getFiles({ folderId: folderId, mimeType: mimeType, pageSize: params.pageSize, nextPageToken: params.nextPageToken })
    if (getFiles) {
      rs.files = getFiles.files
      rs.nextPageToken = getFiles.nextPageToken
    }
    if (rs) return res.status(200).json(rs)
    else return res.status(200).json([])
  } catch (e) {
    // console.log(e)
    return res.status(500).send('invalid')
  }
}

module.exports.post = async function (req, res, next) {
  try {
    const uploadPath = req.headers['upload-path'] ? req.headers['upload-path'].split('/') : null
    const folders = []
    if (uploadPath && uploadPath.length) {
      for await (const e of uploadPath) {
        const folder = await GDrive.createFolder({ name: e, rootFolderId: folders.length ? folders[folders.length - 1].id : null, exist: true })
        if (folder) folders.push(folder)
      }
    }
    // console.log(folders)
    await processFile.diskStorage(req, res)
    // console.log(folders.map(x => x.id))
    // console.log(req.file)
    GDrive.createFile({
      name: req.file.filename,
      mimeType: req.file.mimetype,
      stream: fs.createReadStream(req.file.path),
      rootFolderID: folders[folders.length - 1].id//folders.map(x => x.id) //folders[folders.length - 1].id
    }).then(x => {
      fs.unlinkSync(req.file.path)
      if (x) return res.status(201).json(x)
      else return res.status(201).send(null)
    })
  } catch (e) {
    // console.log(e)
    return res.status(500).send('invalid')
  }
}

module.exports.put = async function (req, res, next) {
  try {
    const rs = []
    if (rs) return res.status(202).json(rs)
    else return res.status(500).send('invalid')
  } catch (e) {
    return res.status(500).send('invalid')
  }
}

module.exports.patch = async function (req, res, next) {
  try {
    const rs = []
    if (rs) return res.status(203).json(rs)
    else return res.status(500).send('invalid')
  } catch (e) {
    return res.status(500).send('invalid')
  }
}

module.exports.delete = async function (req, res, next) {
  try {
    const rs = []
    if (rs) return res.status(204).json(rs)
    else return res.status(500).send('invalid')
  } catch (e) {
    return res.status(500).send('invalid')
  }
}
