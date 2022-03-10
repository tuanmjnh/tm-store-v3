import { boot } from 'quasar/wrappers'
import moment from 'moment'

export default boot(({ app }) => {
  // moment.defaultFormat = 'YYYY/MM/DD'
  // for use: const { $moment } = getCurrentInstance().appContext.config.globalProperties
  app.config.globalProperties.$moment = moment

  // for use: $axios = inject('$axios')
  // app.provide('$moment', moment)
})

export { moment }