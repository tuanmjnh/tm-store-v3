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
  <!-- <q-infinite-scroll ref="refScrollTarget" @load="onScrollLoad" :offset="1000"> -->
  <tm-fileList ref="refTMFileList" v-model="files" :multiple="multiple" :size="size" :lblConfirmTitle="lblConfirmTitle" v-model:selected="selected"
               :isDelete="false" v-model:viewType="viewType" :lblConfirmContent="lblConfirmContent" :lblOk="lblOk" :lblCancel="lblCancel"
               :minHeight="minHeight" :maxHeight="maxHeight" :loading="isLoading" @on-select="onSelect">
    <template v-slot:tool-bar>
      <q-toolbar-title>
        <q-btn round dense flat icon="menu" @click="drawer=!drawer" />
      </q-toolbar-title>
      <q-btn dense flat icon="view_module" :color="viewType!=='list'?'indigo':'blue-grey'"
             @click="$refs.refTMFileList.onChangeView('box')">
        <q-tooltip v-if="!$q.platform.is.mobile">{{labelViewBox}}</q-tooltip>
      </q-btn>
      <q-btn dense flat icon="view_list" :color="viewType==='list'?'indigo':'blue-grey'"
             @click="$refs.refTMFileList.onChangeView('list')">
        <q-tooltip v-if="!$q.platform.is.mobile">{{labelViewList}}</q-tooltip>
      </q-btn>
    </template>
    <template v-slot:panel-left>
      <q-drawer v-model="drawer" show-if-above>
        <q-scroll-area class="fit">
          <!-- <q-list separator>
              <q-item v-for="(e,i) in folders" :key="i" clickable v-ripple @click="onOpenFolder(e)">
                <q-item-section>{{e.name}}</q-item-section>
              </q-item>
            </q-list> -->
          <q-tree :nodes="folders" v-model:selected="selectedFolder" default-expand-all node-key="id" label-key="name">
            <template v-slot:default-header="prop">
              <div :class="`row items-center ${currentFolder===prop.node.id?'text-blue':''}`" @click="onOpenFolder(prop.node)">
                <div>{{prop.node.name}}</div>
              </div>
            </template>
          </q-tree>
        </q-scroll-area>
      </q-drawer>
    </template>
  </tm-fileList>
  <!-- <template v-slot:loading>
      <div class="row justify-center q-my-md">
        <q-spinner-dots color="primary" size="40px" />
      </div>
    </template>
  </q-infinite-scroll> -->
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
    mimeType: { type: String, default: null },
    url: { type: String, required: true },
    headers: { type: Array, default: () => [] },
    multiple: { type: Boolean, default: false },
    // path: { type: String, default: null },
    title: { type: String, default: 'File Manager' },
    size: { type: Number, default: 100 },
    minHeight: { type: String, default: '200px' },
    maxHeight: { type: String, default: '200px' },
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
    const folders = ref([])
    const selected = ref(null)
    const refTMFileList = ref(null)
    const refScrollTarget = ref(null)
    const viewType = ref('box')
    const drawer = ref(false)
    const selectedFolder = ref(null)
    const currentFolder = ref(null)
    const pagination = ref(1)
    const findNode = (nodes, nodeId, nodeKey = 'id') => {
      try {
        for (const e of nodes) {
          if (!nodeId) {
            if (e[nodeKey] === nodeId) return e
          } else {
            if (e[nodeKey] === nodeId) return e
          }
          if (e.children && e.children.length) {
            const child = findNode(e.children, nodeId, nodeKey)
            if (child) return child
          }
        }
      } catch (e) {
        return null
      }
    }
    const onLoadFile = (folderId, scroll) => {
      isLoading.value = true
      // const params = { path: props.path } // { path: 'products' } // { file: 'products/IMG_20220221_093228.jpg' }
      const headers = {
        'Content-Type': 'multipart/form-data',
        'Accept-Type': props.accept,
        'mime-type': props.mimeType
      }
      if (folderId) headers['folder-id'] = folderId
      props.headers.forEach(e => { headers[e.name] = e.value })
      return axios.get(props.url, { headers }).then(x => {
        if (folderId) {
          const node = findNode(folders.value, folderId, 'id')
          node.children = x.data.folders
        } else {
          folders.value = x.data.folders
          if (folders.value.length) currentFolder.value = folders.value[0].id
        }
        files.value = x.data.files
        if (scroll) pagination.value = page
        else {
          if (refScrollTarget.value) {
            document.getElementById('scroll-items').scroll(0, 0)
            refScrollTarget.value.reset()
          }
          pagination.value = 1
        }
        // console.log(files.value)
        // console.log(currentFolder.value)
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
      isLoading, folders, files, slotHeaderLeft, slotHeaderRight, selected, refTMFileList, refScrollTarget, viewType, drawer, currentFolder, selectedFolder,
      onAccept () {
        emit('onAccept', props.multiple ? selected.value : (selected.value && selected.value.length ? selected.value[0] : null))
      },
      onSelect (val) {
        if (val.type === 'folder') {
          console.log(val)
        }
      },
      onOpenFolder (val) {
        if (val.id === currentFolder.value) {
        } else {
          currentFolder.value = val.id
          onLoadFile(currentFolder.value.id)
        }
      },
      onScrollLoad (index, done) {
        if (currentFolder.value) {
          pagination.value = index + 1
          onLoadFile(currentFolder.value.id, true).then(done())
        } else {
          done()
        }
        console.log(index)
      }
    }
  }
})
</script>
