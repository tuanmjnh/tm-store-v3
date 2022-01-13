<template>
  <div class="tm-files">
    <q-toolbar class="q-pa-sm">
      <q-btn flat @click="drawer=!drawer" round dense icon="menu" color="indigo" />
      <q-toolbar-title>{{labelTitle}}</q-toolbar-title>
      <q-btn v-if="iconAccept" icon="add_task" flat outline color="primary" dense @click="onFinish" class="q-mr-sm q-px-md">
        <q-tooltip>{{labelAccept}}</q-tooltip>
      </q-btn>
      <q-btn v-else :label="labelAccept" color="primary" no-caps flat dense class="q-btn--square q-mr-sm" @click="onFinish" />
      <q-btn icon="view_module" flat rounded :color="viewType!=='list'?'teal':'blue-grey'" dense @click="onChangeView('box')">
        <q-tooltip>{{labelViewBox}}</q-tooltip>
      </q-btn>
      <q-btn icon="view_list" flat rounded :color="viewType==='list'?'teal':'blue-grey'" dense @click="onChangeView('list')">
        <q-tooltip>{{labelViewList}}</q-tooltip>
      </q-btn>
      <q-btn flat round dense icon="close" v-close-popup>
        <q-tooltip>{{labelCancel}}</q-tooltip>
      </q-btn>
    </q-toolbar>
    <q-separator />
    <q-scroll-area style="height:calc(100vh - 180px)">
      <!-- <tm-file-list :files="files" :loading="isLoadingFile"></tm-file-list> -->
      <q-layout view="hHh Lpr lff" container style="position:initial;height:100%">
        <!-- <q-header elevated class="bg-black">
          <q-toolbar>
            <q-btn flat @click="drawer = !drawer" round dense icon="menu" />
            <q-toolbar-title>Header</q-toolbar-title>
          </q-toolbar>
        </q-header> -->

        <q-drawer v-model="drawer" class="bg-grey-2" bordered show-if-above :width="200" :breakpoint="500">
          <q-scroll-area class="fit">
            <q-spinner v-if="isLoadingDir" style="top:25%;left:25%;position:absolute;" color="primary" size="6em" :thickness="1" />
            <q-tree :nodes="directories" node-key="id" v-show="!isLoadingDir" v-model:selected="treeSelected" no-nodes-label=""
                    selected-color="primary">
              <template v-slot:default-header="prop">
                <div class="row items-center" @click="onGetData(prop)">
                  <q-icon :name="prop.expanded?'folder_open':'folder'" color="blue-grey" size="18px" class="q-mr-sm" />
                  <div :class="treeSelected===prop.node.id?'text-primary':'text-blue-grey'">{{prop.node.name}}</div>
                </div>
              </template>
            </q-tree>
          </q-scroll-area>
        </q-drawer>

        <q-page-container class="fit q-pa-xs">
          <q-page class="fit">
            <!-- <q-scroll-area class="fit"> -->
            <div class="view-box" v-if="viewType!=='list'">
              <div v-show="!isLoadingFile" v-for="(e,i) in files" :key="i" :class="['item',selected.find(x=>x.fullName===e.fullName)?'selected':'']"
                   :style="`width:${size}px;height:${size}px`" @click="onSelectItem(e)">
                <q-img v-if="Extension.isImage(e.name)" :src="e.fullName" spinner-color="primary" :style="{height:`${size-4}px`}">
                  <template v-slot:error>
                    <i class="content material-icons"
                       style="font-size:60px;position:absolute;top:25%;left:25%;color:#908f8f">photo_size_select_actual</i>
                  </template>
                </q-img>
                <i v-else-if="Extension.isAudio(e.name)" class="content material-icons"
                   :style="`height:${size-4}px;font-size:${size-50}px`">audiotrack</i>
                <i v-else-if="Extension.isVideo(e.name)" class="content material-icons"
                   :style="`height:${size-4}px;font-size:${size-50}px`">video_library</i>
                <i v-else-if="Extension.isPdf(e.name)" class="content material-icons"
                   :style="`height:${size-4}px;font-size:${size-50}px`">picture_as_pdf</i>
                <i v-else-if="Extension.isFlash(e.name)" class="content material-icons"
                   :style="`height:${size-4}px;font-size:${size-50}px`">burst_mode</i>
                <i v-else-if="Extension.isCode(e.name)" class="content material-icons" :style="`height:${size-4}px;font-size:${size-50}px`">code</i>
                <i v-else-if="Extension.isDoc(e.name)" class="content material-icons"
                   :style="`height:${size-4}px;font-size:${size-50}px`">description</i>
                <i v-else-if="Extension.isSheet(e.name)" class="content material-icons"
                   :style="`height:${size-4}px;font-size:${size-50}px`">list_alt</i>
                <i v-else-if="Extension.isText(e.name)" class="content material-icons"
                   :style="`height:${size-4}px;font-size:${size-50}px`">assignment</i>
                <i v-else class="content material-icons" :key="i" :style="`height:${size-4}px;font-size:${size-50}px`">file_copy</i>

                <i class="material-icons file-delete" @click="onDelete(i)">clear</i>
                <q-tooltip>{{Extension.getNameFilePath(e.name)}}</q-tooltip>
                <!--
                <div class="content" v-if="Extension.isImage(e.name)"
                     :style="Extension.getBackgroundImage(e.fullName)+`;height:${size-4}px`" />
                <i v-else-if="Extension.isAudio(e.name)" class="content material-icons"
                   :style="`height:${size-4}px`">audiotrack</i>
                <i v-else-if="Extension.isVideo(e.name)" class="content material-icons"
                   :style="`height:${size-4}px`">video_library</i>
                <i v-else-if="Extension.isPdf(e.name)" class="content material-icons"
                   :style="`height:${size-4}px`">picture_as_pdf</i>
                <i v-else-if="Extension.isFlash(e.name)" class="content material-icons"
                   :style="`height:${size-4}px`">burst_mode</i>
                <i v-else-if="Extension.isCode(e.name)" class="content material-icons"
                   :style="`height:${size-4}px`">code</i>
                <i v-else-if="Extension.isDoc(e.namee)" class="content material-icons"
                   :style="`height:${size-4}px`">description</i>
                <i v-else-if="Extension.isSheet(e.name)" class="content material-icons"
                   :style="`height:${size-4}px`">list_alt</i>
                <i v-else-if="Extension.isText(e.name)" class="content material-icons"
                   :style="`height:${size-4}px`">assignment</i>
                <i v-else class="content material-icons" :key="i" :style="`height:${size-4}px`">file_copy</i>
                <q-tooltip>{{Extension.getNameFilePath(e.name)}}</q-tooltip> -->
              </div>
            </div>
            <div v-else class="views view-list">
              <q-table row-key="name" :rows="files" :columns="columns" v-model:selected="selected" :visible-columns="visibleColumns" flat dense
                       :selection="multiple?'multiple':'single'" :no-data-label="$t('table.noData')" :rows-per-page-label="$t('table.rowPerPage')"
                       :selected-rows-label="()=>`${selected.length} ${$t('table.rowSelected')}`" :rows-per-page-options="rowsPerPageOptions">
                <template v-slot:header="props">
                  <q-tr :props="props">
                    <q-th auto-width key="select">
                      <q-checkbox v-if="multiple" v-model="props.selected" indeterminate-value="some" :dense="true" />
                      <span v-else>#</span>
                    </q-th>
                    <!-- <q-th :key="props.cols[0].name" :props="props">{{props.cols[0].label}}</q-th>
                    <q-th :key="props.cols[1].name" :props="props">{{props.cols[1].label}}</q-th>
                    <q-th :key="props.cols[2].name" :props="props">{{props.cols[2].label}}</q-th>
                    <q-th :key="props.cols[3].name" :props="props">{{props.cols[3].label}}</q-th>
                    <q-th :key="props.cols[4].name" :props="props">{{props.cols[4].label}}</q-th> -->
                    <!-- <q-th :key="props.cols[5].name" :props="props">{{props.cols[5].label}}</q-th> -->
                    <q-th v-for="col in props.cols" :key="col.name" :props="props">
                      <span v-if="$q.dark.isActive" class="text-bold">{{col.label}}</span>
                      <span v-else class="text-bold text-blue-grey-10">{{col.label}}</span>
                    </q-th>
                    <q-th auto-width>
                      <q-btn flat round dense :color="$q.dark.isActive?'':'grey-7'" icon="menu_open">
                        <q-tooltip v-if="!$q.platform.is.mobile">{{$t('table.displayColumns')}}</q-tooltip>
                        <q-menu fit>
                          <q-list dense style="min-width:100px">
                            <template v-for="(item,index) in columns">
                              <q-item v-if="!item.required" clickable :key="index" :active="visibleColumns.indexOf(item.name)>-1||false"
                                      @click="onColumns(item.name)">
                                <q-item-section>{{item.label}}</q-item-section>
                              </q-item>
                            </template>
                          </q-list>
                        </q-menu>
                      </q-btn>
                    </q-th>
                  </q-tr>
                </template>
                <template v-slot:body="props">
                  <q-tr :props="props">
                    <q-td auto-width key="select">
                      <q-checkbox v-model="props.selected" color="primary" :dense="true" />
                    </q-td>
                    <q-td auto-width key="index" :props="props">{{props.row.index+1}}</q-td>
                    <q-td auto-width key="icon" :props="props">
                      <q-img :src="props.row.fullName" spinner-color="primary" style="height:23px;max-width:25px" fit="cover"
                             v-if="Extension.isImage(props.row.name)">
                        <template v-slot:error>
                          <i class="content material-icons"
                             style="font-size:23px;position:absolute;top:0;left:0;color:#908f8f">photo_size_select_actual</i>
                        </template>
                      </q-img>
                      <i v-else-if="Extension.isAudio(props.row.name)" class="content material-icons"
                         style="font-size:20px">audiotrack</i>
                      <i v-else-if="Extension.isVideo(props.row.name)" class="content material-icons"
                         style="font-size:20px">video_library</i>
                      <i v-else-if="Extension.isPdf(props.row.name)" class="content material-icons"
                         style="font-size:20px">picture_as_pdf</i>
                      <i v-else-if="Extension.isFlash(props.row.name)" class="content material-icons"
                         style="font-size:20px">burst_mode</i>
                      <i v-else-if="Extension.isCode(props.row.name)" class="content material-icons"
                         style="font-size:20px">code</i>
                      <i v-else-if="Extension.isDoc(props.row.name)" class="content material-icons"
                         style="font-size:20px">description</i>
                      <i v-else-if="Extension.isSheet(props.row.name)" class="content material-icons"
                         style="font-size:20px">list_alt</i>
                      <i v-else-if="Extension.isText(props.row.name)" class="content material-icons"
                         style="font-size:20px">assignment</i>
                      <i v-else class="content material-icons" style="font-size:20px">file_copy</i>
                    </q-td>
                    <q-td key="name" :props="props">{{Extension.getNameFilePath(props.row.name)}}</q-td>
                    <q-td auto-width key="ext" :props="props">{{props.row.ext?props.row.ext.toLowerCase():props.row.ext}}</q-td>
                    <q-td key="size" :props="props">{{props.row.size.humanFileSize(true)}}</q-td>
                    <td auto-width>
                      <q-btn flat round dense color="negative" icon="clear" size="sm" @click="onDelete(props.row.index)">
                        <q-tooltip v-if="!$q.platform.is.mobile">{{labelDeleteFile}}</q-tooltip>
                      </q-btn>
                    </td>
                  </q-tr>
                </template>
              </q-table>
            </div>
            <!-- </q-scroll-area> -->
          </q-page>
        </q-page-container>
      </q-layout>
    </q-scroll-area>
    <q-spinner v-if="isLoadingFile" style="top:30%;left:35%;position:absolute;" color="primary" size="8em" :thickness="1" />
  </div>
  <!-- <context-menu ref="isContextMenu" :data="contextData" :top="-88">
      <slot name="content">
        <li @click="onActionContext('delete')"><i class="material-icons">clear</i> {{$t('global.delete')}}</li>
      </slot>
    </context-menu> -->
</template>

<script>
import { defineComponent, ref } from 'vue';
import axios from 'axios'
// import tmFileList from '@/components/tm-file-list'
import * as extension from '@/utils/extension'
export default defineComponent({
  name: 'tm-files',
  components: {
    // tmTree: defineAsyncComponent(() => import('components/tm-tree')),
    // contextMenu: defineAsyncComponent(() => import('components/context-menu'))
  },
  props: {
    modelValue: { default: null },
    url: { type: String, default: '' },
    // urlFile: { type: String, default: '' },
    // urlDirectory: { type: String, default: '' },
    headers: { type: Array, default: () => { } },
    noNodesLabel: { type: String, default: 'No data available' },
    accept: { type: String, default: undefined },
    multiple: { type: Boolean, default: false },
    isHeader: { type: Boolean, default: true },
    isCount: { type: Boolean, default: true },
    isBorder: { type: Boolean, default: true },
    size: { type: Number, default: 78 },
    rowsPerPageOptions: { type: Array, default: () => [10, 20, 30, 50] },
    viewType: { type: String, default: 'box' },
    labelTitle: { type: String, default: '' },
    labelViewList: { type: String, default: 'View list' },
    labelViewBox: { type: String, default: 'View box' },
    labelCancel: { type: String, default: 'Close' },
    iconAccept: { type: String, default: null },
    labelAccept: { type: String, default: 'Accept' },
    labelIndex: { type: String, default: 'Index' },
    labelIcon: { type: String, default: 'Icon' },
    labelType: { type: String, default: 'Type' },
    labelFileName: { type: String, default: 'File name' },
    labelFileSize: { type: String, default: 'Size' },
    labelDeleteFile: { type: String, default: 'Delete' }
  },
  setup (props, { emit }) {
    const Extension = extension
    const isLoadingDir = ref(true)
    const isLoadingFile = ref(true)
    const directories = ref([])
    const files = ref([])
    const treeSelected = ref(null)
    const loadedFolder = ref('')
    // const isContextMenu = ref(null)
    const contextData = ref(null)
    const selected = ref([])
    const drawer = ref(false)
    const modeMini = ref(false)
    const drawerMini = ref(false)
    const overlay = ref(false)
    const visibleColumns = ref(['index', 'icon', 'ext', 'size'])
    const columns = ref([
      // { name: 'select', field: 'select', label: 'Select', align: 'center' },
      { name: 'index', field: 'index', label: props.labelIndex, align: 'left', sortable: true },
      { name: 'icon', field: 'icon', label: props.labelIcon, align: 'center' },
      { name: 'name', field: 'name', label: props.labelFileName, align: 'left', required: true, sortable: true },
      { name: 'ext', field: 'ext', label: props.labelType, align: 'left', sortable: true },
      { name: 'size', field: 'size', label: 'Size', align: 'left', sortable: true }
    ])

    if (!props.modelValue)
      if (props.multiple) emit('update:modelValue', [])
      else emit('update:modelValue', null)

    const onGetDirectories = () => {
      return new Promise((resolve, reject) => {
        const headers = {}
        props.headers.forEach(e => { headers[e.name] = e.value })
        axios.get(`${props.url}/directories`, { headers: headers }).then(res => {
          if (res.data) directories.value = res.data
          isLoadingDir.value = false
          resolve(res.data)
        }).catch((e) => {
          reject(e)
        })
      })
    }

    const onGetFiles = (dir = '', _loadedFolder) => {
      files.value = []
      isLoadingFile.value = true
      loadedFolder.value = _loadedFolder
      const headers = {}
      props.headers.forEach(e => { headers[e.name] = e.value })
      axios.get(`${props.url}/files`, { headers: headers, params: { dir: dir } }).then(async res => {
        if (res.data) {
          if (props.accept === undefined || props.accept === '*') {
            files.value = res.data
            files.value.forEach((row, i) => {
              row.index = i
            })
          } else {
            const _accept = props.accept.split(',')
            if (_accept.includes('*')) {
              files.value = res.data
              files.value.forEach((row, i) => {
                row.index = i
              })
            }
            else {
              let i = 0
              for await (let e of res.data) {
                if (_accept.includes('image/*')) {
                  if (Extension.isImage(e.name)) {
                    e.index = i
                    i = i + 1
                    files.value.push(e)
                    continue
                  }
                }
                if (_accept.includes('audio/*')) {
                  if (Extension.isAudio(e.name)) {
                    e.index = i
                    i = i + 1
                    files.value.push(e)
                    continue
                  }
                }
                if (_accept.includes('video/*')) {
                  if (Extension.isVideo(e.name)) {
                    e.index = i
                    i = i + 1
                    files.value.push(e)
                    continue
                  }
                }
                if (_accept.includes('code/*')) {
                  if (thiExtensions.isCode(e.name)) {
                    e.index = i
                    i = i + 1
                    files.value.push(e)
                    continue
                  }
                }
                if (_accept.includes(Extension.getExtension(e.name.toLowerCase()))) {
                  e.index = i
                  i = i + 1
                  files.value.push(e)
                  continue
                }
              }
            }
          }
        }
      }).finally(() => {
        setTimeout(() => { isLoadingFile.value = false }, 300)
      })
    }
    onGetDirectories().then((x) => { onGetFiles() })

    return {
      isLoadingDir, isLoadingFile, directories, files, treeSelected, selected, loadedFolder, contextData,
      Extension, drawer, modeMini, drawerMini, overlay, columns, visibleColumns,
      onMouseOverDrawer: () => {
        if (modeMini.value) {
          drawerMinivalue = false
          overlay.value = true
        }
      },
      onMouseOutDrawer: () => {
        if (modeMini.value) {
          drawerMini.value = true
          overlay.value = false
        }
      },
      onGetData: (val) => {
        val.expanded = true
        if (val.node.name !== loadedFolder.value) onGetFiles(val.node.fullName, val.node.name)
        // onGetFiles(val.node.fullName.replace(/^uploads\\/, val.node.name))
      },
      onSelectItem: (val) => {
        if (props.multiple) {
          const i = selected.value.findIndex(x => x.fullName === val.fullName)
          if (i > -1) {
            selected.value.splice(i, 1)
            // emit('update:modelValue', selected.value)
            emit('on-unselect', val)
          } else {
            selected.value.push(val)
            // emit('update:modelValue', selected.value)
            emit('on-select', val)
          }
        } else {
          if (selected.value && selected.value.length && selected.value[0].fullName === val.fullName) {
            // emit('update:modelValue', null)
            selected.value = []
            emit('on-unselect', val)
          } else {
            // emit('update:modelValue', val)
            selected.value = [val]
            emit('on-select', val)
          }
        }
      },
      onChangeView: (val) => {
        emit('update:viewType', val)
        emit('on-change-view', val)
      },
      onGetSelected: (val) => {
        if (props.modelValue) {
          if (props.multiple) return props.modelValue.findIndex(x => x.name === val.name) > -1 ? 'selected' : ''
          else return props.modelValue.name === val.name ? 'selected' : ''
        }
      },
      onActionContext: (val) => {
        if (val === 'delete') {
          // console.log(contextData.value)
        }
      },
      onFinish: () => {
        if (props.multiple) {
          emit('update:modelValue', selected.value)
          emit('on-finish', selected.value)
        } else {
          const rs = selected.value && selected.value.length ? selected.value[0] : null
          emit('update:modelValue', rs)
          emit('on-finish', rs)
        }
      },
      onColumns: (val) => {
        var i = visibleColumns.value.indexOf(val)
        if (i < 0) visibleColumns.value.push(val)
        else visibleColumns.value.splice(i, 1)
      }
    }
  }
})
</script>
<style lang="scss" scoped>
.tm-files {
  .q-toolbar {
    min-height: initial;
    padding: 5px 0;
  }
  .view-box {
    .item {
      border: 1px solid #ccc;
      padding: 1px;
      margin: 0 0 6px 6px;
      vertical-align: middle;
      text-align: center;
      position: relative;
      display: inline-block;
      transition: all 0.3s;
      .file-delete {
        display: none;
        color: #fff;
        background-color: #b71c1c;
        position: absolute;
        right: 0;
        top: 0;
        opacity: 0;
        transition: opacity 0.3s;
        cursor: pointer;
      }
      &:hover .file-delete {
        display: initial !important;
        opacity: 1;
      }
      &.selected {
        border-color: #2196f3;
        box-shadow: 0 1px 8px #0003, 0 3px 4px #00000024,
          0 3px 3px -2px #0000001f;
      }
    }
  }
}
</style>
