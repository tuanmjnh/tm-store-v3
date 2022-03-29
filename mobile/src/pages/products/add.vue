<template>
  <q-card>
    <q-toolbar>
      <div class="col-auto">
        <q-btn flat dense icon="arrow_back" v-close-popup />
      </div>
      <q-toolbar-title class="text-subtitle1">
        {{data._id?`${$t('route.edit')} ${$t("route.product").toLowerCase()}`:`${$t('route.add')} ${$t("route.product").toLowerCase()}`}}
      </q-toolbar-title>
      <q-btn icon="offline_pin" flat round dense color="blue" class="q-mr-sm" @click="onSubmit(1)" />
      <q-btn icon="draw" flat round dense color="amber" @click="onSubmit(0)" />
    </q-toolbar>
    <q-separator />
    <q-card-section class="q-pa-none">
      <q-form ref="form">
        <tm-tabs v-model="tabs" narrow-indicator :dense="$store.getters.dense.form" class="text-blue" align="justify">
          <q-tab name="inf" :label="$t('tabs.inf')" />
          <q-tab name="images" :label="$t('global.images')" />
          <q-tab name="attributes" :label="$t('global.attributes')" />
          <q-tab name="qrcode" :label="$t('qrCode.qrCode')" />
        </tm-tabs>
        <q-separator />
        <!-- <q-scroll-area style="height:calc(100vh - 99px)"> -->
        <q-tab-panel name="inf" id="tab-inf" class="scroll" style="height:calc(100vh - 99px)">
          <div class="row q-gutter-xs">
            <div class="col-12">
              <select-category v-model="selectedCategory" v-model:parents="selectedCategories" :categories="categories" option-value="_id"
                               :rules="[v=>v&&v.length>0||$t('error.required')]" :expanded="expanded" option-label="label" maximized
                               :dense="$store.getters.dense.input" :labelSelect="$t('category.select')" :labelClose="$t('global.cancel')"
                               :labelTitle="$t('category.titleproduct')" />
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
            <div class="col-12 col-md-5">
              <q-input v-model.trim="data.origin" :dense="$store.getters.dense.input" :label="$t('product.origin')" />
            </div>
            <q-space />
            <div class="col-12 col-md-5">
              <q-input v-model.trim="data.date" :dense="$store.getters.dense.input" :label="$t('product.date')" />
            </div>
          </div>
          <div class="row q-gutter-xs">
            <div class="col-12 col-md-5">
              <q-input v-model.trim="data.price" type="number" :dense="$store.getters.dense.input" :label="$t('product.priceSale')" />
            </div>
            <q-space />
            <div class="col-12 col-md-5">
              <q-input v-model="data.priceDiscount" type="number" :dense="$store.getters.dense.input" :label="$t('product.priceDiscount')" />
            </div>
          </div>
          <div class="row q-gutter-xs">
            <div class="col-12 col-md-5">
              <q-input v-model="data.priceImport" type="number" :dense="$store.getters.dense.input" :label="$t('product.priceImport')" />
            </div>
            <q-space />
            <div class="col-12 col-md-5">
              <q-input v-model="data.priceExport" type="number" :dense="$store.getters.dense.input" :label="$t('product.priceExport')" />
            </div>
          </div>
          <div class="row q-gutter-xs">
            <div class="col-12 col-md-3">
              <q-input v-model="data.quantity" type="number" :dense="$store.getters.dense.input" :label="$t('product.quantityStore')" />
            </div>
            <q-space />
            <div class="col-12 col-md-3">
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
            <!-- <div class="col-2">
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
              </div> -->
            <q-space />
            <div class="col-12 col-md-3">
              <q-input v-model="data.order" type="number" :dense="$store.getters.dense.input" :label="$t('global.order')"
                       :rules="[v=>v!==null&&v!==''||$t('error.required')]" class="col-md-4" />
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
              <tm-editor v-model="data.content" :upload-url="$store.getters.apiUpload" multiple accept=".jpg,.jpeg,.png,.gif"
                         :labelFileSize="$t('files.fileSize')" :labelFileName="$t('files.fileName')"
                         :labelViewList="$t('files.ViewList')" :labelViewBox="$t('files.viewBox')"
                         :headers="[{name:'Upload-Path',value:'products'},{ name:'Upload-Rename',value:true},{name:'x-access-token',value:`Bearer ${$store.state.auth.token}`}]" />
            </div>
          </div>
        </q-tab-panel>
        <q-tab-panel name="images" id="tab-images" class="q-pt-none q-pb-none">
          <tm-fileList ref="refTMFileList" v-model="data.images" v-model:selected="selectedFileList" v-model:view-type="viewType" generate-image
                       :multiple="true" :size="113" minHeight="660px" :lblConfirmTitle="$t('messageBox.warning')"
                       :lblConfirmContent="$t('messageBox.delete')" :lblOk="$t('global.accept')" :lblCancel="$t('global.cancel')">
            <template v-slot:tool-bar>
              <q-btn round dense flat icon="file_upload" color="primary" @click="isDialogUpload=!isDialogUpload" />
              <!-- <q-popup-proxy>
                    <tm-upload v-model="data.images" :upload-url="$store.state.app.apiUpload" :multiple="true" accept=".jpg,.jpeg,.png,.gif,.jfif"
                               :labelTitleUpload="$t('files.upload')" :labelTitleFiles="$t('files.title')"
                               :labelTitle="$t('files.title')" imageWidth="100%" imageHeight="250px" />
                  </q-popup-proxy> -->
              <q-btn round dense flat icon="cloud_circle" color="secondary" @click="isDialogFileManager=!isDialogFileManager" />
              <q-separator vertical class="q-ml-sm q-mr-sm" />
              <q-btn dense flat icon="view_module" :color="viewType==='box'?'indigo':'blue-grey'"
                     @click="$refs.refTMFileList.onChangeView('box')">
                <q-tooltip v-if="!$q.platform.is.mobile">{{labelViewBox}}</q-tooltip>
              </q-btn>
              <q-btn dense flat icon="view_list" :color="viewType==='list'?'indigo':'blue-grey'"
                     @click="$refs.refTMFileList.onChangeView('list')">
                <q-tooltip v-if="!$q.platform.is.mobile">{{labelViewList}}</q-tooltip>
              </q-btn>
            </template>
          </tm-fileList>
        </q-tab-panel>
        <q-tab-panel name="attributes" id="tab-attributes" class="scroll" style="height:calc(100vh - 99px)">
          <div class="row q-gutter-md">
            <div class="col-12">{{$t('global.pin')}}:</div>
            <div class="col-12">
              <q-option-group v-model="data.pins" :options="pins" type="checkbox" inline :dense="$store.getters.dense.input" />
            </div>
          </div>
          <q-separator class="q-mt-md" />
          <tm-tags v-model="data.tags" :dense="$store.getters.dense.input" :labelTitle="$t('global.keyword')+':'"
                   :labelBtnAdd="$t('global.add')" :labelInput="$t('global.tags')" btnIcon="add" :labelConfirmTitle="$t('messageBox.confirm')"
                   :labelConfirmContent="$t('messageBox.delete')" :labelWarningContent="$t('error.required')" :lblOk="$t('global.accept')"
                   :lblCancel="$t('global.cancel')" />
          <q-separator class="q-mb-md q-mt-md" />
          <tm-attributes v-model="data.attr" :keys="attrKeys" :values="attrValues" :dense="$store.getters.dense.input"
                         :labelTitle="$t('global.attributes')+':'" :labelBtnAdd="$t('global.add')" :labelBtnUpdate="$t('global.update')"
                         :labelInputKey="$t('global.key')" :labelInputValue="$t('global.value')" :btnEditLabel="$t('global.edit')"
                         :btnDeleteLabel="$t('global.delete')" :labelConfirmTitle="$t('messageBox.confirm')"
                         :labelConfirmContent="$t('messageBox.delete')" :labelWarningContent="$t('error.required')"
                         :labelNoData="$t('table.noData')" :hintKey="$t('hint.newValue')" :hintVal="$t('hint.newValue')"
                         :on-filter-key="onFilterAttrKey" :on-filter-value="onFilterAttrValue" />
        </q-tab-panel>
        <q-tab-panel name="qrcode" id="tab-qrcode" class="scroll" style="height:calc(100vh - 99px)">
          <div class="row q-gutter-xs q-mb-lg">
            <div class="col-12 col-md-5">
              <tm-qrcodegenerator v-model="data.qrcode" :defaultValue="$store.state.products.item._id"
                                  :title="$t('qrCode.qrCode')" :labelDefault="$t('qrCode.qrCodeDefault')"
                                  :labelScanner="$t('qrCode.qrCodeScanner')" :labelEdit="$t('qrCode.qrCodeEdit')"
                                  :labelHelper="$t('qrCode.qrCodeEditHelp')" />
            </div>
            <q-space />
            <div class="col-12 col-md-5">
              <tm-barcodegenerator v-model="data.barcode" @onSetRandom="onSetRandomCode" :displayValue="true"
                                   :labelDefault="$t('qrCode.barCodeRandom')" :title="$t('qrCode.barCode')"
                                   :labelScanner="$t('qrCode.barCodeScanner')" :labelEdit="$t('qrCode.barCodeEdit')"
                                   :labelHelper="$t('qrCode.barCodeEditHelp')" />
            </div>
          </div>
        </q-tab-panel>
        <!-- </q-scroll-area> -->
      </q-form>
    </q-card-section>
  </q-card>
  <!-- Dialog FileManager -->
  <q-dialog v-model="isDialogFileManager" maximized>
    <q-card>
      <q-card-section class="q-pl-md q-pr-md q-pt-none q-pb-none">
        <!---->
        <tm-fileManager lblAccept="" :lblConfirmTitle="$t('messageBox.warning')" :lblConfirmContent="$t('messageBox.delete')"
                        :size="113" :lblOk="$t('global.accept')" :lblCancel="$t('global.cancel')" accept=".jpg,.jpeg,.png,.gif,.jfif"
                        :url="$store.state.app.apiUpload" @onAccept="onAccept" :multiple="true"
                        :headers="[{name:'Upload-Path',value:'products'},{ name:'Upload-Rename',value:true},{name:'x-access-token',value:`Bearer ${$store.state.auth.token}`}]">
          <template v-slot:headerLeft>
            <q-btn flat dense icon="arrow_back" v-close-popup />
            <span class="text-subtitle1">{{$t('files.manager')}}</span>
          </template>
        </tm-fileManager>
      </q-card-section>
    </q-card>
  </q-dialog>
  <!-- Dialog Upload -->
  <q-dialog v-model="isDialogUpload" maximized>
    <q-card>
      <q-card-section class="q-pl-md q-pr-md q-pt-none q-pb-none">
        <tm-upload :multiple="true" :lblConfirmTitle="$t('messageBox.warning')" :lblConfirmContent="$t('messageBox.delete')"
                   :lblOk="$t('global.accept')" :lblCancel="$t('global.cancel')" :size="113"
                   accept=".jpg,.jpeg,.png,.gif,.jfif" :upload-url="$store.state.app.apiUpload" @on-finish="onUploaded"
                   :headers="[{name:'Upload-Path',value:'products'},{ name:'Upload-Rename',value:true},{name:'x-access-token',value:`Bearer ${$store.state.auth.token}`}]">
          <template v-slot:headerLeft>
            <q-btn flat dense icon="arrow_back" v-close-popup />
            <span class="text-subtitle1">{{$t('files.upload')}}</span>
          </template>
        </tm-upload>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script>
import { defineComponent, defineAsyncComponent, ref, computed } from 'vue';
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'
import { normalize } from '../../../../global/utils/search'
import { getRndInteger } from '../../../../global/utils/number'
export default defineComponent({
  name: "ProductAdd",
  components: {
    tmTabs: defineAsyncComponent(() => import('components/tm-tabs')),
    tmEditor: defineAsyncComponent(() => import('@/components/tm-editor')),
    tmFileList: defineAsyncComponent(() => import('@/components/tm-file-list')),
    tmUpload: defineAsyncComponent(() => import('@/components/tm-upload')),
    tmFileManager: defineAsyncComponent(() => import('@/components/tm-file-manager')),
    tmTags: defineAsyncComponent(() => import('@/components/tm-tags')),
    tmAttributes: defineAsyncComponent(() => import('@/components/tm-attributes')),
    selectCategory: defineAsyncComponent(() => import('pages/category/components/select-category')),
    tmQrcodegenerator: defineAsyncComponent(() => import('@/components/tm-qrcode-generator')),
    tmBarcodegenerator: defineAsyncComponent(() => import('@/components/tm-barcode-generator'))
  },
  emits: ['onFinish'],
  setup (props, { emit }) {
    const $store = useStore()
    const { t } = useI18n({ useScope: 'global' })
    const tabs = ref('inf')
    const form = ref(null)
    const data = ref({})
    const attrKeys = ref([])
    const attrValues = ref([])
    const categories = computed(() => $store.state.categories.all.product || [])
    const pins = computed(() => $store.state.types.items.filter(x => x.key === 'pinProduct').map(x => { return { label: x.name, value: x.code } }))
    const unitsSource = computed(() => $store.state.types.items.filter(x => x.key === 'unit'))
    const unitsPriceSource = computed(() => $store.state.types.items.filter(x => x.key === 'unitPrice'))
    const units = ref(unitsSource.value)
    const unitsPrice = ref(unitsPriceSource.value)
    const selectedCategory = ref(null)
    const selectedCategories = ref([])
    const expanded = ref(null)
    const selectedFileList = ref(null)
    // TMFileList
    const viewType = ref('box')
    const refTMFileList = ref(null)
    // TMUpload
    const isDialogUpload = ref(false)
    const isDialogFileManager = ref(false)
    // const imagesList = ref([])
    if ($store.state.auth.token) {
      if (!$store.state.categories.all.product || $store.state.categories.all.product.length < 1)
        $store.dispatch('categories/get', { type: 'product', flag: 1, all: true })
    }
    const onReset = () => {
      return new Promise((resolve, reject) => {
        if ($store.state.products.item) data.value = JSON.parse(JSON.stringify($store.state.products.item)) // Object.assign({}, $store.state.products.item)
        if (data.value.categories && data.value.categories.length > 0) {
          selectedCategory.value = data.value.categories[data.value.categories.length - 1]
          expanded.value = data.value.categories
        }
        if (!data.value.content) data.value.content = ''
        resolve()
      }).then(() => { if (form.value) form.value.resetValidation() })
    }

    onReset()

    return {
      tabs, form, data, attrKeys, attrValues, categories, pins, units, unitsPrice, selectedCategory, selectedCategories, expanded,
      selectedFileList, viewType, refTMFileList, isDialogUpload, isDialogFileManager,
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
      onSubmit (flag) {
        form.value.validate().then(async (valid) => {
          if (valid) {
            data.value.flag = flag
            if (selectedCategories.value && selectedCategories.value.length) data.value.categories = selectedCategories.value.map(x => x._id)
            if ($store.state.products.item._id) {
              $store.dispatch('products/put', data.value).then(() => {
                data.value = JSON.parse(JSON.stringify(data.value))
                emit('onFinish', data.value)
              })
            } else $store.dispatch('products/post', data.value).then((x) => {
              emit('onFinish', x)
              onReset()
            })
          }
        })
      },
      onSetRandomCode () {
        data.value.barcode = getRndInteger(1234567890123, 9999999999999).toString()
      },
      onUploaded (val) {
        isDialogUpload.value = false
        if (val)
          if (data.value.images) {
            val.forEach(e => {
              if (data.value.images.findIndex(x => x === e.url) < 0)
                data.value.images.push(e.url)
            })
          } else {
            data.value.images = val.map(x => x.url)
          }
      },
      onAccept (val) {
        isDialogFileManager.value = false
        if (val)
          if (data.value.images) {
            val.forEach(e => {
              if (data.value.images.findIndex(x => x === e.url) < 0)
                data.value.images.push(e.url)
            })
          } else {
            data.value.images = val.map(x => x.url)
          }
      }
    }
  }
})
</script>
