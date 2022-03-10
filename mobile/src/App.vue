<template>
  <component :is="layout">
    <router-view />
  </component>
</template>
<script>
import { defineComponent, defineAsyncComponent, computed } from "vue";
import { useQuasar } from 'quasar'
import { useStore } from 'vuex'
export default defineComponent({
  name: "App",
  components: {
    light: defineAsyncComponent(() => import('./layouts/light')),
  },
  setup () {
    const $q = useQuasar()
    const $store = useStore()
    const layout = computed(() => 'light')
    return { layout }
  }
});
</script>
