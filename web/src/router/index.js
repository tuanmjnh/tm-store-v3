import { route } from 'quasar/wrappers'
import { createRouter, createMemoryHistory, createWebHistory, createWebHashHistory } from 'vue-router'
import { constant, dynamic } from './routes'
import fakeLayout from '@/layouts/fake-layout'

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation
 */

const createHistory = process.env.SERVER
  ? createMemoryHistory
  : process.env.VUE_ROUTER_MODE === 'history' ? createWebHistory : createWebHashHistory

const reCreateRouter = () => createRouter({
  scrollBehavior: () => ({ left: 0, top: 0 }),
  routes: constant,

  // Leave this as is and make changes in quasar.conf.js instead!
  // quasar.conf.js -> build -> vueRouterMode
  // quasar.conf.js -> build -> publicPath
  history: createHistory(process.env.MODE === 'ssr' ? void 0 : process.env.VUE_ROUTER_BASE)
})

// const router = createRouter({
//   history: createWebHistory(),
//   routes: [{ path: '/:articleName', component: fakeLayout }]
// })

// router.addRoute({ path: '/about', component: fakeLayout })
// console.log(router.options.routes)

const Router = route(reCreateRouter())

// router.addRoutes(routes.demo)
// export default function(/* { store, ssrContext } */) {
//   const Router = new VueRouter({
//     scrollBehavior: () => ({ x: 0, y: 0 }),
//     routes,

//     // Leave these as is and change from quasar.conf.js instead!
//     // quasar.conf.js -> build -> vueRouterMode
//     // quasar.conf.js -> build -> publicPath
//     mode: process.env.VUE_ROUTER_MODE, // history require service support
//     base: process.env.VUE_ROUTER_BASE
//   })

//   return Router
// }

// export const constant = routes.constant
// export const exception = routes.exception

// Check has router
// const hasRouter = (route, isname = true) => {
//   if (isname) {
//     const matched = Router.resolve({ name: route }).resolved.matched
//     if (matched.length > 0) return matched
//     else return null
//   } else {
//     const resolved = Router.resolve(route).resolved
//     // console.log(resolved)
//     // const match = this.$router.match('/manager/users/add')
//     if (resolved.name === '404') return null
//     else return resolved
//   }
// }
// Router.has = hasRouter

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
const resetRouter = () => {
  const newRouter = reCreateRouter()
  Router.matcher = newRouter.matcher // reset router
}

const addRoutes = (routers, replace = true) => {
  // console.log(router)
  routers = routers.filter(x => {
    if (!Router.includes(x.name)) return x
  })
  Router.addRouter(routers)
}

// Generate routes dynamic
const generateRoutes = (authRoutes, _dynamic) => {
  const rs = []
  _dynamic = dynamic.slice() || _dynamic
  for (const e of _dynamic) {
    if (authRoutes.includes(e.name)) rs.push(e)
  }
  return rs
}

export default Router
export { constant, Router, resetRouter, addRoutes, generateRoutes }
