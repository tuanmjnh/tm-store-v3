const fs = require('fs'),
  path = require('path')
// console.log(process.env.PUBLIC_PATH)
// const public_path = `${process.env.ROOT_PATH}\\public`// `${__dirname}\\..\\public\\`
// const public_path = path.join(__dirname, `..\\${process.env.PUBLIC_DIR}`)
// module.exports.public_path = public_path
// const upload_path = `${process.env.PUBLIC_PATH}\\${process.env.UPLOAD_DIR}`
const upload_path = process.env.UPLOAD_DIR
// module.exports.upload_path = upload_path
// console.log(public_path)
module.exports.createDir = async function (opts) {
  try {
    const list_dir = opts.dir.replace(/^\/|\/$/g, '').split('/')
    const result = {
      path: upload_path,
      list: []
    }
    // create public if not exist
    if (!fs.existsSync(result.path)) await fs.mkdirSync(result.path)
    // loop list path to create
    for await (const e of list_dir) {
      result.path = `${result.path}/${e}/`
      if (!fs.existsSync(result.path)) {
        await fs.mkdirSync(result.path)
        result.list.push(e)
      }
    }
    return result
  } catch (e) {
    console.log(e)
    throw e
  }
}

module.exports.rename = async (oldPath, newPath) => {
  try {
    // if (!fs.existsSync(oldPath)) {
    await fs.renameSync(oldPath, newPath)
    return true
    // }
    // return false
  } catch (e) {
    console.log(e)
    throw e
  }
}

module.exports.getExtention = function (path, dot = true) {
  if (!path) return ''
  path = path.toLowerCase()
  const regx = /(?:\.([^.]+))?$/
  path = regx.exec(path)
  return path ? (dot ? path[0] : path[1]) : ''
}

function getFolder ({ dir, root, host }) {
  let result = []
  root = root || process.env.PUBLIC_DIR
  const _dir = path.join(root, dir)
  const dirs = fs.readdirSync(_dir)
  // for (const i in dirs) {
  for (let i = 0; i < dirs.length; i++) {
    const stat = fs.statSync(path.join(_dir, dirs[i]))
    const isDirectory = stat.isDirectory()
    const item = {
      id: stat.ino,
      name: dir[i],
      fullName: isDirectory ? `${dir}/${dirs[i]}` : `${host}/${dir}/${dirs[i]}`,
      size: stat.size,
      ext: path.extname(dir[i]),
      icon: stat.isDirectory() ? 'folder' : 'file'
    }
    result.push(item)
  }
  return result
}
module.exports.getFolder = getFolder

function getAllFolder ({ dir, parent, root, host }) {
  let result = []
  root = root || process.env.PUBLIC_DIR
  const _dir = path.join(root, dir)
  const dirs = fs.readdirSync(_dir)
  // for (const i in dirs) {
  for (let i = 0; i < dirs.length; i++) {
    const stat = fs.statSync(path.join(_dir, dirs[i]))
    const isDirectory = stat.isDirectory()
    const item = {
      id: stat.ino,
      name: dir[i],
      fullName: isDirectory ? `${dir}/${dirs[i]}` : `${host}/${dir}/${dirs[i]}`,
      path: parent ? parent : dir,
      fullPath: dir,
      size: stat.size,
      ext: path.extname(dir[i]),
      icon: isDirectory ? 'folder' : 'file'
    }
    if (isDirectory) {
      const items = getAllFolder({ dir: item.fullName, parent: item.name, host: host })
      if (items && items.length) result = [...result, ...items]
    }
    result.push(item)
  }
  return result
}
module.exports.getAllFolder = getAllFolder

function getDirectories ({ dir, root }) {
  const result = []
  root = root || process.env.PUBLIC_DIR
  const _dir = path.join(root, dir)
  const dirs = fs.readdirSync(_dir)
  // for (const i in dirs) {
  for (let i = 0; i < dirs.length; i++) {
    const stat = fs.statSync(path.join(_dir, dirs[i]))
    const item = {
      id: stat.ino,
      name: dirs[i],
      fullName: `${dir}/${dirs[i]}`,
      fullPath: dir,
      icon: 'folder'
    }
    if (stat.isDirectory()) result.push(item)
  }
  return result
}
module.exports.getDirectories = getDirectories

function getAllDirectories ({ dir, parent, root }) {
  const result = []
  root = root || process.env.PUBLIC_DIR
  // root = root || `./${process.env.PUBLIC_PATH}`
  const _dir = path.join(root, dir)
  const dirs = fs.readdirSync(_dir)
  // for (const i in dirs) {
  for (let i = 0; i < dirs.length; i++) {
    // const _path = `${_dir}\\${dirs[i]}`
    const stat = fs.statSync(path.join(_dir, dirs[i]))
    const item = {
      id: stat.ino,
      name: dirs[i],
      fullName: `${dir}/${dirs[i]}`,
      path: parent ? parent : dir,
      fullPath: dir,
      icon: 'folder',
      isDirectory: stat.isDirectory(),
      children: []
    }
    if (item.isDirectory) {
      item.children = getAllDirectories({ dir: item.fullName, parent: item.name })
      result.push(item)
    }
  }
  return result
}
module.exports.getAllDirectories = getAllDirectories

function getFiles ({ dir, root, host }) {
  const result = []
  root = root || process.env.PUBLIC_DIR
  const _dir = path.join(root, dir)
  const dirs = fs.readdirSync(_dir)
  // for (const i in dirs) {
  for (let i = 0; i < dirs.length; i++) {
    const stat = fs.statSync(path.join(_dir, dirs[i]))
    const item = {
      id: stat.ino,
      name: dirs[i],
      fullName: `${host}/${dir}/${dirs[i]}`,
      size: stat.size,
      ext: path.extname(dirs[i]),
      icon: 'file'
    }
    if (stat.isFile()) result.push(item)
  }
  return result
}
module.exports.getFiles = getFiles

function getAllFiles ({ dir, root, parent, host }) {
  let result = []
  root = root || process.env.PUBLIC_DIR
  const _dir = path.join(root, dir)
  const dirs = fs.readdirSync(_dir)
  // for (const i in dirs) {
  for (let i = 0; i < dirs.length; i++) {
    const stat = fs.statSync(path.join(_dir, dirs[i]))
    const item = {
      id: stat.ino,
      name: dirs[i],
      fullName: `${host}/${dir}/${dirs[i]}`,
      path: parent ? parent : dir,
      fullPath: dir,
      size: stat.size,
      ext: path.extname(dirs[i]),
      icon: 'file'
    }
    if (stat.isDirectory()) {
      const items = getAllFiles({ dir: item.fullName, parent: item.name, host: host })
      if (items && items.length) result = [...result, ...items]
    }
    if (stat.isFile()) result.push(item)
  }
  return result
}
module.exports.getAllFiles = getAllFiles
