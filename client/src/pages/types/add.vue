<template>
  <div>
    <div class="row card-title">
      <div class="col-sm-auto col-xs-12 text-h6 card-title-text">
        <q-avatar v-if="dialog" :icon="$route.meta.icon" size="50px" />
        {{$store.state.types.item._id?$t('global.update'):$t('global.add') }}
        <span class="text-weight-bold">{{ $t("types.title") }}</span>
      </div>
      <q-space />
      <div class="col-sm-auto col-xs-12 text-right">
        <q-btn v-if="$store.state.types.item._id" flat type="submit" :dense="$store.getters.dense.button" color="amber"
               icon="offline_pin" :loading="$store.state.app.loading.put" @click.prevent="onSubmit">
          <!-- :label="dialog?'':$t('global.update')" -->
          <q-tooltip>{{$t('global.update')}}</q-tooltip>
        </q-btn>
        <q-btn v-if="!$store.state.types.item._id" flat type="submit" :dense="$store.getters.dense.button" color="blue"
               icon="check_circle" :loading="$store.state.app.loading.post"
               @click.prevent="onSubmit">
          <!-- :label="dialog?'':$t('global.add')" -->
          <q-tooltip>{{$t('global.add')}}</q-tooltip>
        </q-btn>
        <q-btn v-if="dialog" flat round dense :color="$store.state.app.darkMode?'':'grey-7'"
               :icon="maximized?'fullscreen_exit':'fullscreen'" :disable="$store.state.app.loading.post||$store.state.app.loading.put"
               @click="$emit('update:maximized',!maximized)">
          <q-tooltip>
            {{maximized?$t('global.normalScreen'):$t('global.fullScreen')}}
          </q-tooltip>
        </q-btn>
        <q-btn v-if="dialog" flat round dense icon="close" :disable="$store.state.app.loading.post||$store.state.app.loading.put" v-close-popup>
          <q-tooltip>{{$t('global.cancel')}}</q-tooltip>
        </q-btn>
        <q-btn v-else flat round dense icon="reply" :disable="$store.state.app.loading.post||$store.state.app.loading.put"
               @click="$router.push('view')">
          <q-tooltip>{{$t('global.back')}}</q-tooltip>
        </q-btn>
      </div>
    </div>
    <q-separator />
    <q-form ref="form">
      <q-tabs v-model="tabs" narrow-indicator :dense="$store.getters.dense.form"
              class="text-deep-purple" align="justify">
        <q-tab name="main" :label="$t('tabs.main')" />
        <q-tab name="attributes" :label="$t('global.attributes')" />
      </q-tabs>
      <q-separator />
      <!-- <q-card-section> -->
      <q-scroll-area style="height:calc(100vh - 180px)">
        <q-tab-panels v-model="tabs">
          <q-tab-panel name="main">
            <div class="row q-gutter-xs">
              <div class="col-12 col-md-5">
                <q-select v-model="data.key" :options="$store.state.types.keys" :label="$t('global.types')"
                          :rules="[v=>v&&v.length>0||$t('error.required')]">
                  <template v-slot:selected>
                    <div v-html="data.key?$t(`types.${data.key}`):''"></div>
                  </template>
                  <template v-slot:option="scope">
                    <q-item v-bind="scope.itemProps">
                      <q-item-section>
                        <q-item-label v-html="$t(`types.${scope.opt}`)" />
                      </q-item-section>
                    </q-item>
                  </template>
                </q-select>
              </div>
              <q-space />
              <div class="col-12 col-md-6">
                <q-input v-model.trim="data.code" v-lowercase :dense="$store.getters.dense.input"
                         :label="$t('global.code')" :rules="[v=>v&&v.length>0||$t('error.required')]" />
              </div>
            </div>
            <div class="row q-gutter-xs">
              <div class="col-12 col-md-5">
                <q-input v-model.trim="data.name" :dense="$store.getters.dense.input"
                         :label="$t('global.name')" :rules="[v=>v&&v.length>0||$t('error.required')]" />
              </div>
              <q-space />
              <div class="col-12 col-md-6">
                <q-input v-model.trim="data.desc" autogrow :dense="$store.getters.dense.input"
                         :label="$t('global.desc')" />
              </div>
            </div>
            <div class="row q-gutter-xs">
              <div class="col-3">
                <q-input v-model="data.orders" type="number" :dense="$store.getters.dense.input"
                         :label="$t('global.order')"
                         :rules="[v=>v!==null&&v!==''||$t('error.required')]" />
              </div>
              <q-space />
              <div class="col-5 self-center">
                <q-toggle v-model="data.flag" :true-value="1" :dense="$store.getters.dense.input"
                          :label="data.flag?$t('global.publish'):$t('global.drafts')" />
              </div>
            </div>
          </q-tab-panel>
          <q-tab-panel name="attributes">
            <tm-attributes v-model:data="data.meta" :keys="metaKeys" :values="metaValues"
                           :dense="$store.getters.dense.input" :labelTitle="$t('global.attributes')+':'"
                           :labelBtnAdd="$t('global.add')" :labelBtnUpdate="$t('global.update')" :labelInputKey="$t('global.key')"
                           :labelInputValue="$t('global.value')" :btnEditLabel="$t('global.edit')" :btnDeleteLabel="$t('global.delete')"
                           :labelConfirmTitle="$t('messageBox.confirm')" :labelConfirmContent="$t('messageBox.delete')"
                           :labelWarningTitle="$t('messageBox.warning')" :labelWarningContent="$t('error.required')"
                           :labelNoData="$t('table.noData')" :hintKey="$t('hint.newValue')" :hintVal="$t('hint.newValue')"
                           :on-filter-key="onFilterMetaKey" :on-filter-value="onFilterMetaValue">
            </tm-attributes>
          </q-tab-panel>
        </q-tab-panels>
      </q-scroll-area>
      <!-- </q-card-section> -->
    </q-form>
  </div>
</template>

<script>
import { defineComponent, defineAsyncComponent, ref } from 'vue';
import { useStore } from 'vuex'
export default defineComponent({
  name: 'TypesAdd',
  components: { tmAttributes: defineAsyncComponent(() => import('components/tm-attributes')) },
  props: {
    dialog: { type: Boolean, default: false },
    maximized: { type: Boolean, default: false }
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
      onSubmit: () => {
        form.value.validate().then(valid => {
          if (valid) {
            if ($store.state.types.item._id) $store.dispatch('types/put', data.value)
            else $store.dispatch('types/post', data.value).then(onReset())
          }
        })
      }
    }
  }
})
</script>

<style>
</style>
