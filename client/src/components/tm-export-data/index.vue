<template>
  <q-btn-dropdown flat dense :color="color" :icon="icon" :dropdown-icon="dropdownIcon">
    <q-list dense>
      <q-item clickable v-close-popup v-for="(e, i) in items" :key="i" @click="onExport(e)">
        <q-item-section>
          <q-item-label>{{ e.title }}</q-item-label>
        </q-item-section>
      </q-item>
    </q-list>
  </q-btn-dropdown>

  <!-- <el-dropdown trigger="click" class="export-data" @command="onExport">
    <el-button type="primary" plain size="mini">
      <svg-icon :icon-class="icon" />
    </el-button>
    <el-dropdown-menu slot="dropdown">
      <el-dropdown-item v-for="(item, i) in items" :key="i" :command="item">
        {{ item.title }}
      </el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown> -->
</template>

<script>
import { defineComponent, getCurrentInstance } from 'vue';

import JSZip from 'jszip'
export default defineComponent({
  name: 'tm-export-data',
  props: {
    data: { type: [Array, String], default: null },
    getData: { type: Function, default: () => { } },
    icon: { type: String, default: 'cloud_download' }, // more_vert
    dropdownIcon: { type: String, default: 'icon' }, // more_vert
    tooltip: { type: String, default: 'Export' },
    color: { type: String, default: 'blue' },
    filename: { type: String, default: 'export' },
    zipname: { type: String, default: 'export' },
    suffixFileName: { type: Boolean, default: false },
    items: {
      type: Array,
      default: () => [
        { title: 'Export .csv', type: 'csv' },
        { title: 'Export .xml', type: 'xml' },
        { title: 'Export .pdf', type: 'pdf' },
        { title: 'Export .sql', type: 'sql' }
      ]
    }
  },
  setup (props) {
    const { $moment } = getCurrentInstance().appContext.config.globalProperties

    const onExport = (item) => {
      if (item.type === 'csv') {
        props.getData().then((x) => {
          if (!x) {
            // console.log('No data available!')
            return
          }
          // console.log(x.has)
          onExportCSV(x)
        })
      } else if (item.type === 'xml') {
        onExportXML(props.data)
      } else if (item.type === 'zip-xml') {
        onExportZipXML(props.data)
      }
    }
    const onExportCSV = (data = []) => {
      // console.log(data)
      if (data.length < 1) {
        // console.log('No data available!')
        return
      }
      let csvContent = ''// "data:text/csv;charset=utf-8,"
      csvContent += [
        `"${Object.keys(data[0]).join('","')}"`,
        ...data.map(item => `"${Object.values(item).join('","')}"`)
      ].join('\r\n').replace(/(^\[)|(\]$)/gm, '')
      var BOM = '\uFEFF'
      // encodeURI(csvContent)
      var blob = new Blob([BOM + csvContent], { type: 'text/plain;charset=utf-8' }) // 'text/csvcharset=utf-8'
      var csvUrl = window.webkitURL.createObjectURL(blob)
      const link = document.createElement('a')
      link.setAttribute('href', csvUrl)
      link.setAttribute('download', `${props.suffixFileName ? `${props.filename}_${$moment().format('YYYYMMDDhhmmss')}` : props.filename}.csv`)
      link.click()
      // const link = document.createElement("a")
      // link.setAttribute("href", data)
      // link.setAttribute("download", "export.csv")
      // link.click()
    }
    const onExportXML = (xmlString) => {
      if (!xmlString) {
        // console.log('No data available!')
        return
      }
      var BOM = '\uFEFF'
      var blob = new Blob([BOM + xmlString], { type: 'text/xml;charset=utf-8' }) //  'text/xml;charset=utf-8'
      var url = window.webkitURL.createObjectURL(blob)
      const link = document.createElement('a')
      link.setAttribute('href', url)
      link.setAttribute('download', `${props.suffixFileName ? `${props.filename}_${moment().format('YYYYMMDDhhmmss')}` : props.filename}.xml`)
      link.click()
    }
    const onExportZipXML = (xmlString) => {
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
          link.setAttribute('download', `${props.suffixFileName ? `${props.zipname}_${moment().format('YYYYMMDDhhmmss')}` : props.zipname}.zip`)
          link.click()
        })
        .catch(e => {
          // console.log(e)
        })
    }
    const onEx = () => {
      var CSV = ''
      var ShowLabel = true
      var arrData = []
      var filename = 'a'
      // This condition will generate the Label/Header
      // if (ShowLabel) {
      //   var head = ""

      //   //This loop will extract the label from 1st index of on array
      //   for (var index in arrData[0]) {
      //     //Now convert each value to string and comma-seprated
      //     head += index + ','
      //   }
      //   head = head.slice(0, -1)
      //   //append Label row with line break
      //   CSV += head + '\r\n'
      // }

      // 1st loop is to extract each row
      for (var i = 0; i < arrData.length; i++) {
        var row = ''
        // 2nd loop will extract each column and convert it in string comma-seprated
        for (var index in arrData[i]) {
          row += '"' + arrData[i][index] + '",'
        }
        row.slice(0, row.length - 1)
        // add a line break after each row
        CSV += row + '\r\n'
      }

      if (CSV === '') {
        alert('Invalid data')
        return
      }

      // this trick will generate a temp "a" tag
      var link = document.createElement('a')
      link.id = 'lnkDwnldLnk'

      // this part will append the anchor tag and remove it after automatic click
      document.body.appendChild(link)

      var BOM = '\uFEFF'
      var csv = BOM + CSV
      var blob = new Blob([csv], { type: 'text/csv;charset=utf-8' })
      var csvUrl = window.webkitURL.createObjectURL(blob)
      filename = filename + '.csv'
      // $("#lnkDwnldLnk").attr({ 'download': filename, 'href': csvUrl })
      // $('#lnkDwnldLnk')[0].click()
      // document.body.removeChild(link)
    }

    return { props, onExport }
  }
})
</script>

<style>
.q-btn-dropdown__arrow {
  display: none;
}
/* .export-data {
  padding: 8px;
  cursor: pointer;
} */
/* .export-data svg {
  width: 26px!important;
  height: 26px!important;
} */
</style>
