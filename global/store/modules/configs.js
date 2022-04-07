import { api } from '@/boot/axios'
const collection = '/configs'
const constant = {
  key: '',
  value: ''
}
const state = {
  items: null,
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
    if (Array.isArray(value)) {
      value.forEach(e => {
        state.items.push(e)
        state.keys.pushIfNotExist(e.key)
      })
    } else {
      state.items.push(value)
      state.keys.pushIfNotExist(value.key)
    }
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
  //   value.forEach(e => {
  //     const i = state.items.find(x => x._id === e)
  //     i.flag = i.flag === 1 ? 0 : 1
  //   })
  // }
  // SET_ROWS_NUMBER (state, value) {
  //   state.rowsNumber = value ? value : 0
  // }
}
const actions = {
  get ({ commit }, params) {
    return api.get(collection, { params }).then((res) => {
      if (res) commit('SET_ITEMS', res)
      return res
    })
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
