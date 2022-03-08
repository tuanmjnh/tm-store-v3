<template>
  <div id="html5-qr-reader" style="display: inline-block; position: relative; padding: 0px; border: 1px solid silver;">
    <div class="qr-reader-top">
      <div class="row">
        <div class="col-2">
          <q-btn flat round dense class="btn-close" color="white" icon="arrow_back" v-close-popup></q-btn>
        </div>
        <q-space />
        <div class="col-6 text-center">
          <div class="text-h6 text-blue">{{title}}</div>
        </div>
        <q-space />
        <div class="col-2"></div>
      </div>
    </div>
    <div class="qr-reader-bottom">
      <div class="row">
        <div class="col-2"></div>
        <q-space />
        <div class="col-3">
          <q-btn flat round dense class="btn-capture" color="white" :icon="iconCapture" @click="onClickCapture">
            <input type="file" id="qr-input-file" accept="image/*">
          </q-btn>

        </div>
        <q-space />
        <div class="col-3 text-right">
          <q-btn flat round dense color="white" :icon="iconFlash" :disabled="torchNotSupported" @click="torchActive=!torchActive">
            <!-- <q-tooltip v-if="!$q.platform.is.mobile">{{cancelLabel}}</q-tooltip> -->
          </q-btn>
        </div>
        <q-space />
        <div class="col-2"></div>
      </div>

    </div>
    <div id="tm-html5qrcode" style="width: 100%; min-height: 100px; text-align: center; position: relative;"></div>
  </div>
</template>

<script>
import { defineComponent, ref, nextTick, onUpdated, onMounted, onBeforeUnmount } from 'vue'
import { Html5Qrcode, Html5QrcodeScanner, Html5QrcodeScannerState, Html5QrcodeSupportedFormats } from 'html5-qrcode'
export default defineComponent({
  name: 'tm-qr-code-reader',
  components: {},
  props: {
    title: { type: String, default: 'QR Code Scanner' },
    cancelLabel: { type: String, default: 'Cancel' },
    iconFlash: { type: String, default: 'flashlight_on' },
    iconCapture: { type: String, default: 'collections' },
    errorMsg: { type: Object, default: () => { } }
    // iconNormalScreen: { type: String, default: 'fullscreen_exit' },
    // iconFullscreen: { type: String, default: 'fullscreen' },
    // normalScreen: { type: String, default: 'NormalScreen' },
    // fullScreen: { type: String, default: 'FullScreen' }
  },
  emits: ['onInit', 'onDecode', 'onError'],
  setup (props, { emit }) {
    const isLoading = ref(false)
    const isDestroyed = ref(false)
    const result = ref(null)
    const error = ref(null)
    const torchActive = ref(true)
    const torchNotSupported = ref(false)
    const inputFile = ref(null)
    const html5QrCode = ref(null)
    const elementId = ref('tm-html5qrcode')
    const elementInputFile = ref(null)

    const onReset = () => {
      if (html5QrCode.value !== null) {
        html5QrCode.value.stop()
        html5QrCode.value = null
      }
    }
    const onInit = (elementId) => {
      onReset()
      // This method will trigger user permissions
      Html5Qrcode.getCameras().then(async (devices) => {
        /**
         * devices would be an array of objects of type:
         * { id: "id", label: "label" }
         */
        if (devices && devices.length) {
          var cameraId = devices.length > 1 ? devices[1].id : devices[0].id
          html5QrCode.value = new Html5Qrcode(elementId)
          // html5QrCode.value.applyVideoConstraints({ advanced: [{ torch: torchActive.value }] })
          const start = await html5QrCode.value.start(
            cameraId,
            {
              fps: 10,    // Optional, frame per seconds for qr code scanning
              qrbox: { width: 250, height: 250 }  // Optional, if you want bounded box UI
            },
            (decodedText, decodedResult) => {
              // do something when code is read
              emit('onDecode', decodedText)
              // alert(decodedText)
            },
            (e) => {
              // parse error, ignore it.
              // emit('onError', { key: 'e', name: 'NotLoad', value: e })
            })
            .catch((e) => {
              // Start failed, handle it.
              emit('onError', { key: 'qrError', name: 'Error', value: e })
              // console.log(e)
            })
          emit("onInit", html5QrCode.value)
        }
      }).catch((e) => {
        // handle err
        emit('onError', { key: 'qrError', name: 'Error', value: e })
        // console.log(e)
      })
    }

    const powerTorch = (powerOn) => {
      // if (html5QrCode.value.getState() === Html5QrcodeScannerState.SCANNING || html5QrCode.value.getState() === Html5QrcodeScannerState.PAUSED) {
      html5QrCode.value.applyVideoConstraints({ advanced: [{ torch: powerOn }] })
      // }
    }
    // onUpdated(() => {
    //   if (nextUpdate.value > 0) {
    //     nextUpdate.value = -1
    //     html5QrCode.value.stop()
    //     html5QrCode.value = null
    //   } else {
    //     onInit(elementId.value)
    //   }
    //   nextUpdate.value = nextUpdate.value + 1
    // })


    onMounted(() => {
      onInit(elementId.value)
      const html5QrCode = new Html5Qrcode('qr-input-file')
      elementInputFile.value = document.getElementById('qr-input-file')
      elementInputFile.value.addEventListener('change', e => {
        if (e.target.files.length == 0) {
          // No file selected, ignore
          return
        }

        // Use the first item in the list
        const imageFile = e.target.files[0]
        html5QrCode.scanFile(imageFile, /* showImage= */true)
          .then(decodedText => {
            // success, use decodedText
            // console.log(decodedText)
            // alert(decodedText)
            emit('onDecode', decodedText)
          })
          .catch(e => {
            // failure, handle it.
            emit('onError', { key: 'qrNotLoad', name: 'NotLoad', value: e })
            // console.log(e)
            // console.log(`Error scanning file. Reason: ${e}}`)
          })
      })
    })
    onBeforeUnmount(() => {
      onReset()
    })
    return {
      isLoading, isDestroyed, torchActive, torchNotSupported, inputFile,
      onClickCapture () {
        // inputFile.$el.click()
        elementInputFile.value.click()
      },
      onChangeCapture (val) {
        setTimeout(() => {
          if (!result.value) {
            error.value = 'ERROR: Can not decode this QR Code, Please try again!'
            emit('onError', { key: 'qrNotLoad', name: 'NotLoad', value: error.value })
          }
        }, 1000)
      }
    }
  }
})
</script>
<style lang="css" >
#html5-qr-reader .qr-reader-top {
  position: absolute;
  top: 15px;
  z-index: 1;
  width: 100%;
}
#html5-qr-reader .qr-reader-bottom {
  position: absolute;
  bottom: 25%;
  z-index: 1;
  width: 100%;
}
#html5-qr-reader input[type="file"] {
  display: none;
}
</style>
<style lang="css" scoped>
/* .qr-main { */
/* position: relative; */
/* } */

/* .btn-capture input[type="file"] {
  display: none;
}
.row-bottom {
  vertical-align: bottom;
  position: absolute;
  bottom: 6%;
  width: 100%;
}
.views-portrait {
  border-style: solid;
  border-width: 30vh 5vh;
  border-color: rgba(0, 0, 0, 0.48);
  position: absolute;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  margin: auto;
  inset: 0px;
  box-sizing: border-box;
}
.views-landscape {
  border-style: solid;
  border-width: 20vh 65vh;
  border-color: rgba(0, 0, 0, 0.48);
  position: absolute;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  margin: auto;
  inset: 0px;
  box-sizing: border-box;
} */
</style>
