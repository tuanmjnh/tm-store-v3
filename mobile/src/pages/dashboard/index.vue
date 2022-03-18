<template>
  <q-scroll-area style="height:calc(100vh - 99px)">
    <drawer-item :options="routes" />
  </q-scroll-area>
</template>

<script>
import { defineComponent, defineAsyncComponent, ref, computed } from "vue";
import { useStore } from 'vuex'
export default defineComponent({
  name: "Dashboard",
  components: {
    drawerItem: defineAsyncComponent(() => import('layouts/components/drawer-item.vue'))
  },
  setup () {
    const $store = useStore()
    const routes = computed(() => $store.getters.routes.filter(x => x.meta && !x.meta.hidden))
    return {
      routes
    }
  }
})
</script>
