<template>
  <q-card>
    <q-card-section class="headder-row row">
      <div class="col-auto">
        <q-btn flat dense icon="arrow_back" v-close-popup></q-btn>
      </div>
      <span class="text-subtitle1">{{$t('route.add')}}</span>
      <q-space />
      <q-btn icon="offline_pin" flat round dense color="blue" class="q-mr-sm" @click="onSubmit(1)" />
      <q-btn icon="draw" flat round dense color="amber" @click="onSubmit(0)" />
    </q-card-section>
    <q-separator />
    <q-card-section class="q-pa-none">
      <q-form ref="form">
        <tm-tabs v-model="tabs" narrow-indicator :dense="$store.getters.dense.form" class="text-deep-purple" align="justify">
          <q-tab name="main" :label="$t('tabs.main')" />
          <q-tab name="attributes" :label="$t('global.attributes')" />
        </tm-tabs>
        <q-separator />
        <q-scroll-area style="height:calc(100vh - 99px)">
          <q-tab-panel name="main" id="tab-main">
            <div class="row">
              <div class="col-12">
                <q-select v-model="data.key" :options="$store.state.types.keys" :label="$t('global.types')"
                          :rules="[v=>v&&v.length>0||$t('error.required')]">
                  <template v-slot:selected>
                    <div v-html="data.key?`${$t(`types.${data.key}`)} - ${data.key}`:''"></div>
                  </template>
                  <template v-slot:option="scope">
                    <q-item v-bind="scope.itemProps">
                      <q-item-section>
                        <q-item-label v-html="`${$t(`types.${scope.opt}`)} - ${scope.opt}`" />
                      </q-item-section>
                    </q-item>
                  </template>
                </q-select>
              </div>
            </div>
            <div class="row">
              <div class="col-12">
                <q-input v-model.trim="data.code" :dense="$store.getters.dense.input" :label="$t('global.code')"
                         :rules="[v=>v&&v.length>0||$t('error.required')]" />
              </div>
            </div>
            <div class="row">
              <div class="col-12">
                <q-input v-model.trim="data.name" :dense="$store.getters.dense.input"
                         :label="$t('global.name')" :rules="[v=>v&&v.length>0||$t('error.required')]" />
              </div>
            </div>
            <div class="row">
              <div class="col-12">
                <q-input v-model.number="data.orders" type="number" :dense="$store.getters.dense.input"
                         :label="$t('global.order')"
                         :rules="[v=>v!==null&&v!==''||$t('error.required')]" />
              </div>
              <!-- <q-space /> -->
              <!-- <div class="col-5 self-center">
                <q-toggle v-model="data.flag" :true-value="1" :dense="$store.getters.dense.input"
                          :label="data.flag?$t('global.publish'):$t('global.drafts')" />
              </div> -->
            </div>
            <div class="row">
              <div class="col-12">
                <q-input v-model.trim="data.desc" autogrow :dense="$store.getters.dense.input"
                         :label="$t('global.desc')" />
              </div>
            </div>
          </q-tab-panel>
          <q-tab-panel name="attributes" id="tab-attributes">
            <tm-attributes v-model="data.meta" :keys="metaKeys" :values="metaValues" :lblOk="$t('global.accept')" :lblCancel="$t('global.cancel')"
                           :dense="$store.getters.dense.input" :labelTitle="$t('global.attributes')+':'"
                           :labelBtnAdd="$t('global.add')" :labelBtnUpdate="$t('global.update')" :labelInputKey="$t('global.key')"
                           :labelInputValue="$t('global.value')" :btnEditLabel="$t('global.edit')" :btnDeleteLabel="$t('global.delete')"
                           :labelConfirmTitle="$t('messageBox.confirm')" :labelConfirmContent="$t('messageBox.delete')"
                           :labelWarningContent="$t('error.required')" :labelNoData="$t('table.noData')" :hintKey="$t('hint.newValue')"
                           :hintVal="$t('hint.newValue')" :on-filter-key="onFilterMetaKey" :on-filter-value="onFilterMetaValue" />
          </q-tab-panel>
        </q-scroll-area>
      </q-form>
    </q-card-section>
  </q-card>
</template>

<script>
import { defineComponent, defineAsyncComponent, ref } from "vue";
import { useStore } from 'vuex'
export default defineComponent({
  name: "TypesAdd",
  components: {
    tmAttributes: defineAsyncComponent(() => import('components/tm-attributes')),
    tmTabs: defineAsyncComponent(() => import('components/tm-tabs'))
  },
  setup () {
    const $store = useStore()
    const tabs = ref('main')
    const form = ref(null)
    const data = ref({})
    const metaKeys = ref([])
    const metaValues = ref([])
    const onReset = () => {
      return new Promise((resolve, reject) => {
        if ($store.state.types.item) data.value = { ...$store.state.types.item }
        resolve()
      }).then(() => { if (form.value) form.value.resetValidation() })
    }

    onReset()

    return {
      tabs, form, data, metaKeys, metaValues,
      onFilterMetaKey: (val) => {
        if (!val) return
        metaKeys.value = []
        return $store.dispatch('types/getMeta', { key: true, filter: val, page: 1, rowsPerPage: 5 }).then((x) => {
          if (x) metaKeys.value = x.data
          return x.data
        })
      },
      onFilterMetaValue: (val) => {
        if (!val) return
        metaValues.value = []
        return $store.dispatch('types/getMeta', { filter: val, page: 1, rowsPerPage: 5 }).then((x) => {
          if (x) metaValues.value = x.data
          return x.data
        })
      },
      onSubmit: (flag) => {
        form.value.validate().then(valid => {
          if (valid) {
            data.value.flag = flag
            if ($store.state.types.item._id) $store.dispatch('types/put', data.value)
            else $store.dispatch('types/post', data.value).then(onReset())
          }
        })
      }
    }
  }
})
</script>
