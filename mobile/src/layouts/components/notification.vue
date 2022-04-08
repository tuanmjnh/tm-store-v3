<template>
  <q-btn flat round color="white" icon="notifications" @click="isDialog=!isDialog" />

  <!-- Dialog -->
  <q-dialog v-model="isDialog" :maximized="isMaximized">
    <q-card>
      <q-card-section class="row">
        <div class="col-2">
          <q-btn flat dense icon="arrow_back" v-close-popup></q-btn>
        </div>
        <q-space />
        <div class="col">
          <span class="text-h6">{{$t('global.notification')}}</span>
        </div>
      </q-card-section>

      <q-card-section class="q-pt-none">
        <notification />
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script>
import { defineComponent, defineAsyncComponent, ref } from "vue";
export default defineComponent({
  name: "NotificationLayout",
  components: {
    notification: defineAsyncComponent(() => import('pages/notification/index'))
  },
  setup () {
    const isMaximized = ref(true)
    const isDialog = ref(false)
    return {
      isMaximized, isDialog
    }
  }
})
</script>
