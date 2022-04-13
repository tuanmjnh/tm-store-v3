<template>
  <q-card>
    <q-toolbar>
      <div class="col-auto">
        <q-btn flat dense icon="arrow_back" v-close-popup />
      </div>
      <q-toolbar-title class="text-subtitle1">{{$t('product.select')}}</q-toolbar-title>
      <q-btn icon="done" flat round dense color="blue" :disable="!selected||selected.length<1" @click="onSubmit" />
    </q-toolbar>
    <q-card-section class="q-pt-none">
      <div class="row">
        <div class="col-5">
          <q-input v-model="pagination.filter" :dense="$store.getters.dense.input" debounce="500" :placeholder="$t('product.select')"
                   @update:model-value="onFilter">
            <template v-slot:append>
              <q-icon v-if="pagination.filter===''" name="search" />
              <q-icon v-else name="clear" class="cursor-pointer" @click="onFilter('')" />
            </template>
          </q-input>
        </div>
        <q-space />
        <div class="col-5">
          <select-category v-model="pagination.categories" :categories="categories" option-value="_id" option-label="label" data-all maximized
                           :dense="$store.getters.dense.input" :labelTitle="$t('category.titleproduct')" :labelSelect="$t('category.select')"
                           :labelAll="$t('category.selectAll')" :labelClose="$t('global.cancel')" @on-selected="onSelectCategory"
                           @onCancel="isFilter=false" />
        </div>
      </div>
    </q-card-section>
    <q-separator />
    <q-card-section class="q-pa-none">
      <!-- <q-scroll-area style="height:calc(100vh - 99px)"> -->
      <q-list separator id="scroll-items" class="scroll" style="height:calc(100vh - 150px)">
        <q-infinite-scroll ref="refScrollTarget" @load="onScrollLoad" :offset="250">
          <tm-swipeitem v-for="(e,i) in rows" :key="i" leftValue="max" rightValue="111" v-touch-hold.mouse="()=>{onTouchHold(e)}"
                        @swipe-left="onChecked(e)">
            <!-- <template v-slot:right>
              <q-checkbox :model-value="true" checked-icon="star" unchecked-icon="star_border" indeterminate-icon="help" class="q-pr-lg" />
            </template> -->
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
            <q-separator v-if="i>0" />
            <q-item>
              <q-item-section avatar>
                <q-avatar rounded size="42px">
                  <q-img v-if="e.images&&e.images.length&&e.images[0].length" :src="e.images[0]">
                    <template v-slot:error>
                      <div class="image-error absolute-full flex flex-center">
                        <q-icon name="insert_photo" />
                      </div>
                    </template>
                  </q-img>
                  <q-img v-else>
                    <div class="image-error absolute-full flex flex-center">
                      <q-icon name="insert_photo" />
                    </div>
                  </q-img>
                </q-avatar>
              </q-item-section>
              <q-item-section>
                <q-item-label>{{e.title}}</q-item-label>
                <q-item-label caption lines="1">
                  <span>{{$t('category.title')}}: </span>
                  <span v-for="cate in e.categoryList" :key="cate._id" :style="{color:cate.color}" class="q-pr-xs">{{cate.title}}</span>
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
                <q-btn v-if="!selected.includes(e)" flat round dense icon="input" color="blue" :size="$store.getters.dense.table?'sm':'md'"
                       @click="onSelected(e)">
                  <q-tooltip v-if="!$q.platform.is.mobile">{{$t('global.select')}}</q-tooltip>
                </q-btn>
                <q-checkbox v-else :model-value="true" checked-icon="star" unchecked-icon="star_border" indeterminate-icon="help" />
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
      <!-- </q-scroll-area> -->
    </q-card-section>
  </q-card>
</template>

<script>
import { defineComponent, defineAsyncComponent, ref, computed } from "vue";
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
export default defineComponent({
  name: "ProductIndex",
  components: {
    tmSwipeitem: defineAsyncComponent(() => import('components/tm-swipe-item')),
    selectCategory: defineAsyncComponent(() => import('pages/category/components/select-category'))
  },
  setup (props, { emit }) {
    const $router = useRouter()
    const $store = useStore()
    const isDialogAdd = ref(false)
    const isMaximized = ref(true)
    const isDialogTouchHold = ref(false)
    const refScrollTarget = ref(null)
    const isFilter = ref(false)
    const selected = ref([])
    const categories = computed(() => $store.state.categories.all.product || [])
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
      flag: 1,
      quantity: 0
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
      return $store.dispatch('products/get', opt.pagination).then(x => {
        pagination.value.rowsNumber = x.rowsNumber
        pagination.value.totalPage = Math.ceil(pagination.value.rowsNumber / pagination.value.rowsPerPage)
        return x.data
      })
    }
    if ($store.state.auth.token) {
      onFetch({ pagination: pagination.value }).then(x => data.value = x)
      if (!$store.state.categories.all.product || $store.state.categories.all.product.length < 1)
        $store.dispatch('categories/get', { type: 'product', flag: 1, all: true })
    }
    return {
      isDialogAdd, isMaximized, isDialogTouchHold, refScrollTarget, isFilter, rows, selected, categories, pagination, isRoutes, onFetch,
      onSelectCategory: (val) => {
        if (val) onFetch({ pagination: pagination.value }).then(x => {
          data.value = x
          isFilter.value = false
        })
      },
      onFilter: (val) => {
        pagination.value.filter = val
        onFetch({ pagination: pagination.value }).then(x => { data.value = x })
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
      },
      onChecked (val) {
        if (selected.value.includes(val)) {
          const i = selected.value.findIndex(x => x._id === val._id)
          selected.value.splice(i, 1)
        }
        else selected.value.push(val)
      },
      onSelected (val) {
        const item = { ...val }
        selected.value = [item]
        emit('on-selected', selected.value)
      },
      onSubmit () {
        const items = selected.value.slice()
        emit('on-selected', items)
      }
    }
  }
})
</script>
