import axios from 'axios'
import { i18n } from '../boot/i18n'
import store from '@/store'
// import { getToken } from './auth'
import { Notify, colors } from 'quasar'

const CancelToken = axios.CancelToken

const source = CancelToken.source()
this.cancelRemote()
this.requestSource = source
this.requesting = true

// console.log(process.env)
// create an axios instance
const MAINAPI = axios.create({
  // uploadURL: 'http://localhost:8001/api/upload',
  baseURL: process.env.API, // 'http://localhost:8001/api',
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 10000 // request timeout
  // headers: {
  //   // Authorization: storageAuth.GetToken() || '',
  //   // Author: storageAuth.GetUid() || '',
  //   // Remember: storageAuth.GetRemember(),
  //   LocalIP: document.getElementById('local-ip').value
  // }
})

// request interceptor
MAINAPI.interceptors.request.use(
  async config => {
    // Loading start
    switch (config.method) {
      case 'get':
        store.commit('SET_LOADING', { key: 'get', value: true })
        break
      case 'post':
        store.commit('SET_LOADING', { key: 'post', value: true })
        break
      case 'put':
        store.commit('SET_LOADING', { key: 'put', value: true })
        break
      case 'patch':
        store.commit('SET_LOADING', { key: 'patch', value: true })
        break
      case 'delete':
        store.commit('SET_LOADING', { key: 'delete', value: true })
        break
    }
    // console.log(config.method)
    // do something before request is sent
    // if (store.state.auth.token) {
    // let each request carry token
    // ['X-Token'] is a custom headers key
    // please modify it according to the actual situation
    // const authToken = await firebase.auth().currentUser.getIdToken(true)
    if (store.state.auth.token) config.headers['x-access-token'] = `Bearer ${store.state.auth.token}`
    // config.headers['userAgent'] = Platform.userAgent
    // config.headers['local-ip'] = await getLocalIP()
    // }
    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    // Loading end
    store.commit('DONE_LOADING')
    return Promise.reject(error)
  }
)

// response interceptor
MAINAPI.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
  */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    switch (response.status) {
      case 201:
        Notify.create({ message: i18n.t('success.insert'), color: 'positive' })
        break
      case 202:
        Notify.create({ message: i18n.t('success.update'), color: 'positive' })
        break
      case 203:
        Notify.create({ message: response.data.success ? `${i18n.t('success.update')}: ${response.data.success.length} ${i18n.t('global.records')}` : i18n.t('success.update'), color: 'positive' })
        break
      case 204:
        Notify.create({ message: i18n.t('success.delete'), color: 'positive' })
        break
    }
    // if the custom code is not 20000, it is judged as an error.
    // if (response.status !== 200 && response.status !== 201) {
    // Message({
    //   message: res.message || 'Error',
    //   type: 'error',
    //   duration: 5 * 1000
    // })
    // Notify.create({ message: res.message || 'Error', color: 'negative' })

    // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
    // if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
    //   // to re-login
    //   MessageBox.confirm('You have been logged out, you can cancel to stay on this page, or log in again', 'Confirm logout', {
    //     confirmButtonText: 'Re-Login',
    //     cancelButtonText: 'Cancel',
    //     type: 'warning'
    //   }).then(() => {
    //     store.dispatch('user/resetToken').then(() => {
    //       location.reload()
    //     })
    //   })
    // }
    // return Promise.reject(new Error(res.message || 'Error'))
    //   return Promise.reject(response)
    // } else {

    // Loading end
    store.commit('DONE_LOADING')
    // Return response
    return response.data
    // }
  },
  error => {
    // console.log(error.response.status) // for debug
    if (!error.response) {
      Notify.create({ message: error, color: 'negative' })
      // Loading end
      store.commit('DONE_LOADING')
      return
    }
    switch (error.response.status) {
      case 401:
        Notify.create({ message: i18n.t('error.token_no_exist'), color: 'negative' })
        break
      case 402:
        Notify.create({ message: i18n.t('error.token_invalid'), color: 'negative' })
        break
      case 404:
        Notify.create({ message: i18n.t('error.no_exist'), color: 'negative' })
        break
      case 500:
        Notify.create({ message: i18n.t('error.system'), color: 'negative' })
        break
      case 501:
        Notify.create({ message: i18n.t('error.exist'), color: 'negative' })
        break
      case 502:
        Notify.create({ message: i18n.t('error.account_no_exist'), color: 'negative' })
        break
      case 503:
        Notify.create({ message: i18n.t('error.account_no_exist'), color: 'negative' })
        break
      case 504:
        Notify.create({ message: i18n.t('error.account_locked'), color: 'negative' })
        break
      default:
        Notify.create({ message: `${i18n.t('error.error_code')}: ${error.response.status}`, color: 'negative' })
        break
    }
    // Notify.create({ message: error.response.data.error && error.response.data.error.message ? error.response.data.error.message : error.message || 'Error', color: 'negative' })
    // Message({
    //   message: ,
    //   type: 'error',
    //   duration: 5 * 1000
    // })

    // Loading end
    store.commit('DONE_LOADING')
    return Promise.reject(error)
  }
)

export default MAINAPI
