<template>
  <q-card flat bordered>
    <q-toolbar>
      <q-toolbar-title>{{$t('product.warehouseExport')}}</q-toolbar-title>
      <q-btn v-if="!result&&rows&&rows.length" type="submit" no-caps :dense="$store.getters.dense.button" color="blue" :label="$t('product.export')"
             :loading="isLoading" class="q-btn--square q-mr-sm" @click.prevent="onSubmit" />
      <!--icon="offline_pin" -->
      <q-btn v-if="rows&&rows.length" type="submit" no-caps :dense="$store.getters.dense.button" color="blue-grey-4"
             :label="$t('product.createNew')" :loading="isLoading" class="q-btn--square" @click.prevent="onCreateNew" />
    </q-toolbar>
    <q-separator />
    <q-form ref="form">
      <q-table :rows="rows" :columns="columns" row-key="code" flat :visible-columns="visibleColumns"
               :loading="$store.state.app.loading.get||$store.state.app.loading.patch" v-model:selected="selected" selection="multiple"
               :dense="$store.getters.dense.table" :no-data-label="$t('table.noData')" :no-results-label="$t('table.noFilterData')"
               :rows-per-page-label="$t('table.rowPerPage')" :selected-rows-label="()=>`${selected.length} ${$t('table.rowSelected')}`"
               :rows-per-page-options="$store.state.app.rowsPerPageOptions" v-model:pagination="pagination">
        <template v-slot:top="props">
          <div class="col-12 row">
            <div v-if="result" class="col-xs-12 col-sm-auto self-center">
              <span>{{$t('product.exportSuccess')}}</span><b
                 class="text-positive">{{result.data.code}}</b>
            </div>
            <q-space />
            <div class="col-xs-12 col-sm-auto self-center text-right">
              <div class="col-auto self-center">
                <q-btn v-if="selected&&selected.length" flat round dense color="negative"
                       icon="delete" @click="onRemove()">
                  <q-tooltip v-if="!$q.platform.is.mobile">{{$t('global.delete')}}</q-tooltip>
                </q-btn>
                <!-- <q-btn v-if="result" flat round dense color="indigo" icon="print" @click="onPrint">
                  <q-tooltip v-if="!$q.platform.is.mobile">{{$t('product.print')}}</q-tooltip>
                </q-btn> -->
                <printer-details v-if="result" :title="$t('product.exportBallot')" :label="$t('product.print')" :labelDate="$t('product.exportDate')"
                                 :items="rows" :result="result" />
                <q-btn v-if="!result" flat round dense color="secondary" icon="find_in_page" @click="onOpenProductList">
                  <q-tooltip v-if="!$q.platform.is.mobile">{{$t('product.select')}}</q-tooltip>
                </q-btn>
                <q-btn v-if="!result" flat round dense color="indigo" icon="cloud_upload" @click="onOpenProductLoad">
                  <q-tooltip v-if="!$q.platform.is.mobile">{{$t('files.openFile')}}</q-tooltip>
                </q-btn>
                <q-btn flat round dense :color="$store.state.app.darkMode?'':'grey-7'" icon="menu_open">
                  <q-tooltip v-if="!$q.platform.is.mobile">{{$t('table.displayColumns')}}
                  </q-tooltip>
                  <q-menu fit>
                    <q-list dense style="min-width:120px">
                      <template v-for="(item,index) in columns">
                        <q-item clickable :key="index" v-if="!item.required" @click="onColumns(item.name)"
                                :active="visibleColumns.indexOf(item.name)>-1||false">
                          <q-item-section>{{$t(item.label)}}</q-item-section>
                        </q-item>
                      </template>
                    </q-list>
                  </q-menu>
                </q-btn>
                <q-btn flat round dense :color="$store.state.app.darkMode?'':'grey-7'" :icon="props.inFullscreen ? 'fullscreen_exit' : 'fullscreen'"
                       @click="props.toggleFullscreen">
                  <q-tooltip v-if="!$q.platform.is.mobile">
                    {{props.inFullscreen?$t('global.normalScreen'):$t('global.fullScreen')}}
                  </q-tooltip>
                </q-btn>
              </div>
            </div>
          </div>
        </template>
        <template v-slot:header="props">
          <q-tr :props="props">
            <q-th auto-width>
              <q-checkbox v-if="props.multipleSelect" v-model="props.selected" indeterminate-value="some" :dense="$store.getters.dense.table" />
            </q-th>
            <q-th v-for="col in props.cols" :key="col.name" :props="props">
              <span v-if="$store.state.app.darkMode" class="text-bold">{{$t(col.label)}}</span>
              <span v-else class="text-bold text-blue-grey-10">{{$t(col.label)}}</span>
            </q-th>
            <q-th auto-width>#</q-th>
          </q-tr>
        </template>
        <template v-slot:body="props">
          <q-tr :props="props">
            <q-td auto-width>
              <q-checkbox v-model="props.selected" color="primary" :dense="$store.getters.dense.table" />
            </q-td>
            <q-td key="title" :props="props">
              <span>{{props.row.title}}</span>
              <q-badge v-if="!props.row._id" color="red" transparent floating class="q-badge--label">{{$t('global.new')}}</q-badge>
            </q-td>
            <q-td key="code" :props="props">
              {{props.row.code}}
            </q-td>
            <q-td key="price" :props="props">
              <div v-if="result">
                <div class="q-pr-xs text-primary flex inline">{{props.row.price.NumberFormat($store.getters.language)}}</div>
                <q-badge v-html="props.row.priceUnit" color="blue" transparent />
              </div>
              <q-input v-else v-model="props.row.price" debounce="300" :label="$t('product.priceExport')" type="number"
                       :dense="$store.getters.dense.input" class="no-error-icon no-arrows"
                       :rules="[v=>v!==null&&v!==''||$t('error.required'),v=>parseInt(v)>0||$t('error.minQuanity',{min:1})]">
                <template v-slot:append>
                  <q-icon name="refresh" class="cursor-pointer" @click="props.row.price=props.row.priceOld" />
                </template>
              </q-input>
            </q-td>
            <q-td key="quantity" :props="props">
              <div v-if="result">
                <div class="q-pr-xs text-primary flex inline">{{props.row.quantity.NumberFormat($store.getters.language)}}</div>
                <q-badge v-html="props.row.unit" color="orange" transparent />
              </div>
              <q-input v-else v-model="props.row.quantity" debounce="300" :label="$t('product.quantityExport')" type="number"
                       :dense="$store.getters.dense.input" class="no-error-icon no-arrows"
                       :rules="[v=>v!==null&&v!==''||$t('error.required'),v=>parseInt(v)>0||$t('error.minQuanity',{min:1})]"
                       @input="onCheckQuantity(props.row)">
                <template v-slot:append>
                  <q-icon name="arrow_drop_up" class="cursor-pointer" @click="props.row.quantity=props.row.quantityStore" />
                </template>
              </q-input>
            </q-td>
            <q-td key="amount" :props="props">
              <div class="q-pr-xs flex inline">{{props.row.amount.NumberFormat($store.getters.language)}}</div>
              <q-badge v-html="props.row.priceUnit" color="blue" transparent />
            </q-td>
            <q-td key="quantityStore" :props="props">
              <div class="q-pr-xs flex inline">
                {{result?props.row.quantityStore-props.row.quantity:props.row.quantityStore.NumberFormat($store.getters.language)}}</div>
              <q-badge v-html="props.row.unit" color="orange" transparent />
            </q-td>
            <q-td key="priceSale" :props="props">
              <div class="q-pr-xs flex inline">{{props.row.priceSale.NumberFormat($store.getters.language)}}</div>
              <q-badge v-html="props.row.priceUnit" color="blue" transparent />
            </q-td>
            <q-td key="priceDiscount" :props="props">
              <div class="q-pr-xs flex inline">{{props.row.priceDiscount.NumberFormat($store.getters.language)}}</div>
              <q-badge v-html="props.row.priceUnit" color="red" transparent />
            </q-td>
            <q-td auto-width class="text-center">
              <q-btn flat round dense icon="close" color="red" :size="$store.getters.dense.table?'sm':'md'" @click="onRemove(props.row)">
                <q-tooltip v-if="!$q.platform.is.mobile">{{$t('global.cancel')}}</q-tooltip>
              </q-btn>
            </q-td>
          </q-tr>
        </template>
      </q-table>
    </q-form>
    <!-- Product list dialog -->
    <q-dialog v-model="isDialogProductList" :maximized="isMaximizedView" persistent>
      <p-list :categories="categories" v-model:dialog="isDialogProductList" v-model:maximized="isMaximizedView"
              v-model:visible-columns="visibleColumnsList" @on-selected="onSelectProduct" />
    </q-dialog>
    <!-- Product load dialog -->
    <q-dialog v-model="isDialogProductLoad" :maximized="isMaximizedView" persistent>
      <q-card style="min-width:800px">
        <q-toolbar>
          <q-avatar :icon="$route.meta.icon" size="50px" />
          <q-toolbar-title>{{$t('files.dataFile')}}</q-toolbar-title>
          <q-btn flat round dense :color="$store.state.app.darkMode?'':'grey-7'" :icon="isMaximizedView?'fullscreen_exit':'fullscreen'"
                 :disable="isLoading" @click="isMaximizedView=!isMaximizedView">
            <q-tooltip v-if="!$q.platform.is.mobile">
              {{isMaximizedView?$t('global.normalScreen'):$t('global.fullScreen')}}</q-tooltip>
          </q-btn>
          <q-btn flat round dense icon="close" v-close-popup>
            <q-tooltip v-if="!$q.platform.is.mobile">{{$t('global.cancel')}}</q-tooltip>
          </q-btn>
        </q-toolbar>
        <q-separator />
        <q-card-section class="text-center">
          <tm-load-files :button="true" :label="$t('files.openFile')" :placeholder="$t('files.chooseFile')"
                         accept=".xls,.xlsx,.csv,.tsv,.txt,.json,.xml" @on-start="isLoading=true" @on-finish="onLoadedFile" />
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-card>
</template>

<script>
import { defineComponent, defineAsyncComponent, ref, watch } from 'vue';
import { useStore } from 'vuex'
import { useQuasar } from 'quasar'
import { useI18n } from 'vue-i18n'
import Cookies from 'js-cookie'
export default defineComponent({
  name: 'StoreExport',
  components: {
    pList: defineAsyncComponent(() => import('pages/products/components/list')),
    tmLoadFiles: defineAsyncComponent(() => import('components/tm-load-files')),
    printerDetails: defineAsyncComponent(() => import('./components/printer-details'))
  },
  setup () {
    const $store = useStore()
    const $q = useQuasar()
    const { t } = useI18n({ useScope: 'global' })
    const isLoading = ref(false)
    const isDialogProductList = ref(false)
    const isDialogProductLoad = ref(false)
    const isMaximizedView = ref(false)
    const visibleColumns = ref([])
    const visibleColumnsList = ref(['price', 'priceDiscount', 'priceExport'])
    const pagination = ref({
      page: 1,
      rowsPerPage: 10
    })
    const columns = ref([
      { name: 'title', field: 'title', label: 'product.name', align: 'left', sortable: true, required: true },
      { name: 'code', field: 'code', label: 'product.code', align: 'left', sortable: true, required: true },
      { name: 'price', field: 'price', label: 'product.priceExport', align: 'right', sortable: true, required: true },
      { name: 'quantity', field: 'quantity', label: 'product.quantityExport', align: 'right', sortable: true, required: true },
      { name: 'amount', field: 'amount', label: 'product.amount', align: 'right', sortable: true, required: true },
      { name: 'quantityStore', field: 'quantityStore', label: 'product.quantityStore', align: 'right', sortable: true, required: true },
      { name: 'priceSale', field: 'priceSale', label: 'product.priceSale', align: 'right', sortable: true },
      { name: 'priceDiscount', field: 'priceDiscount', label: 'product.priceDiscount', align: 'right', sortable: true }
    ])
    const form = ref(null)
    const result = ref(null)
    const selected = ref([])
    const rows = ref(Cookies.get('export-tmp') ? JSON.parse(Cookies.get('export-tmp')) : [])
    const categories = ref([])
    $store.dispatch('categories/get', { type: 'product', flag: 1, x: true, generate: true }).then((x) => { categories.value = x })
    watch(() => rows, (state, preState) => {
      if (state && state.length) Cookies.set('export-tmp', JSON.stringify(rows.value))
      else Cookies.remove('export-tmp')
    }, { deep: true, immediate: true })

    const onReset = () => {
      return new Promise((resolve, reject) => {
        Cookies.remove('export-tmp')
        resolve()
      }).then(() => { if (form.value) form.value.resetValidation() })
    }

    return {
      isLoading, isDialogProductList, isDialogProductLoad, isMaximizedView, visibleColumns,
      visibleColumnsList, pagination, columns, form, result, selected, rows, categories,
      onOpenProductList () {
        isDialogProductList.value = true
        isMaximizedView.value = false
      },
      onOpenProductLoad () {
        isDialogProductLoad.value = true
        isMaximizedView.value = false
      },
      onSelectProduct (selected) {
        selected = selected.map(item => ({
          _id: item._id,
          code: item.code.toUpperCase(),
          title: item.title,
          quantity: item.quantityExport || 0,
          price: item.priceExport || 0,
          priceOld: item.priceExport || 0,
          quantityStore: item.quantity || 0,
          priceSale: item.price || 0,
          priceDiscount: item.priceDiscount || 0,
          priceUnit: item.priceUnit,
          unit: item.unit
        }))
        rows.value.pushIfNotExist(selected, 'code')
      },
      onLoadedFile (data) {
        if (!data) {
          $q.notify({ message: t('error.exist'), color: 'warning' })
          return null
        }
        $store.dispatch('store/exportFinds', data.map(x => x.code)).then((x) => {
          if (x && x.length) {
            x.forEach(item => {
              const _item = data.find(x => x.code === item.code)
              rows.value.pushIfNotExistUpdate({
                _id: item._id,
                code: item.code.toUpperCase(),
                title: item.title,
                quantity: _item.quantityExport || 0,
                price: _item.priceExport || 0,
                priceOld: item.priceExport || 0,
                quantityStore: item.quantity || 0,
                priceSale: item.price || 0,
                priceDiscount: item.priceDiscount || 0,
                priceUnit: item.priceUnit,
                unit: item.unit
              }, 'code')
            })
          }
        }).finally(() => {
          isLoading.value = false
        })
      },
      onRemove (item) {
        if (item) selected.value = [item]
        $q.dialog({ title: t('messageBox.confirm'), message: t('messageBox.delete'), cancel: true, persistent: true }).onOk(() => {
          selected.value.forEach(e => {
            const index = rows.value.findIndex(x => x.code === e.code)
            if (index > -1) rows.value.splice(index, 1)
          })
          selected.value = []
        })
      },
      onCheckQuantity (item) {
        if (item.quantityExport > item.quantity) item.quantityExport = item.quantity
      },
      onSubmit () {
        if (result.value) {
          $q.notify({ message: t('product.exportExistResult'), color: 'red' })
          return null
        }
        form.value.validate().then(valid => {
          if (valid) {
            $q.dialog({ title: t('messageBox.confirm'), message: t('product.exportConfirm'), cancel: true, persistent: true }).onOk(() => {
              $store.dispatch('store/exportUpdate', rows.value).then((x) => {
                if (x) {
                  if (x.data) result.value = x.data
                  onReset()
                }
              })
            })
          }
        })
      },
      onColumns: (val) => {
        var i = visibleColumns.value.indexOf(val)
        if (i < 0) visibleColumns.value.push(val)
        else visibleColumns.value.splice(i, 1)
      },
      onPrint () {
      },
      onCreateNew () {
        rows.value = []
        result.value = null
        Cookies.remove('export-tmp')
      }
    }
  }
})
</script>

<style>
</style>
