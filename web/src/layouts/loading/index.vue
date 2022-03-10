<template>
  <div :style="style">
    <q-spinner-puff color="primary" size="20em" :thickness="1" />
  </div>
</template>

<script>
import { defineComponent } from 'vue';
export default defineComponent({
  setup () {
    const style = {
      height: `${window.screen.height}px`,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    }
    return { style }
  }
})
</script>

<style>
</style>
