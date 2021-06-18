// import { store } from 'quasar/wrappers'
import { createStore, createLogger } from 'vuex'
import getters from './getters';

// import example from './module-example'

const debug = process.env.NODE_ENV !== 'production'
/*
 * If not building with SSR mode, you can
 * directly export the Store instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Store instance.
 */

/*
 * If not building with SSR mode, you can
 * directly export the Store instantiation
 */
// https://webpack.js.org/guides/dependency-management/#requirecontext
const modulesFiles = require.context('./modules', true, /\.js$/);

// you do not need `import app from './modules/app'`
// it will auto require all vuex module from modules file
const modules = modulesFiles.keys().reduce((modules, modulePath) => {
  // set './app.js' => 'app'
  const moduleName = modulePath.replace(/^\.\/(.*)\.\w+$/, '$1');
  const value = modulesFiles(modulePath);
  modules[moduleName] = value.default;
  return modules;
}, {});

// export default store(function (/* { ssrContext } */) {
//   const Store = createStore({
//     modules,
//     getters,

//     // enable strict mode (adds overhead!)
//     // for dev mode and --debug builds only
//     strict: debug,// process.env.DEBUGGING,
//     // plugins
//     plugins: debug ? [createLogger()] : []
//   })

//   return Store
// })

export default createStore({
  modules,
  getters,
  strict: debug,
  plugins: debug ? [createLogger()] : []
})
