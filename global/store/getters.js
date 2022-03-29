export default {
  apiUrl: state => state.app.apiUrl,
  apiUpload: state => state.app.apiUpload,
  avatar: state => state.app.avatar,
  iconApp: state => state.app.iconApp,
  // imageEmpty: state => state.app.imageEmpty,
  loading: state => state.app.loading,
  componentLoaded: state => state.app.componentLoaded,
  routes: state => state.auth.routesConstant.concat(state.auth.routes),
  languages: state => state.app.languages,
  language: state => state.settings.language,
  unitPrice: state => state.settings.unitPrice,
  font: state => state.settings.font,
  dense: state => state.settings.dense,
  darkMode: state => state.settings.darkMode,
  format: state => state.settings.format,
  shadow: state => state.settings.shadow
  // sidebar: state => state.app.sidebar,
  // device: state => state.app.device,
  // useLogs: state => state.app.useLogs,
  // visitedViews: state => state.tagsView.visitedViews,
  // cachedViews: state => state.tagsView.cachedViews,
  // // token: state => state.user.token,
  // // avatar: state => state.user.avatar,
  // // name: state => state.user.name,
  // // introduction: state => state.user.introduction,
  // // roles: state => state.user.roles,
  // permission_routes: state => state.permission.routes,
  // errorLogs: state => state.errorLog.logs,
  // roles: state => state.roles.items,
  // authUser: state => {
  //   // if (state.auth.user.phoneNumber) state.auth.user.phoneNumber = state.auth.user.phoneNumber.replace(`+${state.auth.user.phoneRegion}`, '')
  //   return state.auth.user
  // }
}
