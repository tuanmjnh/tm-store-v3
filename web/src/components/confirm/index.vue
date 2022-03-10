<template>
  <q-dialog v-model="dialog" :persistent="persistent">
    <q-card>
      <q-card-section class="row items-center">
        <q-avatar icon="signal_wifi_off" color="primary" text-color="white" />
        <span class="q-ml-sm">{{ title }}</span>
      </q-card-section>
      <q-separator />
      <q-card-section class="row items-center">
        {{ content }}
      </q-card-section>
      <q-card-actions align="right">
        <q-btn flat :label="btnAcceptText" color="primary" @click="onAccept" />
        <q-btn flat :label="btnCancelText" @click="onCancel" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
<script>
export default {
  props: {
    dialog: { type: Boolean, default: false },
    persistent: { type: Boolean, default: true },
    title: { type: String, default: 'Confirm' },
    content: { type: String, default: 'Are you sure?' },
    btnAcceptText: { type: String, default: 'I accept' },
    btnCancelText: { type: String, default: 'Cancel' }
  },
  data () {
    return {
    }
  },
  methods: {
    onAccept () {
      this.$emit('update:dialog', false)
      this.$emit('onAccept')
    },
    onCancel () {
      this.$emit('update:dialog', false)
      this.$emit('onCancel')
    }
  }
}
</script>
