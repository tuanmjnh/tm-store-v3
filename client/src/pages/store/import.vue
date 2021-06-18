<template>
  <q-card flat bordered>
    <q-toolbar>
      <q-toolbar-title>{{$t('product.warehouseImport')}}</q-toolbar-title>
      <q-btn v-if="!result&&items&&items.length" type="submit" :dense="$store.getters.dense.button"
        color="blue" :label="$t('product.import')" :loading="loading" class="q-btn--square q-mr-sm"
        @click.prevent="onSubmit" />
      <!--icon="offline_pin" -->
      <q-btn v-if="items&&items.length" type="submit" no-caps :dense="$store.getters.dense.button"
        color="blue-grey-4" :label="$t('product.createNew')" :loading="loading"
        class="q-btn--square" @click.prevent="onCreateNew" />
    </q-toolbar>
    <q-separator />
    <!-- <q-toolbar>
      <q-toolbar-title></q-toolbar-title>
    </q-toolbar> -->
    <q-form ref="form">
      <q-table :data="items" :columns="columns" row-key="code" flat
        :visible-columns="visibleColumns"
        :loading="$store.state.loading.get||$store.state.loading.patch" :selected.sync="selected"
        selection="multiple" :dense="$store.getters.dense.table" :no-data-label="$t('table.noData')"
        :no-results-label="$t('table.noFilterData')" :rows-per-page-label="$t('table.rowPerPage')"
        :selected-rows-label="()=>`${selected.length} ${$t('table.rowSelected')}`"
        :rows-per-page-options="[10, 20, 50 ,100, 200, 0]" :pagination.sync="pagination">
        <template v-slot:top="props">
          <div class="col-12 row">
            <div v-if="result" class="col-xs-12 col-sm-auto self-center">
              <span>{{$t('product.importSuccess')}}</span><b
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
                <printer-form v-if="result" :title="$t('product.importBallot')"
                  :label="$t('product.print')" :labelDate="$t('product.importDate')" :items="items"
                  :result="result" />
                <q-btn v-if="!result" flat round dense color="secondary" icon="find_in_page"
                  @click="onOpenProductList">
                  <q-tooltip v-if="!$q.platform.is.mobile">{{$t('product.select')}}</q-tooltip>
                </q-btn>
                <q-btn v-if="!result" flat round dense color="deep-purple" icon="post_add"
                  @click="onOpenProductAdd">
                  <q-tooltip v-if="!$q.platform.is.mobile">{{$t('product.add')}}</q-tooltip>
                </q-btn>
                <q-btn v-if="!result" flat round dense color="indigo" icon="cloud_upload"
                  @click="onOpenProductLoad">
                  <q-tooltip v-if="!$q.platform.is.mobile">{{$t('files.openFile')}}</q-tooltip>
                </q-btn>
                <q-btn flat round dense :color="$store.state.app.darkMode?'':'grey-7'"
                  icon="menu_open">
                  <q-tooltip v-if="!$q.platform.is.mobile">{{$t('table.displayColumns')}}
                  </q-tooltip>
                  <q-menu fit>
                    <q-list dense style="min-width:120px">
                      <template v-for="(item,index) in columns">
                        <q-item v-if="!item.required" clickable :key="index"
                          :active="visibleColumns.indexOf(item.name)>-1||false"
                          @click="onColumns(item.name)">
                          <q-item-section>{{$t(item.label)}}</q-item-section>
                        </q-item>
                      </template>
                    </q-list>
                  </q-menu>
                </q-btn>
                <q-btn flat round dense :color="$store.state.app.darkMode?'':'grey-7'"
                  :icon="props.inFullscreen ? 'fullscreen_exit' : 'fullscreen'"
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
              <q-checkbox v-if="props.multipleSelect" v-model="props.selected"
                indeterminate-value="some" :dense="$store.getters.dense.table" />
            </q-th>
            <!-- <q-th auto-width>#</q-th> -->
            <q-th v-for="col in props.cols" :key="col.name" :props="props">
              <span v-if="$store.state.app.darkMode" class="text-bold">{{ $t(col.label) }}</span>
              <span v-else class="text-bold text-blue-grey-10">{{ $t(col.label) }}</span>
            </q-th>
            <q-th auto-width>#</q-th>
          </q-tr>
        </template>
        <template v-slot:body="props">
          <q-tr :props="props">
            <q-td auto-width>
              <q-checkbox v-model="props.selected" color="primary"
                :dense="$store.getters.dense.table" />
            </q-td>
            <!-- <q-td auto-width>
              {{props.row.index}}
            </q-td> -->
            <q-td key="title" :props="props">
              <div>{{ props.row.title }}</div>
              <q-badge v-if="!props.row._id" color="red" transparent floating>new</q-badge>
            </q-td>
            <q-td key="code" :props="props">
              {{ props.row.code }}
            </q-td>
            <q-td key="price" :props="props">
              <div v-if="result">
                <span
                  class="q-pr-xs">{{ props.row.price|NumberFormat($store.getters.language) }}</span>
                <q-badge v-html="props.row.priceUnit" color="blue" transparent />
              </div>
              <q-input v-else v-model="props.row.price" debounce="300"
                :label="$t('product.priceImport')" type="number" :dense="$store.getters.dense.input"
                class="no-error-icon no-arrows"
                :rules="[v=>v!==null&&v!==''||$t('error.required'),v=>parseInt(v)>0||$t('error.minQuanity',{min:1})]">
                <template v-slot:append>
                  <q-icon name="refresh" class="cursor-pointer"
                    @click="props.row.price=props.row.priceOld" />
                </template>
              </q-input>
            </q-td>
            <q-td key="quantity" :props="props">
              <div v-if="result">
                <span
                  class="q-pr-xs">{{ props.row.quantity|NumberFormat($store.getters.language) }}</span>
                <q-badge v-html="props.row.unit" color="orange" transparent />
              </div>
              <q-input v-else v-model="props.row.quantity" debounce="300"
                :label="$t('product.quantityImport')" type="number"
                :dense="$store.getters.dense.input" class="no-error-icon no-arrows"
                :rules="[v=>v!==null&&v!==''||$t('error.required'),v=>parseInt(v)>0||$t('error.minQuanity',{min:1})]">
              </q-input>
              <!-- <q-badge v-html="props.row.unit" color="orange" transparent /> -->
            </q-td>
            <q-td key="amount" :props="props">
              {{ props.row.amount=parseInt(props.row.price)*parseInt(props.row.quantity)|NumberFormat($store.getters.language) }}
              <q-badge v-html="props.row.priceUnit" color="blue" transparent />
            </q-td>
            <q-td key="quantityStore" :props="props">
              {{ (result?parseInt(props.row.quantity)+parseInt(props.row.quantityStore):props.row.quantity)|NumberFormat($store.getters.language) }}
              <q-badge v-html="props.row.unit" color="orange" transparent />
            </q-td>
            <q-td key="priceSale" :props="props">
              {{ props.row.priceSale|NumberFormat($store.getters.language) }}
              <q-badge v-html="props.row.priceUnit" color="blue" transparent />
            </q-td>
            <q-td key="priceDiscount" :props="props">
              {{ props.row.priceDiscount|NumberFormat($store.getters.language) }}
              <q-badge v-html="props.row.priceUnit" color="red" transparent />
            </q-td>
            <q-td auto-width class="text-center">
              <q-btn flat round dense icon="close" color="red"
                :size="$store.getters.dense.table?'sm':'md'" @click="onRemove(props.row)">
                <q-tooltip v-if="!$q.platform.is.mobile">{{$t('global.cancel')}}</q-tooltip>
              </q-btn>
            </q-td>
          </q-tr>
        </template>
      </q-table>
    </q-form>
    <!-- <q-list v-if="success" dense bordered separator padding>
        <q-item v-for="(e,i) in items" :key="i">
          <q-item-section>{{e.code}} - {{e.title}}</q-item-section>
          <q-item-section>{{e.priceImport}}</q-item-section>
          <q-item-section>{{e.quantityImport}}</q-item-section>
        </q-item>
      </q-list> -->
    <!-- Product list dialog -->
    <q-dialog v-model="dialogProductList" :maximized="maximizedView" persistent>
      <p-list :categories="categories" :dialog.sync="dialogProductList"
        :maximized.sync="maximizedView" :visible-columns.sync="visibleColumnsList"
        @on-selected="onSelectProduct" />
    </q-dialog>
    <!-- Product add dialog -->
    <q-dialog v-model="dialogProductAdd" :maximized="maximizedView" persistent>
      <p-add :categories="categories" :units="units" :unitsPrice="unitsPrice" :pins="pins"
        :dialog.sync="dialogProductAdd" :maximized.sync="maximizedView" @on-finish="onAddProduct" />
    </q-dialog>
    <!-- Product load dialog -->
    <q-dialog v-model="dialogProductLoad" :maximized="maximizedView" persistent>
      <!-- <p-load-files :categories="categories" :maximized.sync="maximizedView" :dialog.sync="dialogProductLoad" :loading.sync="loading"
        @on-finish="onLoadedFile" /> -->
      <q-card flat :style="{minWidth:'60%'}">
        <q-toolbar>
          <q-avatar :icon="$route.meta.icon" size="50px" />
          <q-toolbar-title>{{$t('files.dataFile')}}</q-toolbar-title>
          <q-btn flat round dense :color="$store.state.app.darkMode?'':'grey-7'"
            :icon="maximizedView?'fullscreen_exit':'fullscreen'" :disable="loading"
            @click="maximizedView=!maximized">
            <q-tooltip v-if="!$q.platform.is.mobile">
              {{maximizedView?$t('global.normalScreen'):$t('global.fullScreen')}}</q-tooltip>
          </q-btn>
          <q-btn flat round dense icon="close" v-close-popup>
            <q-tooltip v-if="!$q.platform.is.mobile">{{$t('global.cancel')}}</q-tooltip>
          </q-btn>
        </q-toolbar>
        <q-separator />
        <q-card-section class="text-center">
          <tm-load-files :button="true" :label="$t('files.openFile')"
            :placeholder="$t('files.chooseFile')" accept=".xls,.xlsx,.csv,.tsv,.txt,.json,.xml"
            @on-start="loading=true" @on-finish="onLoadedFile" />
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-card>
</template>

<script>
import Cookies from 'js-cookie'
import * as api from '@/api/store/imports'
import * as apiTypes from '@/api/types'
import * as apiCategories from '@/api/categories'
export default {
  components: {
    pList: () => import('@/views/products/components/list'),
    pAdd: () => import('@/views/products/components/add'),
    tmLoadFiles: () => import('@/components/tm-load-files'),
    printerForm: () => import('./components/printer-form')
  },
  data() {
    return {
      loading: false,
      dialogProductList: false,
      dialogProductAdd: false,
      dialogProductLoad: false,
      maximizedView: false,
      result: null,
      categories: [],
      units: [],
      unitsPrice: [],
      pins: [],
      selected: [],
      items: Cookies.get('import-tmp') ? JSON.parse(Cookies.get('import-tmp')) : [],
      visibleColumns: [],
      visibleColumnsList: ['quantityStore', 'priceSale', 'priceDiscount', 'priceImport'],
      visibleColumnsPrint: [],
      pagination: {
        page: 1,
        rowsPerPage: 10
      },
      columns: [
        { name: 'title', field: 'title', label: 'product.name', align: 'left', sortable: true, required: true }, // row => this.$t(`roles.${row.name}`)
        { name: 'code', field: 'code', label: 'product.code', align: 'left', sortable: true, required: true },
        { name: 'price', field: 'price', label: 'product.unitPrice', align: 'right', sortable: true, required: true },
        { name: 'quantity', field: 'quantity', label: 'product.quantityImport', align: 'right', sortable: true, required: true },
        { name: 'amount', field: 'amount', label: 'product.amount', align: 'right', sortable: true, required: true },
        { name: 'quantityStore', field: 'quantityStore', label: 'product.quantityStore', align: 'right', sortable: true },
        { name: 'priceSale', field: 'priceSale', label: 'product.priceSale', align: 'right', sortable: true },
        { name: 'priceDiscount', field: 'priceDiscount', label: 'product.priceDiscount', align: 'right', sortable: true }
      ]
    }
  },
  created() {
    this.onGetCategory()
    this.onGetUnits({ key: 'unit' })
    this.onGetUnitsPrice({ key: 'unit_price' })
    this.onGetPins({ key: 'pin_product' })
  },
  watch: {
    items: {
      handler(val) {
        if (val && val.length) Cookies.set('import-tmp', JSON.stringify(this.items))
        else Cookies.remove('import-tmp')
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    onGetCategory() {
      apiCategories.select().then((x) => {
        this.categories = x.data
      })
    },
    onGetUnits(props) {
      apiTypes.select(props).then((x) => {
        if (x && x.data && x.data.length > 0) this.units = x.data
      })
    },
    onGetUnitsPrice(props) {
      apiTypes.select(props).then((x) => {
        if (x && x.data && x.data.length > 0) this.unitsPrice = x.data
      })
    },
    onGetPins(props) {
      apiTypes.select(props).then((x) => {
        if (x && x.data && x.data.length > 0) this.pins = x.data.map(x => ({ value: x.code, label: x.name }))
      })
    },
    onOpenProductList() {
      this.dialogProductList = true
      this.maximizedView = false
    },
    onOpenProductAdd() {
      this.dialogProductAdd = true
      this.maximizedView = false
    },
    onOpenProductLoad() {
      this.dialogProductLoad = true
      this.maximizedView = false
    },
    onSelectProduct(selected) {
      const index = this.items.length
      for (let i = 0; i < selected.length; i++) {
        this.items.pushIfNotExist({
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
      // selected = selected.map(item => ({
      //   index: this.items.length + 1,
      //   _id: item._id,
      //   code: item.code.toUpperCase(),
      //   title: item.title,
      //   quantityImport: item.quantityImport || 0,
      //   priceImport: item.priceImport || 0,
      //   priceImport_old: item.priceImport || 0,
      //   quantity: item.quantity || 0,
      //   price: item.price || 0,
      //   priceDiscount: item.priceDiscount || 0,
      //   priceUnit: item.priceUnit,
      //   unit: item.unit
      // }))
      // this.items.pushIfNotExist(selected, 'code')
    },
    onAddProduct(item) {
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
      this.items.pushIfNotExist(item, 'code')
    },
    onLoadedFile(data) {
      if (!data) {
        this.$q.notify({
          message: this.$t('error.exist'),
          color: 'warning'
        })
        return null
      }
      api.finds(data.map(x => x.code)).then(x => {
        if (x && x.length) {
          data.forEach(e => {
            const item = x.find(x => x.code === e.code)
            if (item) {
              this.items.pushIfNotExistUpdate({
                _id: item._id,
                code: item.code.toUpperCase(),
                title: item.title,
                quantity: e.quantityImport || 0,
                price: e.priceImport || 0,
                priceOld: e.priceImport || 0,
                quantityStore: item.quantity || 0,
                priceSale: item.price || 0,
                priceDiscount: item.priceDiscount || 0,
                priceUnit: item.priceUnit,
                unit: item.unit
              }, 'code')
            } else {
              this.items.pushIfNotExistUpdate({
                categories: e.categories.toUpperCase(),
                code: e.code.toUpperCase(),
                title: e.title,
                desc: e.desc,
                content: e.content,
                images: e.images,
                priceSale: parseInt(e.price) || 0,
                priceDiscount: parseInt(e.priceDiscount) || 0,
                quantityStore: 0,
                price: parseInt(e.priceImport) || 0,
                priceOld: parseInt(e.priceImport) || 0,
                quantity: parseInt(e.quantityImport) || 0,
                priceUnit: e.priceUnit,
                unit: e.unit,
                origin: e.origin,
                date: e.date,
                pin: e.pin,
                tags: e.tags,
                attr: e.attr,
                orders: e.orders
              }, 'code')
            }
          })
        }
      })
        .finally(() => {
          this.loading = false
          this.dialogProductLoad = false
        })
    },
    onRemove(item) {
      if (item) this.selected = [item]
      this.$q.dialog({
        title: this.$t('messageBox.confirm'),
        message: this.$t('messageBox.delete'),
        cancel: true,
        persistent: true
      }).onOk(() => {
        this.selected.forEach(e => {
          const index = this.items.findIndex(x => x.code === e.code)
          if (index > -1) this.items.splice(index, 1)
        })
        this.selected = []
      })
    },
    onSubmit() {
      if (this.result) {
        this.$q.notify({
          message: this.$t('product.importExistResult'),
          color: 'red'
        })
        return null
      }
      this.$refs.form.validate().then(valid => {
        if (valid) {
          this.$q.dialog({
            title: this.$t('messageBox.confirm'),
            message: this.$t('product.importConfirm'),
            cancel: true,
            persistent: true
          }).onOk(() => {
            api.imports(this.items).then(x => {
              if (x) {
                if (x.data) this.result = x
                // this.result.total = this.result.data.sum('priceImport')
                // this.result.vat = Math.round(this.result.total * 0.1, 0)
                // this.result.amount = this.result.total + this.result.vat
                this.reset()
              }
            })
          })
        }
      })
    },
    onColumns(value) {
      var index = this.visibleColumns.indexOf(value)
      if (index < 0) this.visibleColumns.push(value)
      else this.visibleColumns.splice(index, 1)
    },
    onCreateNew() {
      this.items = []
      this.result = null
      Cookies.remove('import-tmp')
    },
    reset() {
      new Promise((resolve, reject) => {
        Cookies.remove('import-tmp')
        resolve()
      }).then(() => {
        if (this.$refs.form) this.$refs.form.resetValidation()
      })
    }
  }
}
</script>

<style>
</style>
