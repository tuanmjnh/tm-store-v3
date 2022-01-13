import { api } from '@/boot/axios'
const collectionImports = '/store-imports'
const collectionExports = '/store-exports'
const collectionReports = '/store-reports'

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
  importsGet ({ commit }, params) {
    return api.get(collectionImports, { params }).then((res) => {
      if (res && res.data) commit('IMPORT_SET_ITEMS', res.data)
      return res
    })
  },
  importsFinds ({ commit }, params) {
    return api.post(`${collectionImports}/finds`, params)
  },
  importsUpdate ({ commit }, params) {
    return api.put(collectionImports, params)
  },

  // collection Exports
  exportGet ({ commit }, params) {
    return api.get(collectionExports, { params })
  },
  exportFinds ({ commit }, params) {
    return api.post(`${collectionExports}/finds`, params)
  },
  exportUpdate ({ commit }, params) {
    return api.put(collectionExports, params)
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
