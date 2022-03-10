<template>
  <!-- <q-btn flat dense :color="color" icon="print" @click="onPrint">
    <q-tooltip v-if="!$q.platform.is.mobile">{{label}}</q-tooltip> -->
  <!-- <tm-printer ref="printerDetails" hidden>
    <template v-slot:content> -->
  <div class="row">
    <div class="col-12 text-h6 text-center">{{title}}</div>
  </div>
  <br />
  <div class="row">
    <div class="col-6 text-left" style="padding-left:20px">
      <span>{{$t('product.ballotCode')}}: </span>
      <span class="text-bold">{{total._id}}</span>
    </div>
    <q-space />
    <div class="col-6 text-right" style="padding-right:20px">
      <span>{{labelDate}}: </span>
      <span class="text-bold">{{$moment(total.createdAt).format($store.getters.format.date)}}</span>
    </div>
  </div>
  <br />
  <br />
  <div class="q-table__container q-table--horizontal-separator column no-wrap q-table__card q-table--flat q-table--dense q-table--no-wrap">
    <div class="q-table__middle">
      <table class="q-table">
        <thead>
          <tr class="q-tr">
            <th auto-width>
              <span class="text-bold text-blue-grey-10">#</span>
            </th>
            <th class="text-left">
              <span class="text-bold text-blue-grey-10">{{$t('category.title')}}</span>
            </th>
            <th class="text-left">
              <span class="text-bold text-blue-grey-10">{{$t('category.titlesub')}}</span>
            </th>
            <th class="text-left">
              <span class="text-bold text-blue-grey-10">{{$t('product.name')}}</span>
            </th>
            <th class="text-left">
              <span class="text-bold text-blue-grey-10">{{$t('product.code')}}</span>
            </th>
            <th class="text-right">
              <span class="text-bold text-blue-grey-10">{{$t('product.unitPrice')}}</span>
            </th>
            <th class="text-right">
              <span class="text-bold text-blue-grey-10">{{$t('global.quantity')}}</span>
            </th>
            <th class="text-right">
              <span class="text-bold text-blue-grey-10">{{$t('product.amount')}}</span>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr class="" v-for="(e,i) in rows" :key="i">
            <td class="text-left">{{i+1}}</td>
            <td class="text-left">{{e.category||e.categories[0]}}</td>
            <td class="text-left">{{e.subCategory||e.categories[1]}}</td>
            <td class="text-left">{{e.title}}</td>
            <td class="text-left">{{e.code}}</td>
            <td class="text-right">{{parseInt(e[price]).NumberFormat($store.getters.language)}}</td>
            <td class="text-right">{{parseInt(e.quantity).NumberFormat($store.getters.language)}}</td>
            <td class="text-right">{{(parseInt(e[price])*parseInt(e.quantity)).NumberFormat($store.getters.language)}}</td>
          </tr>
          <tr>
            <td colspan="6" class="text-left text-bold">{{$t('product.total')}}</td>
            <td class="text-right text-bold">{{parseInt(total.quantities).NumberFormat($store.getters.language)}}</td>
            <td class="text-right text-bold"> {{parseInt(total.prices).NumberFormat($store.getters.language)}}</td>
          </tr>
          <tr>
            <td colspan="7" class="text-left text-bold">{{$t('product.tax')}}</td>
            <td class="text-right text-bold">{{parseInt(total.prices*0.1).NumberFormat($store.getters.language)}}</td>
          </tr>
          <tr>
            <td colspan="7" class="text-left text-bold">{{$t('product.totalAmount')}}</td>
            <td class="text-right text-bold">{{parseInt(total.prices*1.1).NumberFormat($store.getters.language)}}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
  <br />
  <br />
  <div v-if="!hiddenBoot">
    <div class="row">
      <div class="col-5 text-center">{{$t('product.deliverer')}}</div>
      <q-space />
      <div class="col-5 text-center">{{$t('product.receiver')}}</div>
    </div>
    <div class="row q-pb-xl">
      <div class="col-5 text-center text-italic text-caption">{{$t('product.sign')}}</div>
      <q-space />
      <div class="col-5 text-center text-italic text-caption">{{$t('product.sign')}}</div>
    </div>
  </div>
  <!-- </tm-printer> -->
  <!-- </q-btn> -->
</template>

<script>
import { defineComponent } from 'vue';
export default defineComponent({
  name: 'ViewDetails',
  // components: { tmPrinter: defineAsyncComponent(() => import('components/tm-printer')) },
  props: {
    rows: { type: Array, required: true },
    total: { type: Object, required: true },
    title: { type: String, default: '' },
    color: { type: String, default: 'indigo' },
    label: { type: String, default: 'Print' },
    labelDate: { type: String, default: 'Date' },
    hiddenBoot: { type: Boolean, default: false },
    price: { type: String, default: 'price' }
    // price: { type: String, required: true },
    // quantiy: { type: String, required: true }
  },
  setup () {
    // const printerDetails = ref(null)
    // const onPrinting = () => {
    //   if (printerDetails.value) printerDetails.value.onExc({
    //     title: `${props.title}-${props.total._id}`
    //     // styles: '<link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Material+Icons"/>'
    //   })
    // }
    // return { printerDetails, onPrinting }
  }
})
</script>

<style>
</style>
