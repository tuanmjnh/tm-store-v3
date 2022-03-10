<template>
  <q-tabs v-model="tab" no-caps active-color="primary" indicator-color="transparent" class="text-grey">
    <q-tab name="images" label="Images" />
    <q-tab name="videos" label="Videos" />
    <q-tab name="articles" label="Articles" />
  </q-tabs>
</template>

<script>
import { defineComponent, ref } from "vue";

export default defineComponent({
  name: "MenuBottom",
  props: {
    // tab: {
    //   type: String,
    //   default: 'images',
    // },
  },
  setup () {
    const tab = ref('images')
    return {
      tab
    };
  }
})
</script>
