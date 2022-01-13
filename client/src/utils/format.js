function sprintf () {
  var args = arguments,
    string = args[0],
    i = 1
  return string.replace(/%((%)|s|d)/g, function (m) {
    // m is the matched format, e.g. %s, %d
    var val = null
    if (m[2]) {
      val = m[2]
    } else {
      val = args[i]
      // A switch statement so that the formatter can be extended. Default is %s
      switch (m) {
        case '%d':
          val = parseFloat(val)
          if (isNaN(val)) {
            val = 0
          }
          break
      }
      i++
    }
    return val
  })
}

String.prototype.format = function () {
  if (arguments.length > 0 && typeof arguments[0] === 'object') {
    let $this = this
    arguments[0].forEach(e => {
      $this = $this.replace(/%s/, e)
    })
    return $this
  }
  return [...arguments].reduce((p, c) => p.replace(/%s/, c), this)
}
String.prototype.formatKey = function () {
  var formatted = this
  for (var prop in arguments[0]) {
    var regexp = new RegExp('\\{' + prop + '\\}', 'gi')
    formatted = formatted.replace(regexp, arguments[0][prop])
  }
  return formatted
}
if (!String.prototype.formatNumber) {
  String.prototype.formatNumber = function () {
    var args = arguments
    return this.replace(/{(\d+)}/g, function (match, number) {
      return typeof args[number] !== 'undefined' ? args[number] : match
    })
  }
}

/**
 * Format bytes as human-readable text.
 *
 * @param bytes Number of bytes.
 * @param si True to use metric (SI) units, aka powers of 1000. False to use
 *           binary (IEC), aka powers of 1024.
 * @param dp Number of decimal places to display.
 *
 * @return Formatted string.
 */
function humanFileSize (bytes, si = false, dp = 1) {
  const thresh = si ? 1000 : 1024

  if (Math.abs(bytes) < thresh) return bytes + ' B'

  const units = si ? ['kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'] : ['KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB']
  let u = -1
  const r = 10 ** dp

  do {
    bytes /= thresh
    ++u
  } while (Math.round(Math.abs(bytes) * r) / r >= thresh && u < units.length - 1)

  return bytes.toFixed(dp) + ' ' + units[u]
}
