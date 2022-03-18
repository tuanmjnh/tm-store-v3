<template>
  <q-list separator>
    <q-item clickable v-ripple>
      <q-item-section>
        <span class="text-warning">{{$t('messageBox.noNotification')}}</span>
      </q-item-section>
    </q-item>
  </q-list>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "Notification",
})
</script>
