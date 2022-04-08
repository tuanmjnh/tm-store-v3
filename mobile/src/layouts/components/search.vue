<template>
  <q-btn flat round color="white" icon="search" @click="isDialog=!isDialog" />

  <!-- Dialog -->
  <q-dialog v-model="isDialog" :maximized="isMaximized">
    <q-card>
      <q-card-section class="row">
        <div class="col-2">
          <q-btn flat dense icon="arrow_back" v-close-popup></q-btn>
        </div>
        <q-space />
        <div class="col">
          <span class="text-h6">{{$t('global.search')}}</span>
        </div>
      </q-card-section>

      <q-card-section class="q-pt-none">
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script>
import { defineComponent, ref } from "vue";
export default defineComponent({
  name: "SearchLayout",
  setup () {
    const isMaximized = ref(true)
    const isDialog = ref(false)
    return {
      isMaximized, isDialog
    }
  }
})
</script>
