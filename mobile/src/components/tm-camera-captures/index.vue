<template>
  <div class="tm-camera-captures">
    <div class="tm-camera-captures_header">
      <slot v-if="slotHeader" name="header" />
    </div>
    <div class="tm-camera-captures__content" ref="tmCameraCaptures"></div>
    <div class="tm-camera-captures_footer">
      <slot v-if="slotFooter" name="footer" />
      <div v-else class="text-center">
        <q-btn v-if="!isPhotoTaken" flat round icon="photo_camera" color="blue" class="q-mr-lg" @click="onTakePhoto" />
        <q-btn v-if="!isPhotoTaken" flat round icon="cameraswitch" color="blue" @click="onCameraSwitch" />
        <q-btn v-if="isPhotoTaken" class="q-btn--square q-mr-lg" color="blue" no-caps :label="lblBtnUse" @click="onAccept" />
        <q-btn v-if="isPhotoTaken" class="q-btn--square" color="blue-grey" no-caps :label="lblBtnAgain" @click="onInit" />
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref, watch, computed, onMounted, onBeforeUnmount } from "vue"
import Camera from "../../../../global/utils/camera"
export default defineComponent({
  name: 'TMCameraCaptures',
  props: {
    // modelValue: { type: String, default: null },
    camera: {
      type: String,
      default: "auto",
      validator (camera) {
        return ["auto", "rear", "front", "off"].includes(camera)
      }
    },
    torch: { type: Boolean, default: false },
    lblBtnUse: { type: String, default: 'Accept' },
    lblBtnAgain: { type: String, default: 'Take again' },
  },
  setup (props, { emit, slots }) {
    const tmCameraCaptures = ref(null)
    const isCameraOpen = ref(false)
    const isPhotoTaken = ref(false)
    const isLoading = ref(false)
    const cameraInstance = ref(null)
    const canvas = ref(null)
    const destroyed = ref(false)
    const slotFooter = computed(() => !!slots['footer'])
    const slotHeader = computed(() => !!slots['header'])
    const beforeResetCamera = () => {
      isPhotoTaken.value = false
      canvas.value = ref(null)
      tmCameraCaptures.value.innerHTML = ''
      if (cameraInstance.value !== null) {
        cameraInstance.value.stop()
        cameraInstance.value = null
      }
    }
    const beforeDestroy = () => {
      beforeResetCamera()
      destroyed.value = true
    }
    const onInit = () => {
      isLoading.value = true
      const promise = (async () => {
        beforeResetCamera()
        if (props.camera === "off") {
          cameraInstance.value = null
          return { capabilities: {} }
        } else {
          const video = document.createElement('video')
          video.autoplay = true
          tmCameraCaptures.value.appendChild(video)
          cameraInstance.value = await Camera(video, {
            camera: props.camera,
            torch: props.torch
          })
          const capabilities = cameraInstance.value.getCapabilities()
          // if the component is destroyed before `cameraInstance` resolves a
          // `beforeDestroy` hook has no chance to clear the remaining camera
          // stream.
          if (destroyed.value) {
            cameraInstance.value.stop()
          }
          isLoading.value = false
          return capabilities
        }
      })()
      emit("init", promise)
    }
    watch(() => props.camera, (state, prevState) => {
      onInit()
    }) //{ deep: true, immediate: true }
    watch(() => props.torch, (state, prevState) => {
      onInit()
    })
    onMounted(() => {
      onInit()
    })
    onBeforeUnmount(() => {
      beforeResetCamera()
    })
    const drawImageProp = (ctx, img, x, y, w, h, offsetX, offsetY) => {
      if (arguments.length === 2) {
        x = y = 0;
        w = ctx.canvas.width;
        h = ctx.canvas.height;
      }

      // default offset is center
      offsetX = typeof offsetX === "number" ? offsetX : 0.5;
      offsetY = typeof offsetY === "number" ? offsetY : 0.5;

      // keep bounds [0.0, 1.0]
      if (offsetX < 0) offsetX = 0;
      if (offsetY < 0) offsetY = 0;
      if (offsetX > 1) offsetX = 1;
      if (offsetY > 1) offsetY = 1;

      var iw = img.width,
        ih = img.height,
        r = Math.min(w / iw, h / ih),
        nw = iw * r,   // new prop. width
        nh = ih * r,   // new prop. height
        cx, cy, cw, ch, ar = 1;

      // decide which gap to fill
      if (nw < w) ar = w / nw;
      if (Math.abs(ar - 1) < 1e-14 && nh < h) ar = h / nh;  // updated
      nw *= ar;
      nh *= ar;

      // calc source rectangle
      cw = iw / (nw / w);
      ch = ih / (nh / h);

      cx = (iw - cw) * offsetX;
      cy = (ih - ch) * offsetY;

      // make sure source rectangle is valid
      if (cx < 0) cx = 0;
      if (cy < 0) cy = 0;
      if (cw > iw) cw = iw;
      if (ch > ih) ch = ih;

      // fill image in dest. rectangle
      ctx.drawImage(img, cx, cy, cw, ch, x, y, w, h);
    }
    return {
      tmCameraCaptures, isCameraOpen, isPhotoTaken, isLoading, slotFooter, slotHeader, onInit,
      onCameraSwitch () {
        switch (props.camera) {
          case 'front':
            emit('update:camera', 'rear')
            break
          case 'rear':
            emit('update:camera', 'front')
            break
        }
      },
      onTakePhoto () {
        if (!cameraInstance.value) return
        const _canvas = document.createElement('canvas')
        const context = _canvas.getContext('2d')
        const width = cameraInstance.value.videoEl.offsetWidth
        const height = cameraInstance.value.videoEl.offsetHeight
        _canvas.width = width
        _canvas.height = height
        context.drawImage(cameraInstance.value.videoEl, 0, 0, width, height)
        beforeResetCamera()
        canvas.value = _canvas
        tmCameraCaptures.value.appendChild(_canvas)
        isPhotoTaken.value = true
      },
      onAccept () {
        // const canvas = canvas.value.toDataURL("image/jpeg").replace("image/jpeg", "image/octet-stream")
        // download.setAttribute("href", canvas)
        const image = canvas.value.toDataURL("image/jpeg")
        emit('on-accept', image)
      },
    }
  }
})
</script>
<style lang="scss">
.tm-camera-captures {
  height: 100%;
  width: 100%;
  position: relative;
  .tm-camera-captures__content {
    width: 100%;
    // height: calc(100vh - 50px);
    height: 100%;
    video {
      width: 100%;
      height: 100%;
      display: block;
      -o-object-fit: cover;
      object-fit: cover;
    }
  }
  .tm-camera-captures_header {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    z-index: 1;
  }
  .tm-camera-captures_footer {
    position: absolute;
    left: 0;
    bottom: 50px;
    width: 100%;
    z-index: 1;
  }
}
</style>
