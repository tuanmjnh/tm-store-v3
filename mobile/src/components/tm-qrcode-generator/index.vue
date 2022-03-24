<template>
  <q-card flat bordered class="my-card bg-grey-1">
    <q-card-section class="card-section-header">
      <div class="row items-center no-wrap">
        <div class="col">
          <div class="text-subtitle2">{{title}}</div>
        </div>
        <div class="col-auto">
          <q-btn flat :dense="dense" :icon="iconEdit">
            <q-tooltip>{{labelEdit}}</q-tooltip>
            <q-popup-edit v-model="modelValueLocal" auto-save v-slot="scope" @update:model-value="onEditBarCode">
              <q-input v-model="scope.value" dense autofocus counter @keyup.enter="scope.set" />
            </q-popup-edit>
          </q-btn>
          <q-btn flat :dense="dense" :icon="iconDefault" @click.prevent="onSetDefault">
            <q-tooltip>{{labelDefault}}</q-tooltip>
          </q-btn>
          <q-btn flat :dense="dense" :icon="iconScanner" @click.prevent="isDialog=!isDialog">
            <q-tooltip>{{labelScanner}}</q-tooltip>
          </q-btn>
        </div>
      </div>
    </q-card-section>
    <q-separator />
    <q-card-section class="bg-white">
      <div id="tm-qrcode" class="q-mb-md">
        <q-popup-edit v-model="modelValueLocal" auto-save v-slot="scope" @update:model-value="onEditBarCode">
          <q-input v-model="scope.value" dense autofocus counter @keyup.enter="scope.set" />
        </q-popup-edit>
      </div>
      <div class="text-value text-subtitle2">{{modelValueLocal}}</div>
    </q-card-section>
    <q-card-section class="text-caption card-section-bottom">
      {{labelHelper}}
    </q-card-section>
  </q-card>
  <!-- QR Code Scanner dialog -->
  <q-dialog v-model="isDialog" :maximized="true">
    <tm-html5qrcode :title="labelScanner" :cancelLabel="labelCancel" @onDecode="onDecode" @onError="onError" />
  </q-dialog>
</template>

<script>
import { defineComponent, defineAsyncComponent, ref, onMounted, watch } from 'vue'
import QRCode from 'easyqrcodejs'
export default defineComponent({
  name: 'TM-BarCodeGenerator',
  components: {
    tmHtml5qrcode: defineAsyncComponent(() => import('components/tm-html5qrcode'))
  },
  props: {
    modelValue: { type: String, default: null },
    defaultValue: { type: String, default: null },
    title: { type: String, default: 'QR Code' },
    logo: { type: String, default: null },
    width: { type: Number, default: 100 },
    height: { type: Number, default: 100 },
    logoWidth: { type: Number, default: 15 },
    logoHeight: { type: Number, default: 15 },
    iconScanner: { type: String, default: 'qr_code_scanner' },
    labelScanner: { type: String, default: 'QR Code Scanner' },
    iconDefault: { type: String, default: 'drive_file_rename_outline' },
    labelDefault: { type: String, default: 'Set by ID' },
    iconEdit: { type: String, default: 'edit' },
    labelEdit: { type: String, default: 'Edit QR Code' },
    labelHelper: { type: String, default: 'Click Barcode to change value' },
    labelCancel: { type: String, default: 'Cancel' },
    dense: { type: Boolean, default: true }
  },
  emits: ['onInit', 'onSetRandom'],
  setup (props, { emit }) {
    const modelValueLocal = ref(null)
    const qrCodeInstant = ref(null)
    const isDialog = ref(false)
    const isMounted = ref(false)
    const options = (text) => {
      return {
        // ====== Basic
        text: text,
        width: props.width,
        height: props.height,
        colorDark: "#000000",
        colorLight: "#ffffff",
        // correctLevel: QRCode.CorrectLevel.H, // L, M, Q, H
        logo: props.logo,
        logoWidth: props.logoWidth,
        logoHeight: props.logoHeight
        // ====== dotScale
        /*
        dotScale: 1, // For body block, must be greater than 0, less than or equal to 1. default is 1

        dotScaleTiming: 1, // Dafault for timing block , must be greater than 0, less than or equal to 1. default is 1
        dotScaleTiming_H: undefined, // For horizontal timing block, must be greater than 0, less than or equal to 1. default is 1
        dotScaleTiming_V: undefined, // For vertical timing block, must be greater than 0, less than or equal to 1. default is 1

        dotScaleA: 1, // Dafault for alignment block, must be greater than 0, less than or equal to 1. default is 1
        dotScaleAO: undefined, // For alignment outer block, must be greater than 0, less than or equal to 1. default is 1
        dotScaleAI: undefined, // For alignment inner block, must be greater than 0, less than or equal to 1. default is 1
        */

        // ====== Quiet Zone
        /*
        quietZone: 0,
        quietZoneColor: "rgba(0,0,0,0)",
        */

        // ====== Logo
        /*
        logo: "../demo/logo.png", // Relative address, relative to `easy.qrcode.min.js`
        logo: "http://127.0.0.1:8020/easy-qrcodejs/demo/logo.png",
        logoWidth: 80, // fixed logo width. default is `width/3.5`
        logoHeight: 80, // fixed logo height. default is `heigth/3.5`
        logoMaxWidth: undefined, // Maximum logo width. if set will ignore `logoWidth` value
        logoMaxHeight: undefined, // Maximum logo height. if set will ignore `logoHeight` value
        logoBackgroundColor: '#fffff', // Logo backgroud color, Invalid when `logBgTransparent` is true; default is '#ffffff'
        logoBackgroundTransparent: false, // Whether use transparent image, default is false
        */

        // ====== Backgroud Image
        /*
        backgroundImage: '', // Background Image
        backgroundImageAlpha: 1, // Background image transparency, value between 0 and 1. default is 1.
        autoColor: false, // Automatic color adjustment(for data block)
        autoColorDark: "rgba(0, 0, 0, .6)", // Automatic color: dark CSS color
        autoColorLight: "rgba(255, 255, 255, .7)", // Automatic color: light CSS color
        */

        // ====== Colorful
        // === Posotion Pattern(Eye) Color
        /*
        PO: '#e1622f', // Global Posotion Outer color. if not set, the defaut is `colorDark`
        PI: '#aa5b71', // Global Posotion Inner color. if not set, the defaut is `colorDark`
        PO_TL:'', // Posotion Outer color - Top Left
        PI_TL:'', // Posotion Inner color - Top Left
        PO_TR:'', // Posotion Outer color - Top Right
        PI_TR:'', // Posotion Inner color - Top Right
        PO_BL:'', // Posotion Outer color - Bottom Left
        PI_BL:'', // Posotion Inner color - Bottom Left
        */
        // === Alignment Color
        /*
        AO: '', // Alignment Outer. if not set, the defaut is `colorDark`
        AI: '', // Alignment Inner. if not set, the defaut is `colorDark`
        */
        // === Timing Pattern Color
        /*
        timing: '#e1622f', // Global Timing color. if not set, the defaut is `colorDark`
        timing_H: '', // Horizontal timing color
        timing_V: '', // Vertical timing color
        */

        // ====== Title
        /*
        title: 'QR Title', // content
        titleFont: "normal normal bold 18px Arial", //font. default is "bold 16px Arial"
        titleColor: "#004284", // color. default is "#000"
        titleBackgroundColor: "#fff", // background color. default is "#fff"
        titleHeight: 70, // height, including subTitle. default is 0
        titleTop: 25, // draws y coordinates. default is 30
        */

        // ====== SubTitle
        /*
        subTitle: 'QR subTitle', // content
        subTitleFont: "normal normal normal 14px Arial", // font. default is "14px Arial"
        subTitleColor: "#004284", // color. default is "4F4F4F"
        subTitleTop: 40, // draws y coordinates. default is 0
        */

        // ===== Event Handler
        /*
        onRenderingStart: undefined,
        onRenderingEnd: undefined,
        */

        // ===== Versions
        /*
        version: 0, // The symbol versions of QR Code range from Version 1 to Version 40. default 0 means automatically choose the closest version based on the text length.
        */

        // ===== Binary(hex) data mode
        /*
        binary: false, // Whether it is binary mode, default is text mode.
        */

        // ===== Tooltip
        /*
        tooltip: false, // Whether set the QRCode Text as the title attribute value of the QRCode div
        */

        // ==== CORS
        /*
        crossOrigin: null, // String which specifies the CORS setting to use when retrieving the image. null means that the crossOrigin attribute is not set.
        */

        // =====  Drawing method
        /*
        drawer: 'canvas', // Which drawing method to use. 'canvas', 'svg'. default is 'canvas'
        */

        // =====  UTF-8 without BOM
        /*
        utf8WithoutBOM: true
        */
      }
    }
    const onInit = (value) => {
      if (qrCodeInstant.value) qrCodeInstant.value._el.children[0].remove()
      if (value) {
        qrCodeInstant.value = new QRCode(document.getElementById("tm-qrcode"), options(value))
        emit('onInit', qrCodeInstant.value)
      }
    }
    watch(() => props.modelValue, (state, prevState) => {
      modelValueLocal.value = state
      if (isMounted.value) onInit(state)
    }, { deep: true, immediate: true })

    onMounted(() => {
      isMounted.value = true
      onInit(props.modelValue)
    })
    return {
      modelValueLocal, isDialog,
      onSetDefault () {
        if (props.defaultValue) emit('update:modelValue', props.defaultValue)
        else emit('onSetRandom')
      },
      onEditBarCode (val) {
        if (val) emit('update:modelValue', val)
      },
      onDecode (val) {
        emit('update:modelValue', val.decodedText)
        isDialog.value = !isDialog.value
      },
      onError (val) {
        // console.log(val)
      }
    }
  }
})
</script>

<style lang="css" scoped>
.q-item__section--avatar {
  min-width: 0px;
}
.q-item__section--side > .q-icon {
  font-size: 15px;
}
.q-card__section--vert.card-section-header {
  padding: 6px 16px;
}
.q-card__section--vert.card-section-bottom {
  padding: 10px 16px;
}
</style>
