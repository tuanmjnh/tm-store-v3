<template>
  <component :is="layout">
    <router-view />
  </component>
</template>
<script>
import { defineComponent, defineAsyncComponent, computed } from "vue";
import { useQuasar } from 'quasar'
import { useStore } from 'vuex'
export default defineComponent({
  name: "App",
  components: {
    light: defineAsyncComponent(() => import('./layouts/light')),
    login: defineAsyncComponent(() => import('./layouts/login'))
  },
  setup () {
    const $q = useQuasar()
    const $store = useStore()
    const layout = computed(() => {
      if ($store.state.auth.verified) {
        return 'light'
      } else {
        return 'login'
      }
    })
    $store.commit('settings/INIT')
    $q.dark.set($store.getters.darkMode)

    // $store.dispatch('configs/post', { key: 'logger', value: 1 }).then(x => {
    //   console.log(x)
    // })
    // $store.dispatch('configs/get').then(x => {
    //   console.log(x)
    // })
    return { layout }
  }
});
</script>
