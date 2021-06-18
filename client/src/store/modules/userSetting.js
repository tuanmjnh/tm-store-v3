import Cookies from 'js-cookie'
// import { Get, Set, GetAll } from '@/i18n'
// import { i18n } from '@/boot/i18n'
// import { setLocale } from 'i18n'
import { api } from '@/boot/axios'
const collection = '/user-setting'
const COOKIE_NAME = 'user-setting'
const COOKIE_DATA = Cookies.get(COOKIE_NAME) ? JSON.parse(Cookies.get(COOKIE_NAME)) : {}
// console.log(COOKIE_DATA)
const state = {
  language: COOKIE_DATA.language || 'vi-VN',
  darkMode: COOKIE_DATA.darkMode || false,
  font: {
    size: COOKIE_DATA.font && COOKIE_DATA.font.size ? COOKIE_DATA.font.size : 'md',
    family: COOKIE_DATA.font && COOKIE_DATA.font.family ? COOKIE_DATA.font.family : '"Roboto", "-apple-system", "Helvetica Neue", Helvetica, Arial, sans-serif',
    color: COOKIE_DATA.font && COOKIE_DATA.font.color ? COOKIE_DATA.font.color : '#6b6b6b'
  },
  format: {
    date: COOKIE_DATA.format && COOKIE_DATA.format.date ? COOKIE_DATA.format.date : 'DD/MM/YYYY',
    time: COOKIE_DATA.format && COOKIE_DATA.format.time ? COOKIE_DATA.format.time : 'hh:mm:ss a'
  },
  dense: {
    form: COOKIE_DATA.dense && COOKIE_DATA.dense.form !== undefined ? COOKIE_DATA.dense.form : true,
    button: COOKIE_DATA.dense && COOKIE_DATA.dense.button !== undefined ? COOKIE_DATA.dense.button : true,
    input: COOKIE_DATA.dense && COOKIE_DATA.dense.input !== undefined ? COOKIE_DATA.dense.input : true,
    table: COOKIE_DATA.dense && COOKIE_DATA.dense.table !== undefined ? COOKIE_DATA.dense.table : true,
    menu: COOKIE_DATA.dense && COOKIE_DATA.dense.menu !== undefined ? COOKIE_DATA.dense.menu : false
  },
  shadow: {
    table: COOKIE_DATA.shadow && COOKIE_DATA.shadow.table !== undefined ? COOKIE_DATA.shadow.table : false
  }
}

const mutations = {
  INIT: (state, data) => {
    if (data) state = state = { ...state, ...data }
    // i18n.global.setLocaleMessage(state.language,)
    document.body.style.fontSize = `${state.font.size}px`
    document.body.style.fontFamily = state.font.family
    document.body.style.color = state.font.color
    Cookies.set(COOKIE_NAME, JSON.stringify(state))
  },
  // SET: (state, data) => {
  //   i18n.locale = state.language
  //   document.body.style.fontSize = `${state.font.size}px`
  //   document.body.style.fontFamily = state.font.family
  //   document.body.style.color = state.font.color
  //   Cookies.set(COOKIE_NAME, JSON.stringify(state))
  // },
  SET_LANGUAGE: (state, value) => {
    state.language = value
    Cookies.set(COOKIE_NAME, JSON.stringify(state))
  },
  SET_DARK_MODE: (state, value) => {
    state.darkMode = value ? true : false
    Cookies.set(COOKIE_NAME, JSON.stringify(state))
  },
  SET_FONT: (state, { key, value }) => {
    if (key === 'size') {
      state.font.size = parseInt(value)
      document.body.style.fontSize = `${state.font.size}px`
    } else if (key === 'family') {
      state.font.family = value
      document.body.style.fontFamily = state.font.family
    } else if (key === 'color') {
      state.font.color = value
      document.body.style.color = state.font.color
    } // else if (key === 'line_height') {
    //   state.font.line_height = value
    //   document.body.style.lineHeight = state.font.line_height
    // }
    Cookies.set(COOKIE_NAME, JSON.stringify(state))
  },
  SET_FORMAT: (state, value) => {
    state.format = { ...state.format, ...value }
    Cookies.set(COOKIE_NAME, JSON.stringify(state))
  },
  SET_DENSE: (state, value) => {
    state.dense = { ...state.dense, ...value }
    Cookies.set(COOKIE_NAME, JSON.stringify(state))
  },
  SET_SHADOW: (state, value) => {
    state.shadow = { ...state.shadow, ...value }
    Cookies.set(COOKIE_NAME, JSON.stringify(state))
  }
}

const actions = {
  get ({ commit }, params) {
    return api.get(collection, { params }).then((res) => {
      if ((typeof rs === 'object' || rs instanceof Object) && Object.keys(rs).length) {
        commit('INIT', rs)
      }
    })
    // http.get(collection, { params }).then(rs => {
    //   if ((typeof rs === 'object' || rs instanceof Object) && Object.keys(rs).length) {
    //     commit('INIT', rs)
    //   }
    // })
  },
  set ({ commit }, params) {
    if (params.language) commit('SET_LANGUAGE', params.language)
    if (params.darkMode) commit('SET_DARK_MODE', params.darkMode)
    if (params.font) commit('SET_FONT', params.font)
    if (params.format) commit('SET_FORMAT', params.format)
    if (params.dense) commit('SET_DENSE', params.dense)
    if (params.shadow) commit('SET_SHADOW', params.shadow)
    api.put(collection, params)
  },
  reload ({ commit, state }) {
    const data = JSON.parse(Cookies.get(COOKIE_NAME))
    commit('INIT', data)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
