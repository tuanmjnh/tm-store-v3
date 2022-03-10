import store from '@/store'

export function init () {
  if (store.state.auth.token) {
    if (!store.state.types.items) store.dispatch('types/get')// .then(() => { console.log(store.state.types.items) })
    if (!store.state.roles.items) store.dispatch('roles/get')// .then(() => { console.log(store.state.roles.items) })
  }
}
