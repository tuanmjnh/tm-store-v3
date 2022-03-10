<template>
  <div>
    <div class="row card-title">
      <div class="col-sm-auto col-xs-12 text-h6 card-title-text">
        <q-avatar v-if="dialog" :icon="$route.meta.icon" size="50px" />
        {{ item ? $t('global.update') : $t('global.add') }}
        <span class="text-weight-bold">{{ $t("types.title") }}</span>
      </div>
      <q-space />
      <div class="col-sm-auto col-xs-12 text-right">
        <q-btn v-if="item" flat type="submit" :dense="$store.getters.dense.button" color="amber"
               icon="offline_pin" :loading="isLoadingAdd" @click.prevent="onSubmit">
          <!-- :label="dialog?'':$t('global.update')" -->
          <q-tooltip>{{$t('global.update')}}</q-tooltip>
        </q-btn>
        <q-btn v-if="!item" flat type="submit" :dense="$store.getters.dense.button" color="blue"
               icon="check_circle" :loading="isLoadingAdd" :disable="isLoadingDrafts"
               @click.prevent="onSubmit(1)">
          <!-- :label="dialog?'':$t('global.add')" -->
          <q-tooltip>{{$t('global.add')}}</q-tooltip>
        </q-btn>
        <q-btn v-if="!item" flat type="submit" :dense="$store.getters.dense.button" color="amber"
               icon="receipt" :loading="isLoadingDrafts" :disable="isLoadingAdd"
               @click.prevent="onSubmit(0)">
          <!-- :label="dialog?'':$t('global.drafts')" -->
          <q-tooltip>{{$t('global.drafts')}}</q-tooltip>
        </q-btn>
        <q-btn v-if="dialog" flat round dense :color="$store.state.app.darkMode?'':'grey-7'"
               :icon="maximized?'fullscreen_exit':'fullscreen'" :disable="isLoading"
               @click="$emit('update:maximized',!maximized)">
          <q-tooltip>
            {{maximized?$t('global.normalScreen'):$t('global.fullScreen')}}
          </q-tooltip>
        </q-btn>
        <q-btn v-if="dialog" flat round dense icon="close" :disable="isLoading" v-close-popup>
          <q-tooltip>{{$t('global.cancel')}}</q-tooltip>
        </q-btn>
        <q-btn v-else flat round dense icon="reply" :disable="isLoading"
               @click="$router.push('view')">
          <q-tooltip>{{$t('global.back')}}</q-tooltip>
        </q-btn>
      </div>
    </div>
    <!-- <q-toolbar>
      <q-avatar v-if="dialog" :icon="$route.meta.icon" size="50px" />
      <q-toolbar-title>
        {{ item ? $t("global.update") : $t("global.add") }}
        <span class="text-weight-bold">{{ $t("types.title") }}</span>
      </q-toolbar-title>
      <q-btn v-if="item" flat type="submit" :dense="$store.getters.dense.button" color="amber"
        icon="offline_pin" :label="dialog?'':$t('global.update')" :loading="isLoadingAdd"
        @click.prevent="onSubmit">
        <q-tooltip v-if="dialog">{{$t('global.update')}}</q-tooltip>
      </q-btn>
      <q-btn v-if="!item" flat type="submit" :dense="$store.getters.dense.button" color="blue"
        icon="check_circle" :label="dialog?'':$t('global.add')" :loading="isLoadingAdd"
        :disable="isLoadingDrafts" @click.prevent="onSubmit(1)">
        <q-tooltip v-if="dialog">{{$t('global.add')}}</q-tooltip>
      </q-btn>
      <q-btn v-if="!item" flat type="submit" :dense="$store.getters.dense.button" color="amber"
        icon="receipt" :label="dialog?'':$t('global.drafts')" :loading="isLoadingDrafts"
        :disable="isLoadingAdd" @click.prevent="onSubmit(0)">
        <q-tooltip v-if="dialog">{{$t('global.drafts')}}</q-tooltip>
      </q-btn>
      <q-btn v-if="dialog" flat round dense :color="$store.state.app.darkMode?'':'grey-7'"
        :icon="maximized?'fullscreen_exit':'fullscreen'" :disable="isLoading"
        @click="$emit('update:maximized',!maximized)">
        <q-tooltip v-if="!$q.platform.is.mobile">
          {{maximized?$t('global.normalScreen'):$t('global.fullScreen')}}
        </q-tooltip>
      </q-btn>
      <q-btn v-if="dialog" flat round dense icon="close" :disable="isLoading" v-close-popup>
        <q-tooltip v-if="!$q.platform.is.mobile">{{$t('global.cancel')}}</q-tooltip>
      </q-btn>
    </q-toolbar> -->
    <q-separator />
    <q-form ref="form">
      <!-- <q-card-actions v-if="item" align="right">
        <q-btn flat type="submit" :dense="$store.getters.dense.button" color="amber"
          icon="offline_pin" :label="$t('global.update')" :loading="isLoadingAdd"
          @click.prevent="onSubmit">
          <q-tooltip>{{$t('global.add')}}</q-tooltip>
        </q-btn>
      </q-card-actions>
      <q-card-actions v-else align="right">
        <q-btn flat type="submit" :dense="$store.getters.dense.button" color="blue"
          icon="check_circle" :label="$t('global.add')" :loading="isLoadingAdd"
          :disable="isLoadingDrafts" @click.prevent="onSubmit(1)">
          <q-tooltip>{{$t('global.add')}}</q-tooltip>
        </q-btn>
        <q-btn flat type="submit" :dense="$store.getters.dense.button" color="amber" icon="receipt"
          :label="$t('global.drafts')" :loading="isLoadingDrafts" :disable="isLoadingAdd"
          @click.prevent="onSubmit(0)">
          <q-tooltip>{{$t('global.drafts')}}</q-tooltip>
        </q-btn>
      </q-card-actions> -->
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
                <!-- <q-input v-model.trim="data.key" :dense="$store.getters.dense.input" v-lowercase :label="$t('global.types')"
                :rules="[v=>v&&v.length>0||$t('error.required')]" /> -->
                <!-- <q-select v-model="data.key" hide-selected fill-input use-input input-debounce="0" :dense="$store.getters.dense.input"
                :options-dense="$store.getters.dense.input" @new-value="onAddKey" :options="keys" @filter="onFilterKey"
                :hint="$t('types.hit_key')" :label="$t('global.types')" /> -->
                <auto-complete v-model.trim="data.key" v-model:data="keys"
                               :placeholder="$t('global.key')" :label="$t('global.types')" is-no-data
                               :no-data="$t('table.noData')" @on-input="onFilterKey"
                               :rules="[v=>v&&v.length>0||$t('error.required')]" />
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
              <q-space v-if="item" />
              <div class="col-5 self-center" v-if="item">
                <q-toggle v-model="data.flag" :true-value="1" :dense="$store.getters.dense.input"
                          :label="data.flag?$t('global.publish'):$t('global.drafts')" />
              </div>
            </div>
          </q-tab-panel>
          <q-tab-panel name="attributes">
            <tm-attributes v-model:data="data.meta" :keys="metaKeys" :values="metaValues"
                           :dense="$store.getters.dense.input" :labelTitle="$t('global.attributes')+':'"
                           :labelBtnAdd="$t('global.add')" :labelInputKey="$t('global.key')"
                           :labelInputValue="$t('global.value')" btnIcon="add" btnColor="blue"
                           :btnEditLabel="$t('global.edit')" :btnDeleteLabel="$t('global.delete')"
                           :labelConfirmTitle="$t('messageBox.confirm')"
                           :labelConfirmContent="$t('messageBox.delete')"
                           :labelWarningTitle="$t('messageBox.warning')"
                           :labelWarningContent="$t('error.required')" :labelNoData="$t('table.noData')"
                           @on-filter-key="onFilterMetaKey" @on-filter-value="onFilterMetaValue">
            </tm-attributes>
          </q-tab-panel>
        </q-tab-panels>
      </q-scroll-area>
      <!-- </q-card-section> -->
    </q-form>
  </div>
</template>

<script>
import { defineComponent, defineAsyncComponent, ref, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router'
import * as apiTypes from '@/api/types'
export default defineComponent({
  name: 'TypesAdd',
  components: {
    autoComplete: defineAsyncComponent(() => import('components/auto-complete')),
    tmAttributes: defineAsyncComponent(() => import('components/tm-attributes'))
  },
  props: {
    item: { type: Object, default: () => { } },
    dialog: { type: Boolean, default: false },
    maximized: { type: Boolean, default: false }
  },
  setup (props, { emit }) {
    const $route = useRoute()
    const isLoading = ref(false)
    const isLoadingAdd = ref(false)
    const isLoadingDrafts = ref(false)
    const tabs = ref('main')
    const form = ref(null)
    const data = ref({})
    const keys = ref([])
    const metaKeys = ref([])
    const metaValues = ref([])
    const constant = ref({
      key: '',
      code: '',
      name: '',
      desc: '',
      meta: null,
      orders: 1,
      flag: 1
    })

    const onFindById = (id) => {
      apiTypes.find({ '_id': id }).then((x) => { data.value = x })
    }
    const onAddKey = (val, done) => {
      if (val.length > 0) {
        if (!keys.value.includes(val)) keys.value.push(val)
        if (done) done(val, 'toggle')
      }
    }
    const onFilterKey = (val) => {
      if (!data.value.key) return
      keys.value = []
      apiTypes.getKey({ key: data.value.key, page: 1, rowsPerPage: 5 }).then((x) => {
        if (x) keys.value = x.data
      })
    }
    const onFilterMetaKey = (val) => {
      if (!val) return
      metaKeys.value = []
      apiTypes.getMeta({ key: true, filter: val, page: 1, rowsPerPage: 5 }).then((x) => {
        if (x) metaKeys.value = x.data
      })
    }
    const onFilterMetaValue = (val) => {
      if (!val) return
      metaValues.value = []
      apiTypes.getMeta({ filter: val, page: 1, rowsPerPage: 5 }).then((x) => {
        if (x) metaValues.value = x.data
      })
    }
    const onSubmit = (action) => {
      // console.log(props.item)
      form.value.validate().then(valid => {
        if (valid) {
          if (props.item || $route.query.id) {
            isLoadingAdd.value = true
            apiTypes.update(data.value).then((x) => {
              if (x.ok) emit('update:item', { m: 2, data: data.value })
            }).finally(() => {
              isLoadingAdd.value = false
              onAddKey(data.value.key)
            })
          } else {
            data.value.flag = action
            if (action) isLoadingAdd.value = true
            else isLoadingDrafts.value = true
            apiTypes.insert(data.value).then((x) => {
              if (x) emit('update:item', { m: 1, data: data.value })
              onReset()
            }).finally(() => {
              isLoadingAdd.value = false
              isLoadingDrafts.value = false
              onAddKey(data.value.key)
              onReset()
            })
          }
        }
      })
    }
    const onReset = () => {
      new Promise((resolve, reject) => {
        emit('update:maximized', false)
        data.value = { ...constant.value }
        resolve()
      }).then(() => {
        if (form.value) form.value.resetValidation()
      })
    }

    onMounted(() => {
      if ($route.query.id) onFindById($route.query.id)
    })

    // watch(() => $route, (to, from) => {
    //   console.log(to)
    //   console.log(from)
    //   // if (to !== from) {
    //   //   location.reload()
    //   // }
    // }, { deep: true, immediate: true })

    watch(() => props.dialog, (state, prevState) => {
      onReset()
      if (props.item) data.value = { ...props.item }
    }, { deep: true, immediate: true })

    return {
      isLoading, isLoadingAdd, isLoadingDrafts, tabs, form, data, keys, metaKeys, metaValues, constant,
      onAddKey, onFilterKey, onFilterMetaKey, onFilterMetaValue, onSubmit
    }
  }
})
</script>

<style>
</style>
