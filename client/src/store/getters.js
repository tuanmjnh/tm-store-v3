export default {
  // sidebar: state => state.app.sidebar,
  routes: state => state.auth.routesConstant.concat(state.auth.routes),
  languages: state => state.app.languages,
  genders: state => state.app.genders,
  // User setting
  // userSetting: state => state.userSetting.data,
  language: state => state.userSetting.language,
  font: state => state.userSetting.font,
  dense: state => state.userSetting.dense,
  darkMode: state => state.userSetting.darkMode,
  format: state => state.userSetting.format,
  shadow: state => state.userSetting.shadow

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
};
