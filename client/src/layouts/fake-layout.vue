<template>
  <router-view :key="$route.path" />
</template>

<script>
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'fake-layout'
})
</script>

<style>
</style>
