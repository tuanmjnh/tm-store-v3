<template>
  <q-card flat>
    <q-toolbar>
      <q-toolbar-title>{{$t('product.warehouseExport')}}</q-toolbar-title>
      <q-btn v-if="!result&&rows&&rows.length" type="submit" color="blue" :label="$t('product.export')"
             :loading="isLoading" class="q-px-lg q-btn--square q-mr-sm" @click.prevent="onSubmit" />
      <q-btn v-if="rows&&rows.length" type="submit" outline color="blue-grey-4"
             :label="$t('product.createNew')" :loading="isLoading" class="q-px-lg q-btn--square" @click.prevent="onCreateNew" />
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
              <span>{{$t('product.exportSuccess')}}</span><b class="text-positive">{{result.data._id}}</b>
            </div>
            <q-space />
            <div class="col-xs-12 col-sm-auto self-center text-right">
              <div class="col-auto self-center">
                <q-btn v-if="selected&&selected.length" flat round dense color="negative" icon="delete" @click="onRemove()">
                  <q-tooltip v-if="!$q.platform.is.mobile">{{$t('global.delete')}}</q-tooltip>
                </q-btn>
                <q-btn v-if="selected&&selected.length" flat round dense color="blue" icon="paid" @click="onToPriceSale()">
                  <q-tooltip v-if="!$q.platform.is.mobile">{{$t('product.priceSale')}}</q-tooltip>
                </q-btn>
                <q-btn v-if="selected&&selected.length" flat round dense color="teal" icon="attach_money" @click="onToPriceExport()">
                  <q-tooltip v-if="!$q.platform.is.mobile">{{$t('product.priceExport')}}</q-tooltip>
                </q-btn>
                <!-- <q-btn v-if="result" flat round dense color="indigo" icon="print" @click="onPrint">
                  <q-tooltip v-if="!$q.platform.is.mobile">{{$t('product.print')}}</q-tooltip>
                </q-btn> -->
                <q-btn-dropdown v-if="result" flat round dense color="indigo" icon="print">
                  <q-list :dense="$store.getters.dense.form">
                    <q-item clickable v-close-popup @click="onPrinting('details')">
                      <q-item-section>
                        <q-item-label>
                          {{$t('product.printDetails')}}
                          <tm-printer ref="refPrinterDetails" hidden :title="`${$t('product.exportBallotDetails')}-${result.data._id}`">
                            <template v-slot:content>
                              <view-details :title="$t('product.exportBallotDetails')" :rows="rows" price="priceExport"
                                            :total="result.data" color="secondary" :label="$t('product.printDetails')"
                                            :labelDate="$t('product.exportDate')" />
                            </template>
                          </tm-printer>
                        </q-item-label>
                      </q-item-section>
                    </q-item>
                    <q-item clickable v-close-popup @click="onPrinting('total')">
                      <q-item-section>
                        <q-item-label>
                          {{$t('product.printTotal')}}
                          <tm-printer ref="refPrinterTotal" hidden :title="`${$t('product.exportBallotTotal')}-${result.data._id}`">
                            <template v-slot:content>
                              <view-total :title="$t('product.exportBallotTotal')" :total="result.data" color="blue"
                                          :label="$t('product.printTotal')" :labelDate="$t('product.exportDate')" />
                            </template>
                          </tm-printer>
                        </q-item-label>
                      </q-item-section>
                    </q-item>
                  </q-list>
                </q-btn-dropdown>
                <q-btn flat round dense color="blue" icon="qr_code_scanner" @click="isDialogQRCode=!isDialogQRCode">
                  <q-tooltip v-if="!$q.platform.is.mobile">{{$t('qrCode.qrCodeScanner')}}</q-tooltip>
                </q-btn>
                <q-btn v-if="!result" flat round dense color="purple" icon="find_in_page" @click="onOpenProductList">
                  <q-tooltip v-if="!$q.platform.is.mobile">{{$t('product.select')}}</q-tooltip>
                </q-btn>
                <q-btn v-if="!result" flat round dense color="indigo" icon="cloud_upload" @click="onOpenProductLoad">
                  <q-tooltip v-if="!$q.platform.is.mobile">{{$t('files.openFile') }}</q-tooltip>
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
            <q-td auto-width>
              <q-checkbox v-model="props.selected" color="primary" :dense="$store.getters.dense.table" />
            </q-td>
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
              <div class="q-pr-xs flex inline">{{parseInt(props.row.price).NumberFormat($store.getters.language)}}</div>
              <q-badge v-html="props.row.priceUnitName" color="blue" transparent />
            </q-td>
            <q-td key="priceDiscount" :props="props">
              <div class="q-pr-xs flex inline">{{parseInt(props.row.priceDiscount).NumberFormat($store.getters.language)}}</div>
              <q-badge v-html="props.row.priceUnitName" color="red" transparent />
            </q-td>
            <q-td key="quantityStore" :props="props">
              <div class="q-pr-xs flex inline">{{parseInt(props.row.quantityStore).NumberFormat($store.getters.language)}}</div>
              <q-badge v-html="props.row.unitName" color="orange-10" transparent />
            </q-td>
            <q-td key="priceExport" :props="props">
              <div class="q-pr-xs text-primary flex inline">{{parseInt(props.row.priceExport).NumberFormat($store.getters.language)}}</div>
              <q-badge v-html="props.row.priceUnitName" color="teal" transparent />
              <q-popup-edit v-model="props.row.priceExport" :title="$t('product.priceExport')" auto-save :validate="v=>parseInt(v)>-1"
                            @update:model-value="props.row.amount=props.row.priceExport*props.row.quantity">
                <template v-slot="scope">
                  <q-input v-model="scope.value" dense autofocus counter class="edit-item no-error-icon no-arrows" @keyup.enter="scope.set"
                           type="number" :rules="[v=>v!==null&&v!==''||$t('error.required'),v=>parseInt(v)>-1||$t('error.minQuanity',{min:0})]">
                    <template v-slot:append>
                      <q-icon name="paid" class="cursor-pointer" color="blue" @click="()=>{props.row.priceExport=props.row.price;scope.cancel()}">
                        <q-tooltip>{{$t('product.priceSale')}}</q-tooltip>
                      </q-icon>
                      <q-icon name="attach_money" class="cursor-pointer" color="teal"
                              @click="()=>{props.row.priceExport=props.row.priceOld;scope.cancel()}">
                        <q-tooltip>{{$t('product.priceExport')}}</q-tooltip>
                      </q-icon>
                    </template>
                  </q-input>
                </template>
              </q-popup-edit>
            </q-td>
            <q-td key="quantity" :props="props">
              <div class="q-pr-xs text-primary flex inline">{{parseInt(props.row.quantity).NumberFormat($store.getters.language)}}</div>
              <q-badge v-html="props.row.unitName" color="orange" transparent />
              <q-popup-edit v-model="props.row.quantity" :title="$t('product.quantityImport')" auto-save :validate="v=>parseInt(v)>-1"
                            @update:model-value="(v)=>{if(v>parseInt(props.row.quantityStore))props.row.quantity=parseInt(props.row.quantityStore);props.row.amount=props.row.priceExport*props.row.quantity}">
                <template v-slot="scope">
                  <q-input v-model="scope.value" dense autofocus counter class="edit-item no-error-icon no-arrows" @keyup.enter="scope.set"
                           type="number" :rules="[v=>v!==null&&v!==''||$t('error.required'),v=>parseInt(v)>-1||$t('error.minQuanity',{min:0})]">
                    <template v-slot:append>
                      <q-icon name="refresh" class="cursor-pointer" color="orange"
                              @click="()=>{props.row.quantity=props.row.quantityOld;scope.cancel()}">
                        <q-tooltip>{{$t('global.recover')}}</q-tooltip>
                      </q-icon>
                    </template>
                  </q-input>
                </template>
              </q-popup-edit>
            </q-td>
            <q-td key="amount" :props="props">
              <!-- {{(parseInt(props.row.price)*parseInt(props.row.quantity)).NumberFormat($store.getters.language)}} -->
              <div class="q-pr-xs flex inline">{{parseInt(props.row.amount).NumberFormat($store.getters.language)}}</div>
              <q-badge v-html="props.row.priceUnitName" color="green" transparent />
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
      <q-card :style="{minWidth:'60%'}">
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
          <!-- <tm-load-files :button="true" :label="$t('files.openFile')" :placeholder="$t('files.chooseFile')"
                         accept=".xls,.xlsx,.csv,.tsv,.txt,.json,.xml" @on-start="isLoading=true" @on-finish="onLoadedFile" /> -->

          <tm-load-files v-model="loadedRows" :button="true" :options="{header:1,raw:true}" :labelBtnUpload="$t('files.openFile')"
                         :labelBtnUrl="$t('files.googleSheet')" :labelFile="$t('files.chooseFile')" :labelUrl="$t('files.inputUrl')"
                         :errorNoExist="$t('error.noExist')" accept=".xls,.xlsx,.csv,.tsv,.txt,.json,.xml" :lblTblTitle="$t('table.temporaryData')"
                         :lblTblNoData="$t('table.noData')" :lblTblNoResults="$t('table.noFilterData')" :lblTblRowsPerPage="$t('table.rowPerPage')"
                         :rowsPerPageOptions="$store.state.app.rowsPerPageOptions" @onStart="isLoading=true" @onFinish="isLoading=false" />
        </q-card-section>
      </q-card>
    </q-dialog>
    <!-- QR Code Scanner dialog -->
    <q-dialog v-model="isDialogQRCode" :maximized="true">
      <tm-html5qrcode :title="$t('qrCode.qrCodeScanner')" :cancelLabel="$t('global.cancel')" @onDecode="onDecodeQR" @onError="onErrorQR" />
    </q-dialog>
  </q-card>
</template>

<script>
import { defineComponent, defineAsyncComponent, ref, watch, computed } from 'vue';
import { useStore } from 'vuex'
import { useQuasar } from 'quasar'
import { useI18n } from 'vue-i18n'
import Cookies from 'js-cookie'
export default defineComponent({
  name: 'StoreExport',
  components: {
    pList: defineAsyncComponent(() => import('pages/products/components/list')),
    tmLoadFiles: defineAsyncComponent(() => import('components/tm-load-files')),
    viewDetails: defineAsyncComponent(() => import('./components/view-details')),
    viewTotal: defineAsyncComponent(() => import('./components/view-total')),
    tmPrinter: defineAsyncComponent(() => import('components/tm-printer')),
    tmHtml5qrcode: defineAsyncComponent(() => import('components/tm-html5qrcode'))
  },
  setup () {
    const $store = useStore()
    const $q = useQuasar()
    const { t } = useI18n({ useScope: 'global' })
    const isLoading = ref(false)
    const isDialogProductList = ref(false)
    const isDialogProductLoad = ref(false)
    const isMaximizedView = ref(false)
    const isDialogQRCode = ref(false)
    const pagination = ref({ page: 1, rowsPerPage: 10 })
    const form = ref(null)
    const result = ref(null)
    const selected = ref([])
    const rows = ref(Cookies.get('export-tmp') ? JSON.parse(Cookies.get('export-tmp')) : [])
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
    const visibleColumns = ref([])
    const visibleColumnsList = ref(['priceExport'])
    const columns = ref([
      { name: 'category', field: 'category', label: 'category.title', align: 'left', sortable: true, required: true },
      { name: 'subCategory', field: 'subCategory', label: 'category.titlesub', align: 'left', sortable: true, required: true },
      { name: 'title', field: 'title', label: 'product.name', align: 'left', sortable: true, required: true },
      { name: 'code', field: 'code', label: 'product.code', align: 'left', sortable: true, required: true },
      { name: 'price', field: 'price', label: 'product.priceSale', align: 'right', sortable: true, required: true },
      { name: 'priceDiscount', field: 'priceDiscount', label: 'product.priceDiscount', align: 'right', sortable: true },
      { name: 'quantityStore', field: 'quantityStore', label: 'product.quantityStore', align: 'right', sortable: true, required: true },
      { name: 'priceExport', field: 'priceExport', label: 'product.priceExport', align: 'right', sortable: true, required: true },
      { name: 'quantity', field: 'quantity', label: 'product.quantityExport', align: 'right', sortable: true, required: true },
      { name: 'amount', field: 'amount', label: 'product.amount', align: 'right', sortable: true, required: true }
    ])

    $store.dispatch('categories/get', { type: 'product', flag: 1, x: true, generate: true }).then((x) => { categories.value = x })
    watch(() => rows, (state, preState) => {
      if (state && state.length) Cookies.set('export-tmp', JSON.stringify(rows.value))
      else Cookies.remove('export-tmp')
    }, { deep: true, immediate: true })

    const onGetCategories = (data, category, subCategory) => {
      let rs = []
      // data.forEach(e => {
      //   if (e.code.toUpperCase() === category.toUpperCase()) {
      //     rs.push(e)
      //     const sub = onGetCategories(e.children, subCategory, null)
      //     if (sub && sub.length) rs = rs.concat(sub)
      //   }
      // })
      for (let i = 0; i < data.length; i++) {
        const e = data[i]
        if (e.code.toUpperCase() === category.toUpperCase()) {
          rs.push(e)
          if (subCategory == null) break
          const sub = onGetCategories(e.children, subCategory, null)
          if (sub && sub.length) rs = rs.concat(sub)
        }
      }
      return rs
    }
    const onGetCategoriesID = (data, categoryID, subCategoryID) => {
      let rs = []
      for (let i = 0; i < data.length; i++) {
        const e = data[i]
        if (e._id === categoryID) {
          rs.push(e)
          if (subCategoryID == null) break
          const sub = onGetCategoriesID(e.children, subCategoryID, null)
          if (sub && sub.length) rs = rs.concat(sub)
        }
      }
      return rs
    }
    const onReset = () => {
      return new Promise((resolve, reject) => {
        loadedRows.value = []
        Cookies.remove('export-tmp')
        resolve()
      }).then(() => { if (form.value) form.value.resetValidation() })
    }

    return {
      isLoading, isDialogProductList, isDialogProductLoad, isDialogQRCode, isMaximizedView, form, result, visibleColumns, visibleColumnsList,
      pagination, columns, selected, rows, loadedRows, categories, refPrinterDetails, refPrinterTotal,
      onOpenProductList () {
        isDialogProductList.value = true
        isMaximizedView.value = false
      },
      onOpenProductLoad () {
        isDialogProductLoad.value = true
        isMaximizedView.value = false
      },
      onSelectProduct (selected) {
        for (let i = 0; i < selected.length; i++) {
          const existItem = rows.value.find(x => x._id === selected[i]._id)
          if (existItem) {
            existItem.quantity = existItem.quantity + 1
          } else {
            const cate = onGetCategoriesID(categories.value, selected[i].categories[0], selected[i].categories[1])
            rows.value.push({
              _id: selected[i]._id,
              categories: selected[i].categories,
              category: cate.length > 0 ? cate[0].title : selected[i].categories[0],
              subCategory: cate.length > 1 ? cate[1].title : selected[i].categories[1],
              code: selected[i].code.toUpperCase(),
              title: selected[i].title,
              price: selected[i].price || 0,
              priceOld: selected[i].priceExport || selected[i].price || 0,
              priceExport: selected[i].priceExport || selected[i].price,
              priceDiscount: selected[i].priceDiscount || 0,
              quantity: selected[i].quantityExport || 1,
              quantityOld: selected[i].quantityExport || 1,
              quantityStore: selected[i].quantity || 0,
              priceUnit: selected[i].priceUnit,
              priceUnitName: selected[i].priceUnitName,
              unit: selected[i].unit,
              unitName: selected[i].unitName,
              amount: parseInt(selected[i].quantityExport || 1) * parseInt(selected[i].priceExport || selected[i].price)
            })
          }
        }
      },
      onLoadedFile (data) {
        if (!data) {
          $q.notify({ message: t('error.exist'), color: 'warning' })
          return null
        }
        loadedRows.value = loadedRows.value.splice(1)
        $store.dispatch('store/exportFinds', { codes: loadedRows.value.map(x => x[3]) }).then((x) => {
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
                price: parseInt(e[7]) || 0,
                priceOld: parseInt(e[13]) || 0,
                priceExport: parseInt(e[13]) || 0,
                priceDiscount: parseInt(e[12]) || 0,
                quantity: parseInt(e[6]) || 0,
                quantityOld: parseInt(e[6]) || 0,
                quantityStore: item.quantity || 0,
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
                price: parseInt(e[7]) || 0,
                priceOld: parseInt(e[13]) || 0,
                priceExport: parseInt(e[13]) || 0,
                priceDiscount: parseInt(e[12]) || 0,
                quantity: parseInt(e[6]) || 0,
                quantityOld: parseInt(e[6]) || 0,
                quantityStore: 0,
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
        // $store.dispatch('store/exportFinds', data.map(x => x.code)).then((x) => {
        //   if (x && x.length) {
        //     x.forEach(item => {
        //       const _item = data.find(x => x.code === item.code)
        //       rows.value.pushIfNotExistUpdate({
        //         _id: item._id,
        //         code: item.code.toUpperCase(),
        //         title: item.title,
        //         quantity: _item.quantityExport || 0,
        //         price: _item.priceExport || 0,
        //         priceOld: item.priceExport || 0,
        //         quantityStore: item.quantity || 0,
        //         priceSale: item.price || 0,
        //         priceDiscount: item.priceDiscount || 0,
        //         priceUnit: item.priceUnit,
        //         unit: item.unit
        //       }, 'code')
        //     })
        //   }
        // }).finally(() => {
        //   isLoading.value = false
        // })
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
      onSubmit () {
        if (result.value) {
          $q.notify({ message: t('product.exportExistResult'), color: 'red' })
          return null
        }
        form.value.validate().then(valid => {
          if (valid) {
            $q.dialog({
              title: t('messageBox.confirm'),
              message: t('product.exportConfirm'),
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
              $store.dispatch('store/exportInsert', rows.value).then((x) => {
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
        Cookies.remove('export-tmp')
      },
      onPrinting (type) {
        if (type === 'details') {
          refPrinterDetails.value.onPrinting()
        } else if (type === 'total') {
          refPrinterTotal.value.onPrinting()
        }
      },
      onToPriceSale () {
        $q.dialog({
          title: t('messageBox.confirm'),
          message: t('product.exportConfirmPriceSale'),
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
          selected.value.forEach(e => { e.priceExport = e.price })
          selected.value = []
        })
      },
      onToPriceExport () {
        $q.dialog({
          title: t('messageBox.confirm'),
          message: t('product.exportConfirmPrice'),
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
          selected.value.forEach(e => { e.priceExport = e.priceOld })
          selected.value = []
        })
      },
      onDecodeQR (val) {
        $store.dispatch('store/exportFinds', { qrcode: val }).then((x) => {
          if (x && x.length) {
            isDialogQRCode.value = false
            const unitName = unitsSource.value.find(val => val.code === x[0].unit)
            const cate = onGetCategoriesID(categories.value, x[0].categories[0], x[0].categories[1])
            rows.value.pushIfNotExistUpdate({
              _id: x[0]._id,
              categories: x[0].categories,
              category: cate.length > 0 ? cate[0].title : x[0].categories[0],
              subCategory: cate.length > 1 ? cate[1].title : x[0].categories[1],
              code: x[0].code.toUpperCase(),
              title: x[0].title,
              price: x[0].price || 0,
              priceOld: x[0].priceExport || x[0].price || 0,
              priceExport: x[0].priceExport || x[0].price || 0,
              priceDiscount: x[0].priceDiscount || 0,
              quantity: x[0].quantityExport || 1,
              quantityOld: x[0].quantityExport || 1,
              quantityStore: x[0].quantity || 0,
              // priceUnit: x[0].priceUnit,
              // priceUnitName: x[0].priceUnitName,
              unit: x[0].unit,
              unitName: unitName ? unitName.name : x[0].unit,
              amount: parseInt(x[0].quantityExport || 1) * parseInt(x[0].priceExport)
            }, 'code')
          } else $q.notify({ message: t('error.qrNotExist'), color: 'negative' })
        })
      },
      onErrorQR (val) {
        $q.notify({ message: t(`error.${val.key}`), color: 'negative' })
      }
    }
  }
})
</script>

<style>
</style>
