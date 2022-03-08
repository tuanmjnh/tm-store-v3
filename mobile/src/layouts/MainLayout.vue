<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn flat dense round icon="menu" aria-label="Menu" @click="leftDrawerOpen=!leftDrawerOpen" />
        <q-btn flat round dense icon="qr_code_scanner" aria-label="QRCode" @click="isDialogQRCode=!isDialogQRCode">
          <q-tooltip>{{$t('global.qrCodeScanner')}}</q-tooltip>
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

    <!-- Dialog QR Code Scanner -->
    <q-dialog v-model="isDialogQRCode" :maximized="true">
      <qr-code v-model:isDialog="isDialogQRCode" />
    </q-dialog>
  </q-layout>
</template>

<script>
import essentialLink from "./essential-link/index";
import menuBottom from "./menu-bottom/index";
import qrCode from "components/qr-code";

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

import { defineComponent, ref } from "vue";

export default defineComponent({
  name: "MainLayout",

  components: {
    essentialLink,
    menuBottom,
    qrCode
  },

  setup () {
    const leftDrawerOpen = ref(false);
    const rightDrawerOpen = ref(false);
    const isDialogQRCode = ref(false);
    return {
      essentialLinks: linksList, leftDrawerOpen, rightDrawerOpen, isDialogQRCode,
    };
  },
});
</script>
