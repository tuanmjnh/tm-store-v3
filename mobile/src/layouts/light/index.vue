<template>
  <q-layout view="lHh Lpr lFf">
    <q-header>
      <q-toolbar>
        <q-btn flat @click="leftDrawerOpen=!leftDrawerOpen" round dense icon="menu" />
        <!-- <img src="icons/favicon-16x16.png"> -->
        <!-- <span class="text-subtitle1">{{title}}</span> -->
        <!-- <drawer-search /> -->
        <q-space />
        <drawer-search />
        <notification />
        <profile />
        <!-- <div>Quasar v{{ $q.version }}</div> -->
        <!-- <q-toolbar-title>TM Store</q-toolbar-title> -->
        <!-- <q-btn flat dense round icon="menu" aria-label="Menu" @click="rightDrawerOpen=!rightDrawerOpen" /> -->

      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered>
      <q-scroll-area class="fit">
        <q-list class="rounded-borders">
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
import { defineComponent, defineAsyncComponent, ref } from "vue"
import { useRoute } from 'vue-router'
export default defineComponent({
  name: "MainLayout",
  components: {
    menuBottom: defineAsyncComponent(() => import('../components/menu-bottom')),
    drawerSearch: defineAsyncComponent(() => import('../components/search')),
    notification: defineAsyncComponent(() => import('../components/notification')),
    profile: defineAsyncComponent(() => import('../components/profile')),
    drawerItem: defineAsyncComponent(() => import('../components/drawer-item')),
  },
  setup () {
    const $route = useRoute()
    const title = process.env.APP_NAME
    const leftDrawerOpen = ref(false)
    // const leftDrawerOpen = ref(false)
    // const rightDrawerOpen = ref(false)
    return {
      title, leftDrawerOpen,//leftDrawerOpen, rightDrawerOpen,
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
