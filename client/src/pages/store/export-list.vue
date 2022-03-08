<template>
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
          <q-btn flat round dense icon="add" color="blue" @click="$router.push('export')">
            <q-tooltip v-if="!$q.platform.is.mobile">{{$t('global.add')}}</q-tooltip>
          </q-btn>
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
        <q-td auto-width key="code" :props="props">
          {{props.row._id}}
        </q-td>
        <q-td key="products" :props="props">
          <div class="q-pr-xs flex inline">{{parseInt(props.row.products).NumberFormat($store.getters.language)}}</div>
          <!-- <q-badge v-html="props.row.unitName" color="orange" transparent /> -->
        </q-td>
        <q-td key="quantities" :props="props">
          <div class="q-pr-xs flex inline">{{parseInt(props.row.quantities).NumberFormat($store.getters.language)}}</div>
          <!-- <q-badge v-html="props.row.priceUnitName" color="teal" transparent /> -->
        </q-td>
        <q-td key="prices" :props="props">
          <div class="q-pr-xs flex inline">{{parseInt(props.row.prices).NumberFormat($store.getters.language)}}</div>
          <!-- <q-badge v-html="props.row.priceUnitName" color="blue" transparent /> -->
        </q-td>
        <q-td key="taxes" :props="props">
          <div class="q-pr-xs flex inline">{{parseInt(props.row.prices*0.1).NumberFormat($store.getters.language)}}</div>
          <!-- <q-badge v-html="props.row.priceUnitName" color="red" transparent /> -->
        </q-td>
        <q-td key="totalize" :props="props">
          <div class="q-pr-xs flex inline">{{parseInt(props.row.prices*1.1).NumberFormat($store.getters.language)}}</div>
          <!-- <q-badge v-html="props.row.priceUnitName" color="green" transparent /> -->
        </q-td>
        <q-td key="createdAt" :props="props">
          <div class="q-pr-xs flex inline">
            {{props.row.createdAt?$moment(props.row.createdAt).format(`${$store.getters.format.date} HH:mm`):''}}
          </div>
          <!-- <q-badge v-html="props.row.priceUnitName" color="teal" transparent /> -->
        </q-td>
        <q-td key="totalize" :props="props" auto-width class="text-center">
          <q-btn-dropdown flat round dense color="indigo" icon="print" @click="onLoadDetails(props.row)">
            <q-list :dense="$store.getters.dense.form">
              <q-item clickable v-close-popup @click="onPrinting('details')">
                <q-item-section>
                  <q-item-label>
                    {{$t('product.printDetails')}}
                    <tm-printer ref="refPrinterDetails" hidden :title="$t('product.exportBallotDetails')">
                      <template v-slot:content>
                        <view-details :title="$t('product.exportBallotDetails')" :rows="detailsPrint"
                                      :total="props.row" color="secondary" :label="$t('product.printDetails')"
                                      :labelDate="$t('product.importDate')" />
                      </template>
                    </tm-printer>
                  </q-item-label>
                </q-item-section>
              </q-item>
              <q-item clickable v-close-popup @click="onPrinting('total')">
                <q-item-section>
                  <q-item-label>
                    {{$t('product.printTotal')}}
                    <tm-printer ref="refPrinterTotal" hidden :title="$t('product.exportBallotDetails')">
                      <template v-slot:content>
                        <view-total :title="$t('product.exportBallotTotal')" :total="props.row" color="blue"
                                    :label="$t('product.printTotal')" :labelDate="$t('product.importDate')" />
                      </template>
                    </tm-printer>
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
  <!-- Details dialog -->
  <q-dialog v-model="isDialogDetails" :maximized="isMaximizedView">
    <q-card flat :style="{minWidth:'60%'}">
      <q-toolbar>
        <q-avatar :icon="$route.meta.icon" size="50px" />
        <q-toolbar-title>{{$t('product.exportBallotDetails')}}</q-toolbar-title>
        <q-btn v-if="isDialogDetails" flat round dense :color="$store.state.app.darkMode?'':'grey-7'"
               :icon="isMaximizedView?'fullscreen_exit':'fullscreen'" :disable="$store.state.app.loading.post||$store.state.app.loading.put"
               @click="isMaximizedView=!isMaximizedView">
          <q-tooltip>
            {{isMaximizedView?$t('global.normalScreen'):$t('global.fullScreen')}}
          </q-tooltip>
        </q-btn>
        <q-btn flat round dense icon="close" v-close-popup>
          <q-tooltip v-if="!$q.platform.is.mobile">{{$t('global.cancel')}}</q-tooltip>
        </q-btn>
      </q-toolbar>
      <q-separator />
      <q-scroll-area style="height:calc(100vh - 180px)">
        <view-details :rows="detailsPrint" :total="totalPrint" color="secondary" :label="$t('product.printDetails')"
                      :labelDate="$t('product.importDate')" hidden-boot />
      </q-scroll-area>
    </q-card>
  </q-dialog>
</template>

<script>
import { defineComponent, defineAsyncComponent, ref, computed } from 'vue';
import { useStore } from 'vuex'
import { useQuasar } from 'quasar'
import { useI18n } from 'vue-i18n'
export default defineComponent({
  name: 'ExportList',
  components: {
    viewDetails: defineAsyncComponent(() => import('./components/view-details')),
    viewTotal: defineAsyncComponent(() => import('./components/view-total')),
    tmPrinter: defineAsyncComponent(() => import('components/tm-printer'))
  },
  setup () {
    const $store = useStore()
    const $q = useQuasar()
    const { t } = useI18n({ useScope: 'global' })
    const isDialogDetails = ref(false)
    const isMaximizedView = ref(false)
    const isFilter = ref(false)
    const selected = ref([])
    const categories = ref([])
    const refPrinterDetails = ref(null)
    const refPrinterTotal = ref(null)
    const detailsPrint = ref([])
    const totalPrint = ref([])
    const pagination = ref({
      filter: '',
      sortBy: 'createdAt',
      descending: true,
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
      { name: 'prices', field: 'prices', label: 'store.prices', align: 'right', sortable: true, required: true },
      { name: 'taxes', field: 'taxes', label: 'store.taxes', align: 'right', sortable: true, required: true },
      { name: 'totalize', field: 'totalize', label: 'store.totalize', align: 'right', sortable: true, required: true },
      { name: 'createdAt', field: 'createdAt', label: 'global.createdAt', align: 'right', sortable: true, required: true }
    ])

    const rows = computed(() => $store.state.store.exportItems || [])
    const onFetch = (props) => {
      const { page, rowsPerPage, sortBy, descending, categories } = props.pagination
      $store.dispatch('store/exportGet', props.pagination).then(x => {
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

    const LoadDetails = (id) => {
      $store.dispatch('store/exportGetDetail', { key: id }).then((x) => {
        detailsPrint.value = x.data
      })
    }
    return {
      rows, selected, categories, pagination, visibleColumns, columns, isDialogDetails, isMaximizedView, isFilter,
      onFetch, refPrinterDetails, refPrinterTotal, detailsPrint, totalPrint,
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
        LoadDetails(val._id)
        totalPrint.value = val
        isDialogDetails.value = true
      },
      onLoadDetails (val) {
        LoadDetails(val._id)
      },
      onPrinting (type) {
        if (type === 'details') {
          // refPrinterDetails.value.onExc({
          //   title: `${props.title}-${props.total._id}`
          //   // styles: '<link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Material+Icons"/>'
          // })
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
