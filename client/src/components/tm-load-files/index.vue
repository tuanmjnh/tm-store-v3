<template>
  <div class="tm-load-files">
    <!-- <q-spinner v-if="isLoading" style="top:50%;left:50%;position:absolute" color="primary" size="6em" :thickness="1" /> -->
    <div class="col">
      <q-input v-if="isGoogleSheet" v-model="urlData" square outlined :dense="dense" :disable="isLoading" :loading="isLoading"
               :placeholder="labelUrl"
               debounce="500" @update:model-value="onGetDataUrl">
        <template v-slot:prepend>
          <q-icon name="link" clickable />
        </template>
        <template v-slot:after>
          <q-btn round dense flat icon="sync_alt" :loading="isLoading" @click="isGoogleSheet=!isGoogleSheet">
            <q-tooltip>{{labelBtnUpload}}</q-tooltip>
          </q-btn>
        </template>
        <!-- <template v-slot:prepend>
          <q-icon name="link" />
        </template> -->
      </q-input>

      <q-input v-else :modelValue="file?file.name:''" square outlined :dense="dense" readonly :disable="isLoading" :loading="isLoading"
               :placeholder="labelFile" @click="openFileDialog">
        <template v-slot:after>
          <q-btn round dense flat icon="sync_alt" :loading="isLoading" @click="isGoogleSheet=!isGoogleSheet">
            <q-tooltip>{{labelBtnUrl}}</q-tooltip>
          </q-btn>
        </template>
        <template v-slot:prepend>
          <q-icon name="text_snippet" clickable />
        </template>
        <!-- <template v-slot:after>
          <q-btn round dense flat icon="add_box" :loading="isLoading" @click="openFileDialog">
            <q-tooltip>{{labelBtnUpload}}</q-tooltip>
          </q-btn>
        </template> -->
      </q-input>

      <!-- <div v-if="button" class="file-name">{{file?file.name:placeholder}}</div>
      <div :class="button?'file-btn':'file-content'">
        <label class="file-label">
          <span class="btn" :style="button?{backgroundColor:color}:{color:color}">
            <i class="material-icons">{{icon}}</i>
            <b>{{label}}</b>
          </span>
          <input type="file" :accept="accept" :multiple="multiple" title @change="onFileChange">
        </label>
      </div> -->
    </div>
    <div class="row q-mt-md">
      <div class="col-12" v-if="sheets&&Array.isArray(sheets)">
        <q-input v-model="range" square :dense="dense" :disable="isLoading" :loading="isLoading" :placeholder="$t('global.range')" debounce="500"
                 :prefix="sheet?`${sheet}!`:''">
          <template v-slot:append>
            <q-icon name="border_clear" />
          </template>
        </q-input>
        <q-chip v-for="(e,i) in sheets" :key="i" square color="primary" text-color="white" icon="description" clickable @click="onGetDataSheet(e)">
          {{e.properties.title}}
        </q-chip>
      </div>
      <div v-if="sheets==='error'">
        <q-icon name="error" color="negative" /> {{errorNoExist}}
      </div>
    </div>
    <q-table class="q-mt-lg sticky-virtscroll-table" :title="lblTblTitle" v-if="rows&&rows.length" :rows="rows" :columns="columns"
             :style="`height:${tblHeight}px`" virtual-scroll flat :loading="isLoading" :dense="dense" :no-data-label="lblTblNoData"
             :no-results-label="lblTblNoResults" :rows-per-page-label="lblTblRowsPerPage" :rows-per-page-options="rowsPerPageOptions" />
  </div>
</template>

<script>
import { defineComponent, ref, watch } from 'vue'
import xlsx from "xlsx"
import { getSheets, getSheetValues } from "@/utils/gapi"
import { validURL } from "@/utils/validate"
export default defineComponent({
  name: 'tm-load-files',
  props: {
    modelValue: { type: Array, default: () => [] },
    color: { type: String, default: '#009688' },
    icon: { type: String, default: 'cloud_upload' },
    labelBtnUpload: { type: String, default: 'Browse...' },
    labelBtnUrl: { type: String, default: 'Url file google sheet' },
    labelFile: { type: String, default: 'Choose file...' },
    labelUrl: { type: String, default: 'Input url...' },
    errorNoExist: { type: String, default: 'Data do not exist. Please try again!' },
    multiple: { type: Boolean, default: false },
    accept: { type: String, default: '.xlsx,.xlsb,.xlsm,.xls,.xml,.csv,.txt,.ods,.fods,.uos,.sylk,.dif,.dbf,.prn,.qpw,.123,.wb*,.wq*,.html,.htm' },
    button: { type: Boolean, default: true },
    dense: { type: Boolean, default: true },
    options: { type: Object, default: () => { return { header: 1, raw: true, defval: '' } } },// , skipHeader: true
    lblTblTitle: { type: String, default: 'Temporary viewing data' },
    lblTblNoData: { type: String, default: 'No data available' },
    lblTblNoResults: { type: String, default: 'No matched records' },
    lblTblRowsPerPage: { type: String, default: 'Records per page' },
    rowsPerPageOptions: { type: Array, default: () => [10, 20, 50, 100] },
    tblHeight: { type: Number, default: 400 }
    // sheet: { type: String, default: null },
    // range: { type: String, default: null }
  },
  emits: ['onStart', 'onFinish', 'update:model-value'],
  setup (props, { emit }) {
    const isGoogleSheet = ref(false)
    const urlData = ref(null) // 'https://docs.google.com/spreadsheets/d/15F3mYued4CDTzHrcpCvrWQrr_ULGxqhLTu5-CYRjOBk'
    const isLoading = ref(false)
    // const files = ref(null)
    const workbook = ref(null)
    const file = ref(null)
    const spreadsheetId = ref(null)
    const sheets = ref(null)
    const sheet = ref(null)
    const range = ref(null)
    const rows = ref([])
    const columns = ref([])
    // const pagination = ref({
    //   filter: '',
    //   sortBy: '0',
    //   descending: false
    // })

    const onReset = () => {
      return new Promise((resolve, reject) => {
        file.value = null
        sheets.value = null
        workbook.value = null
        rows.value = []
        columns.value = []
        emit('update:model-value', [])
        // for (var i = 65; i <= 90; i++) {
        //   console.log(String.fromCharCode(i))
        // }
        resolve()
      })
    }

    const onCreateColumns = (fistRows, type = 3) => {
      const rs = []
      for (let i = 0; i < fistRows.length; i++) {
        if (type === 3) rs.push({ name: fistRows[i], field: fistRows[i], label: fistRows[i], align: 'left', sortable: true })
        else rs.push({ name: i, field: i, label: i, align: 'left', sortable: true })
      }
      return rs
    }
    const onCreateRows = (rows, type = 1) => {
      const rs = []
      if (type === 2) {
        for (let i = 0; i < rows.length; i++) {
          if (rows[i].length) {
            const el = {}
            for (let j = 0; j < rows[0].length; j++) {
              el[j] = rows[i][j] || null
            }
            rs.push(el)
          }
        }
      } else if (type === 3) {
        for (let i = 1; i < rows.length; i++) {
          if (rows[i].length) {
            const el = {}
            for (let j = 0; j < rows[0].length; j++) {
              el[rows[0][j]] = rows[i][j] || null
            }
            rs.push(el)
          }
        }
      } else {
        for (let i = 0; i < rows.length; i++) {
          if (rows[i].length) {
            rs.push(rows[i])
          }
        }
      }
      return rs
    }
    watch(() => isGoogleSheet, (state, prevState) => {
      onReset()
    }, { deep: true, immediate: true })

    return {
      isGoogleSheet, urlData, isLoading, file, sheets, sheet, range, rows, columns,
      openFileDialog () {
        let input = document.createElement('input')
        input.type = 'file'
        input.accept = props.accept
        // input.addEventListener('onchange', onFileChange(e))
        input.onchange = _ => {
          // you can use this method to get file and perform respective operations
          // let files = Array.from(input.files);
          // console.log(files);
          isLoading.value = true
          const files = Array.from(input.files)
          file.value = files[0] // only use files[0]
          if (!file.value) return null
          emit('onStart', file.value)
          // const type = getExtension(file.value.name, false)
          // if (type === 'xls' || type === 'xlsx' || type === 'csv' || type === 'tsv') {
          // return new Promise((resolve, reject) => {
          var reader = new FileReader()
          reader.onload = (e) => {
            // var data = new Uint8Array(e.target.result)
            workbook.value = xlsx.read(e.target.result, { type: 'array' })
            if (workbook.value.SheetNames && workbook.value.SheetNames.length) {
              sheets.value = workbook.value.SheetNames.map((x) => { return { properties: { title: x } } })
            } else sheets.value = 'error'
            isLoading.value = false
          }
          reader.readAsArrayBuffer(file.value)
          // })
          // }
        }
        input.click()
      },
      onGetDataUrl (val) {
        onReset()
        try {
          if (val) {
            isLoading.value = true
            emit('onStart', val)
            // emit('update:model-value', val)
            spreadsheetId.value = validURL(val) ? val.split('/')[5] : (val.split('/')[0] || val)
            getSheets(spreadsheetId.value).then((x) => {
              if (x) sheets.value = x
              else sheets.value = 'error'
              isLoading.value = false
            })
          }
        } catch (error) {
          emit('on-error', error)
        }
      },
      onGetDataSheet (val) {
        sheet.value = val.properties.title
        isLoading.value = true
        if (isGoogleSheet.value) {
          getSheetValues({
            spreadsheetId: spreadsheetId.value,
            range: sheet.value + (range.value ? `!${range.value}` : ''),
            valueRenderOption: 'UNFORMATTED_VALUE'
          }).then((x) => {
            if (x && x.length && x[0].length) {
              if (props.options.header === 2) {
                columns.value = onCreateColumns(x[0], props.options.header)
                rows.value = onCreateRows(x, props.options.header)
              } else if (props.options.header === 3) {
                columns.value = onCreateColumns(x[0], props.options.header)
                rows.value = onCreateRows(x, props.options.header)
              } else {
                columns.value = onCreateColumns(x[0], props.options.header)
                rows.value = onCreateRows(x, props.options.header)
              }
            } else rows.value = []
            emit('onFinish', rows.value)
            emit('update:model-value', rows.value)
            isLoading.value = false
          })
        } else {
          /* DO SOMETHING WITH workbook HERE */
          let worksheet = workbook.value.Sheets[sheet.value]
          // resolve(xlsx.utils.sheet_to_json(worksheet))
          let options = { ...props.options }
          if (options.header === 2) options.header = 1
          else if (options.header === 3) options.header = 1
          const x = xlsx.utils.sheet_to_json(worksheet, options)
          if (x && x.length && x[0].length) {
            if (props.options.header === 2) {
              columns.value = onCreateColumns(x[0], props.options.header)
              rows.value = onCreateRows(x, props.options.header)
            } else if (props.options.header === 3) {
              columns.value = onCreateColumns(x[0], props.options.header)
              rows.value = onCreateRows(x, props.options.header)
            } else {
              columns.value = onCreateColumns(x[0], props.options.header)
              rows.value = onCreateRows(x, props.options.header)
            }
          } else rows.value = []
          emit('onFinish', rows.value)
          emit('update:model-value', rows.value)
          isLoading.value = false
        }
      }
    }
  }
})
</script>

<style>
</style>
