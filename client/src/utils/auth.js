import Cookies from 'js-cookie'

const TokenKey = 'Auth-Token'
const userSetting = 'User-Setting'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

export function checkToken(token) {
  return getToken === token
}

export function getUserSetting() {
  if (Cookies.get(userSetting)) return JSON.parse(Cookies.get(userSetting))
  else return {}
}

export function setUserSetting(value) {
  return Cookies.set(userSetting, JSON.stringify(value))
}

export function removeUserSetting() {
  return Cookies.remove(userSetting)
}
