<template>
  <div>
    <q-table :rows="rows" :columns="columns" row-key="_id" flat :visible-columns="visibleColumns"
             :loading="$store.state.app.loading.get||$store.state.app.loading.patch" v-model:selected="selected"
             :dense="$store.getters.dense.table" selection="multiple" :no-data-label="$t('table.noData')"
             :rows-per-page-label="$t('table.rowPerPage')" :selected-rows-label="()=>`${selected.length} ${$t('table.rowSelected')}`"
             :rows-per-page-options="$store.state.app.rowsPerPageOptions" v-model:pagination="pagination" @request="onFetch"
             :filter="pagination.filter" binary-state-sort>
      <template v-slot:top="props">
        <div class="col-12 row">
          <div class="col-xs-12 col-sm-auto text-h6">{{$t('product.titleList')}}
          </div>
          <q-space />
          <div class="col-xs-12 col-sm-auto self-center text-right">
            <div class="col-auto self-center">
              <q-btn v-if="isRoutes.add" flat round dense icon="add" color="blue" @click="onAdd">
                <q-tooltip v-if="!$q.platform.is.mobile">{{$t('global.add')}}</q-tooltip>
              </q-btn>
              <q-btn v-if="isRoutes.trash&&selected.length>0&&pagination.flag" flat round dense
                     color="negative" icon="delete" @click="onTrash()">
                <q-tooltip v-if="!$q.platform.is.mobile">{{$t('global.delete')}}</q-tooltip>
              </q-btn>
              <q-btn v-if="isRoutes.trash&&selected.length>0&&!pagination.flag" flat round dense
                     color="warning" icon="restore_page" @click="onTrash()">
                <q-tooltip v-if="!$q.platform.is.mobile">{{$t('global.recover')}}</q-tooltip>
              </q-btn>
              <q-btn flat round dense :color="$store.state.app.darkMode?'':'grey-7'" icon="menu_open">
                <q-tooltip v-if="!$q.platform.is.mobile">{{$t('table.displayColumns')}}</q-tooltip>
                <q-menu fit>
                  <q-list dense style="min-width:100px">
                    <template v-for="(item,index) in columns">
                      <q-item clickable :key="index" v-if="!item.required" :active="visibleColumns.indexOf(item.name)>-1||false"
                              @click="onColumns(item.name)">
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
              <q-btn v-if="isRoutes.trash" flat round dense :color="$store.state.app.darkMode?'':'grey-7'" icon="more_vert">
                <q-tooltip v-if="!$q.platform.is.mobile">{{$t('table.action')}}</q-tooltip>
                <q-menu auto-close>
                  <q-list dense bordered>
                    <q-item clickable :active="pagination.flag===1">
                      <q-item-section no-wrap @click="onChangeFlag(1)">{{$t('global.working')}}</q-item-section>
                    </q-item>
                    <q-item clickable :active="pagination.flag===0">
                      <q-item-section no-wrap @click="onChangeFlag(0)">{{$t('global.locked')}}</q-item-section>
                    </q-item>
                  </q-list>
                </q-menu>
              </q-btn>
            </div>
          </div>
        </div>
        <div class="col-12 row">
          <div class="col-xs-12 col-sm-5 col-md-4">
            <select-category v-model="pagination.categories" :categories="categories" option-value="_id" option-label="label" data-all
                             :dense="$store.getters.dense.input" :labelTitle="$t('category.titleproduct')" :labelSelect="$t('category.select')"
                             :labelAll="$t('category.selectAll')" :labelClose="$t('global.cancel')" @on-selected="onSelectCategory" />
          </div>
          <q-space />
          <div class="col-xs-12 col-sm-5 col-md-4">
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
            <q-checkbox v-if="props.multipleSelect" v-model="props.selected" indeterminate-value="some" :dense="$store.getters.dense.table" />
          </q-th>
          <q-th v-for="col in props.cols" :key="col.name" :props="props">
            <span v-if="$store.state.app.darkMode" class="text-bold">{{$t(col.label)}}</span>
            <span v-else class="text-bold text-blue-grey-10">{{$t(col.label)}}</span>
          </q-th>
          <q-th v-if="isRoutes.edit||isRoutes.trash" auto-width>#</q-th>
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
            <div class="q-pr-xs flex inline">{{parseInt(props.row.quantity).NumberFormat($store.getters.language)}}</div>
            <q-badge v-html="props.row.unitName" color="orange" transparent />
          </q-td>
          <q-td key="price" :props="props">
            <div class="q-pr-xs flex inline">{{parseInt(props.row.price).NumberFormat($store.getters.language)}}</div>
            <q-badge v-html="props.row.priceUnitName" color="blue" transparent />
          </q-td>
          <q-td key="priceDiscount" :props="props">
            <div class="q-pr-xs flex inline">{{parseInt(props.row.priceDiscount).NumberFormat($store.getters.language)}}</div>
            <q-badge v-html="props.row.priceUnitName" color="red" transparent />
          </q-td>
          <q-td key="priceImport" :props="props">
            <div class="q-pr-xs flex inline">{{parseInt(props.row.priceImport).NumberFormat($store.getters.language)}}</div>
            <q-badge v-html="props.row.priceUnitName" color="teal" transparent />
          </q-td>
          <q-td key="priceExport" :props="props">
            <div class="q-pr-xs flex inline">{{parseInt(props.row.priceExport).NumberFormat($store.getters.language)}}</div>
            <q-badge v-html="props.row.priceUnitName" color="indigo" transparent />
          </q-td>
          <q-td key="order" :props="props">
            {{props.row.order}}
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
          <q-td v-if="isRoutes.edit||isRoutes.trash" auto-width class="text-center">
            <q-btn v-if="isRoutes.edit" flat round dense icon="edit" color="light-green" :size="$store.getters.dense.table?'sm':'md'"
                   @click="onEdit(props.row)">
              <q-tooltip v-if="!$q.platform.is.mobile">{{$t('global.update')}}</q-tooltip>
            </q-btn>
            <template v-if="isRoutes.trash">
              <q-btn v-if="pagination.flag" flat round dense color="negative" icon="clear" :size="$store.getters.dense.table?'sm':'md'"
                     @click="onTrash(props.row)">
                <q-tooltip v-if="!$q.platform.is.mobile">{{$t('global.lock')}}</q-tooltip>
              </q-btn>
              <q-btn v-else flat round dense color="amber" icon="restore" :size="$store.getters.dense.table?'sm':'md'" @click="onTrash(props.row)">
                <q-tooltip v-if="!$q.platform.is.mobile">{{$t('global.unlock')}}</q-tooltip>
              </q-btn>
            </template>
          </q-td>
        </q-tr>
      </template>
    </q-table>
    <!-- Add dialog -->
    <q-dialog v-model="isDialogAdd" :maximized="isMaximizedView" persistent>
      <q-card flat :style="{minWidth:'60%'}">
        <tpl-add v-model:dialog="isDialogAdd" v-model:maximized="isMaximizedView" />
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import { defineComponent, defineAsyncComponent, ref, computed } from 'vue';
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { useQuasar } from 'quasar'
import { useI18n } from 'vue-i18n'
export default defineComponent({
  name: 'ProductIndex',
  components: {
    tplAdd: defineAsyncComponent(() => import('./add')),
    selectCategory: defineAsyncComponent(() => import('pages/category/components/select-category'))
  },
  setup () {
    const $router = useRouter()
    const $store = useStore()
    const $q = useQuasar()
    const { t } = useI18n({ useScope: 'global' })
    const isDialogAdd = ref(false)
    const isMaximizedView = ref(false)
    const selected = ref([])
    const categories = ref([])
    // const pins = computed(() => $store.state.types.items.filter(x => x.key === 'pin_product'))
    // const units = computed(() => $store.state.types.items.filter(x => x.key === 'unit'))
    // const unitsPrice = computed(() => $store.state.types.items.filter(x => x.key === 'unit_price'))
    const isRoutes = ref({
      add: $router.hasRoute('product-list-add'),
      edit: $router.hasRoute('product-list-edit'),
      trash: $router.hasRoute('product-list-trash')
    })

    const pagination = ref({
      filter: '',
      sortBy: 'order',
      descending: false,
      page: 1,
      rowsPerPage: 10,
      rowsNumber: 1,
      categories: null,
      flag: 1
    })
    const visibleColumns = ref(['price', 'priceDiscount'])
    const columns = ref([
      { name: 'title', field: 'title', label: 'product.name', align: 'left', sortable: true, required: true }, // row => $t(`roles.${row.name}`)
      { name: 'code', field: 'code', label: 'product.code', align: 'left', sortable: true, required: true },
      { name: 'quantity', field: 'quantity', label: 'global.quantity', align: 'right', sortable: true, required: true },
      { name: 'price', field: 'price', label: 'product.priceSale', align: 'right', sortable: true },
      { name: 'priceDiscount', field: 'priceDiscount', label: 'product.priceDiscount', align: 'right', sortable: true },
      { name: 'priceImport', field: 'priceImport', label: 'product.priceImport', align: 'right', sortable: true },
      { name: 'priceExport', field: 'priceExport', label: 'product.priceExport', align: 'right', sortable: true },
      { name: 'order', field: 'order', label: 'global.order', align: 'right', sortable: true }
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
      isDialogAdd, isMaximizedView, rows, selected, categories, pagination, visibleColumns, columns, isRoutes, onFetch,
      // onGetUnits: (id) => {
      //   const rs = units.value.find(x => x._id = id)
      //   if (rs) return rs.name
      //   else return 'N/A'
      // },
      // onGetUnitsPrice: (id) => {
      //   const rs = unitsPrice.value.find(x => x._id = id)
      //   if (rs) return rs.name
      //   else return 'N/A'
      // },
      onSelectCategory: (val) => {
        if (val) onFetch({ pagination: pagination.value })
      },
      onChangeFlag: (val) => {
        if (val === pagination.value.flag) return
        selected.value = []
        pagination.value.flag = val
        onFetch({ pagination: pagination.value })
      },
      onColumns: (val) => {
        var i = visibleColumns.value.indexOf(val)
        if (i < 0) visibleColumns.value.push(val)
        else visibleColumns.value.splice(i, 1)
      },
      onAdd: () => {
        $store.dispatch('products/set')
        isMaximizedView.value = false
        if ($q.platform.is.mobile || !$store.state.app.isDialog.add) $router.push('add')
        else isDialogAdd.value = true
      },
      onEdit: (val) => {
        $store.dispatch('products/set', val)
        isMaximizedView.value = false
        if ($q.platform.is.mobile || !$store.state.app.isDialog.edit) $router.push({ path: 'edit', query: { id: val._id } })
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
