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
const createFolder = async ({ name, rootFolderID, exist }) => {
  try {
    const driveService = google.drive({ version: 'v3', auth })
    if (exist) {
      const _exist = await getFolder({ name: name, rootFolderID: rootFolderID || FOLDER_ROOT })
      if (_exist) return _exist
    }
    const fileMetadata = {
      'name': name,
      'parents': rootFolderID || FOLDER_ROOT,
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
      'parents': rootFolderID || FOLDER_ROOT
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

const getFolder = async ({ name, rootFolderID }) => {
  try {
    const driveService = google.drive({ version: 'v3', auth })
    const opts = {
      pageSize: 10,
      fields: 'files(id,name)',
      q: `'${rootFolderID || FOLDER_ROOT}' in parents and name='${name}' and mimeType='${MIME_TYPE.folder}'`,
      spaces: 'drive'
    }
    const response = await driveService.files.list(opts)
    if (response.data.files && response.data.files.length) return response.data.files[0]
    else {
      // const folder = await createFolder({ name: name })
      // if (folder) return folder
      return null
    }
  } catch (e) {
    // console.log(e)
    return null
  }
}


const getFolders = async ({ name, rootFolderID }) => {
  try {
    const driveService = google.drive({ version: 'v3', auth })
    const names = name.split('/')
    const rs = [{ id: rootFolderID || FOLDER_ROOT, name: 'root' }]
    // for await (const e of names) {
    //   const opts = {
    //     pageSize: 10,
    //     fields: 'files(id,name,mimeType)',
    //     q: `'${rs[rs.length - 1].id}' in parents and name='${e}' and mimeType='${MIME_TYPE.folder}'`,
    //     spaces: 'drive'
    //   }
    //   const response = await driveService.files.list(opts)
    //   if (response.data.files && response.data.files.length) rs.push(response.data.files[0])
    //   else {
    //     const folder = await createFolder({ name: e, rootFolderID: rs[rs.length - 1].id })
    //     if (folder) rs.push(folder)
    //   }
    // }
    const a = await createFolder({ name: '5eccbc9e9071001d87fd4df1', rootFolderID: '1gRKS1SbOEBHvga7CcThAm5EcGKCPedTI' })
    console.log(a)
    return rs
  } catch (e) {
    // console.log(e)
    return null
  }
}

const getFiles = async ({ folder, mimeType }) => {
  try {
    const driveService = google.drive({ version: 'v3', auth })
    const opts = {
      pageSize: 10,
      fields: 'nextPageToken, files(id,name,mimeType,size,thumbnailLink)',
      q: `'${FOLDER_ROOT}' in parents`,
      pageToken: pageToken,
      spaces: 'drive'
    }
    const rs = []
    if (folder) {
      const folderID = await getFolder({ name: folder })
      if (folderID) opts.q = `'${folderID.id}' in parents`
    }
    if (mimeType) opts.q = `${opts.q} and mimeType contains '${mimeType}'`
    // console.log(opts.q)
    const response = await driveService.files.list(opts)
    if (response.data.files && response.data.files.length) {
      for await (const e of response.data.files) {
        rs.push({
          id: e.id,
          name: e.name,
          url: getViewUrl(e.id),
          type: e.mimeType === MIME_TYPE.folder ? 'folder' : e.mimeType,
          size: e.size,
        })
      }
    }
    // console.log(rs)
    if (rs.length) return rs
    else return null
  } catch (e) {
    // console.log(e)
    return null
  }
}

const getAll = async ({ folder, mimeType, folderId }) => {
  try {
    const driveService = google.drive({ version: 'v3', auth })
    const opts = {
      pageSize: 10,
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
    const response = await driveService.files.list(opts)
    if (response.data.files && response.data.files.length) {
      for await (const e of response.data.files) {
        if (e.mimeType === MIME_TYPE.folder) {
          if (rs.folders.length && rs.folders[0].children) rs.folders[0].children.push({
            id: e.id,
            name: e.name
          })
          else rs.folders.push({
            id: e.id,
            name: e.name
          })
        } else {
          if (mimeType) {
            const reg = new RegExp(mimeType)
            if (reg.test(e.mimeType)) rs.files.push({
              id: e.id,
              name: e.name,
              url: getViewUrl(e.id),
              type: e.mimeType,
              size: e.size,
            })
          } else {
            rs.files.push({
              id: e.id,
              name: e.name,
              url: getViewUrl(e.id),
              type: e.mimeType,
              size: e.size,
            })
          }
        }
      }
    }
    // console.log(rs)
    return rs
  } catch (e) {
    // console.log(e)
    return null
  }
}

module.exports = { createFolder, getFolder, getFolders, createFile, getFiles, getAll, MIME_TYPE }
// getFiles()