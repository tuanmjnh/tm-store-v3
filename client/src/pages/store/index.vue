<template>
  <div>
    <q-table :data="items" :columns="columns" row-key="_id" flat :visible-columns="visibleColumns"
      :loading="$store.state.loading.get||$store.state.loading.patch" :selected.sync="selected"
      :dense="$store.getters.dense.table" selection="multiple" :no-data-label="$t('table.noData')"
      :no-results-label="$t('table.noFilterData')" :rows-per-page-label="$t('table.rowPerPage')"
      :selected-rows-label="()=>`${selected.length} ${$t('table.rowSelected')}`"
      :rows-per-page-options="[10, 20, 50 ,100, 200]" :pagination.sync="pagination"
      @request="onSelect" :filter="pagination.filter" binary-state-sort>
      <template v-slot:top="props">
        <div class="col-12 row">
          <div class="col-xs-12 col-sm-auto q-table__title text-h6">{{$t('product.warehouse')}}
          </div>
          <q-space />
          <div class="col-xs-12 col-sm-auto self-center row">
            <q-chip v-if="isRoutes.add" clickable square icon="playlist_add" color="indigo"
              text-color="white" @click="$router.push('import')">
              {{$t('product.import')}}</q-chip>
            <q-chip v-if="isRoutes.add" clickable square icon="double_arrow" color="green"
              text-color="white" @click="$router.push('export')">
              {{$t('product.export')}}</q-chip>
            <q-btn v-if="isRoutes.add" flat dense no-caps color="blue" class="q-ml-sm"
              :label="$t('global.add')" @click="$router.push('/product/list/add')">
            </q-btn>
          </div>
          <div class="col-12 text-right">
            <q-btn icon="filter_list" flat round dense color="teal">
              <q-tooltip v-if="!$q.platform.is.mobile">{{$t('global.filter')}}</q-tooltip>
              <q-menu>
                <!-- <div class="q-pa-md"> -->
                <div class="row no-wrap q-pb-sm q-pl-md q-pr-md" style="min-width:300px">
                  <div class="col-12">
                    <q-input v-model="pagination.filter" :dense="$store.getters.dense.input"
                      debounce="500" :placeholder="$t('global.search')">
                      <template v-slot:append>
                        <q-icon v-if="pagination.filter===''" name="search" />
                        <q-icon v-else name="clear" class="cursor-pointer"
                          @click="pagination.filter=''" />
                      </template>
                    </q-input>
                  </div>
                </div>
                <div class="row no-wrap q-pl-md q-pr-md">
                  <div class="col-12">
                    <select-category :categories="categories" :selected.sync="pagination.categories"
                      data-key="_id" data-all :dense="$store.getters.dense.input"
                      :labelTitle="$t('category.title_product')"
                      :labelSelect="$t('category.select')" :labelAll="$t('category.selectAll')"
                      :labelClose="$t('global.cancel')" @on-selected="onSelectCategory" />
                  </div>
                </div>
              </q-menu>
            </q-btn>
            <q-btn v-if="isRoutes.trash&&selected.length>0&&!pagination.flag" flat round dense
              color="warning" icon="restore_page" @click="onTrash()">
              <q-tooltip v-if="!$q.platform.is.mobile">{{$t('global.recover')}}</q-tooltip>
            </q-btn>
            <q-btn flat round dense :color="$store.state.app.darkMode?'':'grey-7'" icon="menu_open">
              <q-tooltip v-if="!$q.platform.is.mobile">{{$t('table.displayColumns')}}</q-tooltip>
              <q-menu fit>
                <q-list dense style="min-width:120px">
                  <template v-for="(item,index) in columns">
                    <q-item clickable :key="index" v-if="!item.required"
                      @click="onColumns(item.name)"
                      :active="visibleColumns.indexOf(item.name)>-1||false">
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
                {{props.inFullscreen?$t('global.normalScreen'):$t('global.fullScreen')}}</q-tooltip>
            </q-btn>
          </div>
        </div>
      </template>
      <template v-slot:header="props">
        <q-tr :props="props">
          <q-th auto-width>
            <q-checkbox v-if="props.multipleSelect" v-model="props.selected"
              indeterminate-value="some" :dense="$store.getters.dense.table" />
          </q-th>
          <q-th v-for="col in props.cols" :key="col.name" :props="props">
            <span v-if="$store.state.app.darkMode" class="text-bold">{{ $t(col.label) }}</span>
            <span v-else class="text-bold text-blue-grey-10">{{ $t(col.label) }}</span>
          </q-th>
        </q-tr>
      </template>
      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td auto-width>
            <q-checkbox v-model="props.selected" color="primary"
              :dense="$store.getters.dense.table" />
          </q-td>
          <q-td key="title" :props="props">
            {{ props.row.title }}
          </q-td>
          <q-td key="code" :props="props">
            {{ props.row.code }}
          </q-td>
          <q-td key="quantity" :props="props">
            <span
              class="q-pr-xs">{{ props.row.quantity|NumberFormat($store.getters.language) }}</span>
            <q-badge v-html="props.row.unit" color="orange" transparent />
          </q-td>
          <q-td key="priceImport" :props="props">
            <span
              class="q-pr-xs">{{ props.row.priceImport|NumberFormat($store.getters.language) }}</span>
            <q-badge v-html="props.row.priceUnit" color="teal" transparent />
          </q-td>
          <q-td key="priceExport" :props="props">
            <span
              class="q-pr-xs">{{ props.row.priceExport|NumberFormat($store.getters.language) }}</span>
            <q-badge v-html="props.row.priceUnit" color="teal" transparent />
          </q-td>
          <q-td key="price" :props="props">
            <span class="q-pr-xs">{{ props.row.price|NumberFormat($store.getters.language) }}</span>
            <q-badge v-html="props.row.priceUnit" color="blue" transparent />
          </q-td>
          <q-td key="priceDiscount" :props="props">
            <span
              class="q-pr-xs">{{ props.row.priceDiscount|NumberFormat($store.getters.language) }}</span>
            <q-badge v-html="props.row.priceUnit" color="red" transparent />
          </q-td>
        </q-tr>
      </template>
    </q-table>
  </div>
</template>

<script>
import * as api from '@/api/products'
import * as apiCategories from '@/api/categories'
import * as apiTypes from '@/api/types'
export default {
  components: { selectCategory: () => import('@/views/category/components/select-category') },
  data() {
    return {
      dialogAdd: false,
      items: [],
      selected: [],
      categories: [],
      units: [],
      unitsPrice: [],
      pins: [],
      isRoutes: {
        add: this.$router.has('product-list-add'),
        edit: this.$router.has('product-list-edit'),
        trash: this.$router.has('product-list-trash')
      },
      pagination: {
        filter: '',
        sortBy: 'quantity',
        descending: false,
        page: 1,
        rowsPerPage: 10,
        rowsNumber: 1,
        categories: null,
        flag: 1
      },
      visibleColumns: ['priceImport', 'priceExport'],
      columns: [
        { name: 'title', field: 'title', label: 'product.name', align: 'left', sortable: true, required: true }, // row => this.$t(`roles.${row.name}`)
        { name: 'code', field: 'code', label: 'product.code', align: 'left', sortable: true, required: true },
        { name: 'quantity', field: 'quantity', label: 'product.quantityStore', align: 'right', sortable: true, required: true },
        { name: 'priceImport', field: 'priceImport', label: 'product.priceImport', align: 'right', sortable: true },
        { name: 'priceExport', field: 'priceExport', label: 'product.priceExport', align: 'right', sortable: true },
        { name: 'price', field: 'price', label: 'product.priceSale', align: 'right', sortable: true },
        { name: 'priceDiscount', field: 'priceDiscount', label: 'product.priceDiscount', align: 'right', sortable: true }
      ]
    }
  },
  created() {
    this.onGetCategory()
    this.onGetUnits({ key: 'unit' })
    this.onGetUnitsPrice({ key: 'unit_price' })
    this.onGetPins({ key: 'pin_product' })
    this.onSelect({ pagination: this.pagination })
  },
  watch: {
    dialogAdd(val) {
      if (!val) this.selected = []
    }
  },
  methods: {
    onGetCategory() {
      apiCategories.select().then((x) => {
        this.categories = x.data
      })
    },
    onSelectCategory(value) {
      if (value) {
        // this.pagination.categories = value._id
        this.onSelect({ pagination: this.pagination })
      }
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
    onSelect(props) {
      api.select(props.pagination).then((x) => {
        this.items = x.data
        this.pagination = props.pagination
        this.pagination.rowsNumber = x.rowsNumber
      })
    },
    onChangeFlag(flag) {
      if (flag === this.pagination.flag) return
      this.selected = []
      this.pagination.flag = flag
      this.onSelect({ pagination: this.pagination })
    },
    onColumns(value) {
      var index = this.visibleColumns.indexOf(value)
      if (index < 0) this.visibleColumns.push(value)
      else this.visibleColumns.splice(index, 1)
    },
    onUpdate(item) {
      this.dialogAdd = true
      this.selected = [item]
    },
    onTrash(item) {
      this.$q.dialog({
        title: this.$t('messageBox.warning'),
        message: this.pagination.flag ? this.$t('messageBox.lock') : this.$t('messageBox.unlock'),
        cancel: true,
        persistent: true
      }).onOk(() => {
        if (item) this.selected = [item]
        api.lock({ _id: this.selected.map(x => x._id) }).then((x) => {
          x.success.forEach(e => {
            const index = this.items.findIndex(x => x._id === e)
            this.items.splice(index, 1)
          })
        }).finally(() => {
          this.selected = []
        })
      }).onOk(() => {
        // console.log('>>>> second OK catcher')
      }).onCancel(() => {
        this.selected = []
      }).onDismiss(() => {
        // console.log('I am triggered on both OK and Cancel')
      })
    }
  }
}
</script>

<style>
</style>
