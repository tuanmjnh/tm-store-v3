<template>
  <div class="row">
    <div class="q-toolbar row no-wrap items-center">
      <div class="q-toolbar__title ellipsis">{{labelTitle}}</div>
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
    </div>
    <div class="row col-12">
      <div class="col-md-3">
        <q-scroll-area style="height:200px">
          <q-spinner v-if="isLoadingDir" style="top:25%;left:25%;position:absolute;" color="primary" size="6em" :thickness="1" />
          <q-tree :nodes="directories" node-key="id" v-show="!isLoadingDir" v-model:selected="treeSelected"
                  no-nodes-label="" selected-color="primary">
            <template v-slot:default-header="prop">
              <div class="row items-center" @click="onGetData(prop)">
                <q-icon :name="prop.expanded?'folder_open':'folder'" color="blue-grey" size="18px" class="q-mr-sm" />
                <div :class="prop.expanded?'text-primary':'text-blue-grey'">{{prop.node.name}}</div>
              </div>
            </template>
          </q-tree>
          <!-- <tm-tree v-show="!isLoadingDir" :nodes="directories" :selected="treeSelected" node-key="id"
                   node-label="name" :draggable="true" @on-selected="onGetData" no-nodes-label="">
          </tm-tree> -->
        </q-scroll-area>
      </div>
      <div class="col" style="margin-left:5px">
        <q-scroll-area style="height:200px">
          <q-spinner v-if="isLoadingFile" style="top:25%;left:35%;position:absolute;" color="primary" size="8em" :thickness="1" />
          <div class="view-box" v-if="viewType!=='list'">
            <div v-show="!isLoadingFile" v-for="(e,i) in files" :key="i" :class="['item',onGetSelected(e)]"
                 :style="`width:${size}px;height:${size}px`" @click="onSelectItem(e)">
              <div class="content" v-if="Extension.isImage(e.name)"
                   :style="Extension.getBackgroundImage(e.fullName)+`;height:${size-4}px`" />
              <!-- <img class="content" :src="e.fullName"> -->
              <!-- {{e.fullName}} -->
              <i v-else-if="Extension.isAudio(e.name)" class="content material-icons"
                 :style="`height:${size-4}px`">audiotrack</i>
              <!-- <audio controls>
            <source :src="e.fullName" type="audio/ogg">
            <source :src="e.fullName" type="audio/mpeg">
          </audio> -->
              <i v-else-if="Extension.isVideo(e.name)" class="content material-icons"
                 :style="`height:${size-4}px`">video_library</i>
              <!-- <video controls>
            <source :src="e.fullName" type="video/mp4">
            <source :src="e.fullName" type="video/ogg">
          </video> -->
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
              <q-tooltip>{{e.name}}</q-tooltip>
              <!-- <span class="tooltip-text tooltip-bottom">{{e.name}}</span> -->
            </div>
          </div>
          <div v-else class="view-list">
            <table :class="[isBorder?'table-border':'']">
              <thead v-if="isHeader">
                <tr>
                  <th v-if="isCount" class="count">#</th>
                  <th>{{labelFileName}}</th>
                  <!-- <th>Type</th> -->
                  <th>{{labelFileSize}}</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(e,i) in files" :key="i" :class="['item',onGetSelected(e)]" @click="onSelectItem(e)">
                  <td v-if="isCount" class="count">{{i+1}}</td>
                  <td>{{e.name}}</td>
                  <!-- <td>{{e.ext}}</td> -->
                  <td>{{e.size}}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </q-scroll-area>
      </div>
      <!-- <tm-file-list :files="files" :loading="isLoadingFile"></tm-file-list> -->
    </div>
    <!-- <context-menu ref="isContextMenu" :data="contextData" :top="-88">
      <slot name="content">
        <li @click="onActionContext('delete')"><i class="material-icons">clear</i> {{$t('global.delete')}}</li>
      </slot>
    </context-menu> -->
  </div>
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
    selected: { default: null },
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
    viewType: { type: String, default: 'box' },
    labelTitle: { type: String, default: '' },
    labelViewList: { type: String, default: 'View list' },
    labelViewBox: { type: String, default: 'View box' },
    iconAccept: { type: String, default: null },
    labelAccept: { type: String, default: 'Accept' },
    labelFileName: { type: String, default: 'File name' },
    labelFileSize: { type: String, default: 'Size' }
  },
  setup (props, { emit }) {
    const isLoadingDir = ref(true)
    const isLoadingFile = ref(true)
    const directories = ref([])
    const files = ref([])
    const treeSelected = ref(null)
    const loadedFolder = ref('')
    // const isContextMenu = ref(null)
    const contextData = ref(null)
    const Extension = extension
    // if (!props.selected) emit('update:selected', [])
    if (!props.selected)
      if (props.multiple) emit('update:selected', [])
      else emit('update:selected', null)

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
          } else {
            const _accept = props.accept.split(',')
            if (_accept.includes('*')) files.value = res.data
            else {
              for await (let e of res.data) {
                if (_accept.includes('image/*')) {
                  if (Extension.isImage(e.name)) {
                    files.value.push(e)
                    continue
                  }
                }
                if (_accept.includes('audio/*')) {
                  if (Extension.isAudio(e.name)) {
                    files.value.push(e)
                    continue
                  }
                }
                if (_accept.includes('video/*')) {
                  if (Extension.isVideo(e.name)) {
                    files.value.push(e)
                    continue
                  }
                }
                if (_accept.includes('code/*')) {
                  if (thiExtensions.isCode(e.name)) {
                    files.value.push(e)
                    continue
                  }
                }
                if (_accept.includes(Extension.getExtension(e.name.toLowerCase()))) {
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
      isLoadingDir, isLoadingFile, directories, files, treeSelected, loadedFolder, contextData, Extension,
      onGetData: (val) => {
        val.expanded = true
        if (val.node.name !== loadedFolder.value) onGetFiles(val.node.fullName, val.node.name)
        // onGetFiles(val.node.fullName.replace(/^uploads\\/, val.node.name))
      },
      onSelectItem: (val) => {
        // val.selected = true
        if (props.multiple) {
          const i = props.selected.findIndex(x => x.name === val.name)
          if (i > -1) {
            const _selected = props.selected.slice()
            _selected.splice(i, 1)
            emit('update:selected', _selected)
            emit('on-unselect', val)
          } else {
            const _selected = props.selected.slice()
            _selected.push(val)
            emit('update:selected', _selected)
            emit('on-select', val)
          }
        } else {
          if (props.selected && props.selected === val) {
            emit('update:selected', null)
            emit('on-select', null)
          } else {
            emit('update:selected', val)
            emit('on-select', val)
          }
        }
      },
      onChangeView: (val) => {
        emit('update:viewType', val)
      },
      onGetSelected: (val) => {
        if (props.selected) {
          if (props.multiple) return props.selected.findIndex(x => x.name === val.name) > -1 ? 'selected' : ''
          else return props.selected.name === val.name ? 'selected' : ''
        }
      },
      onActionContext: (val) => {
        if (val === 'delete') {
          // console.log(contextData.value)
        }
      },
      onFinish: () => {
        // emit('update:selected', [])
        if (props.multiple) emit('on-finish', [...props.selected])
        else emit('on-finish', props.selected)
      }
    }
  }
})
</script>

<style lang="scss" scoped>
.q-toolbar {
  padding-left: 0;
  padding-right: 0;
  min-height: initial;
}
.item {
  cursor: pointer;
}
.view-box {
  .item {
    // width: 78px;
    // height: 78px;
    border: 1px solid #ccc;
    // overflow: hidden;
    padding: 1px;
    margin: 0 0 6px 6px;
    vertical-align: middle;
    text-align: center;
    position: relative;
    display: inline-block;
    transition: all 0.3s;
    .content {
      // height: 74px;
      // max-width: 50px;
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      margin: auto;
    }
    i.content {
      font-size: 28px;
    }
    &.selected {
      border-color: #2196f3;
    }
    &:hover {
      border-color: #02776b;
    }
    // &:nth(4) {
    //   margin-left: 0;
    // }
  }
}
.view-list {
  table {
    width: 100%;
    max-width: 100%;
    border-collapse: separate;
    border-spacing: 0;
    thead tr,
    thead th {
      height: 28px;
      border-color: rgba(0, 0, 0, 0.12);
    }
    tbody tr,
    tbody td {
      border-color: #fff;
    }
    &.table-border tbody tr,
    &.table-border tbody td {
      border-color: rgba(0, 0, 0, 0.12);
    }
    td,
    th,
    thead {
      border-style: solid;
      border-width: 0;
    }
    th.sortable {
      cursor: pointer;
    }
    th {
      white-space: nowrap;
    }
    td,
    th,
    thead {
      border-style: solid;
      border-width: 0;
    }
    td,
    th {
      padding: 3px 6px;
      background-color: inherit;
    }
    th {
      font-weight: 500;
      font-size: 12px;
      -webkit-user-select: none;
      -moz-user-select: none;
      -ms-user-select: none;
      user-select: none;
      text-align: left;
    }
    tbody tr:not(:last-child) td,
    thead th,
    tbody tr:not(:last-child) td,
    thead th {
      border-bottom-width: 1px;
    }
    tbody tr {
      // font-family: Roboto, -apple-system, Helvetica Neue, Helvetica, Arial,
      //   sans-serif;
      color: #393939;
      &:hover {
        color: #02776b;
      }
      &.selected {
        color: #2196f3;
      }
    }
    tbody tr td.count,
    tbody tr th.count {
      text-align: center;
    }
  }
}
</style>
