<template>
  <div :class="['relative-position',isDisplay?'is-display':'']">
    <q-input v-model.trim="inputValue" @focus="onFocus" @update:model-value="onInput" :dense="dense"
             :placeholder="placeholder" :hint="hint" :label="label" :rules="rules" :debounce="debounce">
      <template v-if="slotPrepend" v-slot:prepend>
        <slot name="prepend"></slot>
      </template>
      <template v-if="slotAppend" v-slot:append>
        <slot name="append"></slot>
      </template>
    </q-input>
    <!-- <q-scroll-area v-if="isDisplay" style="height:100%;max-height:130px"> -->
    <q-list v-if="isDisplay" bordered separator :dense="dense" class="list-complete">
      <template v-if="data&&data.length>0">
        <q-item v-for="(e,i) in data" clickable v-ripple :key="i" @click="onSelected(e)">
          <q-item-section>{{e}}</q-item-section>
        </q-item>
      </template>
      <q-item v-else clickable v-ripple>
        <q-item-section>{{labelNoData}}</q-item-section>
      </q-item>
    </q-list>
    <!-- </q-scroll-area> -->
  </div>
</template>

<script>
import { defineComponent, ref, watch, computed } from 'vue';
export default defineComponent({
  name: 'auto-complete',
  props: {
    data: { type: Array, default: () => [] },
    modelValue: { default: null },
    dense: { type: Boolean, default: true },
    debounce: { type: Number, default: 500 },
    label: { type: String, default: null },
    placeholder: { type: String, default: null },
    hint: { type: String, default: null },
    rules: null,
    isNoData: { type: Boolean, default: false },
    labelNoData: { type: String, default: 'No data available' }
  },
  setup (props, { emit, slots }) {
    const isFirst = ref(false)
    const isDisplay = ref(false)
    const inputValue = ref('')

    const onFocus = () => {
      if (isFirst.value) {
        // isDisplay.value = true
        onCheckDisplay()
        emit('focus', inputValue.value)
      } else isFirst.value = true
    }
    const onInput = (val) => {
      // console.log(val)
      emit('update:modelValue', val)
      emit('on-input', val)
      onCheckDisplay()
      console.log(props.modelValue)
    }
    const onBlur = () => {
      setTimeout(() => {
        emit('blur', inputValue.value)
        isDisplay.value = false
      }, 100)
    }
    const onSelected = (val) => {
      inputValue.value = val
      emit('update:modelValue', val)
      emit('on-input', val)
    }
    const onCheckDisplay = () => {
      setTimeout(() => {
        if (props.isNoData) {
          if (props.data && props.data.length) isDisplay.value = true
          else isDisplay.value = false
        } else {
          isDisplay.value = true
        }
      }, 100);
    }

    watch(() => props.modelValue, (state, prevState) => {
      inputValue.value = props.modelValue
    }, { deep: true, immediate: true })

    watch(() => isDisplay.value, (state, prevState) => {
      if (state) document.body.addEventListener('click', onBlur)
      else document.body.removeEventListener('click', onBlur)
    })
    const slotPrepend = computed(() => !!slots['prepend'])
    const slotAppend = computed(() => !!slots['append'])

    return {
      isFirst, isDisplay, inputValue,
      onFocus, onInput, onBlur, onSelected, onCheckDisplay,
      slotPrepend, slotAppend
    }
  }
})
</script>

<style lang="scss">
.is-display {
  label {
    padding-bottom: 0;
  }
}
.list-complete {
  position: absolute;
  width: 100%;
  z-index: 1;
  background-color: #fff;
  /* bottom: 58px; */
  box-shadow: #ccc 3px 4px 5px;
  max-height: 130px;
  overflow-x: hidden;
  overflow-y: scroll;
}
</style>
