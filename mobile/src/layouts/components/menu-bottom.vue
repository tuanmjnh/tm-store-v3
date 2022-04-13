<template>
  <q-tabs v-model="tab" no-caps active-color="primary" indicator-color="transparent">
    <template v-for="e in menus" :key="e.name">
      <q-tab :name="e.name" :icon="e.meta.icon" @click="onClickTab(e)">
        <!-- <q-badge color="red" floating>2</q-badge> :class="tab===e.name?'text-primary':''" -->
      </q-tab>
    </template>
  </q-tabs>
  <!-- QR Code Scanner dialog -->
  <!-- <q-dialog v-model="isDialogQRCode" :maximized="true">
    <tm-html5qrcode :title="$t('qrCode.qrCodeScanner')" :cancelLabel="$t('global.cancel')" @onDecode="onDecodeQR" @onError="onErrorQR" />
  </q-dialog> -->
</template>

<script>
import { defineComponent, ref, computed } from "vue"
import { useRoute, useRouter } from 'vue-router'
export default defineComponent({
  name: "MenuBottom",
  setup () {
    const $route = useRoute()
    const $router = useRouter()
    const tab = computed({
      get: () => $route.name,
      set: val => val
    })
    const menus = [
      {
        path: '/dashboard',
        name: 'dashboard',
        meta: { title: 'dashboard', icon: 'dashboard' }
      },
      {
        path: '/orders',
        name: 'orders-view',
        meta: { title: 'orders', icon: 'class' },
      },
      {
        path: '/warehouse',
        name: 'warehouse-data',
        meta: { title: 'warehouse', icon: 'store' }
      },
      // {
      //   path: '/qrcode',
      //   name: 'qrcode',
      //   meta: { title: 'qrCodeScanner', icon: 'qr_code_scanner' }
      // },
      {
        path: '/warehouse/report',
        name: 'warehouse-report',
        meta: { title: 'report', icon: 'pie_chart' },
      }
      // {
      //   path: '/notification',
      //   name: 'notification',
      //   meta: { title: 'notification', icon: 'notifications' }
      // },
      // {
      //   path: '/profile',
      //   name: 'profile',
      //   meta: { title: 'profile', icon: 'account_box' }
      // }
    ]
    const isDialogQRCode = ref(false)
    return {
      tab, menus, isDialogQRCode,
      onClickTab (val) {
        if (val.name === 'qrcode') isDialogQRCode.value = !isDialogQRCode.value
        else $router.push(val.path)
      },
      onDecodeQR (val) {
        console.log(val)
        isDialogQRCode.value = !isDialogQRCode.value
      },
      onErrorQR (val) {
        console.log(val)
      }
    }
  }
})
</script>
