<template>
  <q-card flat bordered class="my-card bg-grey-1">
    <q-card-section class="card-section-header">
      <div class="row items-center no-wrap">
        <div class="col">
          <div class="text-subtitle2">{{title}}</div>
        </div>
        <div class="col-auto">
          <q-btn flat :dense="dense" :icon="iconEdit">
            <q-tooltip>{{labelEdit}}</q-tooltip>
            <q-popup-edit v-model="modelValueLocal" auto-save v-slot="scope" @update:model-value="onEditBarCode">
              <q-input v-model="scope.value" dense autofocus counter @keyup.enter="scope.set" />
            </q-popup-edit>
          </q-btn>
          <q-btn flat :dense="dense" :icon="iconDefault" @click.prevent="onSetDefault">
            <q-tooltip>{{labelDefault}}</q-tooltip>
          </q-btn>
          <q-btn flat :dense="dense" :icon="iconScanner" @click.prevent="isDialog=!isDialog">
            <q-tooltip>{{labelScanner}}</q-tooltip>
          </q-btn>
        </div>
        <!-- <div class="col-auto">
          <q-btn color="grey-7" round flat icon="more_vert">
            <q-menu cover auto-close>
              <q-list bordered separator :dense="dense">
                <q-item clickable>
                  <q-item-section avatar>
                    <q-icon :name="iconEdit" />
                  </q-item-section>
                  <q-item-section>
                    {{labelEdit}}
                    <q-popup-edit v-model="textCode" auto-save v-slot="scope">
                      <q-input v-model="scope.value" dense autofocus counter @keyup.enter="scope.set" />
                    </q-popup-edit>
                  </q-item-section>
                </q-item>
                <q-item clickable @click="onSetDefault">
                  <q-item-section avatar>
                    <q-icon :name="iconDefault" />
                  </q-item-section>
                  <q-item-section>{{labelDefault}}</q-item-section>
                </q-item>
                <q-item clickable>
                  <q-item-section avatar>
                    <q-icon :name="iconScanner" />
                  </q-item-section>
                  <q-item-section>{{labelScanner}}</q-item-section>
                </q-item>
              </q-list>
            </q-menu>
          </q-btn>
        </div> -->
      </div>
    </q-card-section>
    <q-separator />
    <q-card-section class="bg-white">
      <!-- :style="{height:`${height+(displayValue?60:20)}px`}" -->
      <canvas id="tm-barcode-generator">
        <q-popup-edit v-model="modelValueLocal" auto-save v-slot="scope" @update:model-value="onEditBarCode">
          <q-input v-model="scope.value" dense autofocus counter @keyup.enter="scope.set" />
        </q-popup-edit>
      </canvas>
      <!-- <div class="text-value text-subtitle2">{{modelValueLocal}}</div> -->
    </q-card-section>
    <q-card-section class="text-caption card-section-bottom">
      {{labelHelper}}
    </q-card-section>
  </q-card>
  <!-- QR Code Scanner dialog -->
  <q-dialog v-model="isDialog" :maximized="true">
    <tm-html5qrcode :title="labelScanner" :cancelLabel="labelCancel" @onDecode="onDecode" @onError="onError" />
  </q-dialog>
</template>

<script>
import { defineComponent, defineAsyncComponent, ref, onMounted, watch, nextTick } from 'vue'
import JsBarcode from 'jsbarcode'
export default defineComponent({
  name: 'TM-BarCodeGenerator',
  components: {
    tmHtml5qrcode: defineAsyncComponent(() => import('components/tm-html5qrcode'))
  },
  props: {
    modelValue: { type: String, default: null },
    defaultValue: { type: String, default: null },
    title: { type: String, default: 'Bar Code' },
    format: { type: String, default: 'CODE128' },
    width: { type: Number, default: 2 },
    height: { type: Number, default: 100 },
    displayValue: { type: Boolean, default: false },
    iconScanner: { type: String, default: 'horizontal_distribute' },
    labelScanner: { type: String, default: 'Bar Code Scanner' },
    iconDefault: { type: String, default: 'drive_file_rename_outline' },
    labelDefault: { type: String, default: 'Set by Default' },
    iconEdit: { type: String, default: 'edit' },
    labelEdit: { type: String, default: 'Edit Barcode' },
    labelHelper: { type: String, default: 'Click Barcode to change value' },
    labelCancel: { type: String, default: 'Cancel' },
    dense: { type: Boolean, default: true }
  },
  emits: ['onInit', 'onSetRandom'],
  setup (props, { emit }) {
    const modelValueLocal = ref(null)
    const isDialog = ref(false)
    const isMounted = ref(false)
    const onInit = (value) => {
      if (value) {
        const rs = JsBarcode('#tm-barcode-generator', value, {
          format: props.format,
          width: props.width,
          height: props.height,
          displayValue: props.displayValue
        })
        emit('onInit', rs)
      }
    }
    watch(() => props.modelValue, (state, prevState) => {
      modelValueLocal.value = state
      if (isMounted.value) onInit(state)
    }, { deep: true, immediate: true })

    onMounted(() => {
      isMounted.value = true
      onInit(props.modelValue)
    })
    return {
      modelValueLocal, isDialog,
      onSetDefault () {
        if (props.defaultValue) emit('update:modelValue', props.defaultValue)
        else emit('onSetRandom')
      },
      onEditBarCode (val) {
        if (val) emit('update:modelValue', val)
      },
      onDecode (val) {
        emit('update:modelValue', val.decodedText)
        isDialog.value = !isDialog.value
      },
      onError (val) {
        // console.log(val)
      }
    }
  }
})
</script>

<style lang="css" scoped>
.q-item__section--avatar {
  min-width: 0px;
}
.q-item__section--side > .q-icon {
  font-size: 15px;
}
.q-card__section--vert.card-section-header {
  padding: 6px 16px;
}
.q-card__section--vert.card-section-bottom {
  padding: 10px 16px;
}
.text-value {
  padding-left: 10px;
}
</style>
