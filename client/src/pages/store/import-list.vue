<template>
  <div>
    <q-table :rows="rows" :columns="columns" row-key="_id" flat :visible-columns="visibleColumns"
             :loading="$store.state.app.loading.get||$store.state.app.loading.patch" v-model:selected="selected"
             :dense="$store.getters.dense.table" selection="multiple" :no-data-label="$t('table.noData')"
             :no-results-label="$t('table.noFilterData')" :rows-per-page-label="$t('table.rowPerPage')"
             :selected-rows-label="()=>`${selected.length} ${$t('table.rowSelected')}`"
             :rows-per-page-options="$store.state.app.rowsPerPageOptions" v-model:pagination="pagination"
             @request="onFetch" :filter="pagination.filter" binary-state-sort>
      <template v-slot:top="props">
        <div class="col-12 row">
          <div class="col-xs-12 col-sm-auto q-table__title text-h6">{{$t('product.warehouse')}}
          </div>
          <q-space />
          <div class="col-xs-12 col-sm-auto self-center row">
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
              </q-menu>
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
          <q-td key="code" :props="props">
            {{props.row.code}}
          </q-td>
          <q-td key="products" :props="props">
            <div class="q-pr-xs flex inline">{{props.row.products.NumberFormat($store.getters.language)}}</div>
            <!-- <q-badge v-html="props.row.unitName" color="orange" transparent /> -->
          </q-td>
          <q-td key="quantities" :props="props">
            <div class="q-pr-xs flex inline">{{props.row.quantities.NumberFormat($store.getters.language)}}</div>
            <!-- <q-badge v-html="props.row.priceUnitName" color="teal" transparent /> -->
          </q-td>
          <q-td key="taxes" :props="props">
            <div class="q-pr-xs flex inline">{{props.row.taxes.NumberFormat($store.getters.language)}}</div>
            <!-- <q-badge v-html="props.row.priceUnitName" color="red" transparent /> -->
          </q-td>
          <q-td key="prices" :props="props">
            <div class="q-pr-xs flex inline">{{props.row.prices.NumberFormat($store.getters.language)}}</div>
            <!-- <q-badge v-html="props.row.priceUnitName" color="teal" transparent /> -->
          </q-td>
          <q-td key="totalize" :props="props">
            <div class="q-pr-xs flex inline">{{(props.row.prices+props.row.taxes).NumberFormat($store.getters.language)}}</div>
            <!-- <q-badge v-html="props.row.priceUnitName" color="teal" transparent /> -->
          </q-td>
          <q-td key="totalize" :props="props" auto-width class="text-center">
            <q-btn-dropdown flat round dense color="indigo" icon="print">
              <q-list :dense="$store.getters.dense.form">
                <q-item clickable v-close-popup @click="onPrinting('details')">
                  <q-item-section>
                    <q-item-label>
                      {{$t('product.printDetails')}}
                      <printer-details ref="refPrinterDetails" :title="$t('product.importBallotDetails')" :rows="[]"
                                       :total="props.row" color="secondary" :label="$t('product.printDetails')"
                                       :labelDate="$t('product.importDate')" />
                    </q-item-label>
                  </q-item-section>
                </q-item>
                <q-item clickable v-close-popup @click="onPrinting('total')">
                  <q-item-section>
                    <q-item-label>
                      {{$t('product.importBallotTotal')}}
                      <printer-total ref="refPrinterTotal" :title="$t('product.importBallotTotal')" :total="props.row" color="blue"
                                     :label="$t('product.printTotal')" :labelDate="$t('product.importDate')" />
                    </q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>
            </q-btn-dropdown>
            <q-btn flat round dense icon="info" color="light-green"
                   :size="$store.getters.dense.table?'sm':'md'" @click="onDetails(props.row)">
              <q-tooltip v-if="!$q.platform.is.mobile">{{$t('global.details')}}</q-tooltip>
            </q-btn>
          </q-td>
        </q-tr>
      </template>
    </q-table>
    <!-- Add dialog -->
    <q-dialog v-model="isDialogAdd" :maximized="isMaximizedView" persistent>
      <q-card flat :style="{minWidth:'60%'}">
        <!-- <tpl-add v-model:dialog="isDialogAdd" v-model:maximized="isMaximizedView" /> -->
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import { defineComponent, defineAsyncComponent, ref, computed } from 'vue';
import { useStore } from 'vuex'
import { useQuasar } from 'quasar'
import { useI18n } from 'vue-i18n'
export default defineComponent({
  name: 'ImportList',
  components: {
    printerDetails: defineAsyncComponent(() => import('./components/printer-details')),
    printerTotal: defineAsyncComponent(() => import('./components/printer-total'))
  },
  setup () {
    const $store = useStore()
    const $q = useQuasar()
    const { t } = useI18n({ useScope: 'global' })
    const isDialogAdd = ref(false)
    const isMaximizedView = ref(false)
    const isFilter = ref(false)
    const selected = ref([])
    const categories = ref([])
    const refPrinterDetails = ref(null)
    const refPrinterTotal = ref(null)
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
    const visibleColumns = ref(['products'])
    const columns = ref([
      { name: 'code', field: 'code', label: 'store.code', align: 'left', sortable: true, required: true },
      { name: 'products', field: 'products', label: 'store.products', align: 'right', sortable: true },
      { name: 'quantities', field: 'quantities', label: 'store.quantities', align: 'right', sortable: true, required: true },
      { name: 'taxes', field: 'taxes', label: 'store.taxes', align: 'right', sortable: true, required: true },
      { name: 'prices', field: 'prices', label: 'store.prices', align: 'right', sortable: true, required: true },
      { name: 'totalize', field: 'totalize', label: 'store.totalize', align: 'right', sortable: true, required: true }
      // { name: 'cmd', field: 'cmd', label: '#', align: 'center', required: true }
    ])

    const rows = computed(() => $store.state.store.importItems || [])
    const onFetch = (props) => {
      const { page, rowsPerPage, sortBy, descending, categories } = props.pagination
      $store.dispatch('store/importsGet', props.pagination).then(x => {
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
      rows, selected, categories, pagination, visibleColumns, refPrinterDetails, refPrinterTotal, columns, isDialogAdd, isMaximizedView, isFilter, onFetch,
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
      onDetails (val) {
        console.log(val)
      },
      onPrinting (type) {
        if (type === 'details') {
          refPrinterDetails.value.onPrinting()
        } else if (type === 'total') {
          refPrinterTotal.value.onPrinting()
        }
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