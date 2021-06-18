<template>
  <div class="file-upload">
    <input v-if="isReload" type="file" id="file-upload" :multiple="multiple===true?true:false" @change="onChange($event)"
           :accept="extension" />
    <div class="btn-upload" v-if="buttonUse">
      <!-- <input v-if="isReload" type="file" id="file-upload" :multiple="multiple===true?true:false"
        @change="onChange($event)" :accept="extension" /> -->
      <label v-if="loading" class="v-btn v-btn--flat v-btn--icon theme--info primary--text">
        <span class="v-btn__loading">
          <div role="progressbar" aria-valuemin="0" aria-valuemax="100"
               class="v-progress-circular v-progress-circular--indeterminate" style="height: 23px; width: 23px;"><svg
                 xmlns="http://www.w3.org/2000/svg"
                 viewBox="21.904761904761905 21.904761904761905 43.80952380952381 43.80952380952381"
                 style="transform: rotate(0deg);">
              <circle fill="transparent" cx="43.80952380952381" cy="43.80952380952381" r="20"
                      stroke-width="3.8095238095238093" stroke-dasharray="125.664" stroke-dashoffset="125.66370614359172px"
                      class="v-progress-circular__overlay"></circle>
            </svg>
            <div class="v-progress-circular__info"></div>
          </div>
        </span>
      </label>
      <v-tooltip bottom v-else>
        <slot name="activator" for="file-upload" class="v-btn v-btn--icon theme--info primary--text">
          <i class="material-icons">{{icon}}</i>
        </slot>
        <span>{{buttonText}}</span>
      </v-tooltip>
    </div>
    <div v-else>
      <!-- <input type="file" id="file-upload" @change="onChange($event)" :accept="extension"
        :multiple="multiple===true?true:false" /> -->
      <!-- <v-progress-circular v-if="loading" :size="30" :width="3" color="purple"
        indeterminate></v-progress-circular> -->
      <v-progress-linear v-if="loading" :indeterminate="true"></v-progress-linear>
      <div class="file-upload-content" v-else>
        <label v-html="buttonText" for="file-upload"></label>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref, nextTick } from 'vue';
import axios from 'axios'
import { NewGuid } from '@/plugins/helpers'
export default defineComponent({
  name: 'tm-upload-files',
  props: {
    http: null,
    loading: { type: Boolean, default: false },
    files: { type: Array, default: () => [] },
    httpOptions: { type: Object, default: () => { } },
    baseUrl: { type: String, default: 'http://localhost:8080/filemanager' },
    basePath: { type: String, default: 'Uploads' },
    fieldName: { type: String, default: 'file-upload' },
    fileName: { type: String, default: null },
    multiple: { type: Boolean, default: false },
    autoName: { type: Boolean, default: false },
    buttonUse: { type: Boolean, default: false },
    buttonText: { type: String, default: 'Drag your file(s) here to begin<br> or click to browse' },
    extension: { type: String, default: null },
    icon: { type: String, default: 'cloud_upload' }
  },
  setup (props, { emit }) {
    const isReload = ref(true)
    // const files=ref([])

    const onChange = (event) => {
      emit('update:loading', true)
      // event.target.name
      // event.target.files
      // event.target.files.length
      let _files = []
      let tmp = {}
      const formData = new FormData()
      Array.from(Array(event.target.files.length).keys()).map(x => {
        if (props.multiple) {
          tmp = {
            fieldName: props.fieldName,
            fileName: props.autoName === true ? NewGuid() + event.target.files[x].name.getExt() : event.target.files[x].name,
            file: event.target.files[x]
          }
        } else {
          tmp = {
            fieldName: props.fieldName,
            fileName: props.autoName ? NewGuid() + event.target.files[x].name.getExt() : (props.fileName ? props.fileName + event.target.files[x].name.getExt() : event.target.files[x].name),
            file: event.target.files[x]
          }
        }
        formData.append(tmp.fieldName, tmp.file, tmp.fileName)
        _files.push({
          lastModified: event.target.files[x].lastModified,
          lastModifiedDate: event.target.files[x].lastModifiedDate,
          name: tmp.fileName,
          size: event.target.files[x].size,
          type: event.target.files[x].type,
          webkitRelativePath: event.target.files[x].webkitRelativePath
        })
        // console.log(_files)
        // console.log(props.files)
      })
      // formData.append('basePath', props.basePath)
      if (props.http) {
        props.http.defaults.headers.path = props.basePath
        props.http.post(`${props.http.defaults.baseURL}/${props.http.defaults.upload}`, formData).then((rs) => {
          // emit('handleUpload', Object.assign(rs.data, { basePath: props.basePath }))
          // emit('update:files', Array.from(event.target.files))
          emit('update:files', _files)
        })
          .catch((error) => { console.log(error) })
          .finally(() => { onClear() })
      } else {
        props.httpOptions.path = props.basePath
        axios.post(props.baseUrl, formData, { headers: props.httpOptions }).then((rs) => {
          // emit('handleUpload', Object.assign(rs.data, { basePath: props.basePath }))
          // emit('update:files', Array.from(event.target.files))
          emit('update:files', _files)
        })
          .catch((error) => { console.log(error) })
          .finally(() => { onClear() })
      }
    }
    const onClear = () => {
      isReload = false
      setTimeout(() => { emit('update:loading', false) }, 300)
      nextTick(() => { isReload = true })
      // files.value = []
    }

    return { props, isReload, onChange }
  }
})
// file extension A file extension starting with the STOP character, e.g: .gif, .jpg, .png, .doc
// audio: audio/* All sound files are accepted
// video: video/* All video files are accepted
// image: image/* All image files are accepted
// pdf: application/pdf
// csv: .csv
// xls: application/vnd.ms-excel
// xlsx: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet
// txt: text/plain
// html: text/html
</script>

<style lang="scss">
.file-upload {
  position: relative;
}
.file-upload [type="file"] {
  opacity: 0;
  /* invisible but it's there! */
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  display: none;
}
.file-upload {
  label {
    font-size: 16px;
    text-align: center;
    padding: 6px 0;
    display: block;
    cursor: pointer;
    // top: 5px;
  }
  .file-upload-content {
    outline: 1px dashed #b1b1b1;
    background: #fefefe;
    color: #bbb;
    position: relative;
    cursor: pointer;
    text-align: center;
    &:hover {
      /*background: #dfdfdf  when mouse over to the drop zone, change color */
      // color: #8d8d8d
      color: #3684d8;
    }
    label {
      padding: 10px 0;
      width: 100%;
      height: 100%;
    }
  }
}
.file-upload .fa {
  color: #007bff;
}
// .file-upload label {
//   /* position: absolute */
//   /* right: -8px */
//   /* top: -3px */
// }
// .btn-upload {
// }
// .btn-upload [type="file"] {
//   display: none;
// }
</style>
