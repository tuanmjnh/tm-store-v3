const moment = require('moment')

module.exports.getBody = function (obj, req) { // req: Request
  const rs = {}
  Object.keys(obj).forEach(e => {
    if (req.body && req.body[e] !== undefined) rs[e] = req.body[e]
  })
  return rs
}

module.exports.toTimestamp = function (strDate) {
  const datum = Date.parse(strDate)
  return datum / 1000
}

function ToUpperCase (obj) {
  const rs = {}
  Object.keys(obj).forEach(e => {
    rs[e.toUpperCase()] = obj[e]
  })
  return rs
}
module.exports.ToUpperCase = ToUpperCase

function ToLowerCase (obj) {
  const rs = {}
  Object.keys(obj).forEach(e => {
    rs[e.toLowerCase()] = obj[e]
  })
  return rs
}
module.exports.ToLowerCase = ToLowerCase

module.exports.RandomDate = function (start, end) {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()))
}

module.exports.ToDate = function (timestamp, format = null) {
  timestamp = parseInt(timestamp)
  if (format) {
    return moment(timestamp).format(format)
  } else {
    return moment(timestamp).toDate()
  }
}

module.exports.pushIfNotExist = function (data, element, key) {
  if (Array.isArray(element)) {
    element.forEach(e => {
      if (key) {
        if (data.findIndex(x => x[key] === e[key]) < 0) data.push(e)
      } else {
        if (data.indexOf(e) < 0) data.push(e)
      }
    })
  } else {
    if (key) {
      if (data.findIndex(x => x[key] === element[key]) < 0) data.push(element)
    } else {
      if (data.indexOf(element) < 0) data.push(element)
    }
  }
  return data
}
