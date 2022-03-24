<template>
  <q-toolbar class="text-primary q-pa-none">
    <q-toolbar-title>
      <slot name="headerLeft" v-if="slotHeaderLeft" />
      <span v-if="!slotHeaderLeft" class="text-subtitle1">{{title}}</span>
    </q-toolbar-title>
    <slot name="headerRight" v-if="slotHeaderRight" />
    <q-btn flat :label="lblAccept" :icon="iconAccept" :no-caps="noCapsAccept" @click="onAccept" />
  </q-toolbar>
  <div v-if="isLoading" class="relative-position">
    <q-linear-progress indeterminate class="absolute" />
  </div>
  <tm-fileList v-model="files" :multiple="multiple" :size="size" :lblConfirmTitle="lblConfirmTitle" v-model:selected="selected"
               :lblConfirmContent="lblConfirmContent" :lblOk="lblOk" :lblCancel="lblCancel" :loading="isLoading" />
</template>

<script>
import { defineComponent, defineAsyncComponent, ref, computed, onMounted } from "vue"
import axios from 'axios'
export default defineComponent({
  name: "TMFileManager",
  components: {
    tmFileList: defineAsyncComponent(() => import('@/components/tm-file-list'))
  },
  props: {
    accept: { type: String, default: '*' },
    url: { type: String, required: true },
    headers: { type: Array, default: () => [] },
    multiple: { type: Boolean, default: false },
    path: { type: String, default: null },
    title: { type: String, default: 'File Manager' },
    size: { type: Number, default: 100 },
    lblAccept: { type: String, default: 'Accept' },
    iconAccept: { type: String, default: 'file_download_done' },
    noCapsAccept: { type: Boolean, default: true },
    lblOk: { type: String, default: 'Ok' },
    lblCancel: { type: String, default: 'Cancel' },
    lblConfirmTitle: { type: String, default: 'Confirm' },
    lblConfirmContent: { type: String, default: 'Are you sure you want to delete this record?' }
  },
  emits: ['onAccept'],
  setup (props, { emit, slots }) {
    const isLoading = ref(false)
    // Slots
    const slotHeaderLeft = computed(() => !!slots['headerLeft'])
    const slotHeaderRight = computed(() => !!slots['headerRight'])
    const files = ref([])
    const selected = ref(null)
    const onLoadFile = () => {
      isLoading.value = true
      const params = { path: props.path } // { path: 'products' } // { file: 'products/IMG_20220221_093228.jpg' }
      const headers = { 'Content-Type': 'multipart/form-data' }
      props.headers.forEach(e => { headers[e.name] = e.value })
      axios.get(props.url, { params, headers }).then(x => {
        files.value = x.data
        // console.log(files.value)
      }).catch(e => {
        // console.log(e)
      }).finally(() => {
        isLoading.value = false
      })
    }
    onMounted(() => {
      onLoadFile()
    })
    return {
      isLoading, files, slotHeaderLeft, slotHeaderRight, selected,
      onAccept () {
        // console.log(selected.value)
        emit('onAccept', selected.value)
      }
    }
  }
})
</script>
