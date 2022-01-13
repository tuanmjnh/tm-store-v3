<template>
  <q-card flat :style="{minWidth:'60%'}">
    <q-toolbar>
      {{icon}}
      <q-avatar v-if="dialog" :icon="icon" size="50px" />
      <q-toolbar-title>{{$t('global.add')}}
        <span class="text-weight-bold">{{$t("product.title")}}</span>
      </q-toolbar-title>
      <q-btn flat type="submit" :dense="$store.getters.dense.button" color="blue"
             icon="check_circle" :label="dialog?'':$t('global.add')" :loading="$store.state.app.loading.post"
             :disable="$store.state.app.loading.post" @click.prevent="onSubmit(1)">
        <q-tooltip v-if="dialog">{{$t('global.add')}}</q-tooltip>
      </q-btn>
      <q-btn v-if="dialog" flat round dense :color="$store.state.app.darkMode?'':'grey-7'" :icon="maximized?'fullscreen_exit':'fullscreen'"
             :disable="$store.state.app.loading.get" @click="$emit('update:maximized',!maximized)">
        <q-tooltip v-if="!$q.platform.is.mobile">
          {{maximized?$t('global.normalScreen'):$t('global.fullScreen')}}
        </q-tooltip>
      </q-btn>
      <q-btn v-if="dialog" flat round dense icon="close" :disable="$store.state.app.loading.get" v-close-popup>
        <q-tooltip v-if="!$q.platform.is.mobile">{{$t('global.cancel')}}</q-tooltip>
      </q-btn>
    </q-toolbar>
    <q-separator />
    <q-form ref="form">
      <q-tabs v-model="tabs" narrow-indicator :dense="$store.getters.dense.form" class="text-deep-purple" align="justify">
        <q-tab name="main" :label="$t('tabs.main')" />
        <q-tab name="about" :label="$t('tabs.about')" />
        <q-tab name="images" :label="$t('global.images')" />
        <q-tab name="attributes" :label="$t('global.attributes')" />
      </q-tabs>
      <q-separator />
      <!-- <q-card-section> -->
      <q-scroll-area style="height:calc(100vh - 180px)">
        <q-tab-panels v-model="tabs">
          <q-tab-panel name="main">
            <div class="row q-gutter-xs">
              <div class="col-12">
                <select-category :categories="categories" v-model:selected="data.categories"
                                 data-key="_id" :dense="$store.getters.dense.input"
                                 :labelTitle="$t('category.titleproduct')" :labelSelect="$t('category.select')"
                                 :labelClose="$t('global.cancel')" @on-selected="onSelectCategory" />
              </div>
            </div>
            <div class="row q-gutter-xs">
              <div class="col-12 col-md-5">
                <q-input v-model.trim="data.title" v-upperCaseFirst :dense="$store.getters.dense.input" :label="$t('product.name')"
                         :rules="[v=>v&&v.length>0||$t('error.required')]" />
              </div>
              <q-space />
              <div class="col-12 col-md-6">
                <q-input v-model.trim="data.code" v-uppercase debounce="500" :dense="$store.getters.dense.input" :label="$t('product.code')"
                         :rules="[v=>v&&v.length>0||$t('error.required'),v=>!existCode||$t('error.exist')]" />
              </div>
            </div>
            <div class="row q-gutter-xs">
              <div class="col-3">
                <q-input v-model="data.priceImport" type="number" :dense="$store.getters.dense.input" :label="$t('product.priceImport')" />
              </div>
              <q-space />
              <div class="col-3">
                <q-input v-model.trim="data.price" type="number" :dense="$store.getters.dense.input" :label="$t('product.priceSale')" />
              </div>
              <q-space />
              <div class="col-3">
                <q-input v-model="data.priceDiscount" type="number" :dense="$store.getters.dense.input" :label="$t('product.priceDiscount')" />
              </div>
            </div>
            <div class="row q-gutter-xs">
              <!-- <div class="col-3">
              <q-input v-model="data.quantity" type="number" :dense="$store.getters.dense.input"
                :label="$t('global.quantity')" />
            </div> -->
              <div class="col-3">
                <q-select v-model="data.unit" use-input emit-value map-options hide-selected fill-input input-debounce="200"
                          :dense="$store.getters.dense.input" :options="units" :label="$t('global.unit')" @filter="onFilterUnit" option-value="_id"
                          :option-label="x=>Object(x)===x&&'name'in x?x.name.toHtml():''" :rules="[v=>v&&v.length>0||$t('error.required')]">
                  <template v-slot:no-option>
                    <q-item>
                      <q-item-section class="text-grey">{{$t('table.noData')}}</q-item-section>
                    </q-item>
                  </template>
                </q-select>
              </div>
              <q-space />
              <div class="col-3">
                <q-select v-model="data.priceUnit" use-input emit-value map-options hide-selected fill-input input-debounce="200"
                          :dense="$store.getters.dense.input" :options="unitsPrice" @filter="onFilterUnitPrice" :label="$t('product.priceUnit')"
                          option-value="_id" :option-label="x=>Object(x)===x&&'name'in x?x.name.toHtml():''"
                          :rules="[v=>v&&v.length>0||$t('error.required')]">
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
                <q-input v-model="data.orders" type="number" :dense="$store.getters.dense.input" :label="$t('global.order')"
                         :rules="[v=>v!==null&&v!==''||$t('error.required')]" class="col-md-4" />
              </div>
            </div>
          </q-tab-panel>
          <q-tab-panel name="about">
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
              <div class="col">
                {{$t('global.pin')}}:
                <q-option-group v-model="data.pin" :options="pins" type="checkbox" inline :dense="$store.getters.dense.input" />
              </div>
            </div>
            <q-separator class="q-mt-md" />
            <tm-tags v-model:data="data.tags" :dense="$store.getters.dense.input" :labelTitle="$t('global.keyword')+':'"
                     :labelBtnAdd="$t('global.add')" :labelInput="$t('global.tags')" btnIcon="add" btnColor="blue" tagsColor="primary"
                     tagsTextColor="white" :labelConfirmTitle="$t('messageBox.confirm')" :labelConfirmContent="$t('messageBox.delete')"
                     :labelWarningTitle="$t('messageBox.warning')" :labelWarningContent="$t('error.required')" />
            <q-separator class="q-mb-md q-mt-md" />
            <tm-attributes v-model:data="data.attr" :keys="attrKeys" :values="attrValues" :dense="$store.getters.dense.input"
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
  </q-card>
</template>

<script>
import { defineComponent, defineAsyncComponent, ref, computed } from 'vue';
import { useStore } from 'vuex'
import normalize from '@/utils/search'
export default defineComponent({
  name: 'ProductComponentsAdd',
  components: {
    tmEditor: defineAsyncComponent(() => import('components/tm-editor')),
    tmUpload: defineAsyncComponent(() => import('components/tm-upload')),
    tmTags: defineAsyncComponent(() => import('components/tm-tags')),
    tmAttributes: defineAsyncComponent(() => import('components/tm-attributes')),
    selectCategory: defineAsyncComponent(() => import('pages/category/components/select-category'))
  },
  props: {
    dialog: { type: Boolean, default: false },
    maximized: { type: Boolean, default: false },
    icon: { type: String, default: 'add' }
  },
  setup (props, { emit }) {
    const $store = useStore()
    const dialogFiles = ref(false)
    const dialogUpload = ref(false)
    const tabs = ref('main')
    const form = ref(null)
    const data = ref({})
    const attrKeys = ref([])
    const attrValues = ref([])
    const unit = ref(null)
    const unitPrice = ref(null)
    const existCode = ref(false)
    const pins = computed(() => $store.state.types.items.filter(x => x.key === 'pin_product').map(x => { return { label: x.name, value: x.code } }))
    const unitsSource = computed(() => $store.state.types.items.filter(x => x.key === 'unit'))
    const unitsPriceSource = computed(() => $store.state.types.items.filter(x => x.key === 'unit_price'))
    const units = ref(unitsSource.value)
    const unitsPrice = ref(unitsPriceSource.value)
    const viewType = ref('box')
    const categories = ref([])
    const constant = ref({
      categories: null,
      title: null,
      code: null,
      desc: null,
      content: '',
      images: null,
      quantity: 0,
      priceImport: 0,
      price: 0,
      priceDiscount: 0,
      quantityImport: 0,
      priceUnit: null,
      unit: null,
      origin: null,
      date: null,
      pin: [],
      tags: null,
      attr: [],
      meta: null,
      orders: 1,
      flag: 1
    })

    $store.dispatch('categories/get', { type: 'product', flag: 1, x: true, generate: true }).then((x) => { categories.value = x })
    const onReset = () => {
      return new Promise((resolve, reject) => {
        emit('update:maximized', false)
        data.value = { ...constant.value }
        // this.form.images = []
        // this.unit = this.units[0]
        // this.unitPrice = this.unitsPrice[0]
        resolve()
      }).then(() => { if (form.value) form.value.resetValidation() })
    }

    onReset()

    return {
      tabs, form, data, attrKeys, attrValues, viewType, categories, pins, units, unitsPrice,
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
      checkExistCode: async (val) => {
        if (val) {
          if ($store.state.products.item._id) {
            if ($store.state.products.item.code === data.value.code) return
          }
          const rs = await $store.dispatch('products/exist', { code: val })
          return rs ? t('error.exist') : true
        }
      },
      onSelectCategory (item) {
        if (!item.children || !item.children.length) {
          data.value.categories = [item._id]
        }
      },
      onSubmit () {
        // if (unit) this.form.unit = this.unit.name
        // if (this.unitPrice) this.form.priceUnit = this.unitPrice.name
        // this.form.images = this.images.map(x => x.fullName)
        form.value.validate().then(async (valid) => {
          if (valid) {
            // api.insert(this.form).then((x) => {
            //   emit('update:dialog', false)
            //   emit('on-finish', x)
            // })
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
