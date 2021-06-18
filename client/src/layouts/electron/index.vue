<template>
  <!-- <div class=""> -->
  <!--
      Anything after view="lHh lpr lFf" is only needed
      so we can display this example in the documentation

      Remove this part: container style="height: 400px" class="shadow-2 rounded-borders"
    -->
  <q-layout view="lHh lpr lFf" :style="{height:(windowSize.height-16)+'px'}" class="shadow-2">
    <q-header elevated>
      <q-bar class="q-electron-drag">
        <!-- <q-icon name="laptop_chromebook" /> -->
        <!-- <ion-icon name="logo-youtube"></ion-icon> -->
        <q-icon name="ion-logo-youtube" />
        <div>Tube Viewer</div>
        <q-space />

        <q-btn dense flat icon="minimize" @click="minimize" />
        <q-btn dense flat icon="crop_square" @click="maximize" />
        <q-btn dense flat icon="close" @click="closeApp" />
      </q-bar>

      <!-- <q-toolbar>
        <q-btn flat dense round @click="drawer = !drawer" aria-label="Menu">
          <q-icon name="menu" />
        </q-btn>
        <q-toolbar-title>
          {{ title }}
        </q-toolbar-title>
        <div>Quasar v{{ $q.version }}</div>
      </q-toolbar> -->

      <!-- <div class="q-pa-sm q-pl-md row items-center">
        <div class="cursor-pointer non-selectable">
          File
          <q-menu>
            <q-list dense style="min-width: 100px">
              <q-item clickable v-close-popup>
                <q-item-section>Open...</q-item-section>
              </q-item>
              <q-item clickable v-close-popup>
                <q-item-section>New</q-item-section>
              </q-item>

              <q-separator />

              <q-item clickable>
                <q-item-section>Preferences</q-item-section>
                <q-item-section side>
                  <q-icon name="keyboard_arrow_right" />
                </q-item-section>

                <q-menu anchor="top right" self="top left">
                  <q-list>
                    <q-item v-for="n in 3" :key="n" dense clickable>
                      <q-item-section>Submenu Label</q-item-section>
                      <q-item-section side>
                        <q-icon name="keyboard_arrow_right" />
                      </q-item-section>
                      <q-menu auto-close anchor="top right" self="top left">
                        <q-list>
                          <q-item v-for="n in 3" :key="n" dense clickable>
                            <q-item-section>3rd level Label</q-item-section>
                          </q-item>
                        </q-list>
                      </q-menu>
                    </q-item>
                  </q-list>
                </q-menu>
              </q-item>

              <q-separator />

              <q-item clickable v-close-popup @click="closeApp">
                <q-item-section>Quit</q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </div>

        <div class="q-ml-md cursor-pointer non-selectable">
          Edit
          <q-menu auto-close>
            <q-list dense style="min-width: 100px">
              <q-item clickable>
                <q-item-section>Cut</q-item-section>
              </q-item>
              <q-item clickable>
                <q-item-section>Copy</q-item-section>
              </q-item>
              <q-item clickable>
                <q-item-section>Paste</q-item-section>
              </q-item>
              <q-separator />
              <q-item clickable>
                <q-item-section>Select All</q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </div>
      </div> -->
    </q-header>

    <!-- <q-drawer v-model="drawer" :mini="miniState" @mouseover="miniState = false" @mouseout="miniState = true"
      mini-to-overlay :width="200" :breakpoint="500" show-if-above bordered content-class="bg-grey-3 fix-electron"
      class="">
      <q-scroll-area class="fit">
        <drawer-item :items="this.$router.options.routes"></drawer-item>
      </q-scroll-area>
    </q-drawer> -->
    <b>Electron</b>
    <q-page-container>
      <!-- <q-page> -->
      <router-view />
      <!-- <q-page class="q-pa-md" :style="{maxHeight:(windowSize.height-20)+'px'}">
        <p v-for="n in 15" :key="n">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Fugit nihil praesentium molestias a adipisci,
          dolore vitae odit, quidem consequatur optio voluptates asperiores pariatur eos numquam rerum delectus
          commodi perferendis voluptate?
        </p>
      </q-page> -->
      <!-- </q-page> -->
    </q-page-container>
  </q-layout>
  <!-- </div> -->
</template>

<script>
// we guard the Electron API calls, but this
// is only needed if we build same app with other
// Quasar Modes as well (SPA/PWA/Cordova/SSR...)
// import { remote } from 'electron'
// let window = remote.getCurrentWindow()
// import drawerItem from '@/layouts/components/drawer-item'
export default {
  // components: { drawerItem },
  data() {
    return {
      windowSize: { height: 600 },
      title: process.env.APP_NAME,
      drawer: this.$q.platform.is.desktop,
      miniState: true
    }
  },
  created() {
  },
  watch: {
    windowSize: {
      handler(val) {
        this.windowSize = this.$q.screen
        // console.log(this.windowSize)
      },
      deep: true
    }
  },
  methods: {
    minimize() {
      if (process.env.MODE === 'electron') {
        this.$q.electron.remote.BrowserWindow.getFocusedWindow().minimize()
      }
    },

    maximize() {
      if (process.env.MODE === 'electron') {
        const win = this.$q.electron.remote.BrowserWindow.getFocusedWindow()

        if (win.isMaximized()) {
          win.unmaximize()
        } else {
          win.maximize()
        }
      }
    },

    closeApp() {
      if (process.env.MODE === 'electron') {
        this.$q.electron.remote.BrowserWindow.getFocusedWindow().close()
      }
    }
  }
}
</script>
<style>
.app-electron .q-layout {
  overflow: hidden;
  /* position: initial !important; */
}
/* .q-page {
  overflow-y: scroll;
  padding: 20px;
} */
.app-electron .q-header {
  z-index: 3001;
  left: 0 !important;
}
.app-electron .q-bar {
  height: 50px;
}
.app-electron .q-drawer {
  z-index: 3000;
}
.app-electron .fix-electron {
  padding-top: 50px !important;
}
</style>
