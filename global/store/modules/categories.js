import { api } from '@/boot/axios'
import { generateCategory } from '../../utils/tree'
const collection = '/categories';

const constant = {
  type: null, // $route.meta.type,
  code: null,
  dependent: null,
  level: 1,
  title: '',
  desc: null,
  content: '',
  url: null,
  images: null,
  quantity: null,
  position: [],
  tags: null,
  icon: 'spa',
  color: '#607d8b',
  meta: null,
  startAt: null,
  endAt: null,
  orders: 1,
  flag: 1
}

const state = {
  all: {},
  // type: 'product',
  rootItems: null,
  items: null,
  item: { ...constant },
  dependent: null
};
const mutations = {
  SET_ALL (state, value) {
    state.all[value.type] = value.data ? value.data : []
    // state.type = value.type
  },
  SET_ITEMS (state, value) {
    state.rootItems = value ? value : []
    state.items = value ? generateCategory(value).sort((a, b) => a.orders - b.orders) : []
  },
  SET_ITEM (state, value) {
    // Set Item
    if (value.item) state.item = value.item
    else state.item = { ...constant }
    // Set Item type
    state.item.type = value.type
    // Set dependent
    if (value.dependent) state.dependent = state.rootItems.find(x => x._id === value.dependent)
    else state.dependent = null
    // Set item dependent
    if (state.dependent) {
      state.item.dependent = state.dependent._id
      state.item.level = state.dependent.level + 1
    } else {
      state.item.dependent = null
      state.item.level = 1
    }
  },
  SET_DEPENDENT (state, value) {
    state.dependent = state.rootItems.find(x => x._id === value)
  },
  ADD_ITEMS (state, value) {
    if (Array.isArray(value)) value.forEach(e => { state.rootItems.push(e) })
    else state.rootItems.push(value)
    state.items = generateCategory(state.rootItems)
  },
  UPDATE_ITEMS (state, value) {
    if (Array.isArray(value)) {
      value.forEach(e => {
        const i = state.rootItems.findIndex(x => x._id === e._id)
        if (i > -1) state.rootItems.splice(i, 1, e)
      })
    } else {
      const i = state.rootItems.findIndex(x => x._id === value._id)
      if (i > -1) state.rootItems.splice(i, 1, value)
    }
    state.items = generateCategory(state.rootItems).sort((a, b) => a.orders - b.orders)
  },
  FLAG_UPDATE_ITEMS (state, value) {
    if (Array.isArray(value)) {
      value.forEach(e => {
        const i = state.rootItems.find(x => x._id === e)
        if (i) i.flag = i.flag === 1 ? 0 : 1
      })
    } else {
      const i = state.rootItems.find(x => x._id === value)
      if (i) i.flag = i.flag === 1 ? 0 : 1
    }
    state.items = generateCategory(state.rootItems)
  },
  REMOVE_ITEMS (state, value) {
    if (Array.isArray(value)) {
      value.forEach(e => {
        const i = state.rootItems.findIndex(x => x._id === e._id)
        if (i > -1) state.rootItems.splice(i, 1)
      })
    } else {
      const i = state.rootItems.findIndex(x => x._id === value._id)
      if (i > -1) state.rootItems.splice(i, 1)
    }
    state.items = generateCategory(state.rootItems)
  }
};
const actions = {
  get ({ commit }, params) {
    return api.get(collection, { params }).then((res) => {
      // if (params.x) return params.generate ? generateCategory(res.data) : res.data
      // else {
      if (res && res.data) {
        if (params.all) commit('SET_ALL', { data: generateCategory(res.data), type: params.type })
        commit('SET_ITEMS', res.data)
      }
      return res
      // }
    })
  },
  set ({ commit }, params) {
    commit('SET_ITEM', params)
  },
  find ({ commit }, params) {
    return api.get(`${collection}/find`, { params })
  },
  exist ({ commit }, params) {
    return api.debonce({ method: 'get', params: params, url: `${collection}/exist` })
  },
  getMeta ({ commit }, params) {
    return api.debonce({ method: 'get', params: params, url: `${collection}/get-meta` })
  },
  post ({ state, commit }, params) {
    return api.post(collection, params).then((res) => {
      commit('ADD_ITEMS', res)
      commit('SET_ITEM', { item: null, dependent: state.dependent ? state.dependent._id : null, type: params.type })
      return res
    })
  },
  put ({ commit }, params) {
    return api.put(collection, params).then((res) => {
      commit('UPDATE_ITEMS', params)
      return res
    })
  },
  patch ({ commit }, params) {
    return api.patch(collection, params).then((res) => {
      commit('FLAG_UPDATE_ITEMS', res.success)
      return res
    })
  },
  imports ({ commit }, params) {
    return api.post(`${collection}/import`, params)
  },
  delete ({ commit }, params) {
    return api.delete(collection, params).then((res) => {
      commit('REMOVE_ITEMS', params)
      return res
    })
  }
};
export default {
  namespaced: true,
  state,
  mutations,
  actions
};
