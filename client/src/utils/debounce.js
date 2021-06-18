
function debounce1(func, wait) {
  var timeout, value
  return function() {
    if (!timeout) value = func.apply(this, arguments)
    clearTimeout(timeout)
    timeout = setTimeout(() => { timeout = value = null }, wait)
    return value
  }
}

function debounce2(func, wait) {
  var timeout
  const never = new Promise(resolve => { /* do nothing */ })
  return function() {
    const result = timeout ? never : func.apply(this, arguments)
    clearTimeout(timeout)
    timeout = setTimeout(() => { timeout = null }, wait)
    return result
  }
}

function debounce3(func, wait) {
  var timeout
  return function() {
    return new Promise(resolve => {
      if (!timeout) resolve(func.apply(this, arguments))
      clearTimeout(timeout)
      timeout = setTimeout(() => { timeout = null }, wait)
    })
  }
}

function debounce4(func, wait) {
  var timeout
  return function() {
    const result = timeout
      ? Promise.reject(new Error('called during debounce period'))
      : Promise.resolve(func.apply(this, arguments))
    clearTimeout(timeout)
    timeout = setTimeout(() => { timeout = null }, wait)
    return result
  }
}

export default debounce4
