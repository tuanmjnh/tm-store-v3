<template>
  <div class="tm-load-files">
    <div v-if="isLoading" class="lds-ring">
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
    <div v-else class="tm-load-content">
      <div v-if="button" class="file-name">
        {{file?file.name:placeholder}}
      </div>
      <div :class="button?'file-btn':'file-content'">
        <label class="file-label">
          <span class="btn" :style="button?{backgroundColor:color}:{color:color}">
            <i class="material-icons">{{icon}}</i>
            <b>{{label}}</b>
          </span>
          <input type="file" :accept="accept" :multiple="multiple" title @change="onFileChange">
        </label>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref } from 'vue';
import XLSX from 'xlsx'
import { getExtension } from '@/utils/extension'
export default defineComponent({
  name: 'tm-load-files',
  props: {
    color: { type: String, default: '#009688' },
    icon: { type: String, default: 'cloud_upload' },
    label: { type: String, default: 'Browse...' },
    placeholder: { type: String, default: 'Choose file...' },
    multiple: { type: Boolean, default: false },
    accept: { type: String, default: null },
    button: { type: Boolean, default: true }
  },
  setup (props, { emit }) {
    const isLoading = ref(false)
    const file = ref(null)

    const onFileChange = (e) => {
      isLoading.value = true
      const files = e.target.files
      file.value = files[0] // only use files[0]
      if (!file.value) return null
      emit('on-start', file.value)
      const type = getExtension(file.value.name, false)
      if (type === 'xls' || type === 'xlsx' || type === 'csv' || type === 'tsv') {
        // return new Promise((resolve, reject) => {
        var reader = new FileReader()
        reader.onload = (e) => {
          var data = new Uint8Array(e.target.result)
          var workbook = XLSX.read(data, { type: 'array' })
          let sheetName = workbook.SheetNames[0]
          /* DO SOMETHING WITH workbook HERE */
          let worksheet = workbook.Sheets[sheetName]
          // resolve(XLSX.utils.sheet_to_json(worksheet))
          const sheet = XLSX.utils.sheet_to_json(worksheet)
          emit('on-finish', sheet)
          isLoading.value = false
        }
        reader.readAsArrayBuffer(file.value)
        // })
      }
    }
    return {
      props, isLoading, file,
      onFileChange
    }
  }
})
</script>

<style scoped>
/* .btn-select-file .q-btn-dropdown__arrow {
  display: none;
} */
.tm-load-files {
  min-height: 50px;
}
.tm-load-files input[type="file"] {
  overflow: hidden !important;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
  visibility: hidden;
}
.tm-load-files .tm-load-content {
  position: relative;
  display: flex;
  flex-wrap: wrap;
}
.tm-load-files .tm-load-content .file-name {
  margin-right: 0px;
  border: 1px solid #ccc;
  padding: 6px 8px;
  flex: 10000 1 0%;
  text-align: left;
}
.tm-load-files .file-btn {
  flex: 0 0 auto;
}
.tm-load-files .file-btn .file-label {
  display: inline-flex;
}
.tm-load-files .file-btn .file-label .btn {
  padding: 8px;
  color: #fff;
  cursor: pointer;
}
.tm-load-files .file-btn .file-label .btn i {
  margin-right: 5px;
}
.tm-load-files .file-content {
  display: flex;
  flex: 10000 1 0%;
}
.tm-load-files .file-content .file-label {
  padding: 30px 10px;
  border: 1px #898989 dashed;
  text-align: center;
  flex: 10000 1 0%;
}
.tm-load-files .file-content i {
  margin-right: 5px;
}
/* Loading*/
.lds-ring {
  display: inline-block;
  position: absolute;
  width: 30px;
  height: 30px;
  top: 30%;
  left: 50%;
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
