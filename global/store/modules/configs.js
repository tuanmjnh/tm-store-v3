import { api } from '@/boot/axios'
const collection = '/configs'
const constant = {
  key: '',
  value: ''
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
    console.log(state.items)
    if (Array.isArray(value)) value.forEach(e => { state.items.push(e) })
    else state.items.push(value)
  },
  UPDATE_ITEMS (state, value) {
    if (Array.isArray(value)) {
      value.forEach(e => {
        const i = state.items.findIndex(x => x._id === e._id)
        // console.log(e)
        if (i > -1) {
          state.items.splice(i, 1, e)
          state.keys.pushIfNotExist(e.key)
        }
      })
    } else {
      const i = state.items.findIndex(x => x._id === value._id)
      if (i > -1) {
        state.items.splice(i, 1, value)
        state.keys.pushIfNotExist(value.key)
      }
    }
  }
}
const actions = {
  get ({ commit }, params) {
    return api.get(collection, { params }).then((res) => {
      if (res) commit('SET_ITEMS', res.data)
      return res
    })
  },
  set ({ commit }, params) {
    commit('SET_ITEM', params)
  },
  exist ({ commit }, params) {
    return api.debonce({ method: 'get', params: params, url: `${collection}/exist` })
  },
  post ({ commit }, params) {
    return api.post(collection, params).then((res) => {
      commit('ADD_ITEMS', res)
      commit('SET_ITEM')
      return res
    })
  },
  put ({ commit }, params) {
    return api.put(collection, params).then((res) => {
      commit('UPDATE_ITEMS', params)
      return res
    })
  },
  patch ({ state, commit }, params) {
    return api.patch(collection, params).then((res) => {
      const data = []
      state.items.forEach(x => {
        if (res.success.indexOf(x._id) > -1) {
          const tmp = { ...x }
          tmp.flag = tmp.flag === 1 ? 0 : 1
          data.push(tmp)
        }
      })
      commit('UPDATE_ITEMS', data)
      return res
    })
  },
  delete ({ commit }, params) {
    return api.delete(collection, params).then((res) => {
      return res
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
