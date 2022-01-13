<template>
  <div class="tm-file-list">
    <q-toolbar>
      <q-toolbar-title>{{labelTitle}}</q-toolbar-title>
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
      <slot v-if="slotPanelLeft" name="panel-left"></slot>
      <div class="panel-right">
        <q-spinner v-if="loading" style="top:50%;left:50%;position:absolute" color="primary" size="6em" :thickness="1" />
        <div class="views view-box" v-if="viewType!=='list'">
          <div v-show="!loading" v-for="(e,i) in rows" :key="i" @click="onSelectItem(e.name)" :style="`width:${size}px;height:${size}px`"
               :class="['item',multiple?(selected&&selected.indexOf(e.name)>-1?'selected':''):(selected===e.name?'selected':'')]">
            <q-img v-if="Extension.isImage(e.name)" :src="e.name" spinner-color="primary" :style="{height:`${size-4}px`}">
              <template v-slot:error>
                <i class="content material-icons" style="font-size:60px;position:absolute;top:25%;left:25%;color:#908f8f">photo_size_select_actual</i>
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
            <i v-else-if="Extension.isDoc(e.name)" class="content material-icons" :style="`height:${size-4}px;font-size:${size-50}px`">description</i>
            <i v-else-if="Extension.isSheet(e.name)" class="content material-icons" :style="`height:${size-4}px;font-size:${size-50}px`">list_alt</i>
            <i v-else-if="Extension.isText(e.name)" class="content material-icons" :style="`height:${size-4}px;font-size:${size-50}px`">assignment</i>
            <i v-else class="content material-icons" :key="i" :style="`height:${size-4}px;font-size:${size-50}px`">file_copy</i>

            <i class="material-icons file-delete" @click="onDelete(i)">clear</i>
            <q-tooltip>{{Extension.getNameFilePath(e.name)}}</q-tooltip>
          </div>
        </div>
        <div v-else class="views view-list">
          <q-table flat dense :rows="rows" :columns="columns" :visible-columns="visibleColumns" row-key="name" selection="multiple"
                   :no-data-label="$t('table.noData')" :rows-per-page-label="$t('table.rowPerPage')"
                   :selected-rows-label="()=>`${selected.length} ${$t('table.rowSelected')}`" :rows-per-page-options="rowsPerPageOptions">
            <template v-slot:header="props">
              <q-tr :props="props">
                <!-- <q-th auto-width>
                  <q-checkbox v-model="props.selected" indeterminate-value="some" :dense="true" />
                </q-th> -->
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
                <!-- <q-td auto-width key="select">
                  <q-checkbox v-model="props.selected" color="primary" :dense="true" />
                </q-td> -->
                <q-td auto-width key="index" :props="props">{{props.row.index+1}}</q-td>
                <q-td auto-width key="icon" :props="props">
                  <q-img :src="props.row.name" spinner-color="primary" style="height:23px;max-width:25px" fit="cover"
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
                <q-td auto-width key="type" :props="props">{{props.row.type}}</q-td>
                <!-- <q-td key="size" :props="props">{{props.row.size}}</q-td> -->
                <td auto-width>
                  <q-btn flat round dense color="negative" icon="clear" size="sm" @click="onDelete(props.row.index)">
                    <q-tooltip v-if="!$q.platform.is.mobile">{{labelDeleteFile}}</q-tooltip>
                  </q-btn>
                </td>
              </q-tr>
            </template>
          </q-table>
          <!-- <table :class="[isBorder?'table-border':'']">
            <thead v-if="isHeader">
              <tr>
                <th v-if="isCount" class="cmd">#</th>
                <th>{{labelFileName}}</th>
                <th class="cmd">#</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(e,i) in rows" :key="i" @click="onSelectItem(e)"
                  :class="['item',multiple?(selected&&selected.indexOf(e)>-1?'selected':''):(selected===e?'selected':'')]">
                <td v-if="isCount" class="cmd">{{i+1}}</td>
                <td>{{Extension.getNameFilePath(e)}}</td>
                <td class="cmd"><i class="material-icons file-delete" @click="onDelete(i)">clear</i></td>
              </tr>
            </tbody>
          </table> -->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref, computed } from 'vue';
import * as extension from '@/utils/extension'
import { useQuasar } from 'quasar'

export default defineComponent({
  name: 'tm-file-list',
  props: {
    modelValue: { default: null },
    selected: { default: null },
    multiple: { type: Boolean, default: false },
    loading: { type: Boolean, default: false },
    isHeader: { type: Boolean, default: false },
    isCount: { type: Boolean, default: false },
    isBorder: { type: Boolean, default: false },
    size: { type: Number, default: 80 },
    rowsPerPageOptions: { type: Array, default: () => [10, 20, 30, 50] },
    viewType: { type: String, default: 'box' },
    labelTitle: { type: String, default: '' },
    labelViewList: { type: String, default: 'View list' },
    labelViewBox: { type: String, default: 'View box' },
    labelIndex: { type: String, default: 'Index' },
    labelIcon: { type: String, default: 'Icon' },
    labelType: { type: String, default: 'Type' },
    labelFileName: { type: String, default: 'File name' },
    labelFileSize: { type: String, default: 'Size' },
    labelDeleteFile: { type: String, default: 'Delete' },
    labelConfirmTitle: { type: String, default: 'Confirm' },
    labelConfirmContent: { type: String, default: 'Are you sure you want to delete this record?' }
  },
  setup (props, { emit, slots }) {
    const $q = useQuasar()
    const Extension = extension
    const slotToolBar = computed(() => !!slots['tool-bar'])
    const slotPanelLeft = computed(() => !!slots['panel-left'])
    const visibleColumns = ref(['index', 'icon', 'type'])
    const columns = ref([
      { name: 'index', field: 'index', label: props.labelIndex, align: 'left', sortable: true },
      { name: 'icon', field: 'icon', label: props.labelIcon, align: 'center' },
      { name: 'name', field: 'name', label: props.labelFileName, align: 'left', required: true, sortable: true },
      { name: 'type', field: 'type', label: props.labelType, align: 'left', sortable: true }
      // { name: 'size', field: 'size', label: 'Size', align: 'left', sortable: true }
    ])
    const rows = computed(() => {
      if (props.modelValue) {
        if (typeof props.modelValue === 'string') return [{
          index: 0,
          icon: '',
          name: props.modelValue,
          type: Extension.getExtension(props.modelValue, false),
          size: 0
        }]
        else {
          const rs = []
          for (let i = 0; i < props.modelValue.length; i++) {
            rs.push({
              index: i,
              icon: '',
              name: props.modelValue[i],
              type: Extension.getExtension(props.modelValue[i], false),
              size: 0
            })
          }
          return rs
        }
      } else return []
    })
    return {
      Extension, slotToolBar, slotPanelLeft, rows, visibleColumns, columns,
      onGetStyleImage: (url) => {
        return `background-size:cover;background-position:50% 50%;background-image:url("${url}");`
      },
      onSelectItem: (val) => {
        // console.log(event.target.class.push('selected'))
        // event.target.classList.toggle('selected')

        let selected = props.selected
        if (props.multiple) {
          if (!selected) selected = []
          const i = selected.indexOf(val)
          if (i < 0) {
            selected.push(val)
            emit('update:selected', selected)
          } else {
            selected.splice(i, 1)
            emit('update:selected', selected)
            emit('on-unselect', val)
          }
        } else {
          if (selected === val) selected = null
          else selected = val
          emit('update:selected', selected)
        }
      },
      onChangeView: (val) => {
        emit('update:viewType', val)
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
        if (val > -1) $q.dialog({ title: props.labelConfirmTitle, message: props.labelConfirmContent, cancel: true, persistent: true }).onOk(() => {
          if (props.multiple) {
            const x = props.modelValue.slice()
            x.splice(val, 1)
            emit('update:modelValue', x)
            emit('on-delete', x)
          } else {
            emit('update:modelValue', null)
            emit('on-delete', null)
          }
        })
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
.tm-file-list {
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
    }
  }
}
</style>
