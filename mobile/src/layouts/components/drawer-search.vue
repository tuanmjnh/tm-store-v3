<template>
  <div :class="['absolute-top drawer-search',isPlaceholder?'':'fix-icon-search']">
    <q-input v-model="appSearch" borderless class="q-pl-md q-pr-md "
             :placeholder="isPlaceholder?$t('global.search'):''">
      <template v-slot:prepend>
        <q-icon v-if="appSearch===''" name="search" color="white" />
        <q-icon v-else name="clear" color="white" class="cursor-pointer" @click="appSearch=''" />
      </template>
      <template v-slot:after>
        <q-btn flat round dense color="white" icon="qr_code_scanner" @click="isDialogQRCode=!isDialogQRCode">
          <q-tooltip v-if="!$q.platform.is.mobile">{{$t('qrCode.qrCodeScanner')}}</q-tooltip>
        </q-btn>
      </template>
    </q-input>
    <!-- QR Code Scanner dialog -->
    <q-dialog v-model="isDialogQRCode" :maximized="true">
      <tm-html5qrcode :title="$t('qrCode.qrCodeScanner')" :cancelLabel="$t('global.cancel')" @onDecode="onDecodeQR" @onError="onErrorQR" />
    </q-dialog>
  </div>
</template>

<script>
import { defineComponent, defineAsyncComponent, ref, computed } from 'vue';
import { useStore } from 'vuex'
// import { useI18n } from 'vue-i18n'
export default defineComponent({
  name: 'drawer-search',
  components: {
    tmHtml5qrcode: defineAsyncComponent(() => import('components/tm-html5qrcode')),
  },
  props: {
    isPlaceholder: { type: Boolean, default: true }
  },
  setup (props) {
    const $store = useStore()
    const isDialogQRCode = ref(false);
    const appSearch = computed({
      get: () => { return $store.state.app.search },
      set: value => { $store.commit('app/SET_SEARCH', value) }
    })
    return { appSearch, isDialogQRCode }
  }
})
</script>

<style>
.drawer-search .q-input {
  height: 50px;
  overflow: hidden;
  color: #fff !important;
}
.drawer-search .q-field__native {
  color: #fff !important;
}
/* .q-field__marginal {
  height: 50px !important;
  color: #fff !important;
} */
</style>
