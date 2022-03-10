<template>
  <q-card flat>
    <q-toolbar>
      <q-toolbar-title>{{$t('product.warehouse')}}</q-toolbar-title>
      <q-chip v-if="isRoutes.add" clickable square icon="playlist_add" color="indigo" text-color="white" @click="$router.push('import')">
        {{$t('product.import')}}</q-chip>
      <q-chip v-if="isRoutes.add" clickable square icon="double_arrow" color="green" text-color="white" @click="$router.push('export')">
        {{$t('product.export')}}</q-chip>
      <q-btn v-if="isRoutes.add" flat dense no-caps color="blue" class="q-ml-sm" :label="$t('global.add')"
             @click="onAdd">
      </q-btn>
    </q-toolbar>
    <q-separator />
    <q-form ref="form">
      <q-table :rows="rows" :columns="columns" row-key="_id" flat :visible-columns="visibleColumns"
               :loading="$store.state.app.loading.get||$store.state.app.loading.patch" v-model:selected="selected"
               :dense="$store.getters.dense.table" selection="multiple" :no-data-label="$t('table.noData')"
               :no-results-label="$t('table.noFilterData')" :rows-per-page-label="$t('table.rowPerPage')"
               :selected-rows-label="()=>`${selected.length} ${$t('table.rowSelected')}`"
               :rows-per-page-options="$store.state.app.rowsPerPageOptions" v-model:pagination="pagination"
               @request="onFetch" :filter="pagination.filter" binary-state-sort>
        <template v-slot:top="props">
          <div class="col-12 text-right">
            <q-btn icon="filter_list" flat round dense color="teal">
              <q-tooltip v-if="!$q.platform.is.mobile">{{$t('global.filter')}}</q-tooltip>
              <q-menu v-model="isFilter" class="q-pa-sm">
                <!-- <div class="q-pa-md"> -->
                <div class="row no-wrap q-pb-sm q-pl-md q-pr-md" style="min-width:300px">
                  <div class="col-12">
                    <q-input v-model="pagination.filter" :dense="$store.getters.dense.input" debounce="500" :placeholder="$t('global.search')">
                      <template v-slot:append>
                        <q-icon v-if="pagination.filter===''" name="search" />
                        <q-icon v-else name="clear" class="cursor-pointer" @click="pagination.filter=''" />
                      </template>
                    </q-input>
                  </div>
                </div>
                <div class="row no-wrap q-pl-md q-pr-md">
                  <div class="col-12">
                    <select-category v-model="pagination.categories" :categories="categories" option-value="_id" option-label="label" data-all
                                     :dense="$store.getters.dense.input" :labelTitle="$t('category.titleproduct')"
                                     :labelSelect="$t('category.select')" :labelAll="$t('category.selectAll')" :labelClose="$t('global.cancel')"
                                     @on-selected="onSelectCategory" />
                  </div>
                </div>
              </q-menu>
            </q-btn>
            <q-btn v-if="isRoutes.trash&&selected.length>0&&!pagination.flag" flat round dense color="warning" icon="restore_page"
                   @click="onTrash()">
              <q-tooltip v-if="!$q.platform.is.mobile">{{$t('global.recover')}}</q-tooltip>
            </q-btn>
            <q-btn flat round dense :color="$store.state.app.darkMode?'':'grey-7'" icon="menu_open">
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
            <q-btn flat round dense :color="$store.state.app.darkMode?'':'grey-7'" :icon="props.inFullscreen?'fullscreen_exit':'fullscreen'"
                   @click="props.toggleFullscreen">
              <q-tooltip v-if="!$q.platform.is.mobile">{{props.inFullscreen?$t('global.normalScreen'):$t('global.fullScreen')}}</q-tooltip>
            </q-btn>
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
            <q-td key="priceImport" :props="props">
              <div class="q-pr-xs flex inline">{{props.row.priceImport.NumberFormat($store.getters.language)}}</div>
              <q-badge v-html="props.row.priceUnitName" color="teal" transparent />
            </q-td>
            <q-td key="priceExport" :props="props">
              <div class="q-pr-xs flex inline">{{props.row.priceExport.NumberFormat($store.getters.language)}}</div>
              <q-badge v-html="props.row.priceUnitName" color="teal" transparent />
            </q-td>
            <q-td key="price" :props="props">
              <div class="q-pr-xs flex inline">{{props.row.price.NumberFormat($store.getters.language)}}</div>
              <q-badge v-html="props.row.priceUnitName" color="blue" transparent />
            </q-td>
            <q-td key="priceDiscount" :props="props">
              <div class="q-pr-xs flex inline">{{props.row.priceDiscount.NumberFormat($store.getters.language)}}</div>
              <q-badge v-html="props.row.priceUnitName" color="red" transparent />
            </q-td>
          </q-tr>
        </template>
      </q-table>
    </q-form>
    <!-- Add dialog -->
    <q-dialog v-model="isDialogAdd" :maximized="isMaximizedView" persistent>
      <q-card flat :style="{minWidth:'60%'}">
        <tpl-add v-model:dialog="isDialogAdd" v-model:maximized="isMaximizedView" />
      </q-card>
    </q-dialog>
  </q-card>
</template>

<script>
import { defineComponent, defineAsyncComponent, ref, computed } from 'vue';
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { useQuasar } from 'quasar'
import { useI18n } from 'vue-i18n'
export default defineComponent({
  name: 'StoreIndex',
  components: {
    tplAdd: defineAsyncComponent(() => import('pages/products/add')),
    selectCategory: defineAsyncComponent(() => import('pages/category/components/select-category'))
  },
  setup () {
    const $router = useRouter()
    const $store = useStore()
    const $q = useQuasar()
    const { t } = useI18n({ useScope: 'global' })
    const isDialogAdd = ref(false)
    const isMaximizedView = ref(false)
    const isFilter = ref(false)
    const selected = ref([])
    const categories = ref([])
    const pins = computed(() => $store.state.types.items.filter(x => x.key === 'pin_product').map(x => { return { label: x.name, value: x.code } }))
    const unitsSource = computed(() => $store.state.types.items.filter(x => x.key === 'unit'))
    const unitsPriceSource = computed(() => $store.state.types.items.filter(x => x.key === 'unit_price'))
    const units = ref(unitsSource.value)
    const unitsPrice = ref(unitsPriceSource.value)
    const isRoutes = ref({
      add: $router.hasRoute('product-list-add'),
      edit: $router.hasRoute('product-list-edit'),
      trash: $router.hasRoute('product-list-trash')
    })
    const pagination = ref({
      filter: '',
      sortBy: 'quantity',
      descending: false,
      page: 1,
      rowsPerPage: 10,
      rowsNumber: 1,
      categories: null,
      flag: 1
    })
    const visibleColumns = ref(['priceImport', 'priceExport'])
    const columns = ref([
      { name: 'title', field: 'title', label: 'product.name', align: 'left', sortable: true, required: true }, // row => this.$t(`roles.${row.name}`)
      { name: 'code', field: 'code', label: 'product.code', align: 'left', sortable: true, required: true },
      { name: 'quantity', field: 'quantity', label: 'product.quantityStore', align: 'right', sortable: true, required: true },
      { name: 'priceImport', field: 'priceImport', label: 'product.priceImport', align: 'right', sortable: true },
      { name: 'priceExport', field: 'priceExport', label: 'product.priceExport', align: 'right', sortable: true },
      { name: 'price', field: 'price', label: 'product.priceSale', align: 'right', sortable: true },
      { name: 'priceDiscount', field: 'priceDiscount', label: 'product.priceDiscount', align: 'right', sortable: true }
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
    if ($store.state.auth.token) {
      onFetch({ pagination: pagination.value })
      $store.dispatch('categories/get', { type: 'product', flag: 1, x: true, generate: true }).then((x) => { categories.value = x })
    }
    return {
      rows, selected, categories, pins, units, unitsPrice, pagination, visibleColumns, columns,
      isRoutes, isDialogAdd, isMaximizedView, isFilter, onFetch,
      onSelectCategory (val) {
        isFilter.value = false
        if (val) onFetch({ pagination: pagination.value })
      },
      onChangeFlag (val) {
        if (val === pagination.value.flag) return
        selected.value = []
        pagination.value.flag = val
        onFetch({ pagination: pagination.value })
      },
      onColumns (val) {
        var i = visibleColumns.value.indexOf(val)
        if (i < 0) visibleColumns.value.push(val)
        else visibleColumns.value.splice(i, 1)
      },
      onAdd () {
        $store.dispatch('products/set')
        isMaximizedView.value = false
        if ($q.platform.is.mobile || !$store.state.app.isDialog.add) $router.push('/product/list/add')
        else isDialogAdd.value = true
      },
      onTrash (val) {
        $q.dialog({
          title: t('messageBox.warning'),
          message: pagination.value.enable ? t('messageBox.lock') : t('messageBox.unlock'),
          cancel: true,
          persistent: true
        }).onOk(() => {
          if (val) selected.value = [val]
          $store.dispatch('products/patch', { _id: selected.value.map(x => x._id) }).then(x => { selected.value = [] })
        })
      }
    }
  }
})
</script>

<style>
</style>
