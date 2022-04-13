<template>
  <q-list padding>
    <template v-for="e in options" :key="e.name">
      <div class="items">
        <q-separator spaced v-if="firstItem.name!==e.name" />
        <q-item-label header>{{$t(`route.${e.name}`)}}</q-item-label>
        <template v-for="child in e.children" :key="child.name">
          <q-item v-if="!child.meta.hidden">
            <q-btn no-caps class="q-btn--square" @click="onItemClick(child)">
              <q-icon top :name="child.meta.icon" :style="{color:RandomColor(true)}" />
            </q-btn>
            <label>{{$t(`route.${child.meta.title}`)}}</label>
          </q-item>
        </template>
      </div>
    </template>
  </q-list>
  <!-- Dialog -->
  <q-dialog v-model="isDialog" :maximized="isMaximized">
    <fake-component :componentName="component" />
  </q-dialog>
</template>

<script>
import { defineComponent, defineAsyncComponent, ref, watch } from "vue";
import { useStore } from 'vuex'
import { RandomColor } from '../../../../global/utils/color'
export default defineComponent({
  name: "drawer-item",
  components: {
    fakeComponent: defineAsyncComponent(() => import('layouts/fake-component'))
  },
  props: {
    options: { type: Array, required: true },
    optionValue: { type: String, default: 'value' },
    optionLabel: { type: String, default: 'label' },
  },
  setup (props) {
    const $store = useStore()
    const isDialog = ref(false)
    const isMaximized = ref(true)
    const firstItem = ref(props.options[0])
    const component = ref(null)
    watch(() => isDialog.value, (state, prevState) => {
      if (!state) $store.dispatch('app/setComponentLoaded')
      // console.log($store.getters.componentLoaded)
    }, { deep: true })
    return {
      isDialog, isMaximized, firstItem, component, RandomColor,
      onItemClick (val) {
        // val.component()
        // const a = () => import(val.component)
        // const a = defineAsyncComponent(() => val.meta.component)
        component.value = val.meta.component
        $store.dispatch('app/setComponentLoaded', val)
        isDialog.value = !isDialog.value
      }
    }
  }
})
</script>
<style scoped>
.q-item {
  display: inline-grid;
}
.q-item label {
  text-align: center;
}
/* .body--light .items {
  background-color: #fff;
} */
</style>
