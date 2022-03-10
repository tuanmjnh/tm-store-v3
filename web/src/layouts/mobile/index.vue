<template>
  <q-layout view="lHh Lpr lFf">
    <q-header :class="$store.state.app.darkMode?'bg-black':''">
      <q-toolbar>
        <q-btn flat dense round @click="onChangeModeDrawer" aria-label="Menu">
          <q-icon name="menu" />
        </q-btn>
        <q-toolbar-title>
          {{ title }}
        </q-toolbar-title>
        <header-right />
        <!-- <div>Quasar v{{ $q.version }}</div> -->
      </q-toolbar>
    </q-header>
    <q-drawer v-model="drawer" bordered :mini="drawerMini" :mini-to-overlay="overlay"
      @mouseover="onMouseOverDrawer" @mouseout="onMouseOutDrawer">
      <q-scroll-area style="height:calc(100% - 50px);margin-top:50px;">
        <q-list class="rounded-borders">
          <drawer-item v-for="(e,i) in $store.getters.routes" :key="i" :active="onActive(e.name)"
            :dense="$store.getters.dense.menu" :item="e" is-icon>
          </drawer-item>
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
// import drawer from '../components/drawer'
import drawerSearch from '../components/drawer-search'
import drawerItem from '../components/drawer-item'
import headerRight from '../components/header-right'
export default {
  components: { drawerItem, drawerSearch, headerRight },
  data() {
    return {
      title: 'TM-Store', // process.env.APP_NAME,
      drawer: this.$q.platform.is.desktop,
      modeMini: false,
      drawerMini: false,
      overlay: false
    }
  },
  created() {
    // get status
    // console.log(this.$q.dark.isActive) // true, false

    // get configured status
    // console.log(this.$q.dark.mode) // "auto", true, false

    // set status
    // this.$q.dark.set(true) // or "false" or "auto"

    // toggle
    // this.$q.dark.toggle()
  },
  methods: {
    // onChangeModeDrawer() {
    //   this.$refs.drawer.onChangeModeDrawer()
    // },
    onChangeModeDrawer() {
      this.modeMini = false
      this.drawer = !this.drawer
    },
    onMouseOverDrawer() {
      if (this.modeMini) {
        this.drawerMini = false
        this.overlay = true
      }
    },
    onMouseOutDrawer() {
      if (this.modeMini) {
        this.drawerMini = true
        this.overlay = false
      }
    },
    onActive(name) {
      const rs = this.$route.matched.map(x => x.name).indexOf(name) > -1 || false
      return rs
    }
  }
}
</script>

<style lang="scss">
// .q-drawer__content {
// background-color: #304156;
// color: white;
// }
</style>
