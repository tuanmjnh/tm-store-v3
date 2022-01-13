<template>
  <q-card flat bordered>
    <q-toolbar>
      <q-toolbar-title>{{$t('product.warehouseImport')}}</q-toolbar-title>
      <q-btn v-if="!result&&rows&&rows.length" type="submit" color="blue" :label="$t('product.import')"
             :loading="isLoading" class="q-px-lg q-btn--square q-mr-sm" @click.prevent="onSubmit" />
      <!--icon="offline_pin" -->
      <q-btn v-if="rows&&rows.length" type="submit" outline color="blue-grey-4"
             :label="$t('product.createNew')" :loading="isLoading" class="q-px-lg q-btn--square" @click.prevent="onCreateNew" />
    </q-toolbar>
    <q-separator />
    <!-- <q-toolbar>
      <q-toolbar-title></q-toolbar-title>
    </q-toolbar> -->
    <q-form ref="form">
      <q-table :rows="rows" :columns="columns" row-key="code" flat :visible-columns="visibleColumns"
               :loading="$store.state.app.loading.get||$store.state.app.loading.patch" v-model:selected="selected" selection="multiple"
               :dense="$store.getters.dense.table" :no-data-label="$t('table.noData')" :no-results-label="$t('table.noFilterData')"
               :rows-per-page-label="$t('table.rowPerPage')" :selected-rows-label="()=>`${selected.length} ${$t('table.rowSelected')}`"
               :rows-per-page-options="$store.state.app.rowsPerPageOptions" v-model:pagination="pagination">
        <template v-slot:top="props">
          <div class="col-12 row">
            <div v-if="result" class="col-xs-12 col-sm-auto self-center">
              <span>{{$t('product.importSuccess')}}</span><b class="text-positive">{{result.data.code}}</b>
            </div>
            <q-space />
            <div class="col-xs-12 col-sm-auto self-center text-right">
              <div class="col-auto self-center">
                <q-btn v-if="selected&&selected.length" flat round dense color="negative" icon="delete" @click="onRemove()">
                  <q-tooltip v-if="!$q.platform.is.mobile">{{$t('global.delete')}}</q-tooltip>
                </q-btn>
                <q-btn-dropdown v-if="result" flat round dense color="indigo" icon="print">
                  <q-list :dense="$store.getters.dense.form">
                    <q-item clickable v-close-popup @click="onPrinting('details')">
                      <q-item-section>
                        <q-item-label>
                          {{$t('product.printDetails')}}
                          <printer-details ref="refPrinterDetails" v-if="result" :title="$t('product.importBallotDetails')" :rows="rows"
                                           :total="result.data" color="secondary" :label="$t('product.printDetails')"
                                           :labelDate="$t('product.importDate')" />
                        </q-item-label>
                      </q-item-section>
                    </q-item>
                    <q-item clickable v-close-popup @click="onPrinting('total')">
                      <q-item-section>
                        <q-item-label>
                          {{$t('product.importBallotTotal')}}
                          <printer-total ref="refPrinterTotal" v-if="result" :title="$t('product.importBallotTotal')" :total="result.data"
                                         color="blue" :label="$t('product.printTotal')" :labelDate="$t('product.importDate')" />
                        </q-item-label>
                      </q-item-section>
                    </q-item>
                  </q-list>
                </q-btn-dropdown>
                <!-- <q-btn v-if="result" flat round dense color="indigo" icon="print" @click="isDialogPrinter=true">
                  <q-tooltip v-if="!$q.platform.is.mobile">{{$t('product.print')}}</q-tooltip>
                </q-btn> -->
                <!-- <printer-details v-if="result" :title="$t('product.importBallotDetails')" :label="$t('product.printDetails')"
                                 :labelDate="$t('product.importDate')" :rows="rows" :result="result" />
                <printer-total v-if="result" :title="$t('product.importBallotTotal')" :label="$t('product.printTotal')"
                               :labelDate="$t('product.importDate')" :result="result" /> -->
                <q-btn v-if="!result" flat round dense color="secondary" icon="find_in_page" @click="onOpenProductList">
                  <q-tooltip v-if="!$q.platform.is.mobile">{{$t('product.select')}}</q-tooltip>
                </q-btn>
                <q-btn v-if="!result" flat round dense color="deep-purple" icon="post_add" @click="onOpenProductAdd">
                  <q-tooltip v-if="!$q.platform.is.mobile">{{$t('product.add')}}</q-tooltip>
                </q-btn>
                <q-btn v-if="!result" flat round dense color="indigo" icon="cloud_upload" @click="onOpenProductLoad">
                  <q-tooltip v-if="!$q.platform.is.mobile">{{$t('files.openFile')}}</q-tooltip>
                </q-btn>
                <q-btn flat round dense :color="$store.state.app.darkMode?'':'grey-7'" icon="menu_open">
                  <q-tooltip v-if="!$q.platform.is.mobile">{{$t('table.displayColumns')}}</q-tooltip>
                  <q-menu fit>
                    <q-list dense style="min-width:120px">
                      <template v-for="(item,index) in columns">
                        <q-item v-if="!item.required" clickable :key="index" :active="visibleColumns.indexOf(item.name)>-1||false"
                                @click="onColumns(item.name)">
                          <q-item-section>{{$t(item.label)}}</q-item-section>
                        </q-item>
                      </template>
                    </q-list>
                  </q-menu>
                </q-btn>
                <q-btn flat round dense :color="$store.state.app.darkMode?'':'grey-7'" :icon="props.inFullscreen?'fullscreen_exit':'fullscreen'"
                       @click="props.toggleFullscreen">
                  <q-tooltip v-if="!$q.platform.is.mobile">
                    {{props.inFullscreen?$t('global.normalScreen'):$t('global.fullScreen')}}
                  </q-tooltip>
                </q-btn>
              </div>
            </div>
          </div>
          <!-- <div class="col-12 row">
            <div class="col-xs-12 col-sm-5 col-md-4">
              <select-category :categories="categories" :selected.sync="pagination.categories" data-key="_id" data-all
                :dense="$store.getters.dense.input" :labelTitle="$t('category.title_product')" :labelSelect="$t('category.select')"
                :labelAll="$t('category.select_all')" :labelClose="$t('global.cancel')" @on-selected="onSelectCategory" />
            </div>
            <q-space />
            <div class="col-xs-12 col-sm-6">
              <q-input v-model="pagination.filter" :dense="$store.getters.dense.input" debounce="500" :placeholder="$t('global.search')">
                <template v-slot:append>
                  <q-icon v-if="pagination.filter===''" name="search" />
                  <q-icon v-else name="clear" class="cursor-pointer" @click="pagination.filter=''" />
                </template>
              </q-input>
            </div>
          </div> -->
        </template>
        <template v-slot:header="props">
          <q-tr :props="props">
            <q-th auto-width>
              <q-checkbox v-if="props.multipleSelect" v-model="props.selected" indeterminate-value="some" :dense="$store.getters.dense.table" />
            </q-th>
            <!-- <q-th auto-width>#</q-th> -->
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
            <!-- <q-td auto-width>
              {{props.row.index}}
            </q-td> -->
            <q-td key="category" :props="props">
              {{props.row.category}}
            </q-td>
            <q-td key="subCategory" :props="props">
              {{props.row.subCategory}}
            </q-td>
            <q-td key="title" :props="props">
              <span>{{props.row.title}}</span>
              <q-badge v-if="!props.row._id" color="red" transparent floating class="q-badge--label">{{$t('global.new')}}</q-badge>
            </q-td>
            <q-td key="code" :props="props">
              {{props.row.code}}
            </q-td>
            <q-td key="price" :props="props">
              <div class="q-pr-xs text-primary flex inline">{{parseInt(props.row.price).NumberFormat($store.getters.language)}}</div>
              <q-badge v-html="props.row.priceUnitName" color="blue" transparent />
              <q-popup-edit v-model="props.row.price" :title="$t('product.priceImport')">
                <q-input v-model="props.row.price" dense autofocus counter class="edit-item no-error-icon no-arrows"
                         :rules="[v=>v!==null&&v!==''||$t('error.required'),v=>parseInt(v)>-1||$t('error.minQuanity',{min:0})]">
                  <template v-slot:append>
                    <q-icon name="refresh" class="cursor-pointer" @click="props.row.price=props.row.priceOld">
                      <q-tooltip>{{$t('global.recover')}}</q-tooltip>
                    </q-icon>
                  </template>
                </q-input>
              </q-popup-edit>
            </q-td>
            <q-td key="quantity" :props="props">
              <div class="q-pr-xs text-primary flex inline">{{parseInt(props.row.quantity).NumberFormat($store.getters.language)}}</div>
              <q-badge v-html="props.row.unitName" color="orange" transparent />
              <q-popup-edit v-model="props.row.quantity" :title="$t('product.quantityImport')">
                <q-input v-model="props.row.quantity" dense autofocus counter class="edit-item no-error-icon no-arrows"
                         :rules="[v=>v!==null&&v!==''||$t('error.required'),v=>parseInt(v)>-1||$t('error.minQuanity',{min:0})]">
                  <template v-slot:append>
                    <q-icon name="refresh" class="cursor-pointer" @click="props.row.quantity=props.row.quantityOld">
                      <q-tooltip>{{$t('global.recover')}}</q-tooltip>
                    </q-icon>
                  </template>
                </q-input>
              </q-popup-edit>
              <!-- <q-input v-model="props.row.quantity" debounce="300" :label="$t('product.quantityImport')" type="number"
                       :dense="$store.getters.dense.input" class="no-error-icon no-arrows"
                       :rules="[v=>v!==null&&v!==''||$t('error.required'),v=>parseInt(v)>-1||$t('error.minQuanity',{min:0})]">
              </q-input> -->
              <!-- <q-badge v-html="props.row.unit" color="orange" transparent /> -->
            </q-td>
            <q-td key="amount" :props="props">
              <!-- {{(parseInt(props.row.price)*parseInt(props.row.quantity)).NumberFormat($store.getters.language)}} -->
              <div class="q-pr-xs flex inline">{{props.row.amount.NumberFormat($store.getters.language)}}</div>
              <q-badge v-html="props.row.priceUnitName" color="blue" transparent />
            </q-td>
            <q-td key="quantityStore" :props="props">
              <div class="q-pr-xs flex inline">
                {{(result?parseInt(props.row.quantity)+parseInt(props.row.quantityStore):props.row.quantity).NumberFormat($store.getters.language)}}
              </div>
              <q-badge v-html="props.row.unitName" color="orange" transparent />
            </q-td>
            <q-td key="priceSale" :props="props">
              <div class="q-pr-xs flex inline">{{props.row.priceSale.NumberFormat($store.getters.language)}}</div>
              <q-badge v-html="props.row.priceUnitName" color="blue" transparent />
            </q-td>
            <q-td key="priceDiscount" :props="props">
              <div class="q-pr-xs flex inline">{{props.row.priceDiscount.NumberFormat($store.getters.language)}}</div>
              <q-badge v-html="props.row.priceUnitName" color="red" transparent />
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
    <!-- <q-list v-if="success" dense bordered separator padding>
        <q-item v-for="(e,i) in rows" :key="i">
          <q-item-section>{{e.code}} - {{e.title}}</q-item-section>
          <q-item-section>{{e.priceImport}}</q-item-section>
          <q-item-section>{{e.quantityImport}}</q-item-section>
        </q-item>
      </q-list> -->
    <!-- Product list dialog -->
    <q-dialog v-model="isDialogProductList" :maximized="isMaximizedView" persistent>
      <p-list :categories="categories" v-model:dialog="isDialogProductList" v-model:maximized="isMaximizedView"
              v-model:visible-columns="visibleColumnsList" @on-selected="onSelectProduct" />
    </q-dialog>
    <!-- Product add dialog -->
    <q-dialog v-model="isDialogProductAdd" :maximized="isMaximizedView" persistent>
      <q-card flat :style="{minWidth:'60%'}">
        <p-add v-model:dialog="isDialogProductAdd" v-model:maximized="isMaximizedView" @on-finish="onAddProduct" />
      </q-card>
    </q-dialog>
    <!-- Product load dialog -->
    <q-dialog v-model="isDialogProductLoad" :maximized="isMaximizedView">
      <!-- <p-load-files :categories="categories" :maximized.sync="isMaximizedView" :dialog.sync="isDialogProductLoad" :loading.sync="isLoading"
        @on-finish="onLoadedFile" /> -->
      <q-card flat :style="{minWidth:'60%'}">
        <q-toolbar>
          <q-avatar :icon="$route.meta.icon" size="50px" />
          <q-toolbar-title>{{$t('files.dataFile')}}</q-toolbar-title>
          <q-btn v-if="loadedRows&&loadedRows.length" flat type="submit" :dense="$store.getters.dense.button" color="blue"
                 icon="offline_pin" :disable="isLoading" @click.prevent="onLoadedFile">
            <!-- :label="dialog?'':$t('global.update')" -->
            <q-tooltip>{{$t('global.accept')}}</q-tooltip>
          </q-btn>
          <q-btn flat round dense :color="$store.state.app.darkMode?'':'grey-7'" :icon="isMaximizedView?'fullscreen_exit':'fullscreen'"
                 :disable="isLoading" @click="isMaximizedView=!isMaximizedView">
            <q-tooltip v-if="!$q.platform.is.mobile">{{isMaximizedView?$t('global.normalScreen'):$t('global.fullScreen')}}</q-tooltip>
          </q-btn>
          <q-btn flat round dense icon="close" v-close-popup>
            <q-tooltip v-if="!$q.platform.is.mobile">{{$t('global.cancel')}}</q-tooltip>
          </q-btn>
        </q-toolbar>
        <q-separator />
        <q-card-section class="text-center">
          <tm-load-files v-model="loadedRows" :button="true" :options="{header:1,raw:true}" :labelBtnUpload="$t('files.openFile')"
                         :labelBtnUrl="$t('files.googleSheet')" :labelFile="$t('files.chooseFile')" :labelUrl="$t('files.inputUrl')"
                         :errorNoExist="$t('error.noExist')" accept=".xls,.xlsx,.csv,.tsv,.txt,.json,.xml" :lblTblTitle="$t('table.temporaryData')"
                         :lblTblNoData="$t('table.noData')" :lblTblNoResults="$t('table.noFilterData')" :lblTblRowsPerPage="$t('table.rowPerPage')"
                         :rowsPerPageOptions="$store.state.app.rowsPerPageOptions" @onStart="isLoading=true" @onFinish="isLoading=false" />
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-card>
</template>

<script>
import { defineComponent, defineAsyncComponent, ref, watch, computed } from 'vue';
import { useStore } from 'vuex'
import { useQuasar } from 'quasar'
import { useI18n } from 'vue-i18n'
import Cookies from 'js-cookie'
// import tmLoadFiles from 'components/tm-load-files'
export default defineComponent({
  name: 'StoreImport',
  components: {
    pList: defineAsyncComponent(() => import('pages/products/components/list')),
    pAdd: defineAsyncComponent(() => import('pages/products/add')),
    tmLoadFiles: defineAsyncComponent(() => import('@/components/tm-load-files')),
    printerDetails: defineAsyncComponent(() => import('./components/printer-details')),
    printerTotal: defineAsyncComponent(() => import('./components/printer-total'))
  },
  setup () {
    const $store = useStore()
    const $q = useQuasar()
    const { t } = useI18n({ useScope: 'global' })
    const isLoading = ref(false)
    const isDialogProductList = ref(false)
    const isDialogProductAdd = ref(false)
    const isDialogProductLoad = ref(false)
    const isMaximizedView = ref(false)
    const visibleColumns = ref([])
    const visibleColumnsList = ref(['quantityStore', 'priceSale', 'priceDiscount', 'priceImport'])
    const visibleColumnsPrint = ref([])
    const pagination = ref({
      page: 1,
      rowsPerPage: 10
    })
    const columns = ref([
      { name: 'category', field: 'category', label: 'category.title', align: 'left', sortable: true, required: true },
      { name: 'subCategory', field: 'subCategory', label: 'category.titlesub', align: 'left', sortable: true, required: true },
      { name: 'title', field: 'title', label: 'product.name', align: 'left', sortable: true, required: true },
      { name: 'code', field: 'code', label: 'product.code', align: 'left', sortable: true, required: true },
      { name: 'price', field: 'price', label: 'product.unitPrice', align: 'right', sortable: true, required: true },
      { name: 'quantity', field: 'quantity', label: 'product.quantityImport', align: 'right', sortable: true, required: true },
      { name: 'amount', field: 'amount', label: 'product.amount', align: 'right', sortable: true, required: true },
      { name: 'quantityStore', field: 'quantityStore', label: 'product.quantityStore', align: 'right', sortable: true },
      { name: 'priceSale', field: 'priceSale', label: 'product.priceSale', align: 'right', sortable: true },
      { name: 'priceDiscount', field: 'priceDiscount', label: 'product.priceDiscount', align: 'right', sortable: true }
    ])
    const form = ref(null)
    const result = ref(null)
    const selected = ref([])
    const rows = ref(Cookies.get('import-tmp') ? JSON.parse(Cookies.get('import-tmp')) : [])
    const loadedRows = ref(null)
    const categories = ref([])
    const pins = computed(() => $store.state.types.items.filter(x => x.key === 'pin_product').map(x => { return { label: x.name, value: x.code } }))
    const unitsSource = computed(() => $store.state.types.items.filter(x => x.key === 'unit'))
    const unitsPriceSource = computed(() => $store.state.types.items.filter(x => x.key === 'unit_price'))
    const units = ref(unitsSource.value)
    const unitsPrice = ref(unitsPriceSource.value)
    const isUrlFile = ref(false)
    const urlFile = ref(null)
    const refPrinterDetails = ref(null)
    const refPrinterTotal = ref(null)

    $store.dispatch('categories/get', { type: 'product', flag: 1, x: true, generate: true }).then((x) => { categories.value = x })
    watch(() => rows, (state, preState) => {
      if (state && state.length) Cookies.set('import-tmp', JSON.stringify(rows.value))
      else Cookies.remove('import-tmp')
    }, { deep: true, immediate: true })


    const onReset = () => {
      return new Promise((resolve, reject) => {
        loadedRows.value = []
        Cookies.remove('import-tmp')
        resolve()
      }).then(() => { if (form.value) form.value.resetValidation() })
    }
    const onGetCategories = (data, category, subCategory) => {
      let rs = []
      data.forEach(e => {
        if (e.code.toUpperCase() === category.toUpperCase()) {
          rs.push(e)
          const sub = onGetCategories(e.children, subCategory, null)
          if (sub && sub.length) rs = rs.concat(sub)
        }
      })
      return rs
    }

    // result.value = {
    //   data: {
    //     code: "46d43290ce0396034f14b45c3cf5bc9d",
    //     createdAt: "2022-01-09T09:12:30.956Z",
    //     createdBy: "5eccbc9e9071001d87fd4df1",
    //     createdIp: "::ffff:127.0.0.1",
    //     flag: 1,
    //     prices: 1379862000,
    //     products: 293,
    //     quantities: 953,
    //     taxes: 137986200,
    //     __v: 0,
    //     _id: "61daa6feac6331d6faf3b7f4"
    //   },
    //   error: [],
    //   success: ["HVC-BO-BSM66-200220"]
    // }

    return {
      isLoading, isDialogProductList, isDialogProductAdd, isDialogProductLoad, isMaximizedView, form, result, visibleColumns, visibleColumnsList,
      visibleColumnsPrint, pagination, columns, selected, rows, loadedRows, categories, pins, units, unitsPrice, isUrlFile, urlFile, refPrinterDetails, refPrinterTotal,

      onOpenProductList () {
        isDialogProductList.value = true
        isMaximizedView.value = false
      },
      onOpenProductAdd () {
        isDialogProductAdd.value = true
        isMaximizedView.value = false
      },
      onOpenProductLoad () {
        onReset()
        isDialogProductLoad.value = true
        isMaximizedView.value = false
      },
      onSelectProduct (selected) {
        for (let i = 0; i < selected.length; i++) {
          rows.value.pushIfNotExist({
            _id: selected[i]._id,
            code: selected[i].code.toUpperCase(),
            title: selected[i].title,
            quantity: selected[i].quantityImport || 0,
            price: selected[i].priceImport || 0,
            priceOld: selected[i].priceImport || 0,
            quantityStore: selected[i].quantity || 0,
            priceSale: selected[i].price || 0,
            priceDiscount: selected[i].priceDiscount || 0,
            priceUnit: selected[i].priceUnit,
            unit: selected[i].unit
          }, 'code')
        }
      },
      onAddProduct (item) {
        item = {
          _id: item._id,
          code: item.code.toUpperCase(),
          title: item.title,
          quantity: item.quantityImport || 0,
          price: item.priceImport || 0,
          priceOld: item.priceImport || 0,
          quantityStore: item.quantity || 0,
          priceSale: item.price || 0,
          priceDiscount: item.priceDiscount || 0,
          priceUnit: item.priceUnit,
          unit: item.unit
        }
        rows.value.pushIfNotExist(item, 'code')
      },
      onLoadedFile () {
        if (!loadedRows.value) {
          $q.notify({ message: t('error.exist'), color: 'warning' })
          return null
        }
        loadedRows.value = loadedRows.value.splice(1)
        // console.log(loadedRows.value.map(x => x['3']))
        // console.log(loadedRows.value.map(x => x[3]).splice(1))
        $store.dispatch('store/importsFinds', { codes: loadedRows.value.map(x => x[3]).splice(1) }).then((x) => {
          // if (x && x.length) {
          loadedRows.value.forEach(e => {
            const item = x.find(x => x.code === e[3])
            const cate = onGetCategories(categories.value, e[1], e[2])
            if (item) {
              const priceUnitName = unitsPrice.value.find(x => x.code === item.priceUnit)
              const unitName = units.value.find(x => x.code === item.unit)
              rows.value.pushIfNotExistUpdate({
                _id: item._id,
                categories: cate.map(x => x._id),
                category: cate.length > 0 ? cate[0].title : e[1].toUpperCase(),
                subCategory: cate.length > 1 ? cate[1].title : e[2].toUpperCase(),
                code: item.code.toUpperCase(),
                title: item.title,
                quantity: parseInt(e[6]) || 0,
                quantityOld: parseInt(e[6]) || 0,
                price: parseInt(e[13]) || 0,
                priceOld: parseInt(e[13]) || 0,
                quantityStore: item.quantity || 0,
                priceSale: item.price || 0,
                priceDiscount: item.priceDiscount || 0,
                priceUnit: item.priceUnit,
                priceUnitName: priceUnitName ? priceUnitName.name : item.priceUnit,
                unit: item.unit,
                unitName: unitName ? unitName.name : item.unit,
                amount: parseInt(e[13]) * parseInt(e[6])
              }, 'code')
            } else {
              const priceUnitName = unitsPrice.value.find(x => x.code === e[14])
              const unitName = units.value.find(x => x.code === e[15])
              rows.value.pushIfNotExistUpdate({
                categories: cate.map(x => x._id),
                category: cate.length > 0 ? cate[0].title : e[1].toUpperCase(),
                subCategory: cate.length > 1 ? cate[1].title : e[2].toUpperCase(),
                code: e[3].toUpperCase(),
                title: e[4],
                desc: e[9],
                content: e[10],
                images: e[11],
                priceSale: parseInt(e[7]) || 0,
                priceDiscount: parseInt(e[12]) || 0,
                quantityStore: 0,
                price: parseInt(e[13]) || 0,
                priceOld: parseInt(e[13]) || 0,
                quantity: parseInt(e[6]) || 0,
                quantityOld: parseInt(e[6]) || 0,
                priceUnit: e[14],
                priceUnitName: priceUnitName ? priceUnitName.name : e[14],
                unit: e[15],
                unitName: unitName ? unitName.name : e[15],
                origin: e[16],
                date: e[17],
                pin: e[18],
                tags: e[19],
                attr: e[20],
                orders: e[0],
                amount: parseInt(e[13]) * parseInt(e[6])
              }, 'code')
            }
          })
          // }
        }).finally(() => {
          isLoading.value = false
          isDialogProductLoad.value = false
        })
      },
      onRemove (item) {
        if (item) selected.value = [item]
        $q.dialog({ title: t('messageBox.confirm'), message: t('messageBox.delete'), cancel: true, persistent: true }).onOk(() => {
          selected.value.forEach(e => {
            const index = rows.value.findIndex(x => x.code === e.code)
            if (index > -1) rows.value.splice(index, 1)
          })
        }).onDismiss(() => {
          selected.value = []
        })
      },
      onSubmit () {
        if (result.value) {
          $q.notify({ message: t('product.importExistResult'), color: 'red' })
          return null
        }
        form.value.validate().then(valid => {
          if (valid) {
            $q.dialog({
              title: t('messageBox.confirm'),
              message: t('product.importConfirm'),
              cancel: true,
              persistent: true,
              ok: {
                label: t('global.accept'),
                flat: true,
                color: 'primary'
              },
              cancel: {
                label: t('global.cancel'),
                flat: true,
                color: 'blue-grey'
              }
            }).onOk(() => {
              $store.dispatch('store/importsUpdate', rows.value).then((x) => {
                if (x) {
                  if (x.data) result.value = x
                  // result.value.total = result.value.data.sum('priceImport')
                  // result.value.vat = Math.round(result.value.total * 0.1, 0)
                  // result.value.amount = result.value.total + result.value.vat
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
      onCreateNew () {
        rows.value = []
        result.value = null
        Cookies.remove('import-tmp')
      },
      onPrinting (type) {
        if (type === 'details') {
          refPrinterDetails.value.onPrinting()
        } else if (type === 'total') {
          refPrinterTotal.value.onPrinting()
        }
      }
    }
  }
})
</script>

<style lang="scss" scoped>
.display-item {
  &:hover .view-item {
    display: none;
  }
  .edit-item {
    display: none;
  }
  &:hover .edit-item {
    display: initial;
  }
}
</style>
