<template>
  <router-view :key="routePath?routePath:$route.path" />
</template>

<script>
import { defineComponent } from 'vue'
import { useRoute } from 'vue-router'
export default defineComponent({
  name: 'fake-layout',
  props: {
    routePath: { type: String, default: null }
  },
  // computed: {
  //   route () {
  //     if (this.routePath) return this.routePath
  //     else return useRoute().path
  //   }
  // }
  // setup (props) {
  //   const $route = useRoute()
  //   return {
  //     onRoutePath () {
  //       let rs = null
  //       if (props.routePath) rs = props.routePath
  //       else rs = $route.path
  //       return rs
  //     }
  //   }
  // }
})
</script>

<style>
</style>
