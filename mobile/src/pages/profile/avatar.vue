<template>
  <q-avatar size="250px" class="q-ml-md" @click="isDialogTouchHold=!isDialogTouchHold">
    <q-img v-if="$store.state.auth.user.avatar&&$store.state.auth.user.avatar.length" :src="$store.state.auth.user.avatar[0].url">
      <template v-slot:error>
        <div class="image-error absolute-full flex flex-center">
          <q-icon name="insert_photo" />
        </div>
      </template>
    </q-img>
    <q-img v-else>
      <div class="image-error absolute-full flex flex-center">
        <q-icon name="insert_photo" />
      </div>
    </q-img>
  </q-avatar>
  <!-- Dialog FileManager -->
  <q-dialog v-model="isDialogFileManager" maximized>
    <q-card>
      <q-card-section class="q-pl-md q-pr-md q-pt-none q-pb-none" style="height:93%">
        <!---->
        <tm-fileManager lblAccept="" :lblConfirmTitle="$t('messageBox.warning')" :lblConfirmContent="$t('messageBox.delete')"
                        :size="113" :lblOk="$t('global.accept')" :lblCancel="$t('global.cancel')" accept=".jpg,.jpeg,.png,.gif,.jfif"
                        :url="$store.state.app.apiUpload" @onAccept="onAccept" :multiple="false" mimeType="image" :headers="headersData">
          <template v-slot:headerLeft>
            <q-btn flat dense icon="arrow_back" v-close-popup />
            <span class="text-subtitle1">{{$t('files.manager')}}</span>
          </template>
        </tm-fileManager>
      </q-card-section>
    </q-card>
  </q-dialog>
  <!-- Dialog upload -->
  <q-dialog v-model="isDialogUpload" :maximized="isMaximized">
    <q-card>
      <q-card-section class="q-pt-none" style="height:600px">
        <tm-upload :multiple="false" :lblConfirmTitle="$t('messageBox.warning')" :lblConfirmContent="$t('messageBox.delete')"
                   :lblOk="$t('global.accept')" :lblCancel="$t('global.cancel')" :size="353" mimeType="image"
                   accept=".jpg,.jpeg,.png,.gif,.jfif" :upload-url="$store.state.app.apiUpload" @on-finish="onUploaded" :headers="headersData">
          <template v-slot:headerLeft>
            <q-btn flat dense icon="arrow_back" v-close-popup />
            <span class="text-subtitle1">{{$t('files.upload')}}</span>
          </template>
        </tm-upload>
      </q-card-section>
    </q-card>
  </q-dialog>
  <!-- Dialog take captures -->
  <q-dialog v-model="isDialogCaptures" :maximized="isMaximized">
    <q-card>
      <q-card-section class="q-pa-none" style="height:100%">
        <tm-cameracaptures v-model:camera="camera" v-model:torch="torchActive" :lblBtnUse="$t('global.use')" :lblBtnAgain="$t('files.reCaptures')"
                           @on-accept="onTakePhoto">
          <template v-slot:header>
            <q-toolbar>
              <div class="col-auto">
                <q-btn flat dense icon="arrow_back" color="blue" v-close-popup />
              </div>
              <q-toolbar-title class="text-subtitle1">
              </q-toolbar-title>
            </q-toolbar>
          </template>
          <!-- <template v-slot:footer>
            <div class="text-center">
              <q-btn flat round icon="photo_camera" class="q-mr-lg" @click="onTakePhoto"></q-btn>
              <q-btn flat round icon="cameraswitch" @click="onCameraSwitch"></q-btn>
            </div>
          </template> -->
        </tm-cameracaptures>
      </q-card-section>
    </q-card>
  </q-dialog>
  <!-- Dialog Actions -->
  <q-dialog v-model="isDialogTouchHold" position="bottom">
    <q-card class="full-width" style="border-radius:initial">
      <q-card-section class="q-pa-none">
        <q-list separator>
          <q-item clickable v-ripple class="text-center" @click="()=>{isDialogTouchHold=!isDialogTouchHold;isDialogUpload=!isDialogUpload}">
            <q-item-section>{{$t('files.upload')}}</q-item-section>
          </q-item>
          <q-item clickable v-ripple class="text-center" @click="()=>{isDialogTouchHold=!isDialogTouchHold;isDialogFileManager=!isDialogFileManager}">
            <q-item-section>{{$t('files.chooseFile')}}</q-item-section>
          </q-item>
          <q-item clickable v-ripple class="text-center" @click="()=>{isDialogTouchHold=!isDialogTouchHold;isDialogCaptures=!isDialogCaptures}">
            <q-item-section>{{$t('files.captures')}}</q-item-section>
          </q-item>
        </q-list>
        <q-separator size="3px" />
        <q-list>
          <q-item clickable v-ripple class="text-center" v-close-popup>
            <q-item-section>
              <q-item-label class="text-red">{{$t('global.cancel')}}</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script>
import { defineComponent, defineAsyncComponent, ref } from "vue"
import { useStore } from 'vuex'
import axios from 'axios'
export default defineComponent({
  name: "Avatar",
  components: {
    tmUpload: defineAsyncComponent(() => import('components/tm-upload')),
    tmFileManager: defineAsyncComponent(() => import('@/components/tm-file-manager')),
    tmCameracaptures: defineAsyncComponent(() => import('@/components/tm-camera-captures'))
  },
  setup () {
    const $store = useStore()
    const isMaximized = ref(true)
    const isDialogUpload = ref(false)
    const isDialogFileManager = ref(false)
    const isDialogCaptures = ref(false)
    const isDialogTouchHold = ref(false)
    const camera = ref('rear')
    const torchActive = ref(false)
    const uploadUrl = ref(false)
    const data = ref({ ...$store.state.auth.user })
    const headersData = ref([
      { name: 'Upload-Path', value: `users${data.value._id ? '/' + data.value._id : ''}` },
      { name: 'Upload-Rename', value: true },
      { name: 'x-access-token', value: `Bearer ${$store.state.auth.token}` }
    ])
    const b64toBlob = (b64Data, contentType, sliceSize) => {
      contentType = contentType || '';
      sliceSize = sliceSize || 512;
      var byteCharacters = atob(b64Data);
      var byteArrays = [];
      for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
        var slice = byteCharacters.slice(offset, offset + sliceSize);
        var byteNumbers = new Array(slice.length);
        for (var i = 0; i < slice.length; i++) {
          byteNumbers[i] = slice.charCodeAt(i);
        }
        var byteArray = new Uint8Array(byteNumbers);
        byteArrays.push(byteArray);
      }
      var blob = new Blob(byteArrays, { type: contentType });
      return blob;
    }
    const onFormDataPhoto = (base64Image) => {
      // Split the base64 string in data and contentType
      const block = base64Image.split(';')
      // Get the content type
      const contentType = block[0].split(':')[1]// In this case "image/gif"
      // get the real base64 content of the file
      const realData = block[1].split(',')[1]// In this case "iVBORw0KGg...."
      // Convert to blob
      const blob = b64toBlob(realData, contentType)
      // Create a FormData and append the file
      const formData = new FormData()
      formData.append('file', blob, 'capture.jpg')
      return formData
    }
    const onUploadPhoto = async (data) => {
      const headers = { 'Content-Type': 'multipart/form-data' }
      headersData.value.forEach(e => { headers[e.name] = e.value })
      return axios.post($store.state.app.apiUpload, data, { headers }).then(x => {
        return x.data
      }).catch(e => {
        return null
      })
    }
    const onUpdateAvatar = (val) => {
      data.value.avatar = uploadUrl.value ? [val.url] : [val]
      $store.dispatch('users/update', {
        data: data.value,
        update: { _id: data.value._id, avatar: data.value.avatar }
      }).then((x) => {
        if (x) {
          $store.commit('auth/SET_USER', { ...data.value })
        }
      })
    }
    return {
      isMaximized, isDialogUpload, isDialogFileManager, isDialogCaptures, isDialogTouchHold, torchActive, camera, data, headersData,
      onUploaded (val) {
        isDialogUpload.value = false
        if (val) onUpdateAvatar(val)
        //   {data.value.avatar = uploadUrl.value ? [val.url] : [val]
        //   $store.dispatch('users/update', {
        //     data: data.value,
        //     update: { _id: data.value._id, avatar: data.value.avatar }
        //   }).then((x) => {
        //     if (x) {
        //       $store.commit('auth/SET_USER', { ...data.value })
        //     }
        //   })
        // }
      },
      onAccept (val) {
        isDialogFileManager.value = false
        if (val) onUpdateAvatar(val)
      },
      onTakePhoto (val) {
        isDialogCaptures.value = false
        const formData = onFormDataPhoto(val)
        onUploadPhoto(formData).then(x => {
          if (x) onUpdateAvatar(x)
        })
        // data.value.avatar = {
        //   name: 'avatar',
        //   url: val
        // }
        // console.log(data.value.avatar)
      },
      onCameraSwitch (val) {
        switch (camera.value) {
          case 'front':
            camera.value = 'rear'
            break
          case 'rear':
            camera.value = 'front'
            break
        }
      }
    }
  }
})
</script>
