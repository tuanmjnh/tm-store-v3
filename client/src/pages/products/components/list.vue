<template>
  <q-card flat :style="{minWidth:'60%'}">
    <q-toolbar>
      <q-avatar :icon="icon" size="50px" />
      <q-toolbar-title>{{$t('product.titleList')}}</q-toolbar-title>
      <q-btn v-if="selected&&selected.length" flat round dense color="primary" icon="done" :disable="$store.state.app.loading.get" @click="onSubmit">
        <q-tooltip v-if="!$q.platform.is.mobile">{{$t('global.accept')}}</q-tooltip>
      </q-btn>
      <q-btn flat round dense :disable="$store.state.app.loading.get" :color="$store.state.app.darkMode?'':'grey-7'" icon="menu_open">
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
      <q-btn flat round dense :color="$store.state.app.darkMode?'':'grey-7'" :icon="maximized?'fullscreen_exit':'fullscreen'"
             :disable="$store.state.app.loading.get" @click="$emit('update:maximized',!maximized)">
        <q-tooltip v-if="!$q.platform.is.mobile">{{maximized?$t('global.normalScreen'):$t('global.fullScreen')}}</q-tooltip>
      </q-btn>
      <q-btn flat round dense icon="close" v-close-popup>
        <q-tooltip v-if="!$q.platform.is.mobile">{{$t('global.cancel')}}</q-tooltip>
      </q-btn>
    </q-toolbar>
    <q-separator />
    <q-table :rows="rows" :columns="columns" row-key="_id" :visible-columns="visibleColumns"
             :loading="$store.state.app.loading.get||$store.state.app.loading.patch" v-model:selected="selected"
             :dense="$store.getters.dense.table" selection="multiple" :no-data-label="$t('table.noData')"
             :no-results-label="$t('table.noFilterData')" :rows-per-page-label="$t('table.rowPerPage')"
             :selected-rows-label="()=>`${selected.length} ${$t('table.rowSelected')}`"
             :rows-per-page-options="$store.state.app.rowsPerPageOptions" v-model:pagination="pagination"
             @request="onFetch" :filter="pagination.filter" binary-state-sort>
      <template v-slot:top>
        <div class="col-12 row">
          <div class="col-xs-12 col-sm-5 col-md-4">
            <select-category v-model="pagination.categories" :categories="categories" option-value="_id" option-label="label" data-all
                             :dense="$store.getters.dense.input" :labelTitle="$t('category.titleproduct')" :labelSelect="$t('category.select')"
                             :labelAll="$t('category.selectAll')" :labelClose="$t('global.cancel')" @on-selected="onSelectCategory" />
          </div>
          <q-space />
          <div class="col-xs-12 col-sm-3">
            <q-input v-model="pagination.filter" :dense="$store.getters.dense.input" debounce="500" :placeholder="$t('global.search')">
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
            <q-checkbox v-model="props.selected" indeterminate-value="some" :dense="$store.getters.dense.table" />
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
            {{props.row.title}}
          </q-td>
          <q-td key="code" :props="props">
            {{props.row.code}}
          </q-td>
          <q-td key="quantity" :props="props">
            <div class="q-pr-xs flex inline">{{props.row.quantity.NumberFormat($store.getters.language)}}</div>
            <q-badge v-html="props.row.unitName" color="orange" transparent />
          </q-td>
          <q-td key="price" :props="props">
            <div class="q-pr-xs flex inline">{{props.row.price.NumberFormat($store.getters.language)}}</div>
            <q-badge v-html="props.row.priceUnitName" color="blue" transparent />
          </q-td>
          <q-td key="priceDiscount" :props="props">
            <div class="q-pr-xs flex inline">{{props.row.priceDiscount.NumberFormat($store.getters.language)}}</div>
            <q-badge v-html="props.row.priceUnitName" color="red" transparent />
          </q-td>
          <q-td key="priceImport" :props="props">
            <div class="q-pr-xs flex inline">{{props.row.priceImport.NumberFormat($store.getters.language)}}</div>
            <q-badge v-html="props.row.priceUnitName" color="teal" transparent />
          </q-td>
          <q-td key="priceExport" :props="props">
            <div class="q-pr-xs flex inline">{{props.row.priceExport.NumberFormat($store.getters.language)}}</div>
            <q-badge v-html="props.row.priceUnitName" color="teal" transparent />
          </q-td>
          <!-- <q-td key="orders" :props="props">
            {{props.row.orders}}
          </q-td> -->
          <q-td auto-width class="text-center">
            <q-btn flat round dense icon="input" color="blue" :size="$store.getters.dense.table?'sm':'md'" @click="onSelected(props.row)">
              <q-tooltip v-if="!$q.platform.is.mobile">{{$t('global.select')}}</q-tooltip>
            </q-btn>
          </q-td>
        </q-tr>
      </template>
    </q-table>
  </q-card>
</template>

<script>
import { defineComponent, defineAsyncComponent, ref, computed } from 'vue';
import { useStore } from 'vuex'
export default defineComponent({
  name: 'ProductComponentsList',
  components: { selectCategory: defineAsyncComponent(() => import('pages/category/components/select-category')) },
  props: {
    maximized: { type: Boolean, default: false },
    // categories: { type: Array, default: null },
    visibleColumns: { type: Array, default: () => [] },
    icon: { type: String, default: 'list' }
  },
  setup (props, { emit }) {
    const $store = useStore()
    const categories = ref([])
    const selected = ref([])
    const pagination = ref({
      filter: '',
      sortBy: 'orders',
      descending: false,
      page: 1,
      rowsPerPage: 10,
      rowsNumber: 1,
      categories: null,
      flag: 1
    })
    const columns = ref([
      { name: 'title', field: 'title', label: 'product.name', align: 'left', sortable: true, required: true }, // row => this.$t(`roles.${row.name}`)
      { name: 'code', field: 'code', label: 'product.code', align: 'left', sortable: true, required: true },
      { name: 'quantity', field: 'quantity', label: 'product.quantityStore', align: 'right', sortable: true, required: true },
      { name: 'price', field: 'price', label: 'product.priceSale', align: 'right', sortable: true, required: true },
      { name: 'priceDiscount', field: 'priceDiscount', label: 'product.priceDiscount', align: 'right', sortable: true },
      { name: 'priceImport', field: 'priceImport', label: 'product.priceImport', align: 'right', sortable: true },
      { name: 'priceExport', field: 'priceExport', label: 'product.priceExport', align: 'right', sortable: true }
      // { name: 'order', field: 'order', label: 'global.order', align: 'right', sortable: true }
    ])
    const rows = computed(() => $store.state.products.items || [])
    const onFetch = (props) => {
      const { page, rowsPerPage, sortBy, descending, categories } = props.pagination
      $store.dispatch('products/get', props.pagination).then(x => {
        pagination.value.categories = categories
        pagination.value.rowsNumber = x.rowsNumber
        pagination.value.page = page
        pagination.value.rowsPerPage = rowsPerPage
        pagination.value.sortBy = sortBy
        pagination.value.descending = descending
      })
    }
    onFetch({ pagination: pagination.value })
    $store.dispatch('categories/get', { type: 'product', flag: 1, x: true, generate: true }).then((x) => { categories.value = x })

    return {
      rows, selected, categories, pagination, columns, onFetch,
      onSelectCategory: (val) => {
        if (val) onFetch({ pagination: pagination.value })
      },
      onColumns (val) {
        var i = props.visibleColumns.indexOf(val)
        const x = props.visibleColumns.slice()
        if (i < 0) x.push(val)
        else x.splice(i, 1)
        emit('update:visibleColumns', x)
      },
      onSelected (val) {
        const item = { ...val }
        // item.quantityImport = 0
        selected.value = [item]
        emit('update:dialog', false)
        emit('on-selected', selected.value)
      },
      onSubmit () {
        const items = selected.value.slice()
        // items.forEach(e => {
        //   e.quantityImport = 0
        // })
        emit('update:dialog', false)
        emit('on-selected', items)
      }
    }
  }
})
</script>

<style>
</style>
