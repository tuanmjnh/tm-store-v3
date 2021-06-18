<template>
  <div>
    <q-editor :modelValue="modelValue" :dense="$q.screen.lt.md" :toolbar="toolbar" :definitions="definitions"
              :fonts="fonts" @update:model-value="$emit('update:modelValue', $event)" />
    <!-- Dialog Files -->
    <q-dialog v-model="isDialogFile">
      <q-card style="width:672px;max-width:80vw;">
        <q-toolbar>
          <q-toolbar-title>{{$t('files.title')}}</q-toolbar-title>
          <q-btn flat round dense icon="close" v-close-popup>
            <q-tooltip>{{$t('global.cancel')}}</q-tooltip>
          </q-btn>
        </q-toolbar>
        <q-separator />
        <q-card-section>
          <tm-files v-model:selected="files" :accept="accept" :multiple="multiple" :url="uploadUrl" :headers="headers" :labelViewList="labelViewList"
                    :iconAccept="iconAccept" :labelAccept="labelAccept" :labelViewBox="labelViewBox"
                    :labelFileName="labelFileName" :labelFileSize="labelFileSize" @on-finish="onFilesFinish" />
        </q-card-section>
      </q-card>
    </q-dialog>
    <!-- Dialog Upload-->
    <q-dialog v-model="isDialogUpload">
      <q-card style="width:500px;max-width:80vw;">
        <q-toolbar>
          <q-toolbar-title>{{$t('files.upload')}}</q-toolbar-title>
          <q-btn flat round dense icon="close" v-close-popup>
            <q-tooltip>{{$t('global.cancel')}}</q-tooltip>
          </q-btn>
        </q-toolbar>
        <q-separator />
        <q-card-section>
          <q-uploader ref="upload" square flat :multiple="multiple" :max-file-size="maxFileSize"
                      :accept="accept" style="width:100%" @uploaded="onUploaded" @finish="dialogUpload=false"
                      :url="uploadUrl" :headers="headers">
          </q-uploader>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import { defineComponent, defineAsyncComponent, ref } from 'vue';
import { useQuasar } from 'quasar'
import { useI18n } from 'vue-i18n'
export default defineComponent({
  components: {
    tmFiles: defineAsyncComponent(() => import('components/tm-files'))
  },
  props: {
    modelValue: { type: String },
    uploadUrl: { type: String, required: true },
    headers: { type: Array, required: true },
    accept: { type: String, default: '.jpg,.jpeg,.png,.gif' },
    maxFileSize: { type: Number, default: 1024 * 1024 * 2 },
    multiple: { type: Boolean, default: false },
    iconAccept: { type: String, default: null },
    labelAccept: { type: String, default: 'Accept' },
    labelViewList: { type: String, default: 'View list' },
    labelViewBox: { type: String, default: 'View box' },
    labelFileName: { type: String, default: 'File name' },
    labelFileSize: { type: String, default: 'Size' }
  },
  setup (props, { emit }) {
    const $q = useQuasar()
    const { t } = useI18n({ useScope: 'global' })
    const isDialogFile = ref(false)
    const isDialogUpload = ref(false)
    const files = ref(null)
    const toolbar = ref([
      [
        {
          icon: $q.iconSet.editor.align,
          fixedLabel: true,
          list: 'only-icons',
          options: ['left', 'center', 'right', 'justify']
        },
        {
          icon: $q.iconSet.editor.formatting,
          list: 'no-icons',
          options: ['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'code']
        },
        {
          icon: $q.iconSet.editor.fontSize,
          fixedLabel: false,
          fixedIcon: false,
          list: 'no-icons',
          options: ['size-1', 'size-2', 'size-3', 'size-4', 'size-5', 'size-6', 'size-7']
        },
        {
          icon: $q.iconSet.editor.font,
          fixedIcon: true,
          list: 'no-icons',
          options: ['default_font', 'arial', 'arial_black', 'comic_sans', 'courier_new', 'impact', 'lucida_grande', 'times_new_roman', 'verdana']
        },
        'removeFormat'
      ],
      ['bold', 'italic', 'strike', 'underline', 'subscript', 'superscript'],
      ['quote', 'unordered', 'ordered', 'outdent', 'indent'],
      ['undo', 'redo'],
      ['token', 'hr', 'link', 'loadFile', 'upload'],
      ['viewsource', 'print', 'fullscreen']
    ])
    const definitions = ref({
      loadFile: {
        tip: t('files.openFile'),
        icon: 'pageview',
        handler: () => isDialogFile.value = true
      },
      upload: {
        tip: t('files.upload'),
        icon: 'cloud_upload',
        handler: () => isDialogUpload.value = true
      }
    })
    const fonts = ref({
      arial: 'Arial',
      arial_black: 'Arial Black',
      comic_sans: 'Comic Sans MS',
      courier_new: 'Courier New',
      impact: 'Impact',
      lucida_grande: 'Lucida Grande',
      times_new_roman: 'Times New Roman',
      verdana: 'Verdana'
    })
    const onGetImg = (url) => {
      return `<p style="text-align:center;"><img src="${url}" style="margin:0px;padding:0px;box-sizing:border-box;border:0px;line-height:0;max-width:100%;width:500px"/></p>`
    }
    return {
      props, isDialogFile, isDialogUpload, files, toolbar, definitions, fonts, onGetImg,
      onFilesFinish: (selected) => {
        const _files = selected.map(x => x.fullName)
        let _value = ''
        for (const e of _files) _value += onGetImg(e)
        emit('update:modelValue', props.modelValue + _value)
        isDialogFile.value = false
        files.value = null
      },
      onUploaded: (info) => {
        const res = JSON.parse(info.xhr.response)
        if (res.length > 0) emit('update:modelValue', props.modelValue + onGetImg(res[0].fullName))
      }
    }
  }
})
</script>

<style>
</style>
