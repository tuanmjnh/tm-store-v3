<template>
  <div class="file-upload">
    <input v-if="uploadReady" type="file" id="file-upload" :multiple="multiple===true?true:false"
           :accept="rules.extension" @change="onChange($event)" />
    <div v-if="button">
      <div class="btn-upload">
        <v-tooltip bottom>
          <slot name="activator" for="file-upload"
                class="v-btn v-btn--flat v-btn--floating v-btn--small primary--text"><i
               class="material-icons">cloud_upload</i>
          </slot>
          <span>{{button}}</span>
        </v-tooltip>
      </div>
    </div>
    <div v-else class="file-upload-content">
      <!-- <input v-if="uploadReady" type="file" id="file-upload" :multiple="multiple===true?true:false" :accept="rules.extension"
        @change="onChange($event)" /> -->
      <p>
        Drag your file(s) here to begin<br> or click to browse
      </p>
    </div>
  </div>

</template>

<script>
import { NewGuid, CheckExtension, GetExtension } from '@/plugins/helpers'
export default {
  data: () => ({
    uploadReady: true
  }),
  props: {
    multiple: { type: Boolean, default: false },
    fieldName: { type: String, default: 'file-upload' },
    renameFile: { type: Boolean, default: false },
    data: { type: Object, default: null },
    path: { type: String, default: '' },
    button: { type: String, default: null },
    firebase: { type: Object, default: null },
    metadata: { type: Object, default: null },
    rules: {
      extension: null,
      size: 0
    },
    error: { type: Object, default: null }
  },
  methods: {
    clear () {
      this.uploadReady = false
      this.$nextTick(() => { this.uploadReady = true })
    },
    onChange (event) {
      this.data.files = event.target.files
      var metadata = { contentType: null }// metadata ? metadata : { contentType: null }
      var path = this.path
      if (this.multiple) {
        for (let i = 0; i < this.data.files.length; i++) {
          path = path ? `${path}/${this.data.files[i].name}` : this.data.files[i].name
          this.uploading(this.firebase, path, this.data.files[i], metadata).then(url => {
            this.data.download = url
            this.clear()
          })
          // storageRef.child(path).put(files[i], metadata).then(function (snapshot) { })
        }
      } else {
        path = path ? `${path}/${this.data.files[0].name}` : this.data.files[0].name
        if (CheckExtension(this.data.files[0].name, this.rules.extension)) {
          this.uploading(this.firebase, path, this.data.files[0], metadata).then(downloadURL => {
            this.data.download = downloadURL
            this.data.path = path
            this.clear()
          })
        } else this.error.data = 'type'
        // console.log('error type')
        // storageRef.child(path).put(files[0], metadata).then(function (snapshot) {
        //   console.log('Uploaded file!')
        // })
      }
    },
    uploading (firebase, path, file, metadata) {
      return new Promise((resolve, reject) => {
        var storageRef = firebase.storage().ref()
        // Upload file and metadata to the object 'images/mountains.jpg'
        var uploadTask = storageRef.child(path).put(file, metadata)
        // Listen for state changes, errors, and completion of the upload.
        uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, // or 'state_changed'
          function (snapshot) {
            // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
            var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
            console.log('Upload is ' + progress + '% done')
            switch (snapshot.state) {
              case firebase.storage.TaskState.PAUSED: // or 'paused'
                console.log('Upload is paused')
                break
              case firebase.storage.TaskState.RUNNING: // or 'running'
                console.log('Upload is running')
                break
            }
          }, function (error) {
            // A full list of error codes is available at
            // https://firebase.google.com/docs/storage/web/handle-errors
            switch (error.code) {
              case 'storage/unauthorized':
                // User doesn't have permission to access the object
                console.log('unauthorized')
                break
              case 'storage/canceled':
                console.log('canceled')
                // User canceled the upload
                break
              case 'storage/unknown':
                console.log('unknown')
                // Unknown error occurred, inspect error.serverResponse
                break
            }
          }, function () {
            // Upload completed successfully, now we can get the download URL
            uploadTask.snapshot.ref.getDownloadURL().then(function (downloadURL) {
              resolve(downloadURL)
              // console.log('File available at', downloadURL)
            })
          })
      })
    },
    getMetaFile (firebase, path) {
      var storageRef = firebase.storage().ref()
      // Create a reference to the file whose metadata we want to retrieve
      var forestRef = storageRef.child(path)
      // Get metadata properties
      forestRef.getMetadata().then(function (metadata) {
        console.log(metadata)
        // Metadata now contains the metadata for 'images/forest.jpg'
      }).catch(function (error) {
        console.log(error)
        // Uh-oh, an error occurred!
      })
    }
  },
  created () {
  }
}
</script>

<style lang="scss">
.file-upload {
  position: relative;
}
.file-upload-content {
  outline: 1px dashed #b1b1b1;
  background: #fefefe;
  color: #bbb;
  position: relative;
  cursor: pointer;
}
.file-upload-content:hover {
  /*background: #dfdfdf  when mouse over to the drop zone, change color */
  color: #8d8d8d;
}
.file-upload [type="file"] {
  opacity: 0;
  /* invisible but it's there! */
  cursor: pointer;
  width: 100%;
  height: 100%;
  display: none;
  position: absolute;
  top: 0;
  left: 0;
}
.file-upload p {
  font-size: 16px;
  text-align: center;
  padding: 10px 0;
}
.file-upload .fa {
  color: #007bff;
}
.file-upload label {
  /* position: absolute */
  /* right: -8px */
  /* top: -3px */
}
.btn-upload {
}
.v-btn {
  cursor: pointer;
}
.btn-upload [type="file"] {
  display: none;
}
</style>
