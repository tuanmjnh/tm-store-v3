<template>
  <q-btn-dropdown flat :dense="dense" :color="color" :icon="icon" :dropdown-icon="dropdownIcon"
                  :loading="isLoading" :class="[label?'':'q-btn-dropdown-tm']">
    <template v-slot:label>
      {{label}}
      <q-tooltip v-if="isTooltip">{{labelTooltip}}</q-tooltip>
    </template>
    <q-list dense>
      <q-item clickable v-close-popup v-for="(e,i) in types" :key="i" @click="onExport(e)">
        <q-item-section>
          <q-item-label>{{e.title}}</q-item-label>
        </q-item-section>
      </q-item>
    </q-list>
  </q-btn-dropdown>

  <!-- <q-btn flat round :dense="dense" :color="color" :icon="icon" :loading="isLoading"
      @click="onDownload">
      <q-tooltip v-if="isTooltip">
        {{lblTooltip}}
      </q-tooltip>
    </q-btn>
  </div> -->
</template>

<script>
import { defineComponent, ref, getCurrentInstance } from 'vue';
// import moment from 'moment'
import JSZip from 'jszip'
import XLSX from 'xlsx'
export default defineComponent({
  name: 'tm-export',
  props: {
    data: { type: [Array, String], default: null },
    icon: { type: String, default: 'cloud_download' },
    dropdownIcon: { type: String, default: 'arrow_drop_down' },
    color: { type: String, default: 'blue' },
    dense: { type: Boolean, default: false },
    label: { type: String, default: '' },
    labelTooltip: { type: String, default: 'Export' },
    isTooltip: { type: Boolean, default: false },
    filename: { type: String, default: 'export' },
    sheetName: { type: String, default: 'sheet1' },
    appendFix: { type: Boolean, default: false },
    options: { type: Object, default: () => { } },
    types: {
      type: Array,
      default: () => [
        { title: 'Export .xlsx', type: 'xlsx' },
        { title: 'Export .xls', type: 'xls' },
        { title: 'Export .csv', type: 'csv' },
        { title: 'Export .xml', type: 'xml' },
        { title: 'Export .xml.zip', type: 'xml-zip' },
        { title: 'Export .pdf', type: 'pdf' },
        { title: 'Export .sql', type: 'sql' }
      ]
    }
  },
  setup (props, { emit }) {
    const { $moment } = getCurrentInstance().appContext.config.globalProperties
    const isLoading = ref(false)
    const onExport = (item) => {
      new Promise((resolve, reject) => {
        isLoading.value = true
        emit('start', item)
        resolve(true)
      }).then(() => {
        if (item.type === 'xlsx') {
          onToXlsx(props.data)
        } else if (item.type === 'xls') {
          onToXls(props.data)
        } else if (item.type === 'xml') {
          onToXML(props.data)
        } else if (item.type === 'xml-zip') {
          onToZipXML(props.data)
        }
      }).finally(() => {
        emit('finish', item)
        isLoading.value = false
      });
    }
    const onToXlsx = () => {
      /* this line is only needed if you are not adding a script tag reference */
      // if (typeof XLSX === 'undefined') XLSX = require('xlsx');

      /* make the worksheet */
      var ws = XLSX.utils.json_to_sheet(props.data);

      /* add to workbook */
      var wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, props.sheetName);

      /* generate an XLSX file */
      XLSX.writeFile(wb, onGetFileName(props.filename, 'xlsx', props.appendFix));
    }
    const onToXls = () => {
      /* this line is only needed if you are not adding a script tag reference */
      // if (typeof XLSX === 'undefined') XLSX = require('xlsx');

      /* make the worksheet */
      var ws = XLSX.utils.json_to_sheet(props.data);

      /* add to workbook */
      var wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, props.sheetName);

      /* generate an XLSX file */
      XLSX.writeFile(wb, onGetFileName(props.filename, 'xls', props.appendFix));
    }
    const onToXML = (xmlString) => {
      if (!xmlString) {
        // console.log('No data available!')
        return
      }
      var BOM = '\uFEFF'
      var blob = new Blob([BOM + xmlString], { type: 'text/xml;charset=utf-8' }) //  'text/xml;charset=utf-8'
      var url = window.webkitURL.createObjectURL(blob)
      const link = document.createElement('a')
      link.setAttribute('href', url)
      link.setAttribute('download', onGetFileName(props.filename, 'xml', props.appendFix))
      link.click()
    }
    const onToZipXML = (xmlString) => {
      if (!xmlString) {
        // console.log('No data available!')
        return
      }
      const zip = new JSZip()
      zip.file(`${props.filename}.xml`, xmlString)
      zip.generateAsync({ type: 'blob' })
        .then((blob) => {
          // saveAs(blob, `${props.zipname}.zip`)
          var url = window.webkitURL.createObjectURL(blob)
          const link = document.createElement('a')
          link.setAttribute('href', url)
          link.setAttribute('download', onGetFileName(props.zipname, 'zip', props.appendFix))
          link.click()
        })
        .catch(e => {
          // console.log(e)
        })
    }
    const onGetFileName = (filename, ext, fix = false) => {
      return `${fix ? `${filename}_${$moment().format('YYYYMMDDhhmmss')}` : filename}.${ext}`
    }

    return {
      props, isLoading,
      onExport
    }
  }
})
</script>

<style scoped>
.q-btn-dropdown-tm >>> .q-btn-dropdown__arrow {
  display: none;
}
</style>
