<template>
  <q-tabs :modelValue="modelValue" :narrow-indicator="narrowIndicator" :dense="dense" :align="align" @update:model-value="onChangeValue">
    <slot />
  </q-tabs>
</template>

<script>
import { defineComponent, watch, onMounted } from 'vue';
export default defineComponent({
  name: 'TMTabs',
  props: {
    modelValue: { type: String, default: null },
    narrowIndicator: { type: Boolean, default: false },
    dense: { type: Boolean, default: false },
    align: { type: String, default: 'justify' },
  },
  setup (props, { emit }) {
    const changeTab = () => {
      const tabsHiden = document.getElementsByClassName('q-tab-panel')
      for (let i = 0; i < tabsHiden.length; i++) {
        // tabsHiden[i].style.transition = 'all 2s'
        if (tabsHiden[i].getAttribute('id') === `tab-${props.modelValue}`) tabsHiden[i].classList.remove('hidden')
        else tabsHiden[i].classList.add('hidden')
      }
    }
    onMounted(() => { changeTab() })
    watch(() => props.modelValue, (state, prevState) => { changeTab() }, { deep: true, immediate: true })
    return {
      onChangeValue (val) {
        emit('update:modelValue', val)
      }
    }
  }
})
</script>

<style>
</style>
