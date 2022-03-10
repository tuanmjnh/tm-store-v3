<template>
  <div class="tm-files">
    <tm-file-list :files="files" :loading="loadingFile" :view-type="viewType" :selected="selected"
                  :multiple="multiple">
      <template v-slot:tool-bar>
        <div class="btn btn-accept tooltip" @click="onAccept">
          <i class="material-icons">check</i>
          <span class="tooltip-text tooltip-tool-bar">{{labelAccept}}</span>
        </div>
        <div :class="['btn btn-view tooltip',viewType==='box'?'active':'']" @click="onChangeView('box')">
          <i class="material-icons">view_module</i>
          <span class="tooltip-text tooltip-tool-bar">{{labelViewBox}}</span>
        </div>
        <div :class="['btn btn-group btn-view tooltip',viewType==='list'?'active':'']" @click="onChangeView('list')">
          <i class="material-icons">view_list</i>
          <span class="tooltip-text tooltip-tool-bar">{{labelViewList}}</span>
        </div>
      </template>
      <template v-slot:panel-left>
        <div class="panel-left">
          <div v-if="loadingDir" class="lds-ring">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </div>
          <tm-tree v-show="!loadingDir" :nodes="directories" :selected="treeSelected" nodeKey="id" nodeLabel="name"
                   :draggable="true" @on-selected="getData" no-nodes-label="">
          </tm-tree>
        </div>
      </template>
    </tm-file-list>
  </div>
</template>

<script>
import axios from 'axios'
import tmTree from '@/components/tm-tree'
import tmFileList from '@/components/tm-file-list'
import contextMenu from '@/components/context-menu'
export default {
  name: 'tm-files',
  components: { tmFileList, tmTree }, // , contextMenu
  props: {
    title: { type: String, default: 'Files' },
    items: { type: Array, default: () => [] },
    url: { type: String, default: '' },
    // urlFile: { type: String, default: '' },
    // urlDirectory: { type: String, default: '' },
    headers: { type: Array, default: () => { } },
    noNodesLabel: { type: String, default: 'No data available' },
    accept: { type: Array, default: undefined },
    selected: { type: Array, default: () => [] },
    multiple: { type: Boolean, default: false },
    labelViewList: { type: String, default: 'View list' },
    labelViewBox: { type: String, default: 'View box' },
    labelAccept: { type: String, default: 'Accept' }
  },
  data () {
    return {
      loadingDir: true,
      loadingFile: true,
      directories: [],
      files: [],
      treeSelected: {},
      loadedFolder: '',
      viewType: 'box',
      contextMenu: false,
      contextData: null
    }
  },
  created () {
    this.getDirectories().then(x => {
      this.getFiles()
    })
  },
  // computed: {
  // },
  // watch: {
  //   selected(val) {
  //     console.log(val)
  //   }
  // },
  methods: {
    getDirectories () {
      return new Promise((resolve, reject) => {
        let headers = {}
        this.headers.forEach(e => {
          headers[e.name] = e.value
        })
        axios.get(`${this.url}/directories`, { headers: headers }).then(res => {
          if (res.data) this.directories = res.data
          this.loadingDir = false
          resolve(res.data)
        }).catch((e) => {
          reject(e)
        })
      })
    },
    getFiles (dir = '', loadedFolder) {
      this.$emit('update:selected', [])
      this.files = []
      this.loadingFile = true
      this.loadedFolder = loadedFolder
      let headers = {}
      this.headers.forEach(e => {
        headers[e.name] = e.value
      })
      axios.get(`${this.url}/files`, { headers: headers, params: { dir: dir } }).then(async res => {
        if (res.data) {
          if (this.accept === undefined || this.accept === '*' || this.accept.includes('*')) {
            this.files = res.data
          } else {
            for await (let e of res.data) {
              if (this.accept.includes('image/*')) {
                if (this.isImage(e.name)) {
                  this.files.push(e)
                  continue
                }
              }
              if (this.accept.includes('audio/*')) {
                if (this.isAudio(e.name)) {
                  this.files.push(e)
                  continue
                }
              }
              if (this.accept.includes('video/*')) {
                if (this.isVideo(e.name)) {
                  this.files.push(e)
                  continue
                }
              }
              if (this.accept.includes('code/*')) {
                if (this.isCode(e.name)) {
                  this.files.push(e)
                  continue
                }
              }
              if (this.accept.includes(this.getExtension(e.name))) {
                this.files.push(e)
                continue
              }
            }
          }
        }
      }).finally(() => {
        setTimeout(() => { this.loadingFile = false }, 300)
      })
    },
    getData (node) {
      if (!this.treeSelected) this.treeSelected = node
      if (this.treeSelected.name !== this.loadedFolder) this.getFiles(node.fullName, node.name)
      // this.getFiles(node.fullName.replace(/^uploads\\/, ''))
    },
    getStyleImage (url) {
      return `background-size: cover; background-position: 50% 50%; background-image: url("${url}");`
    },
    onSelectItem (item) {
      // item.selected = true
      const index = this.selected.findIndex(x => x.name === item.name)
      if (index > -1) {
        this.selected.splice(index, 1)
        this.$emit('on-unselect', item)
      } else {
        if (this.multiple) this.selected.push(item)
        else this.$emit('update:selected', [item])
        this.$emit('on-select', item)
      }
    },
    onChangeView (view) {
      this.viewType = view
    },
    onGetSelected (item) {
      const i = this.selected.findIndex(x => x.name === item.name)
      return i > -1 ? 'selected' : ''
    },
    onActionContext (type) {
      if (type === 'delete') {
        console.log(this.contextData)
      }
    },
    onAccept () {
      // this.$emit('update:selected', [])
      this.$emit('on-finish', [...this.selected])
    },
    getExtension (file, dot = false) {
      if (!file) return null
      let regx = /(?:\.([^.]+))?$/
      file = regx.exec(file)
      return file ? (dot ? file[0].toLowerCase() : file[1].toLowerCase()) : ''
    },
    isImage (value) {
      if (!value) return false
      const rs = /\.(gif|jpg|jpeg|tiff|png|img|ico)$/i.test(value.toLowerCase())
      // console.log(this.accept, this.accept === undefined)
      return rs
      // if (this.accept === undefined || this.accept.includes('*') || this.accept.includes('image/*')) return rs
      // else return rs && this.accept.includes(this.getExtension(value))
    },
    isAudio (value) {
      if (!value) return false
      const rs = /\.(mp3|wav|wave|ogg|m4a|3ga|4mp|aa3)$/i.test(value.toLowerCase())
      return rs
      // if (this.accept === undefined || this.accept.includes('*') || this.accept.includes('audio/*')) return rs
      // else return rs && this.accept.includes(this.getExtension(value))
    },
    isVideo (value) {
      if (!value) return false
      const rs = /\.(3g2|3gp|3gp2|3gpp|3gpp2|amv|flv|gom|mp4|mov|mpe|mpeg|mpg||kmv|mkv|wvm|wmv)$/i.test(value.toLowerCase())
      return rs
      // if (this.accept === undefined || this.accept.includes('*') || this.accept.includes('video/*')) return rs
      // else return rs && this.accept.includes(this.getExtension(value))
    },
    isPdf (value) {
      if (!value) return false
      const rs = /\.(pdf)$/i.test(value.toLowerCase())
      return rs
      // if (this.accept === undefined || this.accept.includes('*')) return rs
      // else return rs && this.accept.includes(this.getExtension(value))
    },
    isDoc (value) {
      if (!value) return false
      const rs = /\.(doc|docx)$/i.test(value.toLowerCase())
      return rs
      // if (this.accept === undefined || this.accept.includes('*')) return rs
      // else return rs && this.accept.includes(this.getExtension(value))
    },
    isSheet (value) {
      if (!value) return false
      const rs = /\.(xls|xlsx)$/i.test(value.toLowerCase())
      return rs
      // if (this.accept === undefined || this.accept.includes('*')) return rs
      // else return rs && this.accept.includes(this.getExtension(value))
    },
    isFlash (value) {
      if (!value) return false
      const rs = /\.(swf)$/i.test(value.toLowerCase())
      return rs
      // if (this.accept === undefined || this.accept.includes('*')) return rs
      // else return rs && this.accept.includes(this.getExtension(value))
    },
    isCode (value) {
      if (!value) return false
      const rs = /\.(sql|json|js)$/i.test(value.toLowerCase())
      return rs
      // if (this.accept === undefined || this.accept.includes('*') || this.accept.includes('code/*')) return rs
      // else return rs && this.accept.includes(this.getExtension(value))
    },
    isText (value) {
      if (!value) return false
      const rs = /\.(txt|rtf)$/i.test(value.toLowerCase())
      return rs
      // if (this.accept === undefined || this.accept.includes('*') || this.accept.includes('text/*')) return rs
      // else return rs && this.accept.includes(this.getExtension(value))
    }
  }
}
</script>

<style lang="scss">
$tooltip-color: #757575;
.panel-left {
  // min-width: 200px;
  border-right: 1px solid #ccc;
  white-space: nowrap;
  padding-right: 15px;
  // margin-right: 10px;
  position: relative;
  min-width: 180px;
  // width: 160px;
  // float: left;
  overflow: auto;
  // overflow-x: hidden;
}
/* Loading folder*/
.lds-ring {
  display: inline-block;
  position: absolute;
  width: 30px;
  height: 30px;
  top: 38%;
  left: 26%;
}
.lds-ring div {
  box-sizing: border-box;
  display: block;
  position: absolute;
  width: 30px;
  height: 30px;
  margin: 3px;
  border: 3px solid #009688;
  border-radius: 50%;
  animation: lds-ring 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
  border-color: #009688 transparent transparent transparent;
}
.lds-ring div:nth-child(1) {
  animation-delay: -0.45s;
}
.lds-ring div:nth-child(2) {
  animation-delay: -0.3s;
}
.lds-ring div:nth-child(3) {
  animation-delay: -0.15s;
}
@keyframes lds-ring {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
