<template>
  <q-card>
    <q-toolbar>
      <div class="col-auto">
        <q-btn flat dense icon="arrow_back" v-close-popup />
      </div>
      <q-toolbar-title class="text-subtitle1">{{$t('warehouse.orderAdd')}}</q-toolbar-title>
      <q-btn icon="find_in_page" flat round dense color="blue" @click="isDialogProductList=!isDialogProductList" />
      <q-btn icon="qr_code_scanner" flat round dense color="blue" @click="isDialogQRCode=!isDialogQRCode" />
      <q-btn icon="add_task" flat round dense color="blue" class="q-ml-sm" :disable="rows.length<1" @click="onSubmit" />
    </q-toolbar>
    <q-separator />
    <q-card-section v-if="TotalAmount.quantity||TotalAmount.price" class="q-pa-none">
      <q-list>
        <q-item>
          <q-item-section avatar>
          </q-item-section>
          <q-item-section>
            <q-item-label lines="1">
              <span>{{$t('global.quantity')}}: </span>
              <span class="text-green text-bold">{{TotalAmount.quantity.NumberFormat($store.getters.language)}}</span>
            </q-item-label>
            <q-item-label caption lines="1">
              <i>{{$t('warehouse.totalbill')}}</i>
            </q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-item-label>
              <span class="text-red text-bold">{{TotalAmount.price.NumberFormat($store.getters.language)}}</span>
            </q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-card-section>
    <q-card-section class="q-pa-none">
      <q-form ref="form">
        <q-list id="scroll-items" class="scroll" style="height:calc(100vh - 99px)">
          <tm-swipeitem v-for="(e,i) in rows" :key="i" leftValue="max" rightValue="111" :ref="el=>setSwipeItem(el,i)">
            <!-- @swipe-left="onSwipeLeft" @swipe-right="onSwipeRight" -->
            <template v-slot:right>
              <q-btn no-caps class="q-btn--square" @click="onRemove(e,i)">
                <q-icon name="clear" color="negative" size="18px" />
              </q-btn>
            </template>
            <q-separator v-if="i>0" />
            <q-item clickable v-ripple>
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
                  <span>{{$t('global.quantity')}}: </span>
                  <span class="text-green">{{parseInt(e.quantity).NumberFormat($store.getters.language)}}</span>
                </q-item-label>
                <q-item-label caption lines="1">
                  <span>{{$t('product.priceSale')}}: </span>
                  <span class="text-red">{{onGetPrice(e).NumberFormat($store.getters.language)}}</span>
                  <q-badge color="blue q-ml-xs" transparent>{{parseInt(e.pricePercent)>0?`-${e.pricePercent}`:'0'}}%</q-badge>
                  <!-- <q-badge color="blue q-ml-xs" transparent>{{$store.getters.unitPrice}}</q-badge> -->
                </q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-item-label caption>
                  <span class="text-red">{{onGetTotalPrice(e).NumberFormat($store.getters.language)}}</span>
                </q-item-label>
              </q-item-section>
              <q-popup-proxy>
                <q-card>
                  <q-card-section class="q-pa-none">
                    <q-list>
                      <q-item>
                        <q-item-section>{{$t('product.priceDiscount')}}</q-item-section>
                        <q-item-section side>
                          <q-chip color="blue" text-color="white" icon="price_change"
                                  @click="()=>{if(e.priceDiscount)e.price=parseInt(e.priceDiscount)}">
                            {{e.priceDiscount}}
                          </q-chip>
                        </q-item-section>
                      </q-item>
                    </q-list>
                  </q-card-section>
                  <q-separator />
                  <q-card-section class="q-pt-none q-pb-none">
                    <q-input v-model.number="e.price" type="number" :label="$t('product.priceSale')">
                      <template v-slot:append>
                        <q-icon name="attach_money" />
                      </template>
                    </q-input>
                    <q-input v-model.number="e.pricePercent" type="number" :label="$t('product.pricePercent')" debounce="500"
                             @update:model-value="()=>{if(e.pricePercent.length<1)e.pricePercent=0}">
                      <template v-slot:append>
                        <q-icon name="percent" />
                      </template>
                    </q-input>
                    <q-input v-model.number="e.quantity" type="number" :label="$t('global.quantity')">
                      <template v-slot:append>
                        <q-icon name="arrow_drop_up"
                                @click="()=>{if(parseInt(e.quantity)<parseInt(e.quantityStore))e.quantity=parseInt(e.quantity)+1}" />
                        <q-icon name="arrow_drop_down" @click="()=>{if(parseInt(e.quantity)>1)e.quantity=parseInt(e.quantity)-1}" />
                      </template>
                    </q-input>
                  </q-card-section>
                </q-card>
              </q-popup-proxy>
            </q-item>
          </tm-swipeitem>
        </q-list>
      </q-form>
    </q-card-section>
  </q-card>
  <!-- Product list dialog -->
  <q-dialog v-model="isDialogProductList" :maximized="isMaximizedView" persistent>
    <p-list @on-selected="onSelectProduct" />
  </q-dialog>
  <!-- QR Code Scanner dialog -->
  <q-dialog v-model="isDialogQRCode" :maximized="isMaximizedView">
    <tm-html5qrcode :title="$t('qrCode.qrCodeScanner')" :cancelLabel="$t('global.cancel')" @onDecode="onDecodeQR" @onError="onErrorQR" />
  </q-dialog>
</template>
<script>
import { defineComponent, defineAsyncComponent, ref, onBeforeUpdate, onBeforeUnmount, computed } from "vue";
import { useStore } from 'vuex'
import { useQuasar } from 'quasar'
import { useI18n } from 'vue-i18n'
export default defineComponent({
  name: "OrdersAdd",
  components: {
    tmSwipeitem: defineAsyncComponent(() => import('components/tm-swipe-item')),
    pList: defineAsyncComponent(() => import('pages/products/components/list')),
    tmHtml5qrcode: defineAsyncComponent(() => import('components/tm-html5qrcode'))
  },
  setup () {
    const $store = useStore()
    const $q = useQuasar()
    const { t } = useI18n({ useScope: 'global' })
    const isMaximizedView = ref(true)
    const isDialogProductList = ref(false)
    const isDialogQRCode = ref(false)
    const form = ref(null)
    const rows = ref([])
    const selected = ref([])
    const result = ref(null)
    const refSwipeitem = ref([])
    const setSwipeItem = (el, index) => {
      if (el) refSwipeitem.value.push({ index: index, el: el })
    }
    const swipeItemReset = (index) => {
      const i = refSwipeitem.value.findIndex(x => x.index === index)
      refSwipeitem.value[i].el.Reset()
      refSwipeitem.value = refSwipeitem.value.splice(i, 1)
      // refSwipeitem.value[index].el.Reset()
      // refSwipeitem.value = refSwipeitem.value.splice(index, 1)
    }
    onBeforeUpdate(() => {
      refSwipeitem.value = []
    })
    const TotalAmount = computed(() => {
      const rs = { quantity: 0, price: 0 }
      rows.value.forEach(e => {
        rs.price = rs.price + onGetTotalPrice(e)
        rs.quantity = rs.quantity + e.quantity
      })
      return rs
    })
    // onUpdated(() => {
    //   console.log(refSwipeitem.value)
    // })

    // TMSwipeItem
    // const Reset = ref(null)
    // let timer
    // function finalize (reset) {
    //   if (timer) clearTimeout(timer)
    //   timer = setTimeout(() => {
    //     reset()
    //   }, 3000)
    // }
    // onBeforeUnmount(() => {
    //   clearTimeout(timer)
    // })
    const onGetPercent = (val) => {
      return (100 - parseInt(val)) / 100
    }
    const onGetPrice = (val) => {
      return parseInt(val.price) * onGetPercent(val.pricePercent)
    }
    const onGetTotalPrice = (val) => {
      return parseInt(val.quantity) * (parseInt(val.price) * onGetPercent(val.pricePercent))
    }
    const onPushRows = (val) => {
      if (val.quantity > 0) {
        const existItem = rows.value.find(x => x._id === val._id)
        if (existItem) {
          if (existItem.quantity < existItem.quantityStore) existItem.quantity = existItem.quantity + 1
        } else {
          rows.value.push({
            _id: val._id,
            categories: val.categories,
            category: val.categoryList.length > 0 ? val.categoryList[0].title : val.categories[0],
            subCategory: val.categoryList.length > 1 ? val.categoryList[1].title : val.categories[1],
            code: val.code.toUpperCase(),
            title: val.title,
            price: val.price || 0,
            priceOld: val.priceExport || val.price || 0,
            priceExport: val.priceExport || val.price,
            priceDiscount: val.priceDiscount || 0,
            pricePercent: 0,
            quantity: val.quantity > 0 ? 1 : 0,
            quantityOld: val.quantityExport || 1,
            quantityStore: val.quantity || 0,
            priceUnit: val.priceUnit,
            priceUnitName: val.priceUnitName,
            unit: val.unit,
            unitName: val.unitName,
            amount: parseInt(val.quantityExport || 1) * parseInt(val.priceExport || val.price),
            images: val.images
          })
        }
      } else {
        $q.notify({ color: 'warning', message: t('warehouse.msgNotQuantity') })
      }
    }
    const onReset = () => {
      return new Promise((resolve, reject) => {
        rows.value = []
        selected.value = []
        // Cookies.remove('export-tmp')
        resolve()
      }).then(() => { if (form.value) form.value.resetValidation() })
    }
    return {
      isMaximizedView, isDialogProductList, isDialogQRCode, form, rows, refSwipeitem, TotalAmount,
      onGetPercent, onGetPrice, onGetTotalPrice, setSwipeItem,
      onSelectProduct (val) {
        isDialogProductList.value = false
        for (let i = 0; i < val.length; i++) {
          onPushRows(val[i])
        }
      },
      onDecodeQR (val) {
        $store.dispatch('products/find', { qrcode: val }).then((x) => {
          if (x) {
            isDialogQRCode.value = false
            onPushRows(x)
          } else $q.notify({ message: t('error.qrNotExist'), color: 'negative' })
        })
      },
      onErrorQR (val) {
        $q.notify({ message: t(`error.${val.key}`), color: 'negative' })
      },
      onRemove (item, index) {
        if (item) selected.value = [item]
        $q.dialog({
          title: t('messageBox.confirm'),
          message: t('messageBox.delete'),
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
          swipeItemReset(index)
          selected.value.forEach(e => {
            const index = rows.value.findIndex(x => x._id === e._id)
            if (index > -1) rows.value.splice(index, 1)
          })
          selected.value = []
        })
      },
      onSubmit () {
        form.value.validate().then(valid => {
          if (valid) {
            $q.dialog({
              title: t('messageBox.confirm'),
              message: t('warehouse.exportConfirm'),
              cancel: true,
              persistent: true,
              ok: {
                label: t('global.accept'),
                flat: true,
                color: 'primary'
              },
              cancel: {
                label: t('global.cancel'),
                flat: true,
                color: 'blue-grey'
              }
            }).onOk(() => {
              $store.dispatch('exports/post', rows.value).then((x) => {
                if (x) {
                  if (x.data) result.value = x
                  $q.notify({ color: 'blue', message: t('warehouse.msgExportBill') })
                }
              }).finally(onReset())
            })
          }
        })
      }
      // onSwipeLeft ({ reset }) {
      // if (Reset.value) Reset.value()
      // Reset.value = reset
      // finalize(Reset.value)
      // },
      // onSwipeRight ({ reset }) {
      // if (Reset) Reset()
      // Reset = reset
      // finalize(reset)
      // }
    }
  }
})
</script>
