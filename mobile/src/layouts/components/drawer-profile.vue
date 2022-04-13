<template>
  <q-item clickable @click="onProfile">
    <q-item-section avatar class="q-mr-sm">
      <q-avatar size="100px">
        <!-- <img :src="$store.state.auth.user.avatar"> -->
        <q-img v-if="$store.state.auth.user.avatar&&$store.state.auth.user.avatar.length" :src="$store.state.auth.user.avatar">
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
    </q-item-section>
    <q-item-section>
      <q-item-label>{{$store.state.auth.user.fullName}}</q-item-label>
      <q-item-label caption>{{$t('navbar.profile')}}</q-item-label>
    </q-item-section>
  </q-item>
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
  name: "DrawerProfileLayout",
  components: {
    profile: defineAsyncComponent(() => import('pages/profile/index')),
    avatar: defineAsyncComponent(() => import('pages/profile/avatar'))
  },
  emits: ['on-show'],
  setup (props, { emit }) {
    const isDialog = ref(false)
    const isMaximized = ref(true)
    return {
      isDialog, isMaximized,
      onProfile () {
        isDialog.value = !isDialog.value
        emit('on-show', isDialog.value)
      }
    }
  }
})
</script>

<style>
</style>
