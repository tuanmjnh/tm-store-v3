<template>
  <q-card flat :style="{minWidth:'60%'}">
    <q-toolbar>
      <q-avatar :icon="$route.meta.icon" size="50px" />
      <q-toolbar-title>{{$t('product.titleList')}}</q-toolbar-title>
      <q-btn v-if="selected&&selected.length" flat round dense color="primary" icon="done"
        :disable="$store.state.loading.get" @click="onSubmit">
        <q-tooltip v-if="!$q.platform.is.mobile">{{$t('global.accept')}}</q-tooltip>
      </q-btn>
      <q-btn flat round dense :disable="$store.state.loading.get"
        :color="$store.state.app.darkMode?'':'grey-7'" icon="menu_open">
        <q-tooltip v-if="!$q.platform.is.mobile">{{$t('table.displayColumns')}}</q-tooltip>
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
      <q-btn flat round dense :color="$store.state.app.darkMode?'':'grey-7'"
        :icon="maximized?'fullscreen_exit':'fullscreen'" :disable="$store.state.loading.get"
        @click="$emit('update:maximized',!maximized)">
        <q-tooltip v-if="!$q.platform.is.mobile">
          {{maximized?$t('global.normalScreen'):$t('global.fullScreen')}}</q-tooltip>
      </q-btn>
      <q-btn flat round dense icon="close" v-close-popup>
        <q-tooltip v-if="!$q.platform.is.mobile">{{$t('global.cancel')}}</q-tooltip>
      </q-btn>
    </q-toolbar>
    <q-separator />
    <q-table :data="items" :columns="columns" row-key="_id" :visible-columns="visibleColumns"
      :loading="$store.state.loading.get" :selected.sync="selected"
      :dense="$store.getters.dense.table" selection="multiple" :no-data-label="$t('table.noData')"
      :no-results-label="$t('table.noFilterData')" :rows-per-page-label="$t('table.rowPerPage')"
      :selected-rows-label="()=>`${selected.length} ${$t('table.rowSelected')}`"
      :rows-per-page-options="[10, 20, 50 ,100, 200, 0]" :pagination.sync="pagination"
      @request="onSelect" :filter="pagination.filter" binary-state-sort>
      <template v-slot:top>
        <div class="col-12 row">
          <div class="col-xs-12 col-sm-5 col-md-4">
            <select-category :categories="categories" :selected.sync="pagination.categories"
              data-key="_id" data-all :dense="$store.getters.dense.input"
              :labelTitle="$t('category.title_product')" :labelSelect="$t('category.select')"
              :labelAll="$t('category.selectAll')" :labelClose="$t('global.cancel')"
              @on-selected="onSelectCategory" />
          </div>
          <q-space />
          <div class="col-xs-12 col-sm-3">
            <q-input v-model="pagination.filter" :dense="$store.getters.dense.input" debounce="500"
              :placeholder="$t('global.search')">
              <template v-slot:append>
                <q-icon v-if="pagination.filter===''" name="search" />
                <q-icon v-else name="clear" class="cursor-pointer" @click="pagination.filter=''" />
              </template>
            </q-input>
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
          <q-th auto-width>#</q-th>
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
          <q-td key="price" :props="props">
            <span class="q-pr-xs">{{ props.row.price|NumberFormat($store.getters.language) }}</span>
            <q-badge v-html="props.row.priceUnit" color="blue" transparent />
          </q-td>
          <q-td key="priceDiscount" :props="props">
            <span
              class="q-pr-xs">{{ props.row.priceDiscount|NumberFormat($store.getters.language) }}</span>
            <q-badge v-html="props.row.priceUnit" color="red" transparent />
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
          <q-td key="orders" :props="props">
            {{ props.row.orders }}
          </q-td>
          <!-- <q-td key="roles" :props="props" class="q-gutter-xs">
            <template v-if="props.row.roles&&props.row.roles.length>0">
              <q-badge v-for="(item,index) in onFilterRoles(props.row.roles)" :key="index"
                :style="{backgroundColor:item.color}">
                {{item.label}}
              </q-badge>
            </template>
            <q-badge v-else color="blue-grey-10">{{$t('global.undefined')}}</q-badge>
          </q-td> -->
          <q-td auto-width class="text-center">
            <q-btn flat round dense icon="input" color="blue"
              :size="$store.getters.dense.table?'sm':'md'" @click="onSelected(props.row)">
              <q-tooltip v-if="!$q.platform.is.mobile">{{$t('global.select')}}</q-tooltip>
            </q-btn>
          </q-td>
        </q-tr>
      </template>
    </q-table>
  </q-card>
</template>

<script>
import * as api from '@/api/products'
import * as apiTypes from '@/api/types'
export default {
  components: { selectCategory: () => import('@/views/category/components/select-category') },
  props: {
    maximized: { type: Boolean, default: false },
    categories: { type: Array, default: null },
    visibleColumns: { type: Array, default: () => [] }
  },
  data() {
    return {
      items: [],
      selected: [],
      pagination: {
        filter: '',
        sortBy: 'orders',
        descending: false,
        page: 1,
        rowsPerPage: 10,
        rowsNumber: 1,
        categories: null,
        flag: 1
      },
      columns: [
        { name: 'title', field: 'title', label: 'product.name', align: 'left', sortable: true, required: true }, // row => this.$t(`roles.${row.name}`)
        { name: 'code', field: 'code', label: 'product.code', align: 'left', sortable: true, required: true },
        { name: 'quantity', field: 'quantity', label: 'product.quantityStore', align: 'right', sortable: true, required: true },
        { name: 'price', field: 'price', label: 'product.priceSale', align: 'right', sortable: true },
        { name: 'priceDiscount', field: 'priceDiscount', label: 'product.priceDiscount', align: 'right', sortable: true },
        { name: 'priceImport', field: 'priceImport', label: 'product.priceImport', align: 'right', sortable: true },
        { name: 'priceExport', field: 'priceExport', label: 'product.priceExport', align: 'right', sortable: true },
        { name: 'order', field: 'order', label: 'global.order', align: 'right', sortable: true }
      ]
    }
  },
  created() {
    this.onSelect({ pagination: this.pagination })
  },
  watch: {
    dialog: {
      handler(val) {
        this.$emit('update:maximized', false)
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    onSelectCategory(value) {
      if (value) {
        // this.pagination.categories = value._id
        this.onSelect({ pagination: this.pagination })
      }
    },
    onSelect(props) {
      api.select(props.pagination).then((x) => {
        this.items = x.data
        this.pagination = props.pagination
        this.pagination.rowsNumber = x.rowsNumber
      })
    },
    onColumns(value) {
      var index = this.visibleColumns.indexOf(value)
      if (index < 0) this.visibleColumns.push(value)
      else this.visibleColumns.splice(index, 1)
    },
    onSelected(item) {
      item.quantity_import = 0
      this.selected = [item]
      this.$emit('update:dialog', false)
      this.$emit('on-selected', this.selected)
    },
    onSubmit() {
      this.selected.forEach(e => {
        e.quantity_import = 0
      })
      this.$emit('update:dialog', false)
      this.$emit('on-selected', this.selected)
    }
  }
}
</script>

<style>
</style>
