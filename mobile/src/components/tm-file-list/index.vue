<template>
  <q-layout container class="tm-file-list">
    <q-toolbar v-if="isHeader">
      <q-toolbar-title v-if="title" class="text-subtitle1">{{title}}</q-toolbar-title>
      <slot v-if="slotToolBar" name="tool-bar"></slot>
      <q-btn v-if="!slotToolBar" round dense flat icon="view_module" :color="viewType!=='list'?'indigo':'blue-grey'"
             @click="onChangeView('box')">
        <q-tooltip v-if="!$q.platform.is.mobile">{{labelViewBox}}</q-tooltip>
      </q-btn>
      <q-btn v-if="!slotToolBar" round dense flat icon="view_list" :color="viewType==='list'?'indigo':'blue-grey'"
             @click="onChangeView('list')">
        <q-tooltip v-if="!$q.platform.is.mobile">{{labelViewList}}</q-tooltip>
      </q-btn>
    </q-toolbar>
    <div class="panel">
      <div v-if="slotPanelLeft" class="panel-left">
        <slot name="panel-left"></slot>
      </div>
      <div v-if="scrollLoad" id="panel-right-scroll" class="panel-right">
        <div v-if="loading" class="fullscreen">
          <div class="absolute-full flex flex-center">
            <q-spinner color="primary" size="6em" :thickness="1" />
          </div>
        </div>
        <div v-if="viewType!=='list'" :class="`views view-box ${center?'text-center':''}`" class="scroll"
             :style="contentHeight?`height:${contentHeight}px`:''">
          <q-infinite-scroll ref="refScrollTarget" @load="onScrollLoad" :offset="1">
            <div v-for="(e,i) in rows" :key="i" :style="`width:${size}px;height:${size}px`"
                 :class="['item',selected&&selected.indexOf(e)>-1?'selected':'']">
              <div @click="onSelectItem(e)">
                <i v-if="e.type==='folder'" class="material-icons absolute-full flex flex-center"
                   :style="`font-size:${fontSize}px`">folder</i>
                <q-img v-else-if="Extension.isImage(e.name)" :src="e.url" spinner-color="primary" :style="{height:`${size-4}px`}">
                  <template v-slot:error>
                    <i class="material-icons"
                       style="font-size:30px;color:#a5a5a5;position:absolute;top:0;right:0;bottom:0;left:0;align-items:center;justify-content:center;display:flex;flex-wrap:wrap;">photo_size_select_actual</i>
                  </template>
                </q-img>
                <i v-else-if="Extension.isAudio(e.name)" class="material-icons absolute-full flex flex-center"
                   :style="`font-size:${fontSize}px`">audiotrack</i>
                <i v-else-if="Extension.isVideo(e.name)" class="material-icons absolute-full flex flex-center"
                   :style="`font-size:${fontSize}px`">video_library</i>
                <i v-else-if="Extension.isPdf(e.name)" class="material-icons absolute-full flex flex-center"
                   :style="`font-size:${fontSize}px`">picture_as_pdf</i>
                <i v-else-if="Extension.isFlash(e.name)" class="material-icons absolute-full flex flex-center"
                   :style="`font-size:${fontSize}px`">burst_mode</i>
                <i v-else-if="Extension.isCode(e.name)" class="material-icons absolute-full flex flex-center"
                   :style="`font-size:${fontSize}px`">code</i>
                <i v-else-if="Extension.isDoc(e.name)" class="material-icons absolute-full flex flex-center"
                   :style="`font-size:${fontSize}px`">description</i>
                <i v-else-if="Extension.isSheet(e.name)" class="material-icons absolute-full flex flex-center"
                   :style="`font-size:${fontSize}px`">list_alt</i>
                <i v-else-if="Extension.isText(e.name)" class="material-icons absolute-full flex flex-center"
                   :style="`font-size:${fontSize}px`">assignment</i>
                <i v-else class="material-icons absolute-full flex flex-center" :key="i" :style="`font-size:${fontSize}px`">file_copy</i>
              </div>
              <i v-if="isDelete" class="material-icons file-delete" @click="onDelete(i)">clear</i>
              <q-tooltip>{{Extension.getNameFilePath(e.name)}}</q-tooltip>
            </div>
            <template v-if="!scrollEnd" v-slot:loading>
              <div class="row justify-center q-my-md">
                <q-spinner-dots color="primary" size="40px" />
              </div>
            </template>
          </q-infinite-scroll>
        </div>
        <div v-else class="views view-list">
          <q-list separator class="scroll" :style="contentHeight?`height:${contentHeight}px`:''">
            <q-infinite-scroll ref="refScrollTarget" @load="onScrollLoad" :offset="50">
              <q-item v-for="(e,i) in rows" :key="i">
                <q-item-section avatar>
                  <q-img :src="e.url" spinner-color="primary" fit="cover" v-if="Extension.isImage(e.name)">
                    <template v-slot:error>
                      <i class="content material-icons"
                         style="font-size:23px;position:absolute;top:0;left:0;color:#908f8f">photo_size_select_actual</i>
                    </template>
                  </q-img>
                  <i v-else-if="Extension.isAudio(e.name)" class="content material-icons"
                     :style="`font-size:${fontSize}px`">audiotrack</i>
                  <i v-else-if="Extension.isVideo(e.name)" class="content material-icons"
                     :style="`font-size:${fontSize}px`">video_library</i>
                  <i v-else-if="Extension.isPdf(e.name)" class="content material-icons"
                     :style="`font-size:${fontSize}px`">picture_as_pdf</i>
                  <i v-else-if="Extension.isFlash(e.name)" class="content material-icons"
                     :style="`font-size:${fontSize}px`">burst_mode</i>
                  <i v-else-if="Extension.isCode(e.name)" class="content material-icons" :style="`font-size:${fontSize}px`">code</i>
                  <i v-else-if="Extension.isDoc(e.name)" class="content material-icons"
                     :style="`font-size:${fontSize}px`">description</i>
                  <i v-else-if="Extension.isSheet(e.name)" class="content material-icons"
                     :style="`font-size:${fontSize}px`">list_alt</i>
                  <i v-else-if="Extension.isText(e.name)" class="content material-icons"
                     :style="`font-size:${fontSize}px`">assignment</i>
                  <i v-else class="content material-icons" :key="i" :style="`font-size:${fontSize}px`">file_copy</i>
                  <!-- <q-icon color="primary" name="e.icon" /> -->
                </q-item-section>
                <q-item-section>
                  <q-item-label class="ellipsis">{{e.name}}</q-item-label>
                  <q-item-label caption lines="1">{{e.type}}</q-item-label>
                  <q-item-label caption lines="1">{{parseInt(e.size).formatFileSize()}}</q-item-label>
                </q-item-section>

                <q-item-section side>
                  <i v-if="isDelete" class="material-icons file-delete" @click="onDelete(i)">clear</i>
                </q-item-section>
              </q-item>
              <template v-if="!scrollEnd" v-slot:loading>
                <div class="row justify-center q-my-md">
                  <q-spinner-dots color="primary" size="40px" />
                </div>
              </template>
            </q-infinite-scroll>
          </q-list>
        </div>
      </div>
      <div v-else id="panel-right-scroll" class="panel-right">
        <div v-if="loading" class="fullscreen">
          <div class="absolute-full flex flex-center">
            <q-spinner color="primary" size="6em" :thickness="1" />
          </div>
        </div>
        <div v-if="viewType!=='list'" :class="`views view-box ${center?'text-center':''}`" class="scroll"
             :style="contentHeight?`height:${contentHeight}px`:''">
          <div v-for="(e,i) in rows" :key="i" :style="`width:${size}px;height:${size}px`"
               :class="['item',selected&&selected.indexOf(e)>-1?'selected':'']">
            <div @click="onSelectItem(e)">
              <i v-if="e.type==='folder'" class="material-icons absolute-full flex flex-center"
                 :style="`font-size:${fontSize}px`">folder</i>
              <q-img v-else-if="Extension.isImage(e.name)" :src="e.url" spinner-color="primary" :style="{height:`${size-4}px`}">
                <template v-slot:error>
                  <i class="material-icons"
                     style="font-size:30px;color:#a5a5a5;position:absolute;top:0;right:0;bottom:0;left:0;align-items:center;justify-content:center;display:flex;flex-wrap:wrap;">photo_size_select_actual</i>
                </template>
              </q-img>
              <i v-else-if="Extension.isAudio(e.name)" class="material-icons absolute-full flex flex-center"
                 :style="`font-size:${fontSize}px`">audiotrack</i>
              <i v-else-if="Extension.isVideo(e.name)" class="material-icons absolute-full flex flex-center"
                 :style="`font-size:${fontSize}px`">video_library</i>
              <i v-else-if="Extension.isPdf(e.name)" class="material-icons absolute-full flex flex-center"
                 :style="`font-size:${fontSize}px`">picture_as_pdf</i>
              <i v-else-if="Extension.isFlash(e.name)" class="material-icons absolute-full flex flex-center"
                 :style="`font-size:${fontSize}px`">burst_mode</i>
              <i v-else-if="Extension.isCode(e.name)" class="material-icons absolute-full flex flex-center"
                 :style="`font-size:${fontSize}px`">code</i>
              <i v-else-if="Extension.isDoc(e.name)" class="material-icons absolute-full flex flex-center"
                 :style="`font-size:${fontSize}px`">description</i>
              <i v-else-if="Extension.isSheet(e.name)" class="material-icons absolute-full flex flex-center"
                 :style="`font-size:${fontSize}px`">list_alt</i>
              <i v-else-if="Extension.isText(e.name)" class="material-icons absolute-full flex flex-center"
                 :style="`font-size:${fontSize}px`">assignment</i>
              <i v-else class="material-icons absolute-full flex flex-center" :key="i" :style="`font-size:${fontSize}px`">file_copy</i>
            </div>
            <i v-if="isDelete" class="material-icons file-delete" @click="onDelete(i)">clear</i>
            <q-tooltip>{{Extension.getNameFilePath(e.name)}}</q-tooltip>
          </div>
        </div>
        <div v-else class="views view-list">
          <q-list separator class="scroll" :style="contentHeight?`height:${contentHeight}px`:''">
            <q-item v-for="(e,i) in rows" :key="i">
              <q-item-section avatar>
                <q-img :src="e.url" spinner-color="primary" fit="cover" v-if="Extension.isImage(e.name)">
                  <template v-slot:error>
                    <i class="content material-icons"
                       style="font-size:23px;position:absolute;top:0;left:0;color:#908f8f">photo_size_select_actual</i>
                  </template>
                </q-img>
                <i v-else-if="Extension.isAudio(e.name)" class="content material-icons"
                   :style="`font-size:${fontSize}px`">audiotrack</i>
                <i v-else-if="Extension.isVideo(e.name)" class="content material-icons"
                   :style="`font-size:${fontSize}px`">video_library</i>
                <i v-else-if="Extension.isPdf(e.name)" class="content material-icons"
                   :style="`font-size:${fontSize}px`">picture_as_pdf</i>
                <i v-else-if="Extension.isFlash(e.name)" class="content material-icons"
                   :style="`font-size:${fontSize}px`">burst_mode</i>
                <i v-else-if="Extension.isCode(e.name)" class="content material-icons" :style="`font-size:${fontSize}px`">code</i>
                <i v-else-if="Extension.isDoc(e.name)" class="content material-icons"
                   :style="`font-size:${fontSize}px`">description</i>
                <i v-else-if="Extension.isSheet(e.name)" class="content material-icons"
                   :style="`font-size:${fontSize}px`">list_alt</i>
                <i v-else-if="Extension.isText(e.name)" class="content material-icons"
                   :style="`font-size:${fontSize}px`">assignment</i>
                <i v-else class="content material-icons" :key="i" :style="`font-size:${fontSize}px`">file_copy</i>
                <!-- <q-icon color="primary" name="e.icon" /> -->
              </q-item-section>
              <q-item-section>
                <q-item-label class="ellipsis">{{e.name}}</q-item-label>
                <q-item-label caption lines="1">{{e.type}}</q-item-label>
                <q-item-label caption lines="1">{{parseInt(e.size).formatFileSize()}}</q-item-label>
              </q-item-section>

              <q-item-section side>
                <i v-if="isDelete" class="material-icons file-delete" @click="onDelete(i)">clear</i>
              </q-item-section>
            </q-item>
          </q-list>
        </div>
      </div>
    </div>
  </q-layout>
</template>

<script>
import { defineComponent, ref, computed, onMounted } from 'vue';
import * as extension from '../../../../global/utils/extension'
import { useQuasar } from 'quasar'
import { number } from '@intlify/core-base';

export default defineComponent({
  name: 'TMFileList',
  props: {
    modelValue: { default: null },
    selected: { default: null },
    title: { type: String, default: '' },
    multiple: { type: Boolean, default: false },
    loading: { type: Boolean, default: false },
    isHeader: { type: Boolean, default: true },
    isCount: { type: Boolean, default: false },
    isBorder: { type: Boolean, default: false },
    generateImage: { type: Boolean, default: false },
    size: { type: Number, default: 80 },
    isDelete: { type: Boolean, default: true },
    fontSize: { type: Number, default: 40 },
    rowsPerPageOptions: { type: Array, default: () => [10, 20, 30, 50] },
    viewType: { type: String, default: 'box' },
    minHeight: { type: String, default: '200px' },
    maxHeight: { type: String, default: '200px' },
    contentHeight: { type: Number, default: 500 },
    labelViewList: { type: String, default: 'View list' },
    labelViewBox: { type: String, default: 'View box' },
    labelIndex: { type: String, default: 'Index' },
    labelIcon: { type: String, default: 'Icon' },
    labelType: { type: String, default: 'Type' },
    labelFileName: { type: String, default: 'File name' },
    labelFileSize: { type: String, default: 'Size' },
    labelDeleteFile: { type: String, default: 'Delete' },
    lblOk: { type: String, default: 'Ok' },
    lblCancel: { type: String, default: 'Cancel' },
    lblConfirmTitle: { type: String, default: 'Confirm' },
    lblConfirmContent: { type: String, default: 'Are you sure you want to delete this record?' },
    center: { type: Boolean, default: false },
    scrollLoad: { type: Boolean, default: false },
    scrollEnd: { type: Boolean, default: true }
  },
  setup (props, { emit, slots }) {
    const $q = useQuasar()
    const Extension = extension
    const slotToolBar = computed(() => !!slots['tool-bar'])
    const slotPanelLeft = computed(() => !!slots['panel-left'])
    const visibleColumns = ref(['index', 'icon', 'type'])
    // const viewType = ref('box')
    const columns = ref([
      { name: 'index', field: 'index', label: props.labelIndex, align: 'left', sortable: true },
      { name: 'icon', field: 'icon', label: props.labelIcon, align: 'center' },
      { name: 'name', field: 'name', label: props.labelFileName, align: 'left', required: true, sortable: true },
      { name: 'type', field: 'type', label: props.labelType, align: 'left', sortable: true }
      // { name: 'size', field: 'size', label: 'Size', align: 'left', sortable: true }
    ])
    //
    const refViewBox = ref(null)
    const refViewList = ref(null)
    const onGenerateImages = (images) => {
      if (images && images.length) {
        const _images = JSON.parse(JSON.stringify(images))
        if (Array.isArray(_images)) {
          const rs = []
          _images.forEach(e => {
            const type = Extension.getExtension(e)
            rs.push({
              name: Extension.getNameFilePath(e),
              url: e,
              type: type,
              size: 0,
              extension: type
            })
          })
          return rs
        } else {
          const rs = []
          const type = Extension.getExtension(images)
          rs.push({
            name: Extension.getNameFilePath(images),
            url: images,
            type: type,
            size: 0,
            extension: type
          })
          return rs
        }
      } else return null
    }
    const rows = computed(() => {
      if (props.generateImage) {
        return onGenerateImages(props.modelValue)
      } else {
        return props.modelValue ? Array.isArray(props.modelValue) ? props.modelValue : [props.modelValue] : []
      }
    })
    return {
      Extension, slotToolBar, slotPanelLeft, rows, visibleColumns, columns, refViewBox, refViewList,
      onGetStyleImage: (url) => {
        return `background-size:cover;background-position:50% 50%;background-image:url("${url}");`
      },
      onSelectItem: (val) => {
        let selected = props.selected ? props.selected.slice() : []
        const i = selected.indexOf(val)
        if (props.multiple) {
          if (i < 0) {
            selected.push(val)
            emit('on-select', val)
          } else {
            selected.splice(i, 1)
            emit('on-unselect', val)
          }
        } else {
          if (i < 0) {
            selected = [val]
            emit('on-select', val)
          } else {
            selected = []
            emit('on-unselect', val)
          }
          // if (selected === val) {
          //   selected = []
          //   emit('on-unselect', val)
          // } else {
          //   selected = val
          //   emit('on-select', val)
          // }
        }
        emit('update:selected', selected)
      },
      onChangeView: (val) => {
        emit('update:viewType', val)
        // viewType.value = val
        emit('on-change-view', val)
      },
      onGetSelected: (val) => {
        if (props.multiple) {
          if (props.selected.indexOf(val) > -1) return 'selected'
        } else {

        }
        return props.multiple ? (props.selected.indexOf(val) > -1 ? 'selected' : '') : (props.selected === val ? 'selected' : '')
        // if (!props.selected) return ''
        // const i = props.selected.findIndex(x => x === val)
        // return i > -1 ? 'selected' : ''
      },
      onDelete: (val) => {
        if (val > -1) $q.dialog({
          title: props.lblConfirmTitle,
          message: props.lblConfirmContent,
          cancel: true,
          ok: {
            label: props.lblOk,
            flat: true,
            color: 'primary',
            noCaps: true
          },
          cancel: {
            label: props.lblCancel,
            flat: true,
            color: 'blue-grey',
            noCaps: true
          }
        }).onOk(() => {
          if (props.multiple) {
            const x = props.modelValue.slice()
            x.splice(val, 1)
            emit('update:modelValue', x)
            emit('on-delete', val)
          } else {
            emit('update:modelValue', null)
            emit('on-delete', val)
          }
        })
      },
      onColumns: (val) => {
        var i = visibleColumns.value.indexOf(val)
        if (i < 0) visibleColumns.value.push(val)
        else visibleColumns.value.splice(i, 1)
      },
      onScrollLoad (index, done) {
        emit('onScrollLoad', { index, done })
      }
    }
  }
})
</script>

<style lang="scss" scoped>
.tm-file-list {
  // height: calc(100vh - 99px);
  .q-toolbar {
    min-height: initial;
    padding: 5px 0;
  }
  .view-box {
    .item {
      border: 1px solid #eee;
      padding: 1px;
      margin: 0 5px 5px 0;
      vertical-align: middle;
      text-align: center;
      position: relative;
      display: inline-block;
      transition: all 0.3s;
      &.selected {
        border: 1px solid #2196f3;
      }
    }
    .file-delete {
      // display: none;
      position: absolute;
      right: 1px;
      top: 1px;
      opacity: 1;
    }
    &:hover .file-delete {
      display: initial !important;
      opacity: 1;
    }
  }
  .file-delete {
    cursor: pointer;
    transition: opacity 0.3s;
    background-color: #c55959;
    color: #fff;
  }
  // .panel {
  //   .panel-left {
  //     position: absolute;
  //     width: 100%;
  //     height: 100%;
  //     z-index: 3000;
  //   }
  // }
}
</style>
