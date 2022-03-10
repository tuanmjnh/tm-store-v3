import Cookies from 'js-cookie'
import { Router, generateRoutes, resetRouter, constant } from '@/router'
import { api } from '@/boot/axios'
const collection = '/auth'

const state = {
  verified: false,
  token: Cookies.get('token') || undefined,
  user: undefined,
  roles: [],
  routesConstant: constant,
  routes: []
}
const mutations = {
  SET_VERIFIED (state, value) {
    state.verified = value
  },
  SET_TOKEN (state, value) {
    if (value) {
      state.token = value
      Cookies.set('token', value)
    } else {
      state.token = null
      Cookies.remove('token')
    }
  },
  SET_USER (state, value) {
    state.user = value
  },
  SET_ROUTES (state, value) {
    state.routes = [[], ...value]
  },
  SET_IS_ADD_ROUTER (state, value) {
    state.isAddRouter = value
  }
}
const actions = {
  async login ({ commit }, params) {
    const rs = await api.post(collection, params)
    if (rs) {
      commit('SET_VERIFIED', true)
      if (rs.token) commit('SET_TOKEN', rs.token)
      if (rs.user) commit('SET_USER', rs.user)
      if (rs.user && rs.user.routes) {
        const routes = await generateRoutes(rs.user.routes)
        Router.addRoutes(routes, { replace: true })
        commit('SET_ROUTES', routes)
      }
    }
  },
  async verify ({ commit, dispatch, rootState }, params) {
    let rs
    if (params) rs = await api.post(collection, params)
    else rs = await api.get(collection, { params })
    if (rs) {
      commit('SET_VERIFIED', true)
      if (rs.token) commit('SET_TOKEN', rs.token)
      if (rs.user) commit('SET_USER', rs.user)
      if (rs.user && rs.user.routes) {
        const routes = await generateRoutes(rs.user.routes)
        for await (const r of routes) {
          Router.addRoute(r)
        }
        commit('SET_ROUTES', routes)
      }
    } else dispatch('logout')
    return rs
  },
  logout ({ commit }) {
    commit('SET_VERIFIED', false)
    commit('SET_TOKEN')
    commit('SET_USER', null)
    commit('SET_ROUTES', [])
    resetRouter()
  }
}
export default {
  namespaced: true,
  state,
  mutations,
  actions
}
