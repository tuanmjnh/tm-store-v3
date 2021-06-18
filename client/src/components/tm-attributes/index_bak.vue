<template>
  <div>
    <div class="row">
      <div class="col-12">{{labelTitle}}</div>
    </div>
    <div class="row q-mb-md">
      <div class="col-4">
        <auto-complete v-model.trim="key" :data="keys" :label="labelInputKey" :label-no-data="labelNoData"
                       is-no-data :hint="hintKey" @on-input="$emit('on-filter-key', $event)">
          <!-- $emit('on-filter-key', $event) -->
        </auto-complete>
      </div>
      <q-space />
      <div class="col-7">
        <auto-complete v-model.trim="val" :data="values" :label="labelInputValue" :label-no-data="labelNoData"
                       is-no-data :hint="hintVal" @on-input="$emit('on-filter-value', $event)">
          <template v-slot:append>
            <q-btn flat round :color="btnColor" :icon="btnIcon" :size="btnSize" @click.prevent="onAddAttr">
              <q-tooltip v-if="!$q.platform.is.mobile">{{labelBtnAdd}}</q-tooltip>
            </q-btn>
          </template>
        </auto-complete>
      </div>
    </div>
    <div class="row q-mb-md">
      <div class="col-12 row" v-for="(e,i) in data" :key="i">
        <div class="col-4">{{e.key}}</div>
        <q-space />
        <div class="col-6">{{e.value}}</div>
        <div>
          <q-btn flat round :color="btnEditColor" :icon="btnEditIcon" :size="btnSize"
                 @click.prevent="onEditAttr(e.key,e.value)">
            <q-tooltip v-if="!$q.platform.is.mobile">{{btnEditLabel}}</q-tooltip>
          </q-btn>
          <q-btn flat round :color="btnDeleteColor" :icon="btnDeleteIcon" :size="btnSize"
                 @click.prevent="onRemoveAttr(e.key)">
            <q-tooltip v-if="!$q.platform.is.mobile">{{btnDeleteLabel}}</q-tooltip>
          </q-btn>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, defineAsyncComponent, ref } from 'vue';
import { useQuasar } from 'quasar'
export default defineComponent({
  name: 'tm-attributes',
  components: {
    autoComplete: defineAsyncComponent(() => import('components/auto-complete'))
  },
  props: {
    data: { type: Array, default: () => [] },
    keys: { type: Array, default: () => [] },
    values: { type: Array, default: () => [] },
    // meta: { type: Array, default: () => [] },
    dense: { type: Boolean, default: true },
    btnIcon: { type: String, default: 'add' },
    btnColor: { type: String, default: 'blue' },
    btnSize: { type: String, default: 'sm' },
    btnEditIcon: { type: String, default: 'edit' },
    btnEditColor: { type: String, default: 'light-green' },
    btnEditLabel: { type: String, default: 'Edit' },
    btnDeleteIcon: { type: String, default: 'cancel' },
    btnDeleteColor: { type: String, default: 'red' },
    btnDeleteLabel: { type: String, default: 'Delete' },
    labelTitle: { type: String, default: 'Attributes:' },
    labelBtnAdd: { type: String, default: 'Add' },
    labelInputKey: { type: String, default: 'Key' },
    labelInputValue: { type: String, default: 'Value' },
    labelPlaceholder: { type: String, default: null },
    timeoutWarning: { type: Number, default: 3000 },
    colorWarning: { type: String, default: 'warning' },
    labelWarningContent: { type: String, default: 'The attribute is required Key and Value!' },
    labelConfirmTitle: { type: String, default: 'Warning' },
    labelConfirmContent: { type: String, default: 'Are you sure you want to delete this record?' },
    labelNoData: { type: String, default: 'No data available' },
    hintKey: { type: String, default: null },
    hintVal: { type: String, default: null }
    // rulesKey: null,
    // rulesValue: null
  },
  setup (props, { emit }) {
    const $q = useQuasar()
    const key = ref('')
    const val = ref('')

    if (!props.data) emit('update:data', [])
    return {
      key, val,
      onAddAttr: () => {
        // console.log('key: ' + key.value, ', value: ' + value.value)
        setTimeout(() => {
          if (!key.value || !val.value) {
            $q.notify({
              color: props.colorWarning,
              timeout: props.timeoutWarning,
              message: props.labelWarningContent
            })
            return
          }
          data.value.push({ key: key.value, value: val.value })
          key.value = ''
          val.value = ''
        }, 300)
      },
      onEditAttr: (_key, _val) => {
        onRemoveAttr(_key)
        key.value = _key
        val.value = _val
      },
      onRemoveAttr: (key) => {
        const index = props.data.findIndex(x => x.key === key)
        // if (index > -1) props.data.splice(index, 1)

        if (index > -1) emit(props.data, props.data.slice().splice(index, 1))
        // if (Object.keys(this.form.meta).length < 1) form.meta = null
        // attr = {}
      },
      onCheckInput: (val) => {
        console.log(val)
      }
    }
  }
})
</script>

<style>
.btn-icon {
  cursor: pointer;
}
</style>
