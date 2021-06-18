<template>
  <div>
    <div class="row q-mb-md">
      <div class="col-12 col-md-2">
        <div class="q-pt-md">{{labelTitle}}</div>
      </div>
      <q-space />
      <div class="col-12 col-md-10">
        <div class="row">
          <div class="col-5">
            <q-select v-model="key" use-input input-debounce="300" :dense="dense" :options-dense="dense" :options="keys" :label="labelInputKey"
                      :hint="hintKey" new-value-mode="add-unique" @filter="onFilterKeyLocal">
              <template v-slot:before>
                <q-icon :name="inputKeyIcon" />
              </template>
              <template v-slot:no-option>
                <q-item>
                  <q-item-section class="text-grey">{{labelNoData}}</q-item-section>
                </q-item>
              </template>
            </q-select>
          </div>
          <q-space />
          <div class="col-7">
            <q-select v-model="val" use-input input-debounce="300" :dense="dense" :options-dense="dense" :options="values" :label="labelInputValue"
                      :hint="hintVal" new-value-mode="add-unique" @filter="onFilterValueLocal">
              <template v-slot:before>
                <q-icon :name="inputValueIcon" />
              </template>
              <template v-slot:after>
                <q-btn v-if="indexItem!=null" round dense flat :icon="btnUpdateIcon" :color="btnUpdateColor" @click.prevent="onAddAttr">
                  <q-tooltip v-if="!$q.platform.is.mobile">{{labelBtnUpdate}}</q-tooltip>
                </q-btn>
                <q-btn v-else round dense flat :icon="btnAddIcon" :color="btnAddColor" @click.prevent="onAddAttr">
                  <q-tooltip v-if="!$q.platform.is.mobile">{{labelBtnAdd}}</q-tooltip>
                </q-btn>
              </template>
              <template v-slot:no-option>
                <q-item>
                  <q-item-section class="text-grey">{{labelNoData}}</q-item-section>
                </q-item>
              </template>
            </q-select>
          </div>
        </div>
      </div>
    </div>
    <div class="row q-mb-md">
      <div class="col-12 row" v-for="(e,i) in data" :key="i">
        <div class="col-3">{{e.key}}</div>
        <q-space />
        <div class="col-8">{{e.value}}</div>
        <q-space />
        <div class="col">
          <q-btn flat round :color="btnEditColor" :icon="btnEditIcon" :size="btnSize" @click.prevent="onEditAttr(i,e.key,e.value)">
            <q-tooltip v-if="!$q.platform.is.mobile">{{btnEditLabel}}</q-tooltip>
          </q-btn>
          <q-btn flat round :color="btnDeleteColor" :icon="btnDeleteIcon" :size="btnSize" @click.prevent="onRemoveAttr(i)">
            <q-tooltip v-if="!$q.platform.is.mobile">{{btnDeleteLabel}}</q-tooltip>
          </q-btn>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref } from 'vue';
import { useQuasar } from 'quasar'
export default defineComponent({
  name: 'tm-attributes',
  props: {
    data: { type: Array, default: () => [] },
    keys: { type: Array, default: () => [] },
    values: { type: Array, default: () => [] },
    dense: { type: Boolean, default: true },
    btnAddIcon: { type: String, default: 'add' },
    btnAddColor: { type: String, default: 'blue' },
    btnUpdateIcon: { type: String, default: 'offline_pin' },
    btnUpdateColor: { type: String, default: 'amber' },
    btnSize: { type: String, default: 'sm' },
    btnEditIcon: { type: String, default: 'edit' },
    btnEditColor: { type: String, default: 'light-green' },
    btnEditLabel: { type: String, default: 'Edit' },
    btnDeleteIcon: { type: String, default: 'cancel' },
    btnDeleteColor: { type: String, default: 'red' },
    btnDeleteLabel: { type: String, default: 'Delete' },
    labelTitle: { type: String, default: 'Attributes:' },
    labelBtnAdd: { type: String, default: 'Add' },
    labelBtnUpdate: { type: String, default: 'Update' },
    labelInputKey: { type: String, default: 'Key' },
    labelInputValue: { type: String, default: 'Value' },
    inputKeyIcon: { type: String, default: 'vpn_key' },
    inputValueIcon: { type: String, default: 'scatter_plot' },
    timeoutWarning: { type: Number, default: 3000 },
    colorWarning: { type: String, default: 'warning' },
    labelWarningContent: { type: String, default: 'The attribute is required Key and Value!' },
    labelConfirmTitle: { type: String, default: 'Warning' },
    labelConfirmContent: { type: String, default: 'Are you sure you want to delete this record?' },
    labelNoData: { type: String, default: 'No data available' },
    hintKey: { type: String, default: null },
    hintVal: { type: String, default: null },
    onFilterKey: { type: Function },
    onFilterValue: { type: Function }
  },
  setup (props, { emit }) {
    const $q = useQuasar()
    const key = ref('')
    const val = ref('')
    const indexItem = ref(null)

    if (!props.data) emit('update:data', [])

    return {
      key, val, indexItem,
      onFilterKeyLocal: (val, update, abort) => {
        if (val) props.onFilterKey(val).then(x => { update() })
        else update()
      },
      onFilterValueLocal: (val, update, abort) => {
        if (val) props.onFilterValue(val).then(x => { update() })
        else update()
      },
      onAddAttr: () => {
        setTimeout(() => {
          if (!key.value || !val.value) {
            $q.notify({ color: props.colorWarning, timeout: props.timeoutWarning, message: props.labelWarningContent })
            return
          }
          const data = props.data.slice()
          if (indexItem.value != null) {
            data.splice(indexItem.value, 1, { key: key.value, value: val.value })
            indexItem.value = null
          } else data.push({ key: key.value, value: val.value })
          emit('update:data', data)
          key.value = ''
          val.value = ''
        }, 300)
      },
      onEditAttr: (i, _key, _val) => {
        indexItem.value = i
        key.value = _key
        val.value = _val
      },
      onRemoveAttr: (i) => {
        $q.dialog({ title: props.labelConfirmTitle, message: props.labelConfirmContent, cancel: true, persistent: true }).onOk(() => {
          const data = props.data.slice()
          data.splice(i, 1)
          emit('update:data', data)
        })
      }
    }
  }
})
</script>

<style>
</style>