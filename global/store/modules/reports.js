import { api } from '@/boot/axios'
const collection = '/product-reports'
const constant = {
}
const state = {
  items: [],
  item: { ...constant }
}
const mutations = {
  SET_ITEMS (state, value) {
    state.items = value ? value : []
  },
  SET_ITEM (state, value) {
    if (value) state.item = value
    else state.item = { ...constant }
  },
  ADD_ITEMS (state, value) {
    if (Array.isArray(value)) value.forEach(e => { state.items.push(e) })
    else state.items.push(value)
  },
  UPDATE_ITEMS (state, value) {
    if (Array.isArray(value)) {
      value.forEach(e => {
        const i = state.items.findIndex(x => x._id === e._id)
        if (i > -1) state.items.splice(i, 1, e)
      })
    } else {
      const i = state.items.findIndex(x => x._id === value._id)
      if (i > -1) state.items.splice(i, 1, value)
    }
  },
  FLAG_REMOVE_ITEMS (state, value) {
    if (Array.isArray(value)) {
      value.forEach(e => {
        const i = state.items.findIndex(x => x._id === e)
        if (i > -1) state.items.splice(i, 1)
      })
    } else {
      const i = state.items.findIndex(x => x._id === value)
      if (i > -1) state.items.splice(i, 1)
    }
  },
}
const actions = {
  getTotalOrders ({ commit }, params) {
    return api.get(`${collection}/total-orders`, { params })
  },
  getDate ({ commit }, params) {
    return api.get(`${collection}/date`, { params })
  },
  getWeekly ({ commit }, params) {
    return api.get(`${collection}/weekly`, { params })
  },
  getMonth ({ commit }, params) {
    return api.get(`${collection}/month`, { params })
  },
  getQuarter ({ commit }, params) {
    return api.get(`${collection}/quarter`, { params })
  },
  getYear ({ commit }, params) {
    return api.get(`${collection}/year`, { params })
  },
  getFiveYear ({ commit }, params) {
    return api.get(`${collection}/five-year`, { params })
  }
}
export default {
  namespaced: true,
  state,
  mutations,
  actions
}
