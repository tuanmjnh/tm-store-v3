<template>
  <q-avatar class="q-ml-sm" @click="isDialog=!isDialog">
    <img :src="$store.state.auth.user.avatar">
  </q-avatar>
  <!-- Dialog information -->
  <q-dialog v-model="isDialog" :maximized="isMaximized">
    <q-card>
      <q-card-section class="row">
        <div class="col-2">
          <q-btn flat dense icon="arrow_back" v-close-popup></q-btn>
        </div>
        <q-space />
        <div class="col">
          <span class="text-h6">{{$t('users.avatar')}}</span>
        </div>
      </q-card-section>
      <q-card-section class="q-pt-none">
        <tm-upload v-model="avatar" :upload-url="$store.getters.apiUpload" :multiple="true" accept=".jpg,.jpeg,.png,.gif"
                   :headers="[{name:'Upload-Path',value:'users'},{ name:'Upload-Rename',value:true},{name:'x-access-token',value:`Bearer ${$store.state.auth.token}`}]"
                   @finish="onFinish" />
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script>
import { defineComponent, defineAsyncComponent, ref } from "vue";
import { useStore } from 'vuex'
export default defineComponent({
  name: "Avatar",
  components: {
    tmUpload: defineAsyncComponent(() => import('components/tm-upload'))
  },
  setup () {
    const $store = useStore()
    const isMaximized = ref(true)
    const isDialog = ref(false)
    const avatar = ref(null)
    const data = ref({ ...$store.state.auth.user })
    return {
      isMaximized, isDialog, avatar,
      onFinish () {
        // console.log(avatar.value)
        if (avatar.value && avatar.value.length) {
          data.value.avatar = avatar.value[0].publicUrl
          $store.dispatch('users/update', {
            data: data.value,
            update: { _id: data.value._id, avatar: data.value.avatar }
          }).then((x) => {
            if (x) {
              $store.commit('auth/SET_USER', { ...data.value })
            }
          })
        }
      }
    }
  }
})
</script>
