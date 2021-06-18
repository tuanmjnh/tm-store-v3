import { api } from '@/boot/axios'
const collectionExports = '/store-exports';
const collectionImports = '/store-imports';
const collectionReports = '/store-reports';

const state = {
  items: [],
  item: {},
  rowsNumber: 0
};
const mutations = {
  SET_ITEMS (state, value) {
    state.items = value ? value : [];
  },
  SET_ITEM (state, value) {
    state.item = value ? value : {};
  },
  SET_ROWS_NUMBER (state, value) {
    state.rowsNumber = value ? value : 0;
  }
};
const actions = {
  // collection Exports
  async getExport ({ commit }, params) {
    const rs = await api.get(collectionExports, { params });
    if (rs && rs.data) commit('SET_ITEMS', rs.data);
    if (rs && rs.rowsNumber) commit('SET_ROWS_NUMBER', rs.rowsNumber);
  },
  async findsExport ({ commit }, params) {
    const rs = await api.post(`${collectionExports}/find`, { params });
    if (rs) commit('SET_ITEMS', rs);
  },
  async updateExport ({ commit }, params) {
    const rs = await api.put(`${collectionExports}/exist`, { params });
    if (rs) commit('SET_ITEMS', rs);
  },

  // collection Imports
  async getImports ({ commit }, params) {
    const rs = await api.get(collectionImports, { params });
    if (rs && rs.data) commit('SET_ITEMS', rs.data);
    if (rs && rs.rowsNumber) commit('SET_ROWS_NUMBER', rs.rowsNumber);
  },
  async findsImports ({ commit }, params) {
    const rs = await api.post(`${collectionImports}/find`, { params });
    if (rs) commit('SET_ITEMS', rs);
  },
  async updateImports ({ commit }, params) {
    const rs = await api.put(`${collectionImports}/exist`, { params });
    if (rs) commit('SET_ITEMS', rs);
  },

  //collectionReports
  async getReportDate ({ commit }, params) {
    const rs = await api.get(collectionReports, { params });
    if (rs && rs.data) commit('SET_ITEMS', rs.data);
    if (rs && rs.rowsNumber) commit('SET_ROWS_NUMBER', rs.rowsNumber);
  },
  async getReportWeekly ({ commit }, params) {
    const rs = await api.get(collectionReports, { params });
    if (rs && rs.data) commit('SET_ITEMS', rs.data);
    if (rs && rs.rowsNumber) commit('SET_ROWS_NUMBER', rs.rowsNumber);
  },
  async getReportMonth ({ commit }, params) {
    const rs = await api.get(collectionReports, { params });
    if (rs && rs.data) commit('SET_ITEMS', rs.data);
    if (rs && rs.rowsNumber) commit('SET_ROWS_NUMBER', rs.rowsNumber);
  },
  async getReportQuarter ({ commit }, params) {
    const rs = await api.get(collectionReports, { params });
    if (rs && rs.data) commit('SET_ITEMS', rs.data);
    if (rs && rs.rowsNumber) commit('SET_ROWS_NUMBER', rs.rowsNumber);
  },
  async getReportYear ({ commit }, params) {
    const rs = await api.get(collectionReports, { params });
    if (rs && rs.data) commit('SET_ITEMS', rs.data);
    if (rs && rs.rowsNumber) commit('SET_ROWS_NUMBER', rs.rowsNumber);
  },
  async getReportFiveYear ({ commit }, params) {
    const rs = await api.get(collectionReports, { params });
    if (rs && rs.data) commit('SET_ITEMS', rs.data);
    if (rs && rs.rowsNumber) commit('SET_ROWS_NUMBER', rs.rowsNumber);
  }
};
export default {
  namespaced: true,
  state,
  mutations,
  actions
};
