<template>
  <q-layout view="lHh Lpr lFf">
    <q-header>
      <q-toolbar>
        <img src="icons/favicon-16x16.png">
        <span class="text-subtitle1">{{title}}</span>
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

    <!-- <q-drawer v-model="leftDrawerOpen" show-if-above bordered>
      <q-list>
        <q-item-label header> Essential Links Left</q-item-label>

        <essential-link v-for="link in essentialLinks" :key="link.title" v-bind="link" />
      </q-list>
    </q-drawer>

    <q-drawer v-model="rightDrawerOpen" show-if-above bordered side="right">
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
import { defineComponent, defineAsyncComponent, ref } from "vue";
export default defineComponent({
  name: "MainLayout",
  components: {
    menuBottom: defineAsyncComponent(() => import('../components/menu-bottom')),
    // drawerSearch: defineAsyncComponent(() => import('../components/drawer-search'))
    drawerSearch: defineAsyncComponent(() => import('../components/search')),
    notification: defineAsyncComponent(() => import('../components/notification')),
    profile: defineAsyncComponent(() => import('../components/profile'))
  },
  setup () {
    const title = process.env.APP_NAME
    // const leftDrawerOpen = ref(false);
    // const rightDrawerOpen = ref(false);
    return {
      title, //leftDrawerOpen, rightDrawerOpen,
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
