<template>
  <!-- <q-linear-progress :value="progress" :buffer="progress" /> -->
  <div class="tm-file-upload">
    <div class="tm-file-upload__header">
      <q-toolbar class="text-primary q-pa-none">
        <q-toolbar-title>
          <slot name="headerLeft" v-if="slotHeaderLeft" />
          <span v-if="!slotHeaderLeft" class="text-subtitle1">{{title}}</span>
        </q-toolbar-title>
        <slot name="headerRight" v-if="slotHeaderRight" />
        <div v-if="useButton&&!slotHeaderRight" class="tm-uploader">
          <div class="tm-uploader__wrapper">
            <div class="tm-uploader__input-wrapper">
              <q-btn flat :label="txtBtnOpen" :icon="iconOpen" :no-caps="noCaps" :disable="isLoading" />
              <input v-if="!isLoading&&isReload" :disable="isLoading" type="file" :name="fileName" :accept="accept" :multiple="multiple"
                     @change="onChange">
            </div>
          </div>
        </div>
        <div v-if="files.length" class="tm-uploader">
          <div class="tm-uploader__wrapper">
            <div class="tm-uploader__input-wrapper">
              <q-btn flat :label="txtBtnUpload" :icon="iconUpload" :no-caps="noCaps" :loading="isLoading" @click="onUpload" />
            </div>
          </div>
        </div>
      </q-toolbar>
      <q-linear-progress v-if="isLoading" :value="progress" :buffer="progress" />
    </div>
    <!-- <q-linear-progress v-show="isLoading" size="25px" :value="progress"> -->
    <!-- </q-linear-progress> -->
    <div class="tm-file-upload__content">
      <div v-if="!useButton" class="tm-uploader">
        <div class="tm-uploader__wrapper">
          <div class="tm-uploader__upload">
            <q-icon name="photo" />
            <input v-if="!isLoading&&isReload" :disable="isLoading" type="file" :name="fileName" :accept="accept" :multiple="multiple"
                   @change="onChange">
          </div>
        </div>
      </div>
      <tm-fileList v-model="files" :multiple="multiple" :isHeader="false" :size="size" :lblConfirmTitle="lblConfirmTitle"
                   :lblConfirmContent="lblConfirmContent" :lblOk="lblOk" :lblCancel="lblCancel" />
      <!-- <div id="upload-images" class="upload-images" /> -->
    </div>
  </div>
</template>

<script>
import { defineComponent, defineAsyncComponent, ref, computed, onBeforeUnmount } from "vue"
import axios from 'axios'
import { getBase64InputFile } from '../../../../global/utils/file-upload'
export default defineComponent({
  name: "TMUpload",
  components: {
    tmFileList: defineAsyncComponent(() => import('@/components/tm-file-list'))
  },
  props: {
    multiple: { type: Boolean, default: false },
    maxFileSize: { type: Number, default: 1024 * 1024 * 2 }, // 2MB
    accept: { type: String, default: '*' },
    uploadUrl: { type: String, required: true },
    headers: { type: Array, default: () => [] },
    iconOpen: { type: String, default: 'pageview' },
    iconUpload: { type: String, default: 'cloud_upload' },
    useButton: { type: Boolean, default: true },
    title: { type: String, default: null },
    txtContent: { type: String, default: 'Drag your file(s) here to begin<br> or click to browse' },
    txtBtnOpen: { type: String, default: null },
    txtBtnUpload: { type: String, default: null },
    size: { type: Number, default: 100 },
    fileName: { type: String, default: 'file' },
    // imageWidth: { type: String, default: '100px' },
    // imageHeight: { type: String, default: '100px' },
    noCaps: { type: Boolean, default: false },
    lblOk: { type: String, default: 'Ok' },
    lblCancel: { type: String, default: 'Cancel' },
    lblConfirmTitle: { type: String, default: 'Confirm' },
    lblConfirmContent: { type: String, default: 'Are you sure you want to delete this record?' }
  },
  setup (props, { emit, slots }) {
    const isDialog = ref(false)
    const isReload = ref(true)
    const isLoading = ref(false)
    // Slots
    const slotHeaderLeft = computed(() => !!slots['headerLeft'])
    const slotHeaderRight = computed(() => !!slots['headerRight'])
    // TMFileList
    const files = ref([])
    const formDatas = ref([])
    const progress = ref(0.0)

    const onReload = () => {
      isReload.value = false
      setTimeout(() => { isReload.value = true }, 300)
      // nextTick(() => { isReload.value = true })
    }
    const onReset = () => {
      isLoading.value = false
      files.value = []
      formDatas.value = []
      progress.value = 0.0
      emit('on-reset')
    }

    const progressValue = computed(() => {
      return (progress.value * 100).toFixed(0) + '%'
    })
    const calProgress = (val, total) => {
      return Math.min(1, val / total) // val / total // val * 100 / total
    }
    onBeforeUnmount(() => { onReset() })
    return {
      isDialog, isReload, isLoading, files, slotHeaderLeft, slotHeaderRight, progress, progressValue,
      async onChange (event) {
        for (let i = 0; i < event.target.files.length; i++) {
          if (props.multiple) {
            const index = files.value.findIndex(x => x.name === event.target.files[i].name)
            if (index < 0) {
              files.value.push({
                name: event.target.files[i].name,
                url: await getBase64InputFile(event.target.files[i]),
                type: event.target.files[i].type,
                size: event.target.files[i].size,
                lastModified: event.target.files[i].lastModified,
                lastModifiedDate: event.target.files[i].lastModifiedDate,
                webkitRelativePath: event.target.files[i].webkitRelativePath
              })
              const formData = new FormData()
              formData.append(props.fileName, event.target.files[i])
              formDatas.value.push(formData)
            }
          } else {
            onReset()
            files.value.push({
              name: event.target.files[i].name,
              url: await getBase64InputFile(event.target.files[i]),
              type: event.target.files[i].type,
              size: event.target.files[i].size,
              lastModified: event.target.files[i].lastModified,
              lastModifiedDate: event.target.files[i].lastModifiedDate,
              webkitRelativePath: event.target.files[i].webkitRelativePath
            })
            const formData = new FormData()
            formData.append(props.fileName, event.target.files[i])
            formDatas.value.push(formData)
          }
        }
        onReload()
        emit('on-change', event.target.files)
      },
      //       onChange (event) {
      //   isLoading.value = true
      //   for (let i = 0; i < event.target.files.length; i++) {
      //     getFileImage(event.target.files[i], true).then(imgEl => {
      //       const imageEl = document.getElementById('upload-images')
      //       //
      //       const divImgEl = document.createElement('div')
      //       divImgEl.classList.add('tm-img')
      //       divImgEl.style.width = props.imageWidth
      //       divImgEl.style.height = props.imageHeight
      //       //
      //       const divImgContentEl = document.createElement('div')
      //       divImgContentEl.classList.add('tm-img__content')
      //       //
      //       imgEl.classList.add('tm-img__image')
      //       //
      //       divImgContentEl.appendChild(imgEl)
      //       divImgEl.appendChild(divImgContentEl)
      //       imageEl.prepend(divImgEl)
      //     })
      //     isLoading.value = false
      //   }
      //   stateUpload.value = 2
      // },
      async onUpload () {
        onReload()
        isLoading.value = true
        const headers = { 'Content-Type': 'multipart/form-data' }
        props.headers.forEach(e => { headers[e.name] = e.value })
        let i = 0
        const rs = []
        emit('on-uploading')
        for await (const e of formDatas.value) {
          i = i + 1
          await axios.post(props.uploadUrl, e, { headers }).then(x => {
            rs.push(x.data)
          }).catch(e => {
            // console.log(e)
          }).finally(() => {
            progress.value = calProgress(i, formDatas.value.length)
          })
        }
        onReset()
        emit('on-finish', props.multiple ? rs : (rs && rs.length ? rs[0] : null))
      }
    }
  }
})
</script>
<style lang="scss">
.tm-file-upload {
  height: 100%;
  overflow: hidden;
  .tm-file-upload__header {
    position: relative;
    .q-linear-progress {
      position: absolute;
      bottom: 2px;
      left: -2px;
    }
  }
  .tm-file-upload__content {
    height: 100%;
  }
  .tm-uploader {
    position: relative;
    display: inline-block;
    .tm-uploader__wrapper {
      display: flex;
      flex-wrap: wrap;
      .tm-uploader__input-wrapper {
        position: relative;
        [type="file"] {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          overflow: hidden;
          cursor: pointer;
          opacity: 0;
        }
      }
      .tm-uploader__upload {
        position: relative;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        box-sizing: border-box;
        width: 80px;
        height: 80px;
        margin-left: 20px;
        background: #f7f8fa;
        border: 1px dashed #eee;
        i {
          font-size: 35px;
          color: #dcdee0;
        }
        [type="file"] {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          overflow: hidden;
          cursor: pointer;
          opacity: 0;
        }
      }
    }
  }
}
</style>
