import { boot } from 'quasar/wrappers'
import * as directives from '../directive' // global directive

// We globally register our directive with Vue;
// Remember that all directives in Vue will start with 'v-'
// but that should not be part of your directive name
// https://vuejs.org/v2/guide/custom-directive.html
// 'my-directive' will be used as 'v-my-directive'
// Vue.directive('my-directive', MyDirective)

// register global utility directive


export default boot(({ app }) => {
  Object.keys(directives).forEach(key => {
    app.directive(key, directives[key])
  })
})

export { directives }
