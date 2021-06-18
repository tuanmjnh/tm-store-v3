export function getExtension (file, dot = true) {
  if (!file) return null
  let regx = /(?:\.([^.]+))?$/
  file = regx.exec(file)
  return file ? (dot ? file[0] : file[1]) : ''
}
export function isImage (value) {
  if (!value) return false
  return /\.(gif|jpg|jpeg|tiff|png|img|ico|jfif)$/i.test(value.toLowerCase())
}
export function isAudio (value) {
  if (!value) return false
  return /\.(mp3|wav|wave|ogg|m4a|3ga|4mp|aa3)$/i.test(value.toLowerCase())
}
export function isVideo (value) {
  if (!value) return false
  return /\.(3g2|3gp|3gp2|3gpp|3gpp2|amv|flv|gom|mp4|mov|mpe|mpeg|mpg||kmv|mkv|wvm|wmv)$/i.test(value.toLowerCase())
}
export function isPdf (value) {
  if (!value) return false
  return /\.(pdf)$/i.test(value.toLowerCase())
}
export function isDoc (value) {
  if (!value) return false
  return /\.(doc|docx)$/i.test(value.toLowerCase())
}
export function isSheet (value) {
  if (!value) return false
  return /\.(xls|xlsx)$/i.test(value.toLowerCase())
}
export function isFlash (value) {
  if (!value) return false
  const rs = /\.(swf)$/i.test(value.toLowerCase())
  return rs
}
export function isCode (value) {
  if (!value) return false
  const rs = /\.(sql|json|js)$/i.test(value.toLowerCase())
  return rs
}
export function isText (value) {
  if (!value) return false
  const rs = /\.(txt|rtf)$/i.test(value.toLowerCase())
  return rs
}
export function getNameFilePath (fileName) {
  if (!fileName) return null
  const tmp = fileName.split('/')
  return tmp[tmp.length - 1]
}
export function getBackgroundImage (img) {
  if (!img) return null
  return `background-size:cover;background-position:50% 50%;background-image:url("${img}")`
}
export function GetImage (file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    const img = document.createElement('img')
    reader.onload = () => {
      img.src = reader.result
      resolve(GetBase64Image(img))
    }
    reader.readAsDataURL(file)
  })
}
export function GetBase64Image (img) {
  const canvas = document.createElement('canvas')
  canvas.width = img.width
  canvas.height = img.height

  const ctx = canvas.getContext('2d')
  ctx.drawImage(img, 0, 0)
  const dataURL = img.src
  return dataURL
}
