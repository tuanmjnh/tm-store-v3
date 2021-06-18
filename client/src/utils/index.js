/**
 * Created by PanJiaChen on 16/11/18.
 */

/**
 * Parse the time to string
 * @param {(Object|string|number)} time
 * @param {string} cFormat
 * @returns {string}
 */
export function parseTime(time, cFormat) {
  if (arguments.length === 0) {
    return null
  }
  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
  let date
  if (typeof time === 'object') {
    date = time
  } else {
    if ((typeof time === 'string') && (/^[0-9]+$/.test(time))) {
      time = parseInt(time)
    }
    if ((typeof time === 'number') && (time.toString().length === 10)) {
      time = time * 1000
    }
    date = new Date(time)
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  }
  const timestr = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
    let value = formatObj[key]
    // Note: getDay() returns 0 on Sunday
    if (key === 'a') { return ['日', '一', '二', '三', '四', '五', '六'][value] }
    if (result.length > 0 && value < 10) {
      value = '0' + value
    }
    return value || 0
  })
  return timestr
}

/**
 * @param {number} time
 * @param {string} option
 * @returns {string}
 */
export function formatTime(time, option) {
  if (('' + time).length === 10) {
    time = parseInt(time) * 1000
  } else {
    time = +time
  }
  const d = new Date(time)
  const now = Date.now()

  const diff = (now - d) / 1000

  if (diff < 30) {
    return '刚刚'
  } else if (diff < 3600) {
    // less 1 hour
    return Math.ceil(diff / 60) + '分钟前'
  } else if (diff < 3600 * 24) {
    return Math.ceil(diff / 3600) + '小时前'
  } else if (diff < 3600 * 24 * 2) {
    return '1天前'
  }
  if (option) {
    return parseTime(time, option)
  } else {
    return (
      d.getMonth() +
      1 +
      '月' +
      d.getDate() +
      '日' +
      d.getHours() +
      '时' +
      d.getMinutes() +
      '分'
    )
  }
}

/**
 * @param {string} url
 * @returns {Object}
 */
export function getQueryObject(url) {
  url = url == null ? window.location.href : url
  const search = url.substring(url.lastIndexOf('?') + 1)
  const obj = {}
  const reg = /([^?&=]+)=([^?&=]*)/g
  search.replace(reg, (rs, $1, $2) => {
    const name = decodeURIComponent($1)
    let val = decodeURIComponent($2)
    val = String(val)
    obj[name] = val
    return rs
  })
  return obj
}

/**
 * @param {string} input value
 * @returns {number} output value
 */
export function byteLength(str) {
  // returns the byte length of an utf8 string
  let s = str.length
  for (var i = str.length - 1; i >= 0; i--) {
    const code = str.charCodeAt(i)
    if (code > 0x7f && code <= 0x7ff) s++
    else if (code > 0x7ff && code <= 0xffff) s += 2
    if (code >= 0xDC00 && code <= 0xDFFF) i--
  }
  return s
}

/**
 * @param {Array} actual
 * @returns {Array}
 */
export function cleanArray(actual) {
  const newArray = []
  for (let i = 0; i < actual.length; i++) {
    if (actual[i]) {
      newArray.push(actual[i])
    }
  }
  return newArray
}

/**
 * @param {Object} json
 * @returns {Array}
 */
export function param(json) {
  if (!json) return ''
  return cleanArray(
    Object.keys(json).map(key => {
      if (json[key] === undefined) return ''
      return encodeURIComponent(key) + '=' + encodeURIComponent(json[key])
    })
  ).join('&')
}

/**
 * @param {string} url
 * @returns {Object}
 */
export function param2Obj(url) {
  const search = url.split('?')[1]
  if (!search) {
    return {}
  }
  return JSON.parse(
    '{"' +
    decodeURIComponent(search)
      .replace(/"/g, '\\"')
      .replace(/&/g, '","')
      .replace(/=/g, '":"')
      .replace(/\+/g, ' ') +
    '"}'
  )
}

/**
 * @param {string} val
 * @returns {string}
 */
export function html2Text(val) {
  const div = document.createElement('div')
  div.innerHTML = val
  return div.textContent || div.innerText
}

/**
 * Merges two objects, giving the last one precedence
 * @param {Object} target
 * @param {(Object|Array)} source
 * @returns {Object}
 */
export function objectMerge(target, source) {
  if (typeof target !== 'object') {
    target = {}
  }
  if (Array.isArray(source)) {
    return source.slice()
  }
  Object.keys(source).forEach(property => {
    const sourceProperty = source[property]
    if (typeof sourceProperty === 'object') {
      target[property] = objectMerge(target[property], sourceProperty)
    } else {
      target[property] = sourceProperty
    }
  })
  return target
}

/**
 * @param {HTMLElement} element
 * @param {string} className
 */
export function toggleClass(element, className) {
  if (!element || !className) {
    return
  }
  let classString = element.className
  const nameIndex = classString.indexOf(className)
  if (nameIndex === -1) {
    classString += '' + className
  } else {
    classString =
      classString.substr(0, nameIndex) +
      classString.substr(nameIndex + className.length)
  }
  element.className = classString
}

/**
 * @param {string} type
 * @returns {Date}
 */
export function getTime(type) {
  if (type === 'start') {
    return new Date().getTime() - 3600 * 1000 * 24 * 90
  } else {
    return new Date(new Date().toDateString())
  }
}

/**
 * @param {Function} func
 * @param {number} wait
 * @param {boolean} immediate
 * @return {*}
 */
export function debounce(func, wait, immediate) {
  let timeout, args, context, timestamp, result

  const later = function() {
    // 据上一次触发时间间隔
    const last = +new Date() - timestamp

    // 上次被包装函数被调用时间间隔 last 小于设定时间间隔 wait
    if (last < wait && last > 0) {
      timeout = setTimeout(later, wait - last)
    } else {
      timeout = null
      // 如果设定为immediate===true，因为开始边界已经调用过了此处无需调用
      if (!immediate) {
        result = func.apply(context, args)
        if (!timeout) context = args = null
      }
    }
  }

  return function(...args) {
    context = this
    timestamp = +new Date()
    const callNow = immediate && !timeout
    // 如果延时不存在，重新设定延时
    if (!timeout) timeout = setTimeout(later, wait)
    if (callNow) {
      result = func.apply(context, args)
      context = args = null
    }

    return result
  }
}

/**
 * This is just a simple version of deep copy
 * Has a lot of edge cases bug
 * If you want to use a perfect deep copy, use lodash's _.cloneDeep
 * @param {Object} source
 * @returns {Object}
 */
export function deepClone(source) {
  if (!source && typeof source !== 'object') {
    throw new Error('error arguments', 'deepClone')
  }
  const targetObj = source.constructor === Array ? [] : {}
  Object.keys(source).forEach(keys => {
    if (source[keys] && typeof source[keys] === 'object') {
      targetObj[keys] = deepClone(source[keys])
    } else {
      targetObj[keys] = source[keys]
    }
  })
  return targetObj
}

/**
 * @param {Array} arr
 * @returns {Array}
 */
export function uniqueArr(arr) {
  return Array.from(new Set(arr))
}

/**
 * @returns {string}
 */
export function createUniqueString() {
  const timestamp = +new Date() + ''
  const randomNum = parseInt((1 + Math.random()) * 65536) + ''
  return (+(randomNum + timestamp)).toString(32)
}

/**
 * Check if an element has a class
 * @param {HTMLElement} elm
 * @param {string} cls
 * @returns {boolean}
 */
export function hasClass(ele, cls) {
  return !!ele.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'))
}

/**
 * Add class to element
 * @param {HTMLElement} elm
 * @param {string} cls
 */
export function addClass(ele, cls) {
  if (!hasClass(ele, cls)) ele.className += ' ' + cls
}

/**
 * Remove class from element
 * @param {HTMLElement} elm
 * @param {string} cls
 */
export function removeClass(ele, cls) {
  if (hasClass(ele, cls)) {
    const reg = new RegExp('(\\s|^)' + cls + '(\\s|$)')
    ele.className = ele.className.replace(reg, ' ')
  }
}

export function last(data) {
  if (data.length > 0) return data[data.length - 1]
  return data
}

export function indexOfArray(data, element) {
  for (let i = 0; i < element.length; i++) {
    const index = data.indexOf(element[i])
    if (index > -1) return index
  }
  return -1
}

export function update(data, element, key) {
  if (key) {
    if (Array.isArray(element)) {
      data.forEach(source => {
        var destination = element.find(x => x[key] === source[key])
        if (destination) {
          Object.keys(source).forEach(function(keyobj, index) {
            // if (typeof source[keyobj] !== 'object')
            if (destination[keyobj] !== undefined) {
              source[keyobj] = destination[keyobj]
            }
          })
        }
      })
    } else {
      data.forEach(source => {
        if (source[key] === element[key]) {
          Object.keys(source).forEach(function(keyobj, index) {
            // if (typeof source[keyobj] !== 'object')
            if (element[keyobj] !== undefined) {
              source[keyobj] = element[keyobj]
            }
          })
        }
      })
    }
  } else {
    if (Array.isArray(element)) {
      element.forEach(e => {
        const index = data.indexOf(e)
        if (index > -1) data.splice(index, 1, element)
      })
    } else {
      const index = data.indexOf(element)
      if (index > -1) data.splice(index, 1, element)
    }
  }
  return data
}

export function updateKey(data, element) {
  if (Array.isArray(element)) {
    element.forEach(e => {
      const index = data.indexOf(e)
      if (index > -1) data.splice(index, 1, element)
    })
  } else {
    data.array.forEach(e => {
      Object.keys(e).forEach(function(key, index) {
        if (typeof e[key] === 'object') {
          e[key] = element[key]
        }
      })
    })
  }
  return data
}

export function remove(data, element, key) {
  if (key) {
    if (Array.isArray(element)) {
      element.forEach(e => {
        const index = data.findIndex((x) => { return x[key] === e[key] })
        if (index > -1) data.splice(index, 1)
      })
    } else {
      const index = data.findIndex((x) => { return x[key] === element[key] })
      if (index > -1) data.splice(index, 1)
    }
  } else {
    if (Array.isArray(element)) {
      element.forEach(e => {
        const index = data.indexOf(e)
        if (index > -1) data.splice(index, 1)
      })
    } else {
      const index = data.indexOf(element)
      if (index > -1) data.splice(index, 1)
    }
  }
  return data
}

export function NewGuid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1)
  }
  return (
    s4() +
    s4() +
    '-' +
    s4() +
    '-' +
    s4() +
    '-' +
    s4() +
    '-' +
    s4() +
    s4() +
    s4()
  )
}

export function trim(obj) {
  if (Array.isArray(obj)) {
    for (let index = 0; index < obj.length; index++) {
      if (typeof obj[index] === 'string') obj[index] = obj[index].trim()
    }
  } else if (Object.keys(obj).length > 0) {
    Object.keys(obj).forEach(e => {
      if (typeof obj[e] === 'string') obj[e] = obj[e].trim()
    })
  } else {
    if (typeof obj === 'string') obj = obj.trim()
  }
  return obj
}

export function pushIfNotExist(data, element, key) {
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

export function RandomDate(start, end) {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()))
}

// onlyUnique Array
export function onlyUnique(value, index, self) {
  // console.log(value)
  return self.indexOf(value) === index
}
export function distinctArry(arr) {
  return [...new Set(arr)]
}
export function distinctArrayObject(arr, key) {
  return [...new Set(arr.map(x => x[key]))]
}
export function filterValue(data, obj) {
  if (data.length < 1 || !obj) return data
  return Object.keys(obj).forEach((key, index) => {
    const _key = key.toLowerCase()
    return data.filter(row => { return row[_key] === obj[_key] })
  })
}
export function searchValue(data, search, key) {
  if (!data || data.length < 1 || !search) return data
  if (key && key.length > 0) {
    return data.filter(row => {
      return key.some(e => {
        return (String(row[e]).toLowerCase().indexOf(search) > -1)
      })
    })
  } else {
    return data.filter(row => {
      return Object.keys(row).some(key => {
        return (String(row[key]).toLowerCase().indexOf(search) > -1)
      })
    })
  }
}
export function sortByKey(data, sortBy, direction = 'asc') {
  if (data.length < 1 || !sortBy) return data
  direction = direction === 'asc' ? 1 : -1
  return data.slice().sort((a, b) => {
    a = a[sortBy]
    b = b[sortBy]
    return (a === b ? 0 : a > b ? 1 : -1) * direction
  })
}

export function getUrlParams(url) {
  var vars = {}
  var hashes = url.split('?')[1]
  var hash = hashes.split('&')

  for (var i = 0; i < hash.length; i++) {
    const params = hash[i].split('=')
    vars[params[0]] = params[1]
  }
  return vars
}

export function delay(timeout, callback) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(true)
    }, timeout)
  })
}
