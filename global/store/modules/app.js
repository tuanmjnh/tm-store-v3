import Cookies from 'js-cookie'
import { i18n, Get, Set, GetAll } from '@/boot/i18n'
const state = {
  avatar:
    'data:image/jpeg;base64,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',
  iconApp: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAACXBIWXMAAAsTAAALEwEAmpwYAAAB4FBMVEVHcEwmzuoGZt0PgtsfuesOiPAUmPAUjdwhu+gUlegnz+oKffsZqfEMhPkIdOYEXeUmzuss4egjxO0LdeMPh+QOifQXoOQLgfcZqOoMd98UmOwt4+cp2Oko1eokyusGZ+Mmzewp2Okgu+4XovMJefMSlfURkfUQjvYDWd0o0+ot5OcUl/Ajxuwr3egs4Ogfu/Eet+8ly+sBRdEWn+gJevYly+sQjvAXoOUSj+ASjOATl/APgNgo0+oCUtko1Oku5Ocw6eYFZO0s3ugjxuwKdN4v6OYu4+cZqfEFXdwFYN0JduYgve4ZqvEJc+kSlOwVnPEt4ucTle8t4eciwe0Sj+cNedsHdfoIcO0GcPQp1ukOfNoUmvIes+gZo+QLbdMOhe4TlOcQhNoKe+ww6eYv6OYEY+UCT9gw6eYBPM0mzOoCTdYw6uYHcfomzOsfue4GaeUBP9Anz+onz+oYpvIEVdUt4ecLdOwNddcbrvAMgPgUjd8lyusmzeskx+wjxO0u5Ocgve4s4Ogp2OkWoPMv5uccsPAZqvEPi/cQg9ww6eYCT9cIdfgTmPUQjOsn0uoet+8QiuMQj/MJeOkEZ+gBQNAPhOIYpvAUmOsNe9sMdNgSkeUXoeQIZ9oFXdgHbe4Zn+QIWhLdAAAAe3RSTlMACBAxBVcxAQIDx/7o/uD+Gfv0QIyMxDL8VrSnPisPKEpvgObs67X3/jeFCaZW7Vfd2GPSiOj3LbT39/hiqo0kvmrjIPfwzrrHiiKmlp+AUh3btXkcseP8wsGM/vn+/ev3tOnbmeVM89Kw+Paogc5g5Za7YuT1+ZXV+GiGFCTHAAAC0ElEQVQ4y2WTZ1daQRCGB7y49wqogBgQaWIM9n4Sg+YYe6zYNVjTY2KKiUkMHaQ3G4jG8lczez1EjfNpd+eZd2Z3dgByRhiA8u4P/RotAAd3jQNi1UQiu263rEZ3F2EJCGreRiLungav19fTiSfsDTfB8PqXGL5do7NqfL6kr6D8pgiuqrsxWqbREtyWLyaTDkddbw5BqeJXmFs2YGBBwNfa2W632+UVuCG8gLF/1+1tMAIwHAg4YFjQbcqdLldTI69gHYi4ve4nOj62vplmFwCnHfGgjQgQmNqVeae0HIvr6i2Hw+6ss1KENXxKBQIVWMa2t6GeEHQXf3XY7U6Ulk+jBMpNBwK/UEHmWwSGAdbY7rA72o0VcpcnRbPXAtOUkSDgQwDA0EzDlxVAfl/KPanUYD7AjOkKSC6C9j3mdi5ZVvQE1CthVQBtVMhIMia8ZzJZsInBrmbD7IklD4j6ZOVnoyQYDErGTX4TKqA0uuXTtWTdYskjRJ3NPofe0Yw/4/fb7iNA3a66YuzIephXCCMAkD9o89t4AC+2VY3vSWC9oyMPawiHS+ibwsRkPI4AK/e0ciy6CXl02oEKonS6BNuE7Z5Z3acKS39KgaE9BwQesqA+3aMA7oWF2VV0LF+W0o7ywBpVSFwDBy8osJwDyi7X8gmIThO3AZXqH3C8hu8nSiSUhAJsDgjmaiizPabA/r4ypxCrREcg08p/UQTiNwC813DlwRwCEtVxq4IFjoWq+AMKhEJK/h0+F87HFhD4ZjveS8/qcZUDpErcKIYOLy5i9+ifm5jcS2f7ngmhKsQDUnEb0XeZiw4PF7D7WAypHe87Ozv/3oIARojE4rGWjajZ/Pop4a9HKx4eOzvfOPoR2rkCio6iUTNKAns9WIqh6NG8FAEiiu0g0KW/NZ8sS0jLlwupGH+UKBYreveGEI78P9zCtso2HCXm4xxNnpvdvwCftVmQyZeoAAAAAElFTkSuQmCC',
  // imageEmpty: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQMAAADCCAMAAAB6zFdcAAAAJFBMVEXw8PDZ2dnb29vs7Ozu7u7a2trk5OTh4eHn5+ff39/m5ubW1tZgd3wLAAADEUlEQVR4nO2d7XaCMAxAgZaPsvd/38nUUdq0eATElHvPfjhFpHehSYq6qgIAAAAAAAAAAAAAAAAAAAAAAAAAAAD4UszP2ZizFVSmPhsc4AAHOMABDnCAAxzgAAc4wIEqB4f3ygocVPZYKg0OjgYHOJjAAQ4mVDswY+9c3w122ysqdjC49rFF0216RbUOrPNrm3bY8IpaHdgm2GpDKCh1ECnYIkGpAxcpqOu3TwedDgZBQe3W923FDKLTgRQGdT2u7rsTPal0kFhiWA+EVhyfSged7GC1ohxlTyod9AkHawc/nULCzKnSgTwdrGaGv5m0je9X6SAuDl5ycFcX1xEqHaTiIH/wjx23UX5U6SAxH/zk+8fns/rwAZUOxBJJPNXF/YZjVOlA6BbEP/CCOXjC/KjSgXwytNljt+28ZbChTgdWcpBvHP26qlk+pNPBVPGFNPkZcXH6LJOoUgdxudzkj3wpbRkIWh2EU8KKgrCkWLSYah1Ugx/d+ZQQZ9PF/KnXwS2+HwvLTb961FFl6UvT7OCWH8wwDi8csomur/sD1e3gVYR6wiuULuHAtOE+az8/XsKBWFbO+fESDiQFXiBcwUFi+dE9C8sLOEh0mXNxfQEHQm9xOQep1ceCHQxBD51YdCrYwdRFLJuH1AJsqQ7Ge9z7EpJhUKaDuZP0JCTDoEQHxh/tv4TMO8CLc2CDevg5MaYuTRbowEQJ8C7BSt1SmQ6kavhPQiYMCnMgj3RMl8nFOUgOtEu+WaM0Bzad/br0Q0U4sM/3mGXHWbAD0zc33LSenA33gh14l5DfV6DbwYZxl+Ig3QVdxsFunwHV6yBb9lzEwdupsBwHuQbgIg52SgmaHeyVEhQ72PdrAVQ62C8l6HWwrwKVDrrmiZt+3P3GfPPxy+Om87dt5nv/n9Zc6ZrrKjjAwQQOcDCBAxxMKHBgzbFEH4b4QgfN0Shw8HFwgAMc4AAHOMABDnCAAxzg4IsdxJ/H/Czf8L+J2sOb5Tz575L4kISzOVsAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQJJfX084wDL8aVYAAAAASUVORK5CYII=',
  leftDrawer: false,
  loading: {
    get: false,
    post: false,
    put: false,
    patch: false,
    delete: false
  },
  search: '',
  sidebar: {
    opened: Cookies.get('sidebarStatus') ? !!+Cookies.get('sidebarStatus') : true,
    withoutAnimation: false
  },
  device: 'desktop',
  languages: GetAll(),//[],
  rowsPerPageOptions: [10, 20, 50, 100, 200, 0],
  isDialog: { add: true, edit: true, import: true },
  passwordResetDefault: 'Bk123456@',
  apiUrl: process.env.API,
  apiUpload: process.env.API_FILE_UPLOAD,
  // apiUpload: '/api/file-manager'
  componentLoaded: {}
}

const mutations = {
  SET_LOADING (state, obj) {
    if (obj) state.loading[obj.key] = obj.value
    else state.loading = {
      get: false,
      post: false,
      put: false,
      patch: false,
      delete: false
    }
  },
  DONE_LOADING (state) {
    state.loading = {
      get: false,
      post: false,
      put: false,
      patch: false,
      delete: false
    }
  },
  TOGGLE_SIDEBAR: state => {
    state.sidebar.opened = !state.sidebar.opened
    state.sidebar.withoutAnimation = false
    if (state.sidebar.opened) {
      Cookies.set('sidebarStatus', 1)
    } else {
      Cookies.set('sidebarStatus', 0)
    }
  },
  CLOSE_SIDEBAR: (state, withoutAnimation) => {
    Cookies.set('sidebarStatus', 0)
    state.sidebar.opened = false
    state.sidebar.withoutAnimation = withoutAnimation
  },
  TOGGLE_DEVICE: (state, device) => {
    state.device = device
  },
  SET_SEARCH: (state, value) => {
    state.search = value
  },
  SET_COMPONENT_LOADED: (state, value) => {
    state.componentLoaded = value
  },
  LEFT_DRAWER: (state, value) => {
    state.leftDrawer = value ? value : false
  }
}

const actions = {
  setLoading ({ commit }, params) {
    commit('SET_LOADING', params)
  },
  toggleSideBar ({ commit }) {
    commit('TOGGLE_SIDEBAR')
  },
  closeSideBar ({ commit }, { withoutAnimation }) {
    commit('CLOSE_SIDEBAR', withoutAnimation)
  },
  toggleDevice ({ commit }, device) {
    commit('TOGGLE_DEVICE', device)
  },
  setComponentLoaded ({ commit }, value) {
    commit('SET_COMPONENT_LOADED', value ? value : {})
  },
  setLeftDrawer ({ commit }, value) {
    commit('LEFT_DRAWER', value ? value : false)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
