<template>
  {{$route}}
  <router-view name="login" />
</template>

<script>
import { defineComponent, ref, computed, onMounted, onUpdated, onUnmounted } from 'vue';
import { useQuasar } from 'quasar'
import { useStore } from 'vuex'
import { useRoute, useRouter, useLink } from 'vue-router'
export default defineComponent({
  name: 'App',
  components: {
    // spa: () => import('./layouts/spa/index'),
    // mobile: () => import('./layouts/mobile'),
    // electron: () => import('./layouts/electron'),
    // loading: () => import('./layouts/loading')
  },
  setup () {
    const $q = useQuasar()
    const $store = useStore()
    const platform = ref('tuanmjnh')
    const $route = useRoute()
    const $router = useRouter()
    console.log($route.path)
    const layout = computed(() => {
      if ($q.platform.is.mobile) return 'mobile'
      else if ($q.platform.is.electron) return 'electron'
      else return 'spa'
    })
    const getDisplay = () => {
      if ($store.state.auth.user && $store.state.auth.roles) {
        return setTimeout(() => {
          return true
        }, 30000)
      } else return false
    }
    // mounted(() => {
    //   console.log('a')
    // })
    onMounted(() => {
      console.log('mounted!')
    })
    onUpdated(() => {
      console.log('updated!')
    })
    onUnmounted(() => {
      console.log('unmounted!')
    })
    onMounted(() => {
      $store.commit('userSetting/INIT')
      // $store.dispatch('userSetting/set', $store.state.userSetting)
      $q.dark.set($store.getters.darkMode)
    })
    return { layout }
  }
})
</script>
