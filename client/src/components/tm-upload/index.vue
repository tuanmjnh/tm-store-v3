<template>
  <div>
    <tm-file-list :data="data" :view-type="viewType" :size="121" :labelTitle="labelTitle"
                  :labelViewList="labelViewList" :labelViewBox="labelViewBox" :labelFileName="labelFileName"
                  :labelFileSize="labelFileSize" :labelConfirmTitle="labelConfirmTitle"
                  :labelConfirmContent="labelConfirmContent">
      <template v-slot:tool-bar>
        <q-btn round dense flat icon="cloud_upload" color="primary"
               @click="dialogUpload=!dialogUpload">
          <q-tooltip v-if="!$q.platform.is.mobile">{{labelOpenFile}}</q-tooltip>
        </q-btn>
        <q-btn round dense flat icon="pageview" color="secondary" @click="isDialogFiles=!isDialogFiles">
          <q-tooltip v-if="!$q.platform.is.mobile">{{labelOpenData}}</q-tooltip>
        </q-btn>
        <span class="q-pl-sm q-pr-sm">|</span>
        <q-btn dense flat icon="view_module" :color="viewType!=='list'?'indigo':'blue-grey'"
               @click="onChangeView('box')">
          <q-tooltip v-if="!$q.platform.is.mobile">{{labelViewBox}}</q-tooltip>
        </q-btn>
        <q-btn dense flat icon="view_list" :color="viewType==='list'?'indigo':'blue-grey'"
               @click="onChangeView('list')">
          <q-tooltip v-if="!$q.platform.is.mobile">{{labelViewList}}</q-tooltip>
        </q-btn>
      </template>
    </tm-file-list>
    <!-- Dialog Files -->
    <q-dialog v-model="isDialogFiles" persistent>
      <q-card style="width:672px;max-width:80vw;">
        <q-toolbar>
          <q-toolbar-title>{{labelTitleFiles}}</q-toolbar-title>
          <q-btn flat round dense icon="close" v-close-popup>
            <q-tooltip>{{labelCancel}}</q-tooltip>
          </q-btn>
        </q-toolbar>
        <q-separator />
        <q-card-section class="q-pa-sm">
          <tm-files v-model:selected="selected" v-model:view-type="viewTypeFiles" :accept="accept" :multiple="multiple" :url="uploadUrl"
                    :headers="headers" :labelViewList="labelViewList" :labelViewBox="labelViewBox" :iconAccept="iconAccept" :labelAccept="labelAccept"
                    :labelFileName="labelFileName" :labelFileSize="labelFileSize" @on-finish="onFinishBrowse" />
        </q-card-section>
      </q-card>
    </q-dialog>
    <!-- Dialog Upload-->
    <q-dialog v-model="dialogUpload">
      <q-card style="width:500px;max-width:80vw;">
        <q-toolbar>
          <q-toolbar-title>{{labelTitleUpload}}</q-toolbar-title>
          <q-btn flat round dense icon="close" v-close-popup>
            <q-tooltip>{{labelCancel}}</q-tooltip>
          </q-btn>
        </q-toolbar>
        <q-separator />
        <q-card-section>
          <q-uploader ref="upload" square flat :multiple="multiple" :max-file-size="maxFileSize" :accept="accept" style="width:100%" :url="uploadUrl"
                      :headers="headers" @uploaded="onFinishUpload" @finish="dialogUpload=false" />
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import { defineComponent, defineAsyncComponent, ref, computed } from 'vue';
export default defineComponent({
  name: 'tm-upload',
  components: {
    tmFileList: defineAsyncComponent(() => import('components/tm-file-list')),
    tmFiles: defineAsyncComponent(() => import('components/tm-files'))
  },
  props: {
    data: { default: null },
    multiple: { type: Boolean, default: false },
    maxFileSize: { type: Number, default: 1024 * 1024 * 2 }, // 2MB
    uploadUrl: { type: String, required: true },
    headers: { type: Array, default: () => [] },
    accept: { type: String, default: undefined },
    loading: { type: Boolean, default: false },
    isHeader: { type: Boolean, default: false },
    isCount: { type: Boolean, default: false },
    isBorder: { type: Boolean, default: false },
    size: { type: Number, default: 80 },
    viewType: { type: String, default: 'box' },
    labelTitle: { type: String, default: '' },
    labelTitleUpload: { type: String, default: 'Upload' },
    labelTitleFiles: { type: String, default: 'Files' },
    iconAccept: { type: String, default: null },
    labelAccept: { type: String, default: 'Accept' },
    labelOpenFile: { type: String, default: 'Open file' },
    labelOpenData: { type: String, default: 'Open data' },
    labelViewList: { type: String, default: 'View list' },
    labelViewBox: { type: String, default: 'View box' },
    labelFileName: { type: String, default: 'File name' },
    labelFileSize: { type: String, default: 'Size' },
    labelCancel: { type: String, default: 'Cancel' },
    labelConfirmTitle: { type: String, default: 'Warning' },
    labelConfirmContent: { type: String, default: 'Are you sure you want to delete this record?' }
  },
  setup (props, { emit }) {
    const isDialogFiles = ref(false)
    const dialogUpload = ref(false)
    const viewTypeFiles = ref('box')
    const selected = ref(null)
    const slotToolBar = computed(() => !!slots['tool-bar'])
    const slotPanelLeft = computed(() => !!slots['panel-left'])

    return {
      isDialogFiles, dialogUpload, viewTypeFiles, selected, slotToolBar, slotPanelLeft,
      onChangeView: (val) => {
        emit('update:viewType', val)
        emit('on-change-view', val)
      },
      onFinishBrowse: (val) => {
        isDialogFiles.value = false
        if (val) {
          if (props.multiple) {
            const rs = props.data.slice()
            val.forEach(e => { if (!rs.includes(e.fullName)) rs.push(e.fullName) })
            emit('update:data', rs)
          } else emit('update:data', val.fullName)
        }
        emit('finish-browse', val)
      },
      onFinishUpload: (val) => {
        var res = JSON.parse(val.xhr.response)
        if (res.length > 0) {
          if (props.multiple) emit(props.data, props.data.slice().push(res[0].fullName)) // props.data.push(res[0].fullName)
          else emit('update:data', res[0].fullName)
        }
        emit('finish-uploaded', res)
      },
      onDeleteImage: (val) => {
        const i = props.data.indexOf(val)
        if (i > -1) emit(props.data, props.data.slice().splice(i, 1))// props.data.splice(i, 1)
      }

    }
  }
})
</script>

<style>
</style>
