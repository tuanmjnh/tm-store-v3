import { api } from '@/boot/axios'
const collection = '/product-imports'
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
  get ({ commit }, params) {
    return api.get(collection, { params }).then((res) => {
      if (res && res.data) commit('SET_ITEMS', res.data)
      return res
    })
  },
  getSub ({ commit }, params) {
    return api.get(`${collection}/get-sub`, { params })
  },
  select ({ commit }, params) {
    return api.post(`${collection}/select`, params)
  },
  post ({ commit }, params) {
    return api.post(collection, params).then((res) => {
      commit('ADD_ITEMS', res.data)
      commit('SET_ITEM')
      return res
    })
  },
  put ({ commit }, params) {
    return api.put(collection, params)
  },
  patch ({ commit }, params) {
    return api.patch(collection, params)
  }
}
export default {
  namespaced: true,
  state,
  mutations,
  actions
}
