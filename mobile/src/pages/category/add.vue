<template>
  <q-card>
    <q-card-section class="headder-row row">
      <div class="col-auto">
        <q-btn flat dense icon="arrow_back" v-close-popup></q-btn>
      </div>
      <span class="text-subtitle1">
        {{data._id?`${$t('route.edit')} ${$t("route.product").toLowerCase()}`:`${$t('route.add')} ${$t("route.product").toLowerCase()}`}}
      </span>
      <q-space />
      <q-btn icon="offline_pin" flat round dense color="blue" class="q-mr-sm" @click="onSubmit(1)" />
      <q-btn icon="draw" flat round dense color="amber" @click="onSubmit(0)" />
    </q-card-section>
    <q-separator />
    <q-card-section class="q-pa-none">
      <q-form ref="form">
        <tm-tabs v-model="tabs" narrow-indicator :dense="$store.getters.dense.form" class="text-blue" align="justify">
          <q-tab name="inf" :label="$t('tabs.inf')" />
          <q-tab name="images" :label="$t('global.images')" />
          <q-tab name="attributes" :label="$t('global.attributes')" />
        </tm-tabs>
        <q-separator />
        <q-scroll-area style="height:calc(100vh - 180px)">
          <q-tab-panels v-model="tabs">
            <q-tab-panel name="inf" id="tab-inf">
              <div class="row">
                <div class="col-auto col-md-5">
                  {{$t('global.dependent')}}:
                  <q-badge color="blue">{{$store.state.categories.dependent?$store.state.categories.dependent.label:'Root'}}</q-badge>
                </div>
                <q-space />
                <div class="col-auto col-md-5">
                  {{$t('global.level')}}: <q-badge color="blue">{{data.level}}</q-badge>
                </div>
              </div>
              <div class="row q-mt-md">
                <div class="col-12 col-md-5">
                  <q-input v-model.trim="data.title" :dense="$store.getters.dense.input" :label="$t('global.title')" v-upperCaseFirst
                           :rules="[v=>v&&v.length>0||$t('error.required')]" />
                </div>
                <q-space />
                <div class="col-12 col-md-6">
                  <q-input v-model.trim="data.code" :dense="$store.getters.dense.input" :label="$t('global.code')" v-uppercase
                           :rules="[v=>v&&v.length>0||$t('error.required'),v=>checkExistCode(v)]" debounce="500" :hint="$t('category.hitCode')" />
                </div>
              </div>
              <div class="row">
                <div class="col-12 col-md-5">
                  <q-input v-model.trim="data.url" :dense="$store.getters.dense.input" v-lowerCase label="URL" />
                </div>
                <q-space />
                <div class="col-12 col-md-6">
                  <q-input v-model.number="data.quantity" type="number" :dense="$store.getters.dense.input" :label="$t('global.quantity')" />
                </div>
              </div>
              <div class="row">
                <div class="col-12 col-md-5">
                  <q-input :model-value="data.startAt?$moment(data.startAt).format($store.getters.format.date):''" :dense="$store.getters.dense.input"
                           readonly :label="$t('global.startDate')" :hint="`${$t('global.format')}: ${$store.getters.format.date}`">
                    <template v-slot:append>
                      <q-icon name="event" class="cursor-pointer">
                        <q-popup-proxy ref="startAt" transition-show="scale" transition-hide="scale">
                          <q-date v-model="data.startAt" today-btn mask="YYYY-MM-DD HH:mm:ss" @update:model-value="()=>$refs.startAt.hide()" />
                        </q-popup-proxy>
                      </q-icon>
                    </template>
                  </q-input>
                </div>
                <q-space />
                <div class="col-12 col-md-5">
                  <q-input :model-value="data.endAt?$moment(data.endAt).format($store.getters.format.date):''" :dense="$store.getters.dense.input"
                           readonly :label="$t('global.endDate')" :hint="`${$t('global.format')}: ${$store.getters.format.date}`">
                    <template v-slot:append>
                      <q-icon name="event" class="cursor-pointer">
                        <q-popup-proxy ref="endAt" transition-show="scale" transition-hide="scale">
                          <q-date v-model="data.endAt" today-btn mask="YYYY-MM-DD HH:mm:ss" @update:model-value="()=>$refs.endAt.hide()" />
                        </q-popup-proxy>
                      </q-icon>
                    </template>
                  </q-input>
                </div>
              </div>
              <div class="row">
                <div class="col-5">
                  <q-input v-model.number="data.orders" type="number" :dense="$store.getters.dense.input" :label="$t('global.order')"
                           :rules="[v=>v!==null&&v!==''||$t('error.required')]" class="col-md-4" />
                </div>
                <q-space />
                <div class="col-5">
                  <q-input v-model.trim="data.icon" :dense="$store.getters.dense.input" label="Icon">
                    <template v-slot:append>
                      <q-icon :name="data.icon" />
                    </template>
                  </q-input>
                </div>
              </div>
              <!-- <div class="row"> -->
              <!-- <q-space />
                <div class="col-5 self-center">
                  <q-toggle v-model="data.flag" :true-value="1" :dense="$store.getters.dense.input"
                            :label="data.flag?$t('global.publish'):$t('global.drafts')" />
                </div> -->
              <!-- </div> -->
              <div class="row q-mb-md">
                <div class="col">
                  <q-input v-model.trim="data.desc" autogrow :dense="$store.getters.dense.input" :label="$t('global.desc')" />
                </div>
              </div>
              <div class="row">
                <div class="col-12 q-mb-sm">
                  <div class="col-12">{{$t('global.content')}}</div>
                </div>
                <div class="col-12">
                  <q-editor v-model="data.content" min-height="5rem" />
                </div>
              </div>
            </q-tab-panel>
            <q-tab-panel name="images" id="tab-images">
              <div class="row">
                <div class="col-12 q-gutter-sm images">
                  <!-- <tm-upload v-model="data.images" :upload-url="$store.state.app.apiFileUpload" :max-file-size="1024*1024*2"
                             :headers="[{name:'Upload-Path',value:'category'},{ name:'Upload-Rename',value:true},{name:'x-access-token',value:`Bearer ${$store.state.auth.token}`}]"
                             accept=".jpg,.jpeg,.png,.gif,.jfif" :multiple="false" v-model:view-type="viewType" :size="121"
                             :labelTitleUpload="$t('files.upload')" :labelTitleFiles="$t('files.title')" :labelTitle="$t('files.title')"
                             :labelOpenFile="$t('files.openFile')" :labelOpenData="$t('files.openData')" iconAccept="add_task"
                             :labelAccept="$t('global.accept')" :labelViewList="$t('files.ViewList')" :labelViewBox="$t('files.viewBox')"
                             :labelIndex="$t('files.index')" :labelIcon="$t('files.icon')" :labelFileName="$t('files.fileName')"
                             :labelType="$t('files.type')" :labelFileSize="$t('files.fileSize')" :labelCancel="$t('global.cancel')"
                             :labelConfirmTitle="$t('messageBox.confirm')" :labelConfirmContent="$t('messageBox.delete')" /> -->
                </div>
              </div>
            </q-tab-panel>
            <q-tab-panel name="attributes" id="tab-attributes">
              <div class="col-12 col-md-6 self-center">
                {{$t('global.colorPick')}}:
                <q-badge class="cursor-pointer" :style="{backgroundColor:data.color}">
                  {{data.color}}
                  <q-popup-proxy>
                    <q-color v-model="data.color" />
                  </q-popup-proxy>
                </q-badge>
                <div class="float-right q-mr-sm">
                  <q-icon name="update" class="cursor-pointer text-secondary" style="font-size:20px" @click="data.color='#607d8b'" />
                  <q-icon name="sync" class="cursor-pointer text-primary" style="font-size:20px" @click="onRandomColor" />
                </div>
              </div>
              <div class="q-pt-md q-pb-md">
                <span>{{$t('global.position')}}:</span>
                <q-option-group v-model="data.position" :options="positions" color="green" type="checkbox" inline
                                :dense="$store.getters.dense.input" />
              </div>
              <q-separator class="q-mb-md q-mt-md" />
              <tm-attributes v-model="data.meta" :keys="metaKeys" :values="metaValues"
                             :dense="$store.getters.dense.input" :labelTitle="$t('global.attributes')+':'"
                             :labelBtnAdd="$t('global.add')" :labelBtnUpdate="$t('global.update')" :labelInputKey="$t('global.key')"
                             :labelInputValue="$t('global.value')" :btnEditLabel="$t('global.edit')" :btnDeleteLabel="$t('global.delete')"
                             :labelConfirmTitle="$t('messageBox.confirm')" :labelConfirmContent="$t('messageBox.delete')"
                             :labelWarningContent="$t('error.required')"
                             :labelNoData="$t('table.noData')" :hintKey="$t('hint.newValue')" :hintVal="$t('hint.newValue')"
                             :on-filter-key="onFilterMetaKey" :on-filter-value="onFilterMetaValue" />
              <q-separator class="q-mb-md q-mt-md" />
              <tm-tags v-model="data.tags" :dense="$store.getters.dense.input" :labelTitle="$t('global.keyword')+':'"
                       :labelBtnAdd="$t('global.add')" :labelInput="$t('global.tags')" btnIcon="add" :labelConfirmTitle="$t('messageBox.confirm')"
                       :labelConfirmContent="$t('messageBox.delete')" :labelWarningContent="$t('error.required')" :lblOk="$t('global.accept')"
                       :lblCancel="$t('global.cancel')" />
            </q-tab-panel>
          </q-tab-panels>
        </q-scroll-area>
      </q-form>
    </q-card-section>
  </q-card>
</template>

<script>
import { defineComponent, defineAsyncComponent, ref, computed } from 'vue';
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'
import { RandomColor } from '../../../../global/utils/color'
export default defineComponent({
  name: "CategoryAdd",
  components: {
    tmTabs: defineAsyncComponent(() => import('components/tm-tabs')),
    // tmUpload: defineAsyncComponent(() => import('components/tm-upload')),
    tmTags: defineAsyncComponent(() => import('components/tm-tags')),
    tmAttributes: defineAsyncComponent(() => import('components/tm-attributes'))
  },
  props: {
    dialog: { type: Boolean, default: false },
    maximized: { type: Boolean, default: false }
  },
  setup () {
    const $store = useStore()
    const { t } = useI18n({ useScope: 'global' })
    const tabs = ref('inf')
    const form = ref(null)
    const data = ref({})
    const metaKeys = ref([])
    const metaValues = ref([])
    const viewType = ref('box')
    const existCode = ref(false)

    const positions = computed(() => $store.state.types.items.filter(x => x.key === 'position').map(x => { return { label: x.name, value: x.code } }))

    const onReset = () => {
      new Promise((resolve, reject) => {
        if ($store.state.categories.item) data.value = { ...$store.state.categories.item }
        if (!data.value.content) data.value.content = ''
        resolve()
      }).then(() => { if (form.value) form.value.resetValidation() })
    }
    onReset()

    return {
      tabs, form, data, metaKeys, metaValues, viewType, positions, existCode,
      onFilterMetaKey: (val) => {
        if (!val) return
        metaKeys.value = []
        return $store.dispatch('categories/getMeta', { key: true, filter: val, page: 1, rowsPerPage: 5 }).then((x) => {
          if (x) metaKeys.value = x.data
          return x.data
        })
      },
      onFilterMetaValue: (val) => {
        if (!val) return
        metaValues.value = []
        return $store.dispatch('categories/getMeta', { filter: val, page: 1, rowsPerPage: 5 }).then((x) => {
          if (x) metaValues.value = x.data
          return x.data
        })
      },
      checkExistCode: async (val) => {
        if (val) {
          if ($store.state.categories.item._id) {
            if ($store.state.categories.item.code === data.value.code) return
          }
          const rs = await $store.dispatch('categories/exist', { code: val })
          return rs ? t('error.exist') : true
        }
      },
      onRandomColor: () => {
        data.value.color = RandomColor(true)
      },
      onSubmit: (val) => {
        form.value.validate().then(valid => {
          if (valid) {
            data.value.flag = val ? 1 : 0
            if (data.value.code) data.value.code = data.value.code.toUpperCase()
            if ($store.state.categories.item._id) $store.dispatch('categories/put', data.value)
            else $store.dispatch('categories/post', data.value).then(() => onReset())
          }
        })
      }
    }
  }
})
</script>

<style>
.images .q-img {
  height: 100px;
  max-width: 100px;
}
.img-delete {
  color: #fff;
  cursor: pointer;
  position: absolute;
  right: 0;
  top: 0;
  background-color: #b71c1c;
  display: none;
}
.images .q-img:hover .img-delete {
  display: initial;
}
</style>
