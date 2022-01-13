<template>
  <div>
    <div class="row card-title">
      <div class="col-sm-auto col-xs-12 text-h6 card-title-text">
        <q-avatar v-if="dialog" :icon="$route.meta.icon" size="50px" />
        {{$store.state.products.item._id?$t('global.update'):$t('global.add')}}
        <span class="text-weight-bold">{{$t("product.title")}}</span>
      </div>
      <q-space />
      <div class="col-sm-auto col-xs-12 text-right">
        <q-btn v-if="$store.state.products.item._id" flat type="submit" :dense="$store.getters.dense.button" color="amber"
               icon="offline_pin" :loading="$store.state.app.loading.put" @click.prevent="onSubmit">
          <!-- :label="dialog?'':$t('global.update')" -->
          <q-tooltip>{{$t('global.update')}}</q-tooltip>
        </q-btn>
        <q-btn v-if="!$store.state.products.item._id" flat type="submit" :dense="$store.getters.dense.button" color="blue"
               icon="check_circle" :loading="$store.state.app.loading.post" @click.prevent="onSubmit">
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
      <q-tabs v-model="tabs" narrow-indicator :dense="$store.getters.dense.form" class="text-deep-purple" align="justify">
        <q-tab name="inf" :label="$t('tabs.inf')" />
        <!-- <q-tab name="about" :label="$t('tabs.about')" /> -->
        <q-tab name="images" :label="$t('global.images')" />
        <q-tab name="attributes" :label="$t('global.attributes')" />
      </q-tabs>
      <q-separator />
      <!-- <q-card-section> -->
      <q-scroll-area style="height:calc(100vh - 180px)">
        <q-tab-panels v-model="tabs">
          <q-tab-panel name="inf">
            <div class="row q-gutter-xs">
              <div class="col-12">
                <select-category v-model="selectedCategory" v-model:parents="selectedCategories" :categories="categories" option-value="_id"
                                 option-label="label" :dense="$store.getters.dense.input" :labelTitle="$t('category.titleproduct')"
                                 :labelSelect="$t('category.select')" :labelClose="$t('global.cancel')"
                                 :rules="[v=>v&&v.length>0||$t('error.required')]" />
              </div>
            </div>
            <div class="row q-gutter-xs">
              <div class="col-12 col-md-5">
                <q-input v-model.trim="data.title" v-upperCaseFirst :dense="$store.getters.dense.input" :label="$t('product.name')"
                         :rules="[v=>v&&v.length>0||$t('error.required')]" />
              </div>
              <q-space />
              <div class="col-12 col-md-5">
                <q-input v-model.trim="data.code" v-uppercase debounce="500" :dense="$store.getters.dense.input" :label="$t('product.code')"
                         :rules="[v=>v&&v.length>0||$t('error.required'),v=>checkExistCode(v)]" />
              </div>
            </div>
            <div class="row q-gutter-xs">
              <div class="col-5">
                <q-input v-model.trim="data.price" type="number" :dense="$store.getters.dense.input" :label="$t('product.priceSale')" />
              </div>
              <q-space />
              <div class="col-5">
                <q-input v-model="data.priceDiscount" type="number" :dense="$store.getters.dense.input" :label="$t('product.priceDiscount')" />
              </div>
            </div>
            <div class="row q-gutter-xs">
              <div class="col-5">
                <q-input v-model="data.priceImport" type="number" :dense="$store.getters.dense.input" :label="$t('product.priceImport')" />
              </div>
              <q-space />
              <div class="col-5">
                <q-input v-model="data.priceExport" type="number" :dense="$store.getters.dense.input" :label="$t('product.priceExport')" />
              </div>
            </div>
            <div class="row q-gutter-xs">
              <div class="col-3">
                <q-input v-model="data.quantity" type="number" :dense="$store.getters.dense.input" :label="$t('product.quantityStore')" />
              </div>
              <div class="col-2">
                <q-select v-model="data.unit" use-input emit-value map-options hide-selected fill-input input-debounce="200"
                          :dense="$store.getters.dense.input" :options="units" :label="$t('global.unit')" @filter="onFilterUnit" option-value="code"
                          :option-label="x=>Object(x)===x&&'name'in x?x.name.toHtml():''" :rules="[v=>v&&v.length>0||$t('error.required')]"
                          @update:model-value="onUpdateValueUnit">
                  <template v-slot:no-option>
                    <q-item>
                      <q-item-section class="text-grey">{{$t('table.noData')}}</q-item-section>
                    </q-item>
                  </template>
                </q-select>
              </div>
              <div class="col-2">
                <q-select v-model="data.priceUnit" use-input emit-value map-options hide-selected fill-input input-debounce="200"
                          :dense="$store.getters.dense.input" :options="unitsPrice" :label="$t('product.priceUnit')" @filter="onFilterUnitPrice"
                          option-value="code" :option-label="x=>Object(x)===x&&'name'in x?x.name.toHtml():''"
                          :rules="[v=>v&&v.length>0||$t('error.required')]" @update:model-value="onUpdateValueUnitPrice">
                  <template v-slot:no-option>
                    <q-item>
                      <q-item-section class="text-grey">{{$t('table.noData')}}</q-item-section>
                    </q-item>
                  </template>
                </q-select>
                <!-- <q-input v-model="data.priceUnit" type="number" :dense="$store.getters.dense.input" :label="$t('global.priceUnit')" /> -->
              </div>
              <q-space />
              <div class="col-3">
                <q-input v-model="data.order" type="number" :dense="$store.getters.dense.input" :label="$t('global.order')"
                         :rules="[v=>v!==null&&v!==''||$t('error.required')]" class="col-md-4" />
              </div>
            </div>
            <div class="row q-gutter-xs">
              <div class="col-12 col-md-5">
                <q-input v-model.trim="data.origin" :dense="$store.getters.dense.input" :label="$t('product.origin')" />
              </div>
              <q-space />
              <div class="col-12 col-md-6">
                <q-input v-model.trim="data.date" :dense="$store.getters.dense.input" :label="$t('product.date')" />
              </div>
            </div>
            <div class="row q-gutter-sm q-mb-lg">
              <div class="col-12">
                <q-input v-model.trim="data.desc" autogrow :dense="$store.getters.dense.input" :label="$t('global.desc')" />
              </div>
            </div>
            <div class="row q-gutter-sm">
              <div class="col-12">{{$t('global.content')}}</div>
              <div class="col-12">
                <tm-editor v-model="data.content" :upload-url="$store.state.app.apiFileUpload" multiple :max-file-size="1024*1024*2"
                           :headers="[{name:'Upload-Path',value:'products'},{ name:'Upload-Rename',value:true},{name:'x-access-token',value:`Bearer ${$store.state.auth.token}`}]"
                           accept=".jpg,.jpeg,.png,.gif" iconAccept="add_task" :labelAccept="$t('global.accept')"
                           :labelViewList="$t('files.ViewList')" :labelViewBox="$t('files.viewBox')" :labelFileName="$t('files.fileName')"
                           :labelFileSize="$t('files.fileSize')" />
              </div>
            </div>
          </q-tab-panel>
          <!-- <q-tab-panel name="about">
            <div class="row q-gutter-xs">
              <div class="col-12 col-md-5">
                <q-input v-model.trim="data.origin" :dense="$store.getters.dense.input"
                  :label="$t('product.origin')" />
              </div>
              <q-space />
              <div class="col-12 col-md-6">
                <q-input v-model.trim="data.date" :dense="$store.getters.dense.input"
                  :label="$t('product.date')" />
              </div>
            </div>
            <div class="row q-gutter-sm q-mb-lg">
              <div class="col-12">
                <q-input v-model.trim="data.desc" autogrow :dense="$store.getters.dense.input"
                  :label="$t('global.desc')" />
              </div>
            </div>
            <div class="row q-gutter-sm">
              <div class="col-12">{{$t('global.content')}}</div>
              <div class="col-12">
                <tm-editor :value.sync="data.content" :upload-url="uploadUrl" :headers="headers"
                  multiple :max-file-size="1024*1024*2" accept=".jpg,.jpeg,.png,.gif"></tm-editor>
                <-- <q-editor v-model="data.content" min-height="5rem" />
              </div>
            </div>
          </q-tab-panel> -->
          <q-tab-panel name="images">
            <div class="row">
              <div class="col-12 q-gutter-sm images">
                <tm-upload v-model="data.images" :upload-url="$store.state.app.apiFileUpload" :max-file-size="1024*1024*2"
                           :headers="[{name:'Upload-Path',value:'products'},{ name:'Upload-Rename',value:true},{name:'x-access-token',value:`Bearer ${$store.state.auth.token}`}]"
                           accept=".jpg,.jpeg,.png,.gif,.jfif" :multiple="true" v-model:view-type="viewType" :size="121"
                           :labelTitleUpload="$t('files.upload')" :labelTitleFiles="$t('files.title')" :labelTitle="$t('files.title')"
                           :labelOpenFile="$t('files.openFile')" :labelOpenData="$t('files.openData')" iconAccept="add_task"
                           :labelAccept="$t('global.accept')" :labelViewList="$t('files.ViewList')" :labelViewBox="$t('files.viewBox')"
                           :labelIndex="$t('files.index')" :labelIcon="$t('files.icon')" :labelFileName="$t('files.fileName')"
                           :labelType="$t('files.type')" :labelFileSize="$t('files.fileSize')" :labelCancel="$t('global.cancel')"
                           :labelConfirmTitle="$t('messageBox.confirm')" :labelConfirmContent="$t('messageBox.delete')" />
              </div>
            </div>
          </q-tab-panel>
          <q-tab-panel name="attributes">
            <div class="row q-gutter-md">
              <div class="col-12">{{$t('global.pin')}}:</div>
              <div class="col-12">
                <q-option-group v-model="data.pins" :options="pins" type="checkbox" inline :dense="$store.getters.dense.input" />
              </div>
            </div>
            <q-separator class="q-mt-md" />
            <tm-tags v-model="data.tags" :dense="$store.getters.dense.input" :labelTitle="$t('global.keyword')+':'"
                     :labelBtnAdd="$t('global.add')" :labelInput="$t('global.tags')" btnIcon="add" btnColor="blue" tagsColor="primary"
                     tagsTextColor="white" :labelConfirmTitle="$t('messageBox.confirm')" :labelConfirmContent="$t('messageBox.delete')"
                     :labelWarningTitle="$t('messageBox.warning')" :labelWarningContent="$t('error.required')" />
            <q-separator class="q-mb-md q-mt-md" />
            <tm-attributes v-model="data.attr" :keys="attrKeys" :values="attrValues" :dense="$store.getters.dense.input"
                           :labelTitle="$t('global.attributes')+':'" :labelBtnAdd="$t('global.add')" :labelBtnUpdate="$t('global.update')"
                           :labelInputKey="$t('global.key')" :labelInputValue="$t('global.value')" :btnEditLabel="$t('global.edit')"
                           :btnDeleteLabel="$t('global.delete')" :labelConfirmTitle="$t('messageBox.confirm')"
                           :labelConfirmContent="$t('messageBox.delete')" :labelWarningTitle="$t('messageBox.warning')"
                           :labelWarningContent="$t('error.required')" :labelNoData="$t('table.noData')" :hintKey="$t('hint.newValue')"
                           :hintVal="$t('hint.newValue')" :on-filter-key="onFilterAttrKey" :on-filter-value="onFilterAttrValue" />
          </q-tab-panel>
        </q-tab-panels>
      </q-scroll-area>
      <!-- </q-card-section> -->
    </q-form>
    <!-- </q-card> -->
  </div>
</template>

<script>
import { defineComponent, defineAsyncComponent, ref, computed } from 'vue';
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'
import normalize from '@/utils/search'
export default defineComponent({
  name: 'ProductAdd',
  components: {
    tmEditor: defineAsyncComponent(() => import('@/components/tm-editor')),
    tmUpload: defineAsyncComponent(() => import('@/components/tm-upload')),
    tmTags: defineAsyncComponent(() => import('@/components/tm-tags')),
    tmAttributes: defineAsyncComponent(() => import('@/components/tm-attributes')),
    selectCategory: defineAsyncComponent(() => import('pages/category/components/select-category'))
  },
  props: {
    dialog: { type: Boolean, default: false },
    maximized: { type: Boolean, default: false }
  },
  setup (props, { emit }) {
    const $store = useStore()
    const { t } = useI18n({ useScope: 'global' })
    const tabs = ref('inf')
    const form = ref(null)
    const data = ref({})
    const attrKeys = ref([])
    const attrValues = ref([])
    const viewType = ref('box')
    const categories = ref([])
    const pins = computed(() => $store.state.types.items.filter(x => x.key === 'pin_product').map(x => { return { label: x.name, value: x.code } }))
    const unitsSource = computed(() => $store.state.types.items.filter(x => x.key === 'unit'))
    const unitsPriceSource = computed(() => $store.state.types.items.filter(x => x.key === 'unit_price'))
    const units = ref(unitsSource.value)
    const unitsPrice = ref(unitsPriceSource.value)
    const selectedCategory = ref([])
    const selectedCategories = ref([])

    $store.dispatch('categories/get', { type: 'product', flag: 1, x: true, generate: true }).then((x) => { categories.value = x })

    const onReset = () => {
      return new Promise((resolve, reject) => {
        if ($store.state.products.item) data.value = { ...$store.state.products.item }
        if ($store.state.products.item._id) { }
        resolve()
      }).then(() => { if (form.value) form.value.resetValidation() })
    }

    onReset()

    return {
      tabs, form, data, attrKeys, attrValues, viewType, categories, pins, units, unitsPrice, selectedCategory, selectedCategories,
      onFilterAttrKey (val) {
        if (!val) return
        attrKeys.value = []
        return $store.dispatch('products/getAttr', { key: true, filter: val, page: 1, rowsPerPage: 5 }).then((x) => {
          if (x) attrKeys.value = x.data
          return x.data
        })
      },
      onFilterAttrValue (val) {
        if (!val) return
        attrValues.value = []
        return $store.dispatch('products/getAttr', { filter: val, page: 1, rowsPerPage: 5 }).then((x) => {
          if (x) attrValues.value = x.data
          return x.data
        })
      },
      onFilterUnit: (val, update, abort) => {
        update(() => { units.value = unitsSource.value.filter(v => normalize(v.name.toLowerCase()).indexOf(normalize(val.toLowerCase())) > -1) })
      },
      onFilterUnitPrice: (val, update, abort) => {
        update(() => { unitsPrice.value = unitsPriceSource.value.filter(v => normalize(v.name.toLowerCase()).indexOf(normalize(val.toLowerCase())) > -1) })
      },
      onUpdateValueUnit: (val) => {
        const e = unitsSource.value.find(x => x.code === val)
        if (e) data.value.unitName = e.name
      },
      onUpdateValueUnitPrice: (val) => {
        const e = unitsPriceSource.value.find(x => x.code === val)
        if (e) data.value.priceUnitName = e.name
      },
      checkExistCode: async (val) => {
        if (val) {
          if ($store.state.products.item._id) {
            if ($store.state.products.item.code === data.value.code) return
          }
          const rs = await $store.dispatch('products/exist', { code: val })
          return rs ? t('error.exist') : true
        }
      },
      onSubmit () {
        form.value.validate().then(async (valid) => {
          if (valid) {
            data.value.categories = selectedCategories.value.map(x => x._id)
            if ($store.state.products.item._id) {
              $store.dispatch('products/put', data.value).then(() => {
                emit('on-finish', data.value)
              })
            } else $store.dispatch('products/post', data.value).then((x) => {
              emit('on-finish', x)
              onReset()
            })
          }
        })
      }
    }
  }
})
</script>

<style scoped>
.images {
  min-height: 100px;
}
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
