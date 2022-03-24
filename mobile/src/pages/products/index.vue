<template>
  <q-card>
    <q-card-section class="headder-row row">
      <div class="col-auto">
        <q-btn flat dense icon="arrow_back" v-close-popup></q-btn>
      </div>
      <span class="text-subtitle1">{{$t('route.product')}}</span>
      <q-space />
      <q-btn icon="add" flat round dense color="blue" @click="onAdd" />
      <q-btn icon="filter_list" flat round dense color="teal">
        <q-tooltip v-if="!$q.platform.is.mobile">{{$t('global.filter')}}</q-tooltip>
        <q-menu v-model="isFilter" class="q-pa-md">
          <!-- <div class="q-pa-md"> -->
          <div class="row">
            <div class="col-12">
              <q-input v-model="pagination.filter" :dense="$store.getters.dense.input" debounce="500" :placeholder="$t('global.search')"
                       @update:model-value="onFilter">
                <template v-slot:append>
                  <q-icon v-if="pagination.filter===''" name="search" />
                  <q-icon v-else name="clear" class="cursor-pointer" @click="pagination.filter=''" />
                </template>
              </q-input>
            </div>
          </div>
          <div class="row">
            <div class="col-12">
              <select-category v-model="pagination.categories" :categories="categories" option-value="_id" option-label="label" data-all maximized
                               :dense="$store.getters.dense.input" :labelTitle="$t('category.titleproduct')" :labelSelect="$t('category.select')"
                               :labelAll="$t('category.selectAll')" :labelClose="$t('global.cancel')" @on-selected="onSelectCategory"
                               @onCancel="isFilter=false" />
            </div>
          </div>
        </q-menu>
      </q-btn>
    </q-card-section>
    <!-- <q-separator /> -->
    <q-card-section class="q-pa-none">
      <!-- <q-scroll-area style="height:calc(100vh - 99px)"> -->
      <q-list separator ref="refListTarget" id="scroll-items" class="scroll" style="height:calc(100vh - 99px)">
        <q-infinite-scroll ref="refScrollTarget" @load="onScrollLoad" :offset="250" :scroll-target="refListTarget">
          <tm-swipeitem v-for="e in rows" :key="e._id" leftValue="max" rightValue="111">
            <template v-slot:right>
              <q-btn no-caps class="q-btn--square" @click="onEdit(e)">
                <q-icon name="edit" color="blue" size="18px" />
              </q-btn>
              <q-btn no-caps class="q-btn--square" @click="onTrash(e)">
                <q-icon name="clear" color="negative" size="18px" />
              </q-btn>
            </template>
            <template v-slot:left>
              <q-item-section class="q-pl-lg q-pr-lg">
                <q-item-label>{{e.title}}</q-item-label>
                <q-item-label caption lines="1">
                  <span>{{$t('global.code')}}: </span>
                  <span class="text-blue">{{e.code}}</span>
                </q-item-label>
                <q-item-label caption lines="1">
                  <span>{{$t('global.quantity')}}: </span>
                  <span class="text-green">{{parseInt(e.quantity).NumberFormat($store.getters.language)}}</span>
                </q-item-label>
                <q-item-label caption lines="1">
                  <span>{{$t('product.priceSale')}}: </span>
                  {{parseInt(e.price).NumberFormat($store.getters.language)}}
                  <q-badge color="red" transparent>{{$store.getters.unitPrice}}</q-badge>
                </q-item-label>
                <q-item-label caption lines="1">
                  <span>{{$t('product.priceImport')}}: </span>
                  <span class="text-purple">
                    {{parseInt(e.priceImport).NumberFormat($store.getters.language)}}
                    <q-badge color="red" transparent>{{$store.getters.unitPrice}}</q-badge>
                  </span>
                </q-item-label>
              </q-item-section>
            </template>
            <q-item>
              <q-item-section avatar>
                <q-avatar rounded size="42px">
                  <!-- <img src="https://cdn.quasar.dev/img/avatar2.jpg"> -->
                  <q-icon color="primary" name="insert_photo" />
                </q-avatar>
              </q-item-section>
              <q-item-section>
                <q-item-label>{{e.title}}</q-item-label>
                <q-item-label caption lines="1">
                  <!-- <span>{{$t('category.title')}}: </span> -->
                  <span class="text-orange">{{e.categories}}</span>
                </q-item-label>
                <q-item-label caption lines="1">
                  <span>{{$t('global.code')}}: </span>
                  <span class="text-blue">{{e.code}}</span>
                </q-item-label>
                <q-item-label caption lines="1">
                  <span>{{$t('global.quantity')}}: </span>
                  <span class="text-green">{{parseInt(e.quantity).NumberFormat($store.getters.language)}}</span>
                </q-item-label>
                <q-item-label caption lines="1">
                  <span>{{$t('product.priceSale')}}: </span>
                  <span class="text-red">
                    {{parseInt(e.price).NumberFormat($store.getters.language)}}
                    <q-badge color="red" transparent>{{$store.getters.unitPrice}}</q-badge>
                  </span>
                </q-item-label>
              </q-item-section>
              <q-item-section side>
                {{e.orders}}
              </q-item-section>
            </q-item>
            <q-separator />
          </tm-swipeitem>
          <!-- <tm-swipeitem v-for="e in rows" :key="e._id" :translateXValue="111">
            <template v-slot:right>
              <q-btn no-caps class="q-btn--square" @click="onEdit(e)">
                <q-icon name="edit" color="blue" size="18px" />
              </q-btn>
              <q-btn no-caps class="q-btn--square" @click="onTrash(e)">
                <q-icon name="clear" color="negative" size="18px" />
              </q-btn>
            </template>
            <q-item clickable v-ripple>
              <q-item-section>
                <q-item-label>{{e.name}}</q-item-label>
                <q-item-label caption lines="1">{{`${$t('global.code')}: ${e.code}`}}</q-item-label>
              </q-item-section>
              <q-item-section side>
                {{e.orders}}
              </q-item-section>
            </q-item>
          </tm-swipeitem> -->
          <template v-slot:loading>
            <div class="row justify-center q-my-md">
              <q-spinner-dots color="primary" size="40px" />
            </div>
          </template>
        </q-infinite-scroll>
      </q-list>
      <!-- </q-scroll-area> -->
    </q-card-section>
  </q-card>
  <!-- Dialog Add -->
  <q-dialog v-model="isDialogAdd" :maximized="isMaximized">
    <add-item />
  </q-dialog>
</template>

<script>
import { defineComponent, defineAsyncComponent, ref, computed, onBeforeMount } from "vue";
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { useQuasar } from 'quasar'
import { useI18n } from 'vue-i18n'
import { normalize } from '../../../../global/utils/search'
export default defineComponent({
  name: "ProductIndex",
  components: {
    tmSwipeitem: defineAsyncComponent(() => import('components/tm-swipe-item')),
    addItem: defineAsyncComponent(() => import('./add')),
    selectCategory: defineAsyncComponent(() => import('pages/category/components/select-category'))
  },
  setup () {
    const $router = useRouter()
    const $store = useStore()
    const $q = useQuasar()
    const { t } = useI18n({ useScope: 'global' })
    const isDialogAdd = ref(false)
    const isMaximized = ref(true)
    const refScrollTarget = ref(null)
    const refListTarget = ref(null)
    const isFilter = ref(false)
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
      page: 1,
      rowsPerPage: 15,
      rowsNumber: 1,
      totalPage: 1,
      sortBy: 'order',
      descending: false,
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
    const data = ref([])
    const rows = computed(() => data.value)
    const onFetch = (opt) => {
      const { page, rowsPerPage, sortBy, descending, categories } = opt.pagination
      if (opt.scroll) pagination.value.page = page
      else {
        if (refScrollTarget.value) {
          document.getElementById('scroll-items').scroll(0, 0)
          refScrollTarget.value.reset()
        }
        pagination.value.page = 1
      }
      pagination.value.rowsPerPage = rowsPerPage
      pagination.value.sortBy = sortBy
      pagination.value.categories = categories
      pagination.value.descending = descending
      return $store.dispatch('products/get', opt.pagination).then(x => {
        pagination.value.rowsNumber = x.rowsNumber
        pagination.value.totalPage = Math.ceil(pagination.value.rowsNumber / pagination.value.rowsPerPage)
        // data.value = data.value.concat(x.data)
        return x.data
      })
    }
    if ($store.state.auth.token) {
      onFetch({ pagination: pagination.value }).then(x => data.value = x)
      $store.dispatch('categories/get', { type: 'product', flag: 1, x: true, generate: true }).then((x) => { categories.value = x })
    }
    return {
      isDialogAdd, isMaximized, refListTarget, refScrollTarget, isFilter, rows, selected, categories, pagination, visibleColumns, columns, isRoutes, onFetch,
      onSelectCategory: (val) => {
        if (val) onFetch({ pagination: pagination.value }).then(x => {
          data.value = x
          isFilter.value = false
        })
      },
      onFilter: (val) => {
        if (val) onFetch({ pagination: pagination.value }).then(x => {
          data.value = x
          // isFilter.value = false
        })
      },
      onChangeFlag: (val) => {
        if (val === pagination.value.flag) return
        selected.value = []
        pagination.value.flag = val
        onFetch({ pagination: pagination.value }).then(x => data.value = x)
      },
      onColumns: (val) => {
        var i = visibleColumns.value.indexOf(val)
        if (i < 0) visibleColumns.value.push(val)
        else visibleColumns.value.splice(i, 1)
      },
      onAdd: () => {
        $store.dispatch('products/set')
        isDialogAdd.value = true
      },
      onEdit: (val) => {
        $store.dispatch('products/set', val)
        isDialogAdd.value = true
      },
      onTrash (val) {
        $q.dialog({
          title: t('messageBox.warning'),
          message: pagination.value.flag ? t('messageBox.lock') : t('messageBox.unlock'),
          cancel: true,
          ok: {
            label: t('global.accept'),
            flat: true,
            color: 'primary',
            noCaps: true
          },
          cancel: {
            label: t('global.cancel'),
            flat: true,
            color: 'blue-grey',
            noCaps: true
          }
        }).onOk(() => {
          if (val) selected.value = [val]
          $store.dispatch('products/patch', { _id: selected.value.map(x => x._id) }).then(x => { selected.value = [] })
        })
      },
      onScrollLoad (index, done) {
        pagination.value.page = index + 1
        if (pagination.value.page <= pagination.value.totalPage)
          onFetch({ pagination: pagination.value, scroll: true }).then(x => {
            data.value = data.value.concat(x)
            done()
          })
        else {
          done()
        }
      }
    }
  }
})
</script>
