<template>
  <q-btn flat round dense :color="btnColor" :icon="btnIcon" @click="isDialog=!isDialog">
    <q-tooltip v-if="!$q.platform.is.mobile">{{title}}</q-tooltip>
  </q-btn>
  <!-- QR Code Scanner dialog -->
  <q-dialog v-model="isDialog" :maximized="maximized">
    <!-- <q-card flat :style="{minWidth:'50%'}"> -->
    <!-- <q-toolbar> -->
    <!-- <q-avatar icon="qr_code_scanner" size="50px" /> -->
    <!-- <q-toolbar-title>{{title}}</q-toolbar-title> -->
    <!-- <q-btn flat round dense :color="$store.state.app.darkMode?'':'grey-7'" :icon="maximized?iconNormalScreen:iconFullscreen"
               :disable="isLoading" @click="onUpdateMaximized">
          <q-tooltip v-if="!$q.platform.is.mobile">{{maximized?normalScreen:fullScreen}}</q-tooltip>
        </q-btn> -->
    <!-- <q-btn flat round dense icon="close" v-close-popup>
          <q-tooltip v-if="!$q.platform.is.mobile">{{cancelLabel}}</q-tooltip>
        </q-btn> -->
    <!-- </q-toolbar> -->
    <!-- <q-separator /> -->
    <!-- <q-card-section class="text-center"> -->
    <qrcode-stream v-if="!isDestroyed" @decode="onDecode" @init="onInit" :track="selectedTrack.value" :torch="torchActive">
      <div class="element"></div>
      <div class="orientation-portrait views-portrait">
      </div>
      <div class=" orientation-landscape views-landscape">
      </div>
      <div class="row">
        <div class="col-1 q-ml-sm q-mt-sm">
          <q-btn flat round dense :color="$store.state.app.darkMode?'':'white'" icon="arrow_back" v-close-popup>
            <q-tooltip v-if="!$q.platform.is.mobile">{{cancelLabel}}</q-tooltip>
          </q-btn>
        </div>
        <q-space />
        <div class="col-3 q-mt-sm text-center text-weight-bold text-blue">
          {{title}}
        </div>
        <q-space />
        <div class="col-1 q-mr-sm q-mt-sm">
        </div>
      </div>
      <div class="row row-bottom">
        <div class="col-3" />
        <q-space />
        <div class="col-1">
          <q-btn flat round dense class="btn-capture" :color="$store.state.app.darkMode?'':'white'" :icon="iconCapture"
                 @click="inputFile.$el.click()">
            <!-- <qrcode-capture ref="inputFile" capture @decode="onDecode" class="file-capture" @detect="onDetect" /> -->
          </q-btn>
        </div>
        <q-space />
        <div class="col-1">
          <q-btn flat round dense :color="$store.state.app.darkMode?'':'white'" :icon="iconFlash" :disabled="torchNotSupported"
                 @click="torchActive=!torchActive">
            <!-- <q-tooltip v-if="!$q.platform.is.mobile">{{cancelLabel}}</q-tooltip> -->
          </q-btn>
        </div>
        <q-space />
        <div class="col-3" />
      </div>
    </qrcode-stream>
    <!-- </q-card-section> -->
    <!-- </q-card> -->
  </q-dialog>
</template>

<script>
import { defineComponent, defineAsyncComponent, ref, nextTick } from 'vue'
export default defineComponent({
  name: 'tm-qr-code-reader',
  components: {
    QrcodeStream: defineAsyncComponent(() => import('./QrcodeStream'))
  },
  props: {
    // modelValue: { type: String, default: null },
    maximized: { type: Boolean, default: true },
    title: { type: String, default: 'QR Code Scanner' },
    cancelLabel: { type: String, default: 'Cancel' },
    btnIcon: { type: String, default: 'qr_code_scanner' },
    btnColor: { type: String, default: 'blue' },
    iconFlash: { type: String, default: 'flashlight_on' },
    iconCapture: { type: String, default: 'collections' },
    errorMsg: { type: Object, default: () => { } }
    // iconNormalScreen: { type: String, default: 'fullscreen_exit' },
    // iconFullscreen: { type: String, default: 'fullscreen' },
    // normalScreen: { type: String, default: 'NormalScreen' },
    // fullScreen: { type: String, default: 'FullScreen' }
  },
  emits: ['onDecode', 'onError'],
  setup (props, { emit }) {
    const isDialog = ref(false)
    const isLoading = ref(false)
    const isDestroyed = ref(false)
    const result = ref(null)
    const error = ref({
      load: 'ERROR: Can not decode this QR Code, Please try again!',
      NotAllowedError: 'ERROR: you need to grant camera access permission',
      NotFoundError: 'ERROR: no camera on this device',
      NotSupportedError: 'ERROR: secure context required (HTTPS, localhost)',
      NotReadableError: 'ERROR: is the camera already in use?',
      OverconstrainedError: 'ERROR: installed cameras are not suitable',
      StreamApiNotSupportedError: 'ERROR: Stream API is not supported in this browser',
      InsecureContextError: 'ERROR: Camera access is only permitted in secure context. Use HTTPS or localhost rather than HTTP.',
      SomeError: 'ERROR: Camera error',
      color: 'negative'
    })
    const torchActive = ref(false)
    const torchNotSupported = ref(false)
    const inputFile = ref(null)
    //Tracking
    const trackPaintOutline = (detectedCodes, ctx) => {
      // detectedCodes
      // bottomLeftCorner
      // bottomLeftFinderPattern
      // bottomRightAlignmentPattern
      // bottomRightCorner
      // topLeftCorner
      // topLeftFinderPattern
      // topRightCorner
      // topRightFinderPattern
      const points = []
      for (const k in detectedCodes) {
        switch (k) {
          case 'topLeftCorner':
            points[0] = detectedCodes[k]
            break;
          case 'topRightCorner':
            points[1] = detectedCodes[k]
            break;
          case 'bottomRightCorner':
            points[2] = detectedCodes[k]
            break;
          case 'bottomLeftCorner':
            points[3] = detectedCodes[k]
            break;
          default:
            break;
        }
      }
      ctx.strokeStyle = "green"
      ctx.beginPath()
      ctx.moveTo(points[0].x, points[0].y)
      for (const { x, y } of points) {
        ctx.lineTo(x, y)
      }
      ctx.lineTo(points[0].x, points[0].y)
      ctx.closePath()
      ctx.stroke()

      // for (const detectedCode of detectedCodes) {
      //   const [ firstPoint, ...otherPoints ] = detectedCode.cornerPoints

      //   ctx.strokeStyle = "red";

      //   ctx.beginPath();
      //   ctx.moveTo(firstPoint.x, firstPoint.y);
      //   for (const { x, y } of otherPoints) {
      //     ctx.lineTo(x, y);
      //   }
      //   ctx.lineTo(firstPoint.x, firstPoint.y);
      //   ctx.closePath();
      //   ctx.stroke();
      // }
    }

    const trackPaintBoundingBox = (detectedCodes, ctx) => {
      for (const detectedCode of detectedCodes) {
        const { boundingBox: { x, y, width, height } } = detectedCode

        ctx.lineWidth = 2
        ctx.strokeStyle = '#007bff'
        ctx.strokeRect(x, y, width, height)
      }
    }

    const trackPaintCenterText = (detectedCodes, ctx) => {
      for (const detectedCode of detectedCodes) {
        const { boundingBox, rawValue } = detectedCode

        const centerX = boundingBox.x + boundingBox.width / 2
        const centerY = boundingBox.y + boundingBox.height / 2

        const fontSize = Math.max(12, 50 * boundingBox.width / ctx.canvas.width)
        // console.log(boundingBox.width, ctx.canvas.width)

        ctx.font = `bold ${fontSize}px sans-serif`
        ctx.textAlign = "center"

        ctx.lineWidth = 3
        ctx.strokeStyle = '#35495e'
        ctx.strokeText(detectedCode.rawValue, centerX, centerY)

        ctx.fillStyle = '#5cb984'
        ctx.fillText(rawValue, centerX, centerY)
      }
    }
    const optionstTrack = [
      { text: "nothing (default)", value: undefined },
      { text: "outline", value: trackPaintOutline },
      { text: "centered text", value: trackPaintCenterText },
      { text: "bounding box", value: trackPaintBoundingBox }
    ]
    const selectedTrack = optionstTrack[1]

    return {
      isDialog, isLoading, isDestroyed, torchActive, torchNotSupported, optionstTrack, selectedTrack, inputFile,
      onUpdateMaximized () {
        emit('update:maximized', !props.maximized)
      },
      onDecode (val) {
        // isDialog.value = false
        result.value = val
        emit('onDecode', val)
        alert(val)
      },
      onChangeCapture (val) {
        setTimeout(() => {
          if (!result.value) {
            error.value = 'ERROR: Can not decode this QR Code, Please try again!'
            emit('onError', { key: 'qrNotLoad', name: 'NotLoad', value: error.value })
          }
        }, 1000)
      },
      async reload () {
        isDestroyed.value = true
        await nextTick()
        isDestroyed.value = false
      },
      async onInit (promise) {
        try {
          isLoading.value = true
          const { capabilities } = await promise
          torchNotSupported.value = !capabilities.torch
          // Remove Attribute capture
          inputFile.value.$el.removeAttribute('capture')
        } catch (e) {
          if (e.name === 'NotAllowedError') {
            error.value = "ERROR: you need to grant camera access permission"
            emit('onError', { key: 'qrNotAllowedError', name: 'NotAllowedError', value: error.value })
          } else if (e.name === 'NotFoundError') {
            error.value = "ERROR: no camera on this device"
            emit('onError', { key: 'qrNotFoundError', name: 'NotFoundError', value: error.value })
          } else if (e.name === 'NotSupportedError') {
            error.value = "ERROR: secure context required (HTTPS, localhost)"
            emit('onError', { key: 'qrNotSupportedError', name: 'NotSupportedError', value: error.value })
          } else if (e.name === 'NotReadableError') {
            error.value = "ERROR: is the camera already in use?"
            emit('onError', { key: 'qrNotReadableError', name: 'NotReadableError', value: error.value })
          } else if (e.name === 'OverconstrainedError') {
            error.value = "ERROR: installed cameras are not suitable"
            emit('onError', { key: 'qrOverconstrainedError', name: 'OverconstrainedError', value: error.value })
          } else if (e.name === 'StreamApiNotSupportedError') {
            error.value = "ERROR: Stream API is not supported in this browser"
            emit('onError', { key: 'qrStreamApiNotSupportedError', name: 'StreamApiNotSupportedError', value: error.value })
          } else if (e.name === 'InsecureContextError') {
            error.value = 'ERROR: Camera access is only permitted in secure context. Use HTTPS or localhost rather than HTTP.'
            emit('onError', { key: 'qrInsecureContextError', name: 'InsecureContextError', value: error.value })
          } else {
            error.value = `ERROR: Camera error (${e.name})`
            emit('onError', { key: 'qrError', name: e.name, value: error.value })
          }
        } finally {
          isLoading.value = false
        }
      },
      async onDetect (promise) {
        try {
          const {
            imageData,    // raw image data of image/frame
            content,      // decoded String or null
            location      // QR code coordinates or null
          } = await promise
          if (content === null) {
            error.value = 'ERROR: Can not decode this QR Code, Please try again!'
            emit('onError', { key: 'qrNotLoad', name: 'NotLoad', value: error.value })
          } else {
          }
        } catch (error) {
        }
      }
    }
  }
})
</script>

<style lang="scss" scoped>
.btn-capture input[type="file"] {
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
  /* height: 200px */
  /* width: 200px */
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
  /* height: 200px */
  /* width: 200px */
  position: absolute;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  margin: auto;
  inset: 0px;
  box-sizing: border-box;
}
// .element {
// position: absolute
// top: 0
// width: 100%
// height: 100%
// background: rgba(120, 120, 120, 0.8)
// opacity: 0.5
// -webkit-clip-path: polygon(
//   0% 0%,
//   0% 100%,
//   25% 100%,
//   25% 25%,
//   75% 25%,
//   75% 75%,
//   25% 75%,
//   25% 100%,
//   100% 100%,
//   100% 0%
// )
// clip-path: polygon(
//   0% 0%,
//   0% 100%,
//   25% 100%,
//   25% 25%,
//   75% 25%,
//   75% 75%,
//   25% 75%,
//   25% 100%,
//   100% 100%,
//   100% 0%
// )
// }
</style>
