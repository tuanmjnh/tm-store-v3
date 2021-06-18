<template>
  <div id="q-app">
    <!-- <q-spinner-pie color="primary" size="2em" /> -->
    <!-- <q-inner-loading :showing="$store.state.loading.get">
      <q-spinner-gears size="100px" color="primary" />
    </q-inner-loading> -->
    <!-- <b>{{$q.platform}}</b> -->
    <component v-if="$store.state.auth.verified" :is="layout">
      <!-- <transition name="fade" mode="out-in"> -->
      <!-- <transition  enter-active-class="animated fadeIn"> -->
      <!-- <q-transition appear enter="fadeInLeft" leave="fadeOutRight" mode="out-in"> -->
      <router-view :key="$route.path" />
      <!-- </transition> -->
      <!-- </transition> -->
      <!-- <router-view :layout.sync="layout" /> -->
    </component>
    <!-- <router-view v-else :key="$route.path" /> -->
    <loading v-else />
    <router-view v-if="$route.path==='/login'" :key="$route.path" />
  </div>
</template>

<script>
import { defineComponent, ref, computed, onMounted, onUpdated, onUnmounted } from 'vue';
import { useQuasar } from 'quasar'
import { useStore } from 'vuex'
import { useRoute, useRouter, useLink } from 'vue-router'
export default defineComponent({
  name: 'App',
  components: {
    spa: () => import('./layouts/spa/index'),
    mobile: () => import('./layouts/mobile'),
    electron: () => import('./layouts/electron'),
    loading: () => import('./layouts/loading')
  },
  async setup () {
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
    return { layout, $route }
  }
})
</script>
