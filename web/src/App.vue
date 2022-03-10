<template>
  <component :is="layout">
    <router-view />
  </component>
</template>
<script>
import { defineComponent, defineAsyncComponent, computed } from 'vue';
import { useQuasar } from 'quasar'
import { useStore } from 'vuex'
export default defineComponent({
  name: 'App',
  components: {
    spa: defineAsyncComponent(() => import('./layouts/spa/index')),
    // mobile: defineAsyncComponent(() => import('./layouts/mobile')),
    // electron: defineAsyncComponent(() => import('./layouts/electron')),
    // loading: defineAsyncComponent(() => import('./layouts/loading')),
    login: defineAsyncComponent(() => import('./layouts/login'))

  },
  setup () {
    const $q = useQuasar()
    const $store = useStore()
    const layout = computed(() => {
      if ($store.state.auth.verified) {
        // if ($q.platform.is.mobile) return 'mobile'
        // else if ($q.platform.is.electron) return 'electron'
        // else return 'spa'
        return 'spa'
      } else {
        return 'login'
      }
    })

    $store.commit('settings/INIT')
    // $store.dispatch('userSetting/set', $store.state.userSetting)
    $q.dark.set($store.getters.darkMode)
    return { layout }
  }
})
</script>
