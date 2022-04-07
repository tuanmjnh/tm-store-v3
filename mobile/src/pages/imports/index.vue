<template>
  <q-card>
    <q-toolbar>
      <div class="col-auto">
        <q-btn flat dense icon="arrow_back" v-close-popup />
      </div>
      <q-toolbar-title class="text-subtitle1">{{$t('route.import')}}</q-toolbar-title>
      <q-btn icon="add" flat round dense color="blue" @click="isDialogAdd=!isDialogAdd" />
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
                  <q-icon v-else name="clear" class="cursor-pointer" @click="onFilter('')" />
                </template>
              </q-input>
            </div>
          </div>
        </q-menu>
      </q-btn>
    </q-toolbar>

    <q-card-section class="q-pt-none q-pb-none">
      <q-list separator id="scroll-items" class="scroll" style="height:calc(100vh - 99px)">
        <q-infinite-scroll ref="refScrollTarget" @load="onScrollLoad" :offset="250">
          <tm-swipeitem v-for="(e,i) in rows" :key="i" leftValue="max" rightValue="111" v-touch-hold.mouse="()=>{onTouchHold(e)}">
            <template v-slot:right>
              <q-btn-dropdown flat round dense color="indigo" icon="print" @click="onLoadDetails(e)">
                <q-list :dense="$store.getters.dense.form">
                  <q-item clickable v-close-popup @click="onPrinting('details')">
                    <q-item-section>
                      <q-item-label>
                        {{$t('product.printDetails')}}
                        <tm-printer ref="refPrinterDetails" hidden :title="`${$t('product.importBallotDetails')}-${e._id}`">
                          <template v-slot:content>
                            <view-details :title="$t('product.importBallotDetails')" :rows="detailsPrint"
                                          :total="e" color="secondary" :label="$t('product.printDetails')"
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
                        <tm-printer ref="refPrinterTotal" hidden :title="`${$t('product.importBallotDetails')}-${e._id}`">
                          <template v-slot:content>
                            <view-total :title="$t('product.importBallotTotal')" :total="e" color="blue"
                                        :label="$t('product.printTotal')" :labelDate="$t('product.importDate')" />
                          </template>
                        </tm-printer>
                      </q-item-label>
                    </q-item-section>
                  </q-item>
                </q-list>
              </q-btn-dropdown>
              <q-btn flat round dense icon="info" color="light-green" :size="$store.getters.dense.table?'sm':'md'" @click="onDetails(e)">
                <q-tooltip v-if="!$q.platform.is.mobile">{{$t('global.details')}}</q-tooltip>
              </q-btn>
            </template>
            <template v-slot:left>
              <q-item-section class="q-pl-lg q-pr-lg">
                <q-item-label caption lines="1">
                  <span>{{$t('warehouse.taxes')}}: </span>
                  <span class="text-red">
                    {{parseInt(e.prices*0.1).NumberFormat($store.getters.language)}}
                    <q-badge color="red" transparent>{{$store.getters.unitPrice}}</q-badge>
                  </span>
                </q-item-label>
                <q-item-label caption lines="1">
                  <span>{{$t('warehouse.totalize')}}: </span>
                  <span class="text-red">
                    {{parseInt(e.prices*1.1).NumberFormat($store.getters.language)}}
                    <q-badge color="red" transparent>{{$store.getters.unitPrice}}</q-badge>
                  </span>
                </q-item-label>
                <q-item-label caption lines="1">
                  <span>{{$t('global.createdAt')}}: </span>
                  <span class="text-blue">
                    {{e.createdAt?$moment(e.createdAt).format(`${$store.getters.format.date} HH:mm`):''}}
                  </span>
                </q-item-label>
              </q-item-section>
            </template>
            <q-separator v-if="i>0" />
            <q-item>
              <q-item-section>
                <q-item-label>{{e.code}}</q-item-label>
                <q-item-label caption lines="1">
                  <span>{{$t('warehouse.products')}}: </span>
                  <span class="text-blue">{{e.products}}</span>
                </q-item-label>
                <q-item-label caption lines="1">
                  <span>{{$t('warehouse.quantities')}}: </span>
                  <span class="text-green">{{parseInt(e.quantities).NumberFormat($store.getters.language)}}</span>
                </q-item-label>
                <q-item-label caption lines="1">
                  <span>{{$t('warehouse.prices')}}: </span>
                  <span class="text-red">
                    {{parseInt(e.prices).NumberFormat($store.getters.language)}}
                    <q-badge color="red" transparent>{{$store.getters.unitPrice}}</q-badge>
                  </span>
                </q-item-label>
              </q-item-section>
              <q-item-section side>
              </q-item-section>
            </q-item>
          </tm-swipeitem>
          <template v-slot:loading>
            <div class="row justify-center q-my-md">
              <q-spinner-dots color="primary" size="40px" />
            </div>
          </template>
        </q-infinite-scroll>
      </q-list>
    </q-card-section>
  </q-card>
  <!-- Dialog Add -->
  <q-dialog v-model="isDialogAdd" maximized>
    <add-item />
  </q-dialog>
  <!-- Details dialog -->
  <q-dialog v-model="isDialogDetails" maximized>
    <q-card flat :style="{minWidth:'60%'}">
      <q-toolbar>
        <div class="col-auto">
          <q-btn flat dense icon="arrow_back" v-close-popup></q-btn>
        </div>
        <span class="text-subtitle1">{{$t('product.importBallotDetails')}}</span>
      </q-toolbar>
      <q-separator />
      <!-- <q-scroll-area style="height:calc(100vh - 180px)"> -->
      <view-details :rows="detailsPrint" :total="totalPrint" color="secondary" :label="$t('product.printDetails')"
                    :labelDate="$t('product.importDate')" hidden-boot />
      <!-- </q-scroll-area> -->
    </q-card>
  </q-dialog>
  <!-- Dialog Actions -->
  <q-dialog v-model="isDialogTouchHold" position="bottom">
    <q-card class="full-width" style="border-radius:initial">
      <q-card-section class="q-pa-none">
        <q-list separator>
          <q-item clickable v-ripple class="text-center" @click="()=>{isDialogTouchHold=!isDialogTouchHold;onEdit()}">
            <q-item-section>{{$t('global.edit')}}</q-item-section>
          </q-item>
          <q-item clickable v-ripple class="text-center" @click="()=>{isDialogTouchHold=!isDialogTouchHold;onTrash()}">
            <q-item-section>
              <q-item-label v-if="pagination.flag" class="text-red">{{$t('global.trash')}}</q-item-label>
              <q-item-label v-else class="text-warning">{{$t('global.recover')}}</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
        <q-separator size="3px" />
        <q-list>
          <q-item clickable v-ripple class="text-center" v-close-popup>
            <q-item-section>
              <q-item-label>{{$t('global.cancel')}}</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script>
import { defineComponent, defineAsyncComponent, ref, computed } from "vue"
import { useStore } from 'vuex'
export default defineComponent({
  name: "ImportIndex",
  components: {
    addItem: defineAsyncComponent(() => import('./add')),
    tmSwipeitem: defineAsyncComponent(() => import('components/tm-swipe-item')),
    viewDetails: defineAsyncComponent(() => import('components/view-details')),
    viewTotal: defineAsyncComponent(() => import('components/view-total')),
    tmPrinter: defineAsyncComponent(() => import('components/tm-printer'))
  },
  setup () {
    const $store = useStore()
    const isDialogAdd = ref(false)
    const isDialogDetails = ref(false)
    const isDialogTouchHold = ref(false)
    const refScrollTarget = ref(null)
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
      return $store.dispatch('imports/get', opt.pagination).then(x => {
        pagination.value.rowsNumber = x.rowsNumber
        pagination.value.totalPage = Math.ceil(pagination.value.rowsNumber / pagination.value.rowsPerPage)
        // data.value = data.value.concat(x.data)
        return x.data
      })
    }
    if ($store.state.auth.token) {
      onFetch({ pagination: pagination.value }).then(x => data.value = x)
    }
    const LoadDetails = (id) => {
      $store.dispatch('imports/getSub', { key: id }).then((x) => {
        detailsPrint.value = x.data
      })
    }
    return {
      rows, selected, categories, pagination, isDialogAdd, isDialogDetails, isDialogTouchHold, refScrollTarget, isFilter,
      onFetch, refPrinterDetails, refPrinterTotal, detailsPrint, totalPrint,
      onFilter: (val) => {
        pagination.value.filter = val
        onFetch({ pagination: pagination.value }).then(x => { data.value = x })
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
          refPrinterDetails.value.onPrinting()
        } else if (type === 'total') {
          refPrinterTotal.value.onPrinting()
        }
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
      },
      onTouchHold (val) {
        if (val) selected.value = [val]
        isDialogTouchHold.value = !isDialogTouchHold.value
      }
    }
  }
})
</script>
