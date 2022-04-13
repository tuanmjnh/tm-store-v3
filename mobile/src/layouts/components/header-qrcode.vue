<template>
  <q-btn flat round color="white" icon="qr_code_scanner" @click="isDialog=!isDialog" />

  <!-- QR Code Scanner dialog -->
  <q-dialog v-model="isDialog" :maximized="true">
    <tm-html5qrcode :title="$t('qrCode.qrCodeScanner')" :cancelLabel="$t('global.cancel')" @onDecode="onDecodeQR" @onError="onErrorQR" />
  </q-dialog>
</template>

<script>
import { defineComponent, defineAsyncComponent, ref } from "vue";
export default defineComponent({
  name: "DrawerQRCodeLayout",
  components: {
    tmHtml5qrcode: defineAsyncComponent(() => import('components/tm-html5qrcode')),
  },
  setup () {
    const isDialog = ref(false)
    return {
      isDialog,
      onDecodeQR (val) {
        console.log(val)
        isDialog.value = !isDialog.value
      },
      onErrorQR (val) {
        console.log(val)
      }
    }
  }
})
</script>
