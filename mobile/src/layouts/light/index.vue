<template>
  <q-layout view="lHh Lpr lFf">
    <q-header>
      <q-toolbar>
        <q-btn flat @click="leftDrawer=!leftDrawer" round dense icon="menu" />
        <!-- <img src="icons/favicon-16x16.png"> -->
        <!-- <span class="text-subtitle1">{{title}}</span> -->
        <!-- <drawer-search /> -->
        <q-space />
        <header-qrcode />
        <header-search />
        <header-notification />
        <!-- <profile /> -->
        <!-- <div>Quasar v{{ $q.version }}</div> -->
        <!-- <q-toolbar-title>TM Store</q-toolbar-title> -->
        <!-- <q-btn flat dense round icon="menu" aria-label="Menu" @click="rightDrawerOpen=!rightDrawerOpen" /> -->

      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawer" show-if-above>
      <q-scroll-area class="fit">
        <q-list>
          <drawer-profile @on-show="leftDrawer=!leftDrawer" />
          <q-separator spaced />
          <drawer-item v-for="(e,i) in $store.getters.routes" :key="i" :dense="$store.getters.dense.menu" :item="e" is-icon
                       :active="onActive(e.name)" />
        </q-list>
      </q-scroll-area>
    </q-drawer>

    <!--  <q-drawer v-model="rightDrawerOpen" show-if-above bordered side="right">
      <q-list>
        <q-item-label header> Essential Links Right</q-item-label>

        <essential-link v-for="link in essentialLinks" :key="link.title" v-bind="link" />
      </q-list>
    </q-drawer> -->


    <q-footer bordered>
      <menu-bottom></menu-bottom>
    </q-footer>

    <q-page-container>
      <!-- <q-scroll-area style="height:calc(100vh - 99px)"> -->
      <router-view />
      <!-- </q-scroll-area> -->
    </q-page-container>
  </q-layout>
</template>

<script>
import { defineComponent, defineAsyncComponent, computed } from "vue"
import { useRoute } from 'vue-router'
import { useStore } from 'vuex'
export default defineComponent({
  name: "MainLayout",
  components: {
    headerQrcode: defineAsyncComponent(() => import('../components/header-qrcode')),
    headerSearch: defineAsyncComponent(() => import('../components/header-search')),
    headerNotification: defineAsyncComponent(() => import('../components/header-notification')),
    drawerProfile: defineAsyncComponent(() => import('../components/drawer-profile')),
    drawerItem: defineAsyncComponent(() => import('../components/drawer-item')),
    menuBottom: defineAsyncComponent(() => import('../components/menu-bottom'))
  },
  setup () {
    const $route = useRoute()
    const $store = useStore()
    const title = process.env.APP_NAME
    const leftDrawer = computed({
      get: () => $store.getters.leftDrawer,
      set: val => $store.commit('app/LEFT_DRAWER', val)
    })
    return {
      title, leftDrawer,
      onActive: (name) => {
        const rs = $route.matched.map(x => x.name).indexOf(name) > -1 || false
        return rs
      }
    }
  }
})
</script>
<style scoped>
.q-toolbar img {
  position: relative;
  top: -1px;
  margin-right: 5px;
}
</style>
