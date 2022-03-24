export function upload (formData, uploadFieldName) {
  const photos = formData.getAll(uploadFieldName)
  const promises = photos.map(x =>
    getImage(x).then(img => ({
      id: img,
      originalName: x.name,
      fileName: x.name,
      url: img
    }))
  )
  return Promise.all(promises)
}

export function getFileImage (file, image) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    const img = document.createElement('img')
    reader.onload = () => {
      img.src = reader.result
      if (image) resolve(img)
      else resolve(getBase64Image(img))
    }

    reader.readAsDataURL(file)
  })
}

export function getBase64InputFile (file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onloadend = function () {
      resolve(reader.result)
    }
    reader.readAsDataURL(file)
  })
}

export function getBase64Image (img) {
  const canvas = document.createElement('canvas')
  canvas.width = img.width
  canvas.height = img.height

  const ctx = canvas.getContext('2d')
  ctx.drawImage(img, 0, 0)
  const dataURL = img.src
  return dataURL
}

export function fakeTimeOut (val) {
  return new Promise((resolve) => {
    // simulating a delay of 2 seconds
    setTimeout(() => {
      resolve(val)
    }, 2000)
  })
}