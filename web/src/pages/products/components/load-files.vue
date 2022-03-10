<template>
  <q-card style="min-width:800px">
    <q-toolbar>
      <q-avatar :icon="$route.meta.icon" size="50px" />
      <q-toolbar-title>{{$t('files.dataFile')}}</q-toolbar-title>
      <q-btn v-if="items&&items.length" flat round dense color="primary" icon="done" :disable="isLoading" @click="onFinish">
        <q-tooltip v-if="!$q.platform.is.mobile">{{$t('global.accept')}}</q-tooltip>
      </q-btn>
      <q-btn v-if="items&&items.length" flat round dense :disable="isLoading" :color="$store.state.app.darkMode?'':'grey-7'" icon="menu_open">
        <q-tooltip v-if="!$q.platform.is.mobile">{{$t('table.displayColumns')}}</q-tooltip>
        <q-menu fit>
          <q-list dense style="min-width:100px">
            <template v-for="(item,index) in columns">
              <q-item clickable :key="index" v-if="!item.required" @click="onColumns(item.name)"
                      :active="visibleColumns.indexOf(item.name)>-1||false">
                <q-item-section>{{$t(item.label)}}</q-item-section>
              </q-item>
            </template>
          </q-list>
        </q-menu>
      </q-btn>
      <q-btn v-if="items&&items.length" flat round dense :color="$store.state.app.darkMode?'':'grey-7'"
             :icon="maximized?'fullscreen_exit':'fullscreen'" :disable="isLoading" @click="$emit('update:maximized',!maximized)">
        <q-tooltip v-if="!$q.platform.is.mobile">
          {{maximized?$t('global.normalScreen'):$t('global.fullScreen')}}</q-tooltip>
      </q-btn>
      <q-btn flat round dense icon="close" v-close-popup>
        <q-tooltip v-if="!$q.platform.is.mobile">{{$t('global.cancel')}}</q-tooltip>
      </q-btn>
    </q-toolbar>
    <q-separator />
    <q-table v-if="items&&items.length" :rows="items" :columns="columns" row-key="_id" :visible-columns="visibleColumns" :loading="isLoading"
             :dense="$store.getters.dense.table" :no-data-label="$t('table.noData')" :no-results-label="$t('table.noFilterData')"
             :rows-per-page-label="$t('table.rowPerPage')" :rows-per-page-options="$store.state.app.rowsPerPageOptions"
             v-model:pagination="pagination" :filter="pagination.filter" binary-state-sort>
      <template v-slot:top>
        <div class="col-12 row">
          <div class="col-xs-12 col-sm-5 col-md-4">
            <select-category :categories="categories" v-model:selected="pagination.categories" data-key="_id" data-all
                             :dense="$store.getters.dense.input" :labelTitle="$t('category.title_product')" :labelSelect="$t('category.select')"
                             :labelAll="$t('category.selectAll')" :labelClose="$t('global.cancel')" />
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
          <!-- <q-th auto-width>
            <q-checkbox v-if="props.multipleSelect" v-model="props.selected" indeterminate-value="some" :dense="$store.getters.dense.table" />
          </q-th> -->
          <q-th v-for="col in props.cols" :key="col.name" :props="props">
            <span v-if="$store.state.app.darkMode" class="text-bold">{{$t(col.label)}}</span>
            <span v-else class="text-bold text-blue-grey-10">{{$t(col.label)}}</span>
          </q-th>
        </q-tr>
      </template>
      <template v-slot:body="props">
        <q-tr :props="props">
          <!-- <q-td auto-width>
            <q-checkbox v-model="props.selected" color="primary" :dense="$store.getters.dense.table" />
          </q-td> -->
          <q-td key="title" :props="props">
            {{props.row.title}}
          </q-td>
          <q-td key="code" :props="props">
            {{props.row.code}}
          </q-td>
          <q-td key="quantityImport" :props="props">
            {{props.row.quantityImport.NumberFormat($store.getters.language)}}
            <!-- <q-badge v-html="props.row.unit" color="orange" transparent /> -->
          </q-td>
          <q-td key="priceImport" :props="props">
            {{props.row.priceImport.NumberFormat($store.getters.language)}}
            <!-- <q-badge v-html="props.row.price_unit" color="blue" transparent /> -->
          </q-td>
          <q-td key="price" :props="props">
            {{props.row.price.NumberFormat($store.getters.language)}}
            <!-- <q-badge v-html="props.row.price_unit" color="blue" transparent /> -->
          </q-td>
          <q-td key="priceDiscount" :props="props">
            {{props.row.priceDiscount.NumberFormat($store.getters.language)}}
            <!-- <q-badge v-html="props.row.price_unit" color="red" transparent /> -->
          </q-td>
          <q-td key="orders" :props="props">
            {{props.row.orders}}
          </q-td>
          <q-td auto-width key="status" :props="props">
            <i v-if="props.row.status" class="material-icons text-green">
              cloud_done
              <q-tooltip v-if="!$q.platform.is.mobile">{{$t('product.statusIn')}}</q-tooltip>
            </i>
            <i v-else class="material-icons text-orange">
              cloud_off
              <q-tooltip v-if="!$q.platform.is.mobile">{{$t('product.statusOut')}}</q-tooltip>
            </i>
          </q-td>
        </q-tr>
      </template>
    </q-table>
    <q-card-section class="text-center" v-else>
      <tm-load-files ref="tmLoadFiles" v-model:loading="isLoading" :button="true" :btnLabel="$t('files.openFile')" attachLabel="template"
                     :options="{header:2}" v-model:url="urlFile" :isUrl="isUrlFile" :labelFile="$t('files.chooseFile')"
                     :labelUrl="$t('files.inputUrl')" accept=".xls,.xlsx,.csv,.tsv,.txt,.json,.xml" @on-start="isLoading=true"
                     @on-finish="onLoadedFile" />
    </q-card-section>
  </q-card>
</template>

<script>
import { defineComponent, defineAsyncComponent, ref } from 'vue';
import { useStore } from 'vuex'
export default defineComponent({
  name: 'ProductComponentsLoadFile',
  components: {
    tmLoadFiles: defineAsyncComponent(() => import('components/tm-load-files')),
    selectCategory: defineAsyncComponent(() => import('pages/category/components/select-category'))
  },
  props: {
    dialog: { type: Boolean, default: false },
    maximized: { type: Boolean, default: false }
  },
  setup () {
    const $store = useStore()
    const isLoading = ref(false)
    const items = ref([])
    const categories = ref([])
    // selected: [],
    const pagination = ref({
      filter: '',
      sortBy: 'orders',
      descending: false,
      page: 1,
      rowsPerPage: 10,
      // rowsNumber: 1,
      categories: null,
      flag: 1
    })
    const visibleColumns = ref([])
    const columns = ref([
      { name: 'title', field: 'title', label: 'product.name', align: 'left', sortable: true, required: true }, // row => this.$t(`roles.${row.name}`)
      { name: 'code', field: 'code', label: 'product.code', align: 'left', sortable: true, required: true },
      { name: 'quantityImport', field: 'quantityImport', label: 'product.quantityImport', align: 'center', sortable: true, required: true },
      { name: 'priceImport', field: 'priceImport', label: 'product.priceImport', align: 'center', sortable: true, required: true },
      { name: 'price', field: 'price', label: 'product.priceSale', align: 'center', sortable: true },
      { name: 'priceDiscount', field: 'priceDiscount', label: 'product.priceDiscount', align: 'center', sortable: true },
      { name: 'orders', field: 'orders', label: 'global.order', align: 'right', sortable: true },
      { name: 'status', field: 'status', label: 'global.status', align: 'center', sortable: true, required: true }
    ])

    $store.dispatch('categories/get', { type: 'product', flag: 1, x: true, generate: true }).then((x) => { categories.value = x })

    return {
      isLoading, items, categories, pagination, visibleColumns, columns,
      onColumns (value) {
        var index = visibleColumns.value.indexOf(value)
        if (index < 0) visibleColumns.value.push(value)
        else visibleColumns.value.splice(index, 1)
      },
      onLoadedFile (data) {
        $store.dispatch('products/finds', data).then(x => {
          items.value = x
        })
      },
      onFinish () {
        emit('on-finish', items.value)
      }
    }
  }
})
</script>

<style>
</style>
