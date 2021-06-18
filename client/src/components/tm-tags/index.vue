<template>
  <div>
    <div class="row q-mb-md">
      <div v-if="labelTitle" class="col-5 self-center">{{labelTitle}}</div>
      <q-space v-if="labelTitle" />
      <div class="col-5">
        <q-input v-model.trim="tag" :dense="dense" :label="labelInput" :placeholder="labelPlaceholder" :rules="rules">
          <template v-slot:prepend>
            <q-icon :name="inputIcon" />
          </template>
          <template v-slot:append>
            <q-btn round dense flat :icon="btnIcon" :color="btnColor" :size="btnSize" @click.prevent="onAddTag">
              <q-tooltip v-if="!$q.platform.is.mobile">{{labelBtnAdd}}</q-tooltip>
            </q-btn>
          </template>
        </q-input>
      </div>
    </div>
    <div class="col-12" v-if="data&&data.length">
      <q-chip v-for="(e,i) in data" :key="i" removable clickable @click="onEditTag(e)" @remove="onRemoveTag(e)"
              :color="tagsColor" :text-color="tagsTextColor">{{e}}</q-chip>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref } from 'vue';
import { useQuasar } from 'quasar'
export default defineComponent({
  name: 'tm-tags',
  props: {
    data: { type: Array, default: () => [] },
    dense: { type: Boolean, default: true },
    inputIcon: { type: String, default: 'style' },
    btnIcon: { type: String, default: 'add' },
    btnColor: { type: String, default: 'blue' },
    btnSize: { type: String, default: 'sm' },
    tagsColor: { type: String, default: 'primary' },
    tagsTextColor: { type: String, default: 'white' },
    labelTitle: { type: String, default: null },
    labelBtnAdd: { type: String, default: 'Add' },
    labelInput: { type: String, default: 'Tag' },
    labelPlaceholder: { type: String, default: null },
    timeoutWarning: { type: Number, default: 3000 },
    colorWarning: { type: String, default: 'warning' },
    labelWarningContent: { type: String, default: 'Are you sure you want to delete this record?' },
    labelConfirmTitle: { type: String, default: 'Confirm' },
    labelConfirmContent: { type: String, default: 'Are you sure you want to delete this record?' },
    rules: null
  },
  setup (props, { emit }) {
    const $q = useQuasar()
    const tag = ref('')

    if (!props.data) emit('update:data', [])
    return {
      tag,
      onAddTag: () => {
        if (!tag.value) {
          $q.notify({ color: props.colorWarning, timeout: props.timeoutWarning, message: props.labelWarningContent })
          return
        }
        const data = props.data.slice()
        data.push(tag.value)
        emit('update:data', data)
        tag.value = ''
      },
      onEditTag: (val) => {
        tag.value = val
        onRemoveTag(val)
      },
      onRemoveTag: (val) => {
        $q.dialog({ title: props.labelConfirmTitle, message: props.labelConfirmContent, cancel: true, persistent: true }).onOk(() => {
          const i = props.data.indexOf(val)
          if (i > -1) emit(props.data, props.data.slice().splice(i, 1)) // props.data.splice(i, 1)
          if (props.data.length < 1) emit('update:data', null)
        })
      }
    }
  }
})
</script>

<style>
</style>
