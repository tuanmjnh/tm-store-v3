const state = {
  items: []
}
const mutations = {
  SET_ITEMS (state, value) {
    state.items = value
  }
}
const actions = {
}
export default {
  namespaced: true,
  state,
  mutations,
  actions
}
