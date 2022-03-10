export function RandomColor (lowercase = false) {
  var letters = '0123456789ABCDEF'.split('')
  var color = '#'
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)]
  }
  return lowercase ? color.toLowerCase() : color
}

export function DynamicColors (a = '0.2') {
  var r = Math.floor(Math.random() * 255)
  var g = Math.floor(Math.random() * 255)
  var b = Math.floor(Math.random() * 255)
  return `rgba(${r},${g},${b},${a})`
}
