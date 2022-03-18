<template>
  <q-btn round flat dense @click="isDialog=!isDialog">
    <q-avatar size="28px">
      <img :src="$store.state.auth.user.avatar">
    </q-avatar>
  </q-btn>

  <!-- Dialog -->
  <q-dialog v-model="isDialog" :maximized="isMaximized">
    <q-card>
      <q-card-section class="row">
        <div class="col-2">
          <q-btn flat dense icon="arrow_back" v-close-popup></q-btn>
        </div>
        <q-space />
        <span class="text-subtitle2 q-pt-md">{{$store.state.auth.user.fullName}}</span>
        <avatar />
      </q-card-section>

      <q-card-section class="q-pt-none">
        <profile />
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script>
import { defineComponent, defineAsyncComponent, ref } from "vue";
export default defineComponent({
  name: "ProfileLayout",
  components: {
    profile: defineAsyncComponent(() => import('pages/profile/index')),
    avatar: defineAsyncComponent(() => import('pages/profile/avatar'))
  },
  setup () {
    const isDialog = ref(false)
    const isMaximized = ref(true)
    return {
      isDialog, isMaximized
    }
  }
})
</script>
