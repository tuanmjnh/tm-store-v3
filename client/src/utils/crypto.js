export function NewGuid(otps = null) {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1)
  }
  if (otps && otps.toLowerCase() === 'n') {
    return `${s4()}${s4()}${s4()}${s4()}${s4()}${s4()}${s4()}${s4()}`
  } else {
    return `${s4()}${s4()}-${s4()}-${s4()}-${s4()}-${s4()}${s4()}${s4()}`
  }
}
