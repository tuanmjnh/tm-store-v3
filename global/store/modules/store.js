import { api } from '@/boot/axios'
const collectionImports = '/product-imports'
const collectionExports = '/product-exports'
const collectionReports = '/product-reports'

const state = {
  importItems: [],
  exportItems: []
}
const mutations = {
  IMPORT_SET_ITEMS (state, value) {
    state.importItems = value ? value : []
  },
  EXPORT_SET_ITEMS (state, value) {
    state.exportItems = value ? value : []
  }
}
const actions = {
  // collection Imports
  importGet ({ commit }, params) {
    return api.get(collectionImports, { params }).then((res) => {
      if (res && res.data) commit('IMPORT_SET_ITEMS', res.data)
      return res
    })
  },
  importGetDetail ({ commit }, params) {
    return api.get(`${collectionImports}/get-sub`, { params })
  },
  importsFinds ({ commit }, params) {
    return api.post(`${collectionImports}/select`, params)
  },
  importsInsert ({ commit }, params) {
    return api.post(collectionImports, params)
  },

  // collection Exports
  exportGet ({ commit }, params) {
    return api.get(collectionExports, { params }).then((res) => {
      if (res && res.data) commit('EXPORT_SET_ITEMS', res.data)
      return res
    })
  },
  exportGetDetail ({ commit }, params) {
    return api.get(`${collectionExports}/get-sub`, { params })
  },
  exportFinds ({ commit }, params) {
    return api.post(`${collectionExports}/select`, params)
  },
  exportInsert ({ commit }, params) {
    return api.post(collectionExports, params)
  },

  //collectionReports
  reportGetDate ({ commit }, params) {
    return api.get(collectionReports, { params })
  },
  reportGetWeekly ({ commit }, params) {
    return api.get(`${collectionReports}/weekly`, { params })
  },
  reportGetMonth ({ commit }, params) {
    return api.get(`${collectionReports}/month`, { params })
  },
  reportGetQuarter ({ commit }, params) {
    return api.get(`${collectionReports}/quarter`, { params })
  },
  reportGetYear ({ commit }, params) {
    return api.get(`${collectionReports}/year`, { params })
  },
  reportGetFiveYear ({ commit }, params) {
    return api.get(`${collectionReports}/five-year`, { params })
  }
}
export default {
  namespaced: true,
  state,
  mutations,
  actions
}
