<template>
  <q-layout view="lHh Lpr lFf">
    <q-header :class="$store.state.app.darkMode?'bg-black':''">
      <q-toolbar>
        <q-btn flat dense round @click="onChangeModeDrawer" aria-label="Menu">
          <q-icon name="menu" />
        </q-btn>
        <q-toolbar-title>{{title}}</q-toolbar-title>
        <header-right />
        <!-- <div>Quasar v{{$q.version}}</div> -->
      </q-toolbar>
    </q-header>
    <q-drawer v-model="drawer" bordered :mini="drawerMini" :mini-to-overlay="overlay" @mouseover="onMouseOverDrawer" @mouseout="onMouseOutDrawer">
      <q-scroll-area style="height:calc(100% - 50px);margin-top:50px">
        <q-list class="rounded-borders">
          <drawer-item v-for="(e,i) in $store.getters.routes" :key="i" :dense="$store.state.userSetting.menu" :item="e" is-icon
                       :active="onActive(e.name)" />
        </q-list>
      </q-scroll-area>
      <drawer-search :is-placeholder="!drawerMini" />
    </q-drawer>
    <!-- <drawer ref="drawer" :items="$store.getters.routes" :dense="$store.getters.dense.menu" /> -->
    <q-page-container>
      <q-page padding>
        <slot v-if="$store.state.auth.user" />
        <!-- <q-spinner v-else color="primary" size="3em" :thickness="2" /> -->
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script>
import { defineComponent, ref, defineAsyncComponent } from 'vue';
import { useRoute, useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
// import drawerItem from '../components/drawer-item'
// import drawerSearch from '../components/drawer-search'
// import headerRight from '../components/header-right'
export default defineComponent({
  name: 'SPA',
  components: {
    // drawerItem,
    // drawerSearch,
    // headerRight
    // drawer: () => import('../components/drawer'),
    drawerSearch: defineAsyncComponent(() => import('../components/drawer-search')),
    drawerItem: defineAsyncComponent(() => import('../components/drawer-item')),
    headerRight: defineAsyncComponent(() => import('../components/header-right'))
  },
  setup () {
    const $route = useRoute()
    const $router = useRouter()
    const $q = useQuasar()
    const title = ref('TM-Store') // process.env.APP_NAME,
    const drawer = ref($q.platform.is.desktop)
    const modeMini = ref(false)
    const drawerMini = ref(false)
    const overlay = ref(false)

    // Global data

    // console.log($router.options.routes)
    // get status
    // console.log($q.dark.isActive) // true, false

    // get configured status
    // console.log($q.dark.mode) // "auto", true, false

    // set status
    // $q.dark.set(true) // or "false" or "auto"

    // toggle
    // $q.dark.toggle()
    // const onChangeModeDrawer = () => {
    //   $refs.drawer.onChangeModeDrawer()
    // }
    return {
      title, drawer, modeMini, drawerMini, overlay,
      onChangeModeDrawer: () => {
        if (modeMini.value) {
          modeMini.value = false
          drawerMini.value = false
        } else {
          modeMini.value = true
          drawerMini.value = true
        }
      },
      onMouseOverDrawer: () => {
        if (modeMini.value) {
          drawerMini.value = false
          overlay.value = true
        }
      },
      onMouseOutDrawer: () => {
        if (modeMini.value) {
          drawerMini.value = true
          overlay.value = false
        }
      },
      onActive: (name) => {
        const rs = $route.matched.map(x => x.name).indexOf(name) > -1 || false
        return rs
      }
    }
  }
})
</script>

<style lang="scss">
// .q-drawer__content {
// background-color: #304156;
// color: white;
// }
</style>
