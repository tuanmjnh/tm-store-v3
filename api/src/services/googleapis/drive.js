const path = require('path')
// const io = require('../../utils/io')
const { google } = require('googleapis')

const KEY_FILE_PATH = path.join(__dirname, './key.json')
// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/drive']//['https://www.googleapis.com/auth/drive.metadata.readonly']
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
// const TOKEN_PATH = 'token.json'
const FOLDER_ROOT = ['1-50W83sJCVlEnsFrNXsRedVntewD4DS4']
const MIME_TYPE = {
  audio: 'application/vnd.google-apps.audio',
  docs: 'application/vnd.google-apps.document',
  '3rd_party_shortcut': 'application/vnd.google-apps.drive-sdk',
  drawing: 'application/vnd.google-apps.drawing',
  file: 'application/vnd.google-apps.file',
  folder: 'application/vnd.google-apps.folder',
  forms: 'application/vnd.google-apps.form',
  table: 'application/vnd.google-apps.fusiontable',
  Jamboard: 'application/vnd.google-apps.jam',
  map: 'application/vnd.google-apps.map',
  photo: 'application/vnd.google-apps.photo',
  slide: 'application/vnd.google-apps.presentation',
  script: 'application/vnd.google-apps.script',
  shortcut: 'application/vnd.google-apps.shortcut',
  site: 'application/vnd.google-apps.site',
  sheets: 'application/vnd.google-apps.spreadsheet',
  unknown: 'application/vnd.google-apps.unknown',
  video: 'application/vnd.google-apps.video',
  image: 'image'
}
var pageToken = null
const getViewUrl = (fileId) => {
  return `https://drive.google.com/uc?export=view&id=${fileId}`
}

// Create a service account initialize with the service account key file and scope needed
const auth = new google.auth.GoogleAuth({
  keyFile: KEY_FILE_PATH,
  scopes: SCOPES
})
const getPath = (filePath) => {
  return path.join(__dirname, filePath)
}
const createFolder = async ({ name, rootFolderId, exist }) => {
  try {
    const driveService = google.drive({ version: 'v3', auth })
    if (exist) {
      const _exist = await getFolder({ name: name, rootFolderId: rootFolderId || FOLDER_ROOT })
      if (_exist) return _exist
    }
    const fileMetadata = {
      'name': name,
      'parents': [rootFolderId] || FOLDER_ROOT,
      'mimeType': MIME_TYPE.folder
    }
    const response = await driveService.files.create({
      resource: fileMetadata,
      fields: 'id,name',
    })
    if (response.data) return response.data
    else return null
  } catch (e) {
    console.log(e)
    return null
  }
}

const createFile = async ({ name, rootFolderID, mimeType, stream }) => {
  try {
    const driveService = google.drive({ version: 'v3', auth })
    const fileMetadata = {
      'name': name, //'icon.png',
      'parents': [rootFolderID] || FOLDER_ROOT
    }
    const media = {
      mimeType: mimeType, //'image/jpeg',
      body: stream //fs.createReadStream(getPath('../../public/uploads/5f5ca31ddfdb29bd43217e95e4dda1f8.JPG'))
    }
    const response = await driveService.files.create({
      resource: fileMetadata,
      media: media,
      fields: 'id,name,mimeType,size,thumbnailLink'
    })
    // console.log(response.data)
    if (response.data) return {
      id: response.data.id,
      name: response.data.name,
      url: getViewUrl(response.data.id),
      type: response.data.mimeType,
      size: response.data.size,
    }
    else return null
  } catch (e) {
    console.log(e)
    return null
  }
}

const getFolder = async ({ name, rootFolderId, pageSize }) => {
  try {
    // console.log(rootFolderId)
    const driveService = google.drive({ version: 'v3', auth })
    const opts = {
      pageSize: pageSize || 50,
      fields: 'files(id,name)',
      q: `'${rootFolderId || FOLDER_ROOT}' in parents and name='${name}' and mimeType='${MIME_TYPE.folder}'`,
      spaces: 'drive'
    }
    // console.log(opts)
    const response = await driveService.files.list(opts)
    if (response.data.files && response.data.files.length) return response.data.files[0]
    else return null
  } catch (e) {
    // console.log(e)
    return null
  }
}
const getFolderById = async ({ rootFolderId, pageSize }) => {
  try {
    const driveService = google.drive({ version: 'v3', auth })
    const opts = {
      pageSize: pageSize || 50,
      fields: 'files(id,name)',
      q: `'${rootFolderId || FOLDER_ROOT}' in parents and mimeType='${MIME_TYPE.folder}'`,
      spaces: 'drive'
    }
    const response = await driveService.files.list(opts)
    // console.log(rootFolderId)
    if (response.data.files && response.data.files.length) return response.data.files[0]
    else return null
  } catch (e) {
    // console.log(e)
    return null
  }
}

const getFolders = async ({ rootFolder, rootFolderId, folderId, pageSize }) => {
  try {
    const driveService = google.drive({ version: 'v3', auth })
    const rs = []
    const opts = {
      pageSize: pageSize || 50,
      fields: 'files(id,name)',
      q: `mimeType='${MIME_TYPE.folder}'`,
      spaces: 'drive'
    }
    if (folderId) opts.q = `${opts.q} and '${folderId}' in parents`
    else {
      if (rootFolderId) {
        opts.q = `${opts.q} and '${rootFolderId}' in parents`
        rs.push({
          id: rootFolderId,
          name: 'Root',
          children: []
        })
      } else {
        const folderID = await getFolder({ name: rootFolder, pageSize: pageSize })
        if (folderID) {
          opts.q = `${opts.q} and '${folderID.id}' in parents`
          rs.push({
            id: folderID.id,
            name: 'Root',
            children: []
          })
        } else {
          opts.q = `${opts.q} and '${FOLDER_ROOT[0]}' in parents`
          rs.push({
            id: FOLDER_ROOT[0],
            name: 'Root',
            children: []
          })
        }
      }
    }
    // console.log(opts)
    const response = await driveService.files.list(opts)
    if (response.data.files && response.data.files.length) {
      for await (const e of response.data.files) {
        if (rs.length && rs[0].children) rs[0].children.push({
          id: e.id,
          name: e.name
        })
        else rs.push({
          id: e.id,
          name: e.name
        })
      }
    }
    return rs
  } catch (e) {
    // console.log(e)
    return null
  }
}

const getFiles = async ({ rootFolder, folderId, mimeType, pageSize, nextPageToken }) => {
  try {
    const driveService = google.drive({ version: 'v3', auth })
    const opts = {
      pageSize: pageSize || 10,
      fields: 'nextPageToken, files(id,name,mimeType,size,thumbnailLink)',
      q: `'${FOLDER_ROOT}' in parents`,
      pageToken: nextPageToken,
      spaces: 'drive'
    }
    const rs = { files: [], nextPageToken: null }
    if (folderId) opts.q = `'${folderId}' in parents`
    else if (rootFolder) {
      const folderID = await getFolder({ name: rootFolder })
      if (folderID) opts.q = `'${folderID.id}' in parents`
    }
    if (mimeType) opts.q = `${opts.q} and mimeType contains '${mimeType}'`
    const response = await driveService.files.list(opts)
    if (response.data.files && response.data.files.length) {
      rs.nextPageToken = response.data.nextPageToken
      for await (const e of response.data.files) {
        rs.files.push({
          id: e.id,
          name: e.name,
          url: getViewUrl(e.id),
          type: e.mimeType === MIME_TYPE.folder ? 'folder' : e.mimeType,
          size: e.size,
        })
      }
    }
    // console.log(rs)
    return rs
  } catch (e) {
    console.log(e)
    return null
  }
}

const getAll = async ({ folder, mimeType, folderId, pageSize }) => {
  try {
    const driveService = google.drive({ version: 'v3', auth })
    const opts = {
      pageSize: pageSize || 10,
      fields: 'nextPageToken, files(id,name,mimeType,size,thumbnailLink)',
      q: `'${FOLDER_ROOT}' in parents`,
      pageToken: pageToken,
      spaces: 'drive'
    }
    const rs = { folders: [], files: [] }
    if (folderId) opts.q = `'${folderId}' in parents`
    else {
      if (folder) {
        const fid = await getFolder({ name: folder })
        if (fid) {
          opts.q = `'${fid.id}' in parents`
          rs.folders.push({
            id: fid.id,
            name: 'Root',
            children: []
          })
        } else {
          rs.folders.push({
            id: FOLDER_ROOT[0],
            name: 'Root',
            children: []
          })
        }
      } else {
        rs.folders.push({
          id: FOLDER_ROOT[0],
          name: 'Root',
          children: []
        })
      }
    }
    // if (mimeType) opts.q = `${opts.q} and mimeType contains '${mimeType}'`
    // console.log(opts.q)
    const resFolders = await getFolders({ rootFolderID: folderId })
    console.log(resFolders)
    // const response = await driveService.files.list(opts)
    // if (response.data.files && response.data.files.length) {
    //   for await (const e of response.data.files) {
    //     console.log(e.name)
    //     if (e.mimeType === MIME_TYPE.folder) {
    //       if (rs.folders.length && rs.folders[0].children) rs.folders[0].children.push({
    //         id: e.id,
    //         name: e.name
    //       })
    //       else rs.folders.push({
    //         id: e.id,
    //         name: e.name
    //       })
    //     } else {
    //       if (mimeType) {
    //         const reg = new RegExp(mimeType)
    //         if (reg.test(e.mimeType)) rs.files.push({
    //           id: e.id,
    //           name: e.name,
    //           url: getViewUrl(e.id),
    //           type: e.mimeType,
    //           size: e.size,
    //         })
    //       } else {
    //         rs.files.push({
    //           id: e.id,
    //           name: e.name,
    //           url: getViewUrl(e.id),
    //           type: e.mimeType,
    //           size: e.size,
    //         })
    //       }
    //     }
    //   }
    // }
    // console.log(rs)
    return rs
  } catch (e) {
    // console.log(e)
    return null
  }
}

module.exports = { createFolder, getFolder, getFolderById, getFolders, createFile, getFiles, getAll, MIME_TYPE }
// getFiles()