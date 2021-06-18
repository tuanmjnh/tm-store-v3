<template>
  <div class="tm-file-list">
    <div class="tool-bar">
      <div class="title">{{labelTitle}}</div>
      <div class="menu">
        <slot v-if="slotToolBar" name="tool-bar"></slot>
        <div v-if="!slotToolBar" :class="['btn btn-view tooltip',viewType!=='list'?'active':'']"
             @click="onChangeView('box')">
          <i class="icon-btn material-icons">view_module</i>
          <span class="tooltip-text tooltip-tool-bar">{{labelViewBox}}</span>
        </div>
        <div v-if="!slotToolBar" :class="['btn btn-group btn-view tooltip',viewType==='list'?'active':'']"
             @click="onChangeView('list')">
          <i class="icon-btn material-icons">view_list</i>
          <span class="tooltip-text tooltip-tool-bar">{{labelViewList}}</span>
        </div>
      </div>
    </div>
    <div class="panel">
      <slot v-if="slotPanelLeft" name="panel-left"></slot>
      <div class="panel-right">
        <div v-if="loading" class="lds-roller">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
        <div class="views view-box" v-if="viewType!=='list'">
          <div v-show="!loading" v-for="(e,i) in dataLocal" :key="i" :class="['item',onGetSelected(e)]"
               @click="onSelectItem(e)" :style="`width:${size}px;height:${size}px`">
            <div class="content" v-if="Extension.isImage(e)"
                 :style="Extension.getBackgroundImage(e)+`;height:${size-4}px`" />
            <!-- <img class="content" :src="e.fullName"> -->
            <!-- {{e.fullName}} -->
            <i v-else-if="Extension.isAudio(e)" class="content material-icons"
               :style="`height:${size-4}px`">audiotrack</i>
            <!-- <audio controls>
            <source :src="e.fullName" type="audio/ogg">
            <source :src="e.fullName" type="audio/mpeg">
          </audio> -->
            <i v-else-if="Extension.isVideo(e)" class="content material-icons"
               :style="`height:${size-4}px`">video_library</i>
            <!-- <video controls>
            <source :src="e.fullName" type="video/mp4">
            <source :src="e.fullName" type="video/ogg">
          </video> -->
            <i v-else-if="Extension.isPdf(e)" class="content material-icons"
               :style="`height:${size-4}px`">picture_as_pdf</i>
            <i v-else-if="Extension.isFlash(e)" class="content material-icons"
               :style="`height:${size-4}px`">burst_mode</i>
            <i v-else-if="Extension.isCode(e)" class="content material-icons" :style="`height:${size-4}px`">code</i>
            <i v-else-if="Extension.isDoc(e)" class="content material-icons"
               :style="`height:${size-4}px`">description</i>
            <i v-else-if="Extension.isSheet(e)" class="content material-icons"
               :style="`height:${size-4}px`">list_alt</i>
            <i v-else-if="Extension.isText(e)" class="content material-icons"
               :style="`height:${size-4}px`">assignment</i>
            <i v-else class="content material-icons" :key="i" :style="`height:${size-4}px`">file_copy</i>
            <i class="material-icons file-delete" @click="onDelete(i)">clear</i>
            <q-tooltip>{{Extension.getNameFilePath(e)}}</q-tooltip>
            <!-- <span class="tooltip-text tooltip-bottom">{{Extension.getNameFilePath(e)}}</span> -->
          </div>
        </div>
        <div v-else class="views view-list">
          <table :class="[isBorder?'table-border':'']">
            <thead v-if="isHeader">
              <tr>
                <th v-if="isCount" class="cmd">#</th>
                <th>{{labelFileName}}</th>
                <!-- <th>Type</th> -->
                <!-- <th>{{labelFileSize}}</th> -->
                <th class="cmd">#</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(e,i) in dataLocal" :key="i" :class="['item',onGetSelected(e)]" @click="onSelectItem(e)">
                <td v-if="isCount" class="cmd">{{i+1}}</td>
                <td>{{Extension.getNameFilePath(e)}}</td>
                <!-- <td>{{e.ext}}</td> -->
                <!-- <td>{{e.size}}</td> -->
                <td class="cmd"><i class="material-icons file-delete" @click="onDelete(i)">clear</i></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, computed } from 'vue';
import * as extension from '@/utils/extension'
import { useQuasar } from 'quasar'
export default defineComponent({
  name: 'tm-file-list',
  props: {
    data: { default: null },
    selected: { type: Array, default: () => [] },
    multiple: { type: Boolean, default: false },
    loading: { type: Boolean, default: false },
    isHeader: { type: Boolean, default: false },
    isCount: { type: Boolean, default: false },
    isBorder: { type: Boolean, default: false },
    size: { type: Number, default: 80 },
    viewType: { type: String, default: 'box' },
    labelTitle: { type: String, default: '' },
    labelViewList: { type: String, default: 'View list' },
    labelViewBox: { type: String, default: 'View box' },
    labelFileName: { type: String, default: 'File name' },
    labelFileSize: { type: String, default: 'Size' },
    labelConfirmTitle: { type: String, default: 'Confirm' },
    labelConfirmContent: { type: String, default: 'Are you sure you want to delete this record?' }
  },
  setup (props, { emit, slots }) {
    const $q = useQuasar()
    const Extension = extension
    const slotToolBar = computed(() => !!slots['tool-bar'])
    const slotPanelLeft = computed(() => !!slots['panel-left'])
    const dataLocal = computed(() => {
      if (props.data) {
        if (typeof props.data === 'string') return [props.data]
        else return props.data
      } else return null
    })
    return {
      Extension, slotToolBar, slotPanelLeft, dataLocal,
      onGetStyleImage: (url) => {
        return `background-size: cover; background-position: 50% 50%; background-image: url("${url}");`
      },
      onSelectItem: (item) => {
        const i = props.selected.findIndex(x => x === item)
        if (i > -1) {
          // props.selected.splice(i, 1)
          emit(props.selected, props.selected.slice().splice(i, 1))
          emit('on-unselect', item)
        } else {
          if (props.multiple) emit(props.selected, props.selected.slice().push(item))// props.selected.push(item)
          else emit('update:selected', [item])
          emit('on-select', item)
        }
      },
      onChangeView: (view) => {
        emit('update:viewType', view)
      },
      onGetSelected: (item) => {
        const i = props.selected.findIndex(x => x === item)
        return i > -1 ? 'selected' : ''
      },
      onDelete: (i) => {
        $q.dialog({
          title: props.labelConfirmTitle,
          message: props.labelConfirmContent,
          cancel: true,
          persistent: true
        }).onOk(() => {
          if (i > -1) emit(props.data, props.data.slice().splice(i, 1))// props.data.splice(index, 1)
        })
      }
    }
  }
})
</script>

<style lang="scss">
$tooltip-color: #757575;
$delete-color: #b71c1c;
.tm-file-list {
  // min-height: 200px;
  min-width: 510px;
  .tool-bar {
    display: flex;
    justify-content: space-between;
    margin-bottom: 6px;
    // flex-wrap: wrap;
    .title {
      font-size: 0.875rem;
      font-weight: 500;
      line-height: 1.375rem;
      letter-spacing: 0.00714em;
    }
    .menu {
      .btn-group {
        margin-left: 0px !important;
      }
      .btn {
        display: inline-block;
        margin-left: 5px;
      }
      i.icon-btn {
        padding: 6px 12px;
        cursor: pointer;
        color: #fff;
      }
      .btn-view {
        background-color: #009688;
        &:hover,
        &.active {
          background-color: #02776b;
        }
      }
      .btn-accept {
        background-color: #2196f3;
        &:hover {
          background-color: #2c8bd8;
        }
      }
    }
  }
  .panel {
    display: flex;
    // flex-wrap: wrap;
    // overflow: scroll;
    // min-height: 200px;
    .panel-right {
      // width: 350px;
      // overflow: auto;
      position: relative;
      // float: left;
      width: 100%;
      .item {
        cursor: pointer;
        transition: all 0.5s;
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
          .file-delete {
            display: none;
            color: #fff;
            background-color: $delete-color;
            position: absolute;
            right: 0;
            top: 0;
            opacity: 0;
            transition: opacity 0.3s;
          }
          &:hover .file-delete {
            display: initial !important;
            opacity: 1;
          }
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
            .file-delete {
              color: #393939;
            }
            &:hover {
              color: #02776b;
            }
            &:hover .file-delete {
              color: $delete-color;
            }
            &.selected {
              color: #2196f3;
            }
          }
          tbody tr td.cmd,
          tbody tr th.cmd {
            width: 1px;
            text-align: center;
          }
        }
      }
    }
  }

  /* Tooltip text */
  .tooltip {
    position: relative;
  }
  .tooltip .tooltip-text {
    visibility: hidden;
    width: 120px;
    word-break: break-word;
    background-color: $tooltip-color;
    color: #fff;
    text-align: center;
    padding: 5px;
    border-radius: 3px;

    /* Position the tooltip text */
    position: absolute;
    z-index: 1;
    bottom: 108%;
    left: 50%;
    margin-left: -60px;

    /* Fade in tooltip */
    opacity: 0;
    transition: opacity 0.3s;
    // display: none;
  }

  /* Tooltip arrow */
  .tooltip .tooltip-text::after {
    content: "";
    position: absolute;
    top: 100%;
    left: 50%;
    margin-left: -5px;
    border-width: 5px;
    border-style: solid;
    border-color: $tooltip-color transparent transparent transparent;
  }

  /* Show the tooltip text when you mouse over the tooltip container */
  .tooltip:hover .tooltip-text {
    visibility: visible;
    opacity: 1;
    display: initial;
  }
  .tooltip-top {
    bottom: 108% !important;
    left: 50% !important;
    right: initial !important;
    top: initial !important;
    margin-left: -60px !important;
  }
  .tooltip-top::after {
    top: 100% !important;
    left: 50% !important;
    right: initial !important;
    bottom: initial !important;
    border-color: $tooltip-color transparent transparent transparent !important;
  }
  .tooltip-right {
    top: -5px !important;
    left: 108% !important;
    right: initial !important;
    bottom: initial !important;
  }
  .tooltip-right::after {
    top: 50% !important;
    right: 100% !important;
    left: initial !important;
    bottom: initial !important;
    border-color: transparent $tooltip-color transparent transparent !important;
  }
  .tooltip-bottom {
    top: 108% !important;
    left: 50% !important;
    right: initial !important;
    bottom: initial !important;
    margin-left: -60px !important;
  }
  .tooltip-bottom::after {
    bottom: 100% !important;
    left: 50% !important;
    right: initial !important;
    top: initial !important;
    border-color: transparent transparent $tooltip-color transparent !important;
  }
  .tooltip-left {
    top: 28% !important;
    bottom: auto !important;
    right: 107% !important;
    left: initial !important;
  }
  .tooltip-left::after {
    top: 38% !important;
    left: 104% !important;
    right: initial !important;
    bottom: initial !important;
    border-color: transparent transparent transparent $tooltip-color !important;
  }
  .tooltip-tool-bar {
    top: 121% !important;
    left: -216% !important;
    right: initial !important;
    bottom: initial !important;
    margin-left: 0 !important;
    // width: fit-content !important;
  }
  .tooltip-tool-bar::after {
    bottom: 100% !important;
    left: initial !important;
    right: 12% !important;
    top: initial !important;
    border-color: transparent transparent $tooltip-color transparent !important;
  }

  /* Loading files*/
  .lds-roller {
    display: inline-block;
    position: absolute;
    width: 80px;
    height: 80px;
    top: 30%;
    left: 38%;
  }
  .lds-roller div {
    animation: lds-roller 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
    transform-origin: 40px 40px;
  }
  .lds-roller div:after {
    content: " ";
    display: block;
    position: absolute;
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: #009688;
    margin: -4px 0 0 -4px;
  }
  .lds-roller div:nth-child(1) {
    animation-delay: -0.036s;
  }
  .lds-roller div:nth-child(1):after {
    top: 63px;
    left: 63px;
  }
  .lds-roller div:nth-child(2) {
    animation-delay: -0.072s;
  }
  .lds-roller div:nth-child(2):after {
    top: 68px;
    left: 56px;
  }
  .lds-roller div:nth-child(3) {
    animation-delay: -0.108s;
  }
  .lds-roller div:nth-child(3):after {
    top: 71px;
    left: 48px;
  }
  .lds-roller div:nth-child(4) {
    animation-delay: -0.144s;
  }
  .lds-roller div:nth-child(4):after {
    top: 72px;
    left: 40px;
  }
  .lds-roller div:nth-child(5) {
    animation-delay: -0.18s;
  }
  .lds-roller div:nth-child(5):after {
    top: 71px;
    left: 32px;
  }
  .lds-roller div:nth-child(6) {
    animation-delay: -0.216s;
  }
  .lds-roller div:nth-child(6):after {
    top: 68px;
    left: 24px;
  }
  .lds-roller div:nth-child(7) {
    animation-delay: -0.252s;
  }
  .lds-roller div:nth-child(7):after {
    top: 63px;
    left: 17px;
  }
  .lds-roller div:nth-child(8) {
    animation-delay: -0.288s;
  }
  .lds-roller div:nth-child(8):after {
    top: 56px;
    left: 12px;
  }
  @keyframes lds-roller {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
}
</style>
