import Cookies from 'js-cookie';
import { i18n, Get, Set, GetAll } from '@/boot/i18n';

const state = {
  avatar:
    'data:image/jpeg;base64,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',
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
  languages: GetAll(),
  sizes: [
    { key: 'md', value: 14 },
    { key: 'lg', value: 18 },
    { key: 'sm', value: 12 },
    { key: 'xs', value: 10 }
  ],
  language: Get(),
  font: {
    size: Cookies.get('size') || 'md',
    family: '"Roboto", "-apple-system", "Helvetica Neue", Helvetica, Arial, sans-serif',
    color: '#6b6b6b',
    line_height: 1.5
  },
  dense: {
    form: true,
    button: false,
    input: true,
    table: true,
    menu: false
  },
  format: {
    date: 'DD/MM/YYYY',
    time: 'hh:mm:ss'
  },
  darkMode: (Cookies.get('darkMode') && Cookies.get('darkMode').toLowerCase() === 'true') || false,
  genders: [
    { id: 1, code: 'male' },
    { id: 2, code: 'female' },
    { id: 3, code: 'unknown' }
  ],
  rowsPerPageOptions: [10, 20, 50, 100, 200, 0],
  isDialogAdd: true,
  isDialogEdit: true,
  passwordResetDefault: 'Bk123456@',
  apiFileUpload: '/api/file-manager'
};

const mutations = {
  SET_LOADING (state, obj) {
    if (obj) state.loading[obj.key] = obj.value;
    else state.loading = {
      get: false,
      post: false,
      put: false,
      patch: false,
      delete: false
    };
  },
  DONE_LOADING (state) {
    state.loading = {
      get: false,
      post: false,
      put: false,
      patch: false,
      delete: false
    };
  },
  TOGGLE_SIDEBAR: state => {
    state.sidebar.opened = !state.sidebar.opened;
    state.sidebar.withoutAnimation = false;
    if (state.sidebar.opened) {
      Cookies.set('sidebarStatus', 1);
    } else {
      Cookies.set('sidebarStatus', 0);
    }
  },
  CLOSE_SIDEBAR: (state, withoutAnimation) => {
    Cookies.set('sidebarStatus', 0);
    state.sidebar.opened = false;
    state.sidebar.withoutAnimation = withoutAnimation;
  },
  TOGGLE_DEVICE: (state, device) => {
    state.device = device;
  },
  SET_LANGUAGE: (state, value) => {
    state.language = value;
    i18n.locale = value;
    Set(value);
  },
  SET_FONT: (state, value) => {
    state.font = value;
    Cookies.set('font', JSON.stringify(state.font));
    document.body.style.fontSize = `${state.font.size}px`;
  },
  SET_DENSEN: (state, value) => {
    state.dense = value;
    Cookies.set('dense', JSON.stringify(state.dense));
  },
  SET_FORMAT: (state, value) => {
    state.format = value;
    Cookies.set('format', JSON.stringify(state.format));
  },
  SET_DARK_MODE: (state, value) => {
    state.darkMode = value;
    Cookies.set('darkMode', value);
  },
  SET_SEARCH: (state, value) => {
    state.search = value;
  }
};

const actions = {
  setLoading ({ commit }, params) {
    commit('SET_LOADING', params);
  },
  toggleSideBar ({ commit }) {
    commit('TOGGLE_SIDEBAR');
  },
  closeSideBar ({ commit }, { withoutAnimation }) {
    commit('CLOSE_SIDEBAR', withoutAnimation);
  },
  toggleDevice ({ commit }, device) {
    commit('TOGGLE_DEVICE', device);
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions
};
