import Cookies from 'js-cookie'
import { api } from '@/boot/axios'
import { setI18nLanguage } from '@/boot/i18n'
const collection = '/settings'
const COOKIE_NAME = 'settings'
const COOKIE_DATA = Cookies.get(COOKIE_NAME) ? JSON.parse(Cookies.get(COOKIE_NAME)) : {}
const constant = {
  darkMode: false,
  language: 'vi-VN',
  unitPrice: 'vnd',
  font: {
    size: 14,
    family: '"Roboto", "-apple-system", "Helvetica Neue", Helvetica, Arial, sans-serif',
    color: '#6b6b6b',
    lineHeight: 1.5
  },
  format: {
    date: 'DD/MM/YYYY',
    time: 'hh:mm:ss a'
  },
  dense: {
    form: true,
    button: true,
    input: true,
    table: true,
    menu: false
  },
  shadow: {
    table: false
  }
}
const state = {
  darkMode: COOKIE_DATA.darkMode || constant.darkMode,
  language: COOKIE_DATA.language && COOKIE_DATA.language != 'undefined-undefined' && COOKIE_DATA.language != 'undefined' ? COOKIE_DATA.language : constant.language,
  unitPrice: COOKIE_DATA.unitPrice || constant.unitPrice,
  font: {
    size: COOKIE_DATA.font && COOKIE_DATA.font.size ? COOKIE_DATA.font.size : constant.font.size,
    family: COOKIE_DATA.font && COOKIE_DATA.font.family ? COOKIE_DATA.font.family : constant.font.family,
    color: COOKIE_DATA.font && COOKIE_DATA.font.color ? COOKIE_DATA.font.color : constant.font.color,
    lineHeight: COOKIE_DATA.lineHeight && COOKIE_DATA.font.lineHeight ? parseFloat(COOKIE_DATA.font.lineHeight) : constant.font.lineHeight
  },
  format: {
    date: COOKIE_DATA.format && COOKIE_DATA.format.date ? COOKIE_DATA.format.date : constant.format.date,
    time: COOKIE_DATA.format && COOKIE_DATA.format.time ? COOKIE_DATA.format.time : constant.format.time
  },
  dense: {
    form: COOKIE_DATA.dense && COOKIE_DATA.dense.form !== undefined ? COOKIE_DATA.dense.form : constant.dense.form,
    button: COOKIE_DATA.dense && COOKIE_DATA.dense.button !== undefined ? COOKIE_DATA.dense.button : constant.dense.button,
    input: COOKIE_DATA.dense && COOKIE_DATA.dense.input !== undefined ? COOKIE_DATA.dense.input : constant.dense.input,
    table: COOKIE_DATA.dense && COOKIE_DATA.dense.table !== undefined ? COOKIE_DATA.dense.table : constant.dense.table,
    menu: COOKIE_DATA.dense && COOKIE_DATA.dense.menu !== undefined ? COOKIE_DATA.dense.menu : constant.dense.menu
  },
  shadow: {
    table: COOKIE_DATA.shadow && COOKIE_DATA.shadow.table !== undefined ? COOKIE_DATA.shadow.table : constant.shadow.table
  }
}
const mutations = {
  INIT: (state, data) => {
    if (data) state = { ...state, ...data }
    document.body.style.fontSize = `${state.font.size}px`
    document.body.style.fontFamily = state.font.family
    document.body.style.color = state.font.color
    document.body.style.lineHeight = state.font.lineHeight
    setI18nLanguage(state.language)
    Cookies.set(COOKIE_NAME, JSON.stringify(state))
  },
  SET_DARK_MODE: (state, value) => {
    state.darkMode = value ? true : false
    Cookies.set(COOKIE_NAME, JSON.stringify(state))
  },
  SET_LANGUAGE: (state, value) => {
    if (value && value != 'undefined-undefined' && value != 'undefined') {
      state.language = value
      Cookies.set(COOKIE_NAME, JSON.stringify(state))
    }
  },
  SET_UNIT_PRICE: (state, value) => {
    state.unitPrice = value
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
    } else if (key === 'lineHeight') {
      state.font.lineHeight = value
      document.body.style.lineHeight = state.font.lineHeight
    }
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
        console.log(rs)
        commit('INIT', rs)
      }
    })
  },
  set ({ commit, state }, params) {
    if (params) {
      commit('SET_DARK_MODE', params.darkMode ? true : false)
      if (params.language) commit('SET_LANGUAGE', params.language)
      if (params.unitPrice) commit('SET_UNIT_PRICE', params.unitPrice)
      if (params.font) commit('SET_FONT', params.font)
      if (params.format) commit('SET_FORMAT', params.format)
      if (params.dense) commit('SET_DENSE', params.dense)
      if (params.shadow) commit('SET_SHADOW', params.shadow)
      commit('INIT')
      if (Cookies.get('token')) api.post(collection, params)
    } else {
      commit('INIT')
      if (Cookies.get('token')) api.post(collection, state)
    }
  },
  reload ({ commit, state }) {
    const data = JSON.parse(Cookies.get(COOKIE_NAME))
    commit('INIT', data)
  }
}

const getters = {
  constant () {
    return constant
  }
}
export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
