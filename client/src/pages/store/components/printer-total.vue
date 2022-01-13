<template>
  <!-- <q-btn flat dense :color="color" icon="print" @click="onPrint"> -->
  <!-- <q-tooltip v-if="!$q.platform.is.mobile">{{label}}</q-tooltip> -->
  <tm-printer ref="printerTotal" hidden>
    <template v-slot:content>
      <div class="row">
        <div class="col-12 text-h6 text-center">{{title}}</div>
      </div>
      <br />
      <div class="row">
        <div class="col-6 text-left" style="padding-left:20px">
          <span>{{$t('product.ballotCode')}}: </span>
          <span class="text-bold">{{total.code}}</span>
        </div>
        <q-space />
        <div class="col-6 text-right" style="padding-right:20px">
          <span>{{labelDate}}: </span>
          <span class="text-bold">{{$moment(total.createdAt).format($store.getters.format.date)}}</span>
        </div>
      </div>
      <br />
      <br />
      <div
           class="q-table__container q-table--horizontal-separator column no-wrap q-table__card q-table--flat q-table--dense q-table--no-wrap">
        <div class="q-table__middle scroll">
          <table class="q-table">
            <tbody>
              <tr>
                <td>{{$t('product.totalProduct')}}</td>
                <td class="text-right text-bold">{{total.products.NumberFormat($store.getters.language)}}</td>
              </tr>
              <tr>
                <td>{{$t('product.totalQuantity')}}</td>
                <td class="text-right text-bold">{{total.quantities.NumberFormat($store.getters.language)}}</td>
              </tr>
              <tr>
                <td>{{$t('product.total')}}</td>
                <td class="text-right text-bold">{{total.prices.NumberFormat($store.getters.language)}}</td>
              </tr>
              <tr>
                <td>{{$t('product.tax')}}</td>
                <td class="text-right text-bold">{{total.taxes.NumberFormat($store.getters.language)}}</td>
              </tr>
              <tr>
                <td>{{$t('product.totalAmount')}}</td>
                <td class="text-right text-bold">{{(total.prices+total.taxes).NumberFormat($store.getters.language)}}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <br />
      <br />
      <div class="row">
        <div class="col-3 text-center">{{$t('product.deliverer')}}</div>
        <q-space />
        <div class="col-3 text-center">{{$t('product.receiver')}}</div>
      </div>
      <div class="row">
        <div class="col-3 text-center text-italic text-caption">{{$t('product.sign')}}</div>
        <q-space />
        <div class="col-3 text-center text-italic text-caption">{{$t('product.sign')}}</div>
      </div>
    </template>
  </tm-printer>
  <!-- </q-btn> -->
</template>

<script>
import { defineComponent, defineAsyncComponent, ref } from 'vue';
export default defineComponent({
  name: 'PrinterTotal',
  components: { tmPrinter: defineAsyncComponent(() => import('components/tm-printer')) },
  props: {
    total: { type: Object, required: true },
    title: { type: String, default: 'Ballot' },
    color: { type: String, default: 'indigo' },
    label: { type: String, default: 'Print' },
    labelDate: { type: String, default: 'Date' }
    // price: { type: String, required: true },
    // quantiy: { type: String, required: true }
  },
  setup (props) {
    const printerTotal = ref(null)
    const onPrinting = () => {
      if (printerTotal.value) printerTotal.value.onExc({
        title: `${props.title}-${props.total.code}`
        // styles: '<link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Material+Icons"/>'
      })
    }
    return { printerTotal, onPrinting }
  }
})
</script>

<style>
</style>
