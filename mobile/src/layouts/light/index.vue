<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn flat dense round icon="menu" aria-label="Menu" @click="leftDrawerOpen=!leftDrawerOpen" />
        <q-btn flat round dense icon="qr_code_scanner" @click="isDialogQRCode=!isDialogQRCode">
          <q-tooltip v-if="!$q.platform.is.mobile">{{$t('qrCode.qrCodeScanner')}}</q-tooltip>
        </q-btn>
        <q-space />
        <!-- <div>Quasar v{{ $q.version }}</div> -->
        <q-toolbar-title>TM Store</q-toolbar-title>
        <q-space />
        <q-btn flat dense round icon="menu" aria-label="Menu" @click="rightDrawerOpen=!rightDrawerOpen" />
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered>
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
    </q-drawer>


    <q-footer bordered class="bg-white text-primary">
      <menu-bottom></menu-bottom>
    </q-footer>

    <q-page-container>
      <router-view />
    </q-page-container>

    <!-- QR Code Scanner dialog -->
    <q-dialog v-model="isDialogQRCode" :maximized="true">
      <tm-html5qrcode :title="$t('qrCode.qrCodeScanner')" :cancelLabel="$t('global.cancel')" @onDecode="onDecodeQR" @onError="onErrorQR" />
    </q-dialog>
  </q-layout>
</template>

<script>
import essentialLink from "./essential-link";
import menuBottom from "./menu-bottom";

const linksList = [
  {
    title: "Docs",
    caption: "quasar.dev",
    icon: "school",
    link: "https://quasar.dev",
  },
  {
    title: "Github",
    caption: "github.com/quasarframework",
    icon: "code",
    link: "https://github.com/quasarframework",
  },
  {
    title: "Discord Chat Channel",
    caption: "chat.quasar.dev",
    icon: "chat",
    link: "https://chat.quasar.dev",
  },
  {
    title: "Forum",
    caption: "forum.quasar.dev",
    icon: "record_voice_over",
    link: "https://forum.quasar.dev",
  },
  {
    title: "Twitter",
    caption: "@quasarframework",
    icon: "rss_feed",
    link: "https://twitter.quasar.dev",
  },
  {
    title: "Facebook",
    caption: "@QuasarFramework",
    icon: "public",
    link: "https://facebook.quasar.dev",
  },
  {
    title: "Quasar Awesome",
    caption: "Community Quasar projects",
    icon: "favorite",
    link: "https://awesome.quasar.dev",
  },
];

import { defineComponent, defineAsyncComponent, ref } from "vue";

export default defineComponent({
  name: "MainLayout",

  components: {
    essentialLink,
    menuBottom,
    tmHtml5qrcode: defineAsyncComponent(() => import('components/tm-html5qrcode'))
  },

  setup () {
    const leftDrawerOpen = ref(false);
    const rightDrawerOpen = ref(false);
    const isDialogQRCode = ref(false);
    return {
      essentialLinks: linksList, leftDrawerOpen, rightDrawerOpen, isDialogQRCode,
      onDecodeQR (val) {
        alert(val)
        // $store.dispatch('store/importsFinds', { qrcode: val }).then((x) => {
        //   if (x && x.length) {
        //   } else $q.notify({ message: t('error.qrNotExist'), color: 'negative' })
        // })
      },
      onErrorQR (val) {
        $q.notify({ message: t(`error.${val.key}`), color: 'negative' })
      }
    }
  }
})
</script>
