import { boot } from 'quasar/wrappers'
import VueGapi from 'vue-gapi'

export default boot(({ app }) => {
  app.use(VueGapi, {
    apiKey: 'AIzaSyBbhrs5sA6IbAuFG0miLdmEo1ZLcOFZHVw',
    clientId: '45492650401-84j1lpnseu0lgn2k0cgs4hchks18cahn.apps.googleusercontent.com',
    discoveryDocs: ['https://sheets.googleapis.com/$discovery/rest?version=v4'],
    scope: 'https://www.googleapis.com/auth/spreadsheets'
  })
  app.provide('$gapi', VueGapi)
})

export { VueGapi }