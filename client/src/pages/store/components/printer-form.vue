<template>
  <q-btn flat round dense :color="color" icon="print" @click="onPrint">
    <q-tooltip v-if="!$q.platform.is.mobile">{{label}}</q-tooltip>
    <tm-printer ref="printer" hidden>
      <template v-slot:content>
        <div class="row">
          <div class="col-12 text-h6 text-center">{{title}}</div>
        </div>
        <br />
        <div class="row">
          <div class="col-6 text-left" style="padding-left:20px">
            <span>{{$t('product.ballot_code')}}: </span>
            <span class="text-bold">{{result.data.code}}</span>
          </div>
          <q-space />
          <div class="col-6 text-right" style="padding-right:20px">
            <span>{{labelDate}}: </span>
            <span class="text-bold">{{result.data.created_at|formatDate}}</span>
          </div>
        </div>
        <br />
        <br />
        <div
          class="q-table__container q-table--horizontal-separator column no-wrap q-table__card q-table--flat q-table--dense q-table--no-wrap">
          <div class="q-table__middle scroll">
            <table class="q-table">
              <thead>
                <tr class="q-tr">
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
                    <span class="text-bold text-blue-grey-10">{{$t('product.quantity')}}</span>
                  </th>
                  <th class="text-right">
                    <span class="text-bold text-blue-grey-10">{{$t('product.amount')}}</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr class="" v-for="(e,i) in items" :key="i">
                  <td class="text-left">{{e.title}}</td>
                  <td class="text-left">{{e.code}}</td>
                  <td class="text-right">{{e.price|NumberFormat($store.getters.language)}}</td>
                  <td class="text-right">{{e.quantity|NumberFormat($store.getters.language)}}</td>
                  <td class="text-right">{{e.amount|NumberFormat($store.getters.language)}}</td>
                </tr>
                <tr>
                  <td colspan="3" class="text-left text-bold">{{$t('product.total')}}</td>
                  <td class="text-right text-bold">
                    {{result.data.quantity|NumberFormat($store.getters.language)}}</td>
                  <td class="text-right text-bold">
                    {{result.data.price|NumberFormat($store.getters.language)}}
                  </td>
                </tr>
                <tr>
                  <td colspan="4" class="text-left text-bold">{{$t('product.vat')}}</td>
                  <td class="text-right text-bold">
                    {{result.data.vat|NumberFormat($store.getters.language)}}
                  </td>
                </tr>
                <tr>
                  <td colspan="4" class="text-left text-bold">{{$t('product.totalAmount')}}</td>
                  <td class="text-right text-bold">
                    {{(result.data.price+result.data.vat)|NumberFormat($store.getters.language)}}
                  </td>
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
  </q-btn>
</template>

<script>
export default {
  components: { tmPrinter: () => import('@/components/tm-printer') },
  props: {
    items: { type: Array, required: true },
    result: { type: Object, required: true },
    title: { type: String, default: 'Ballot' },
    color: { type: String, default: 'indigo' },
    label: { type: String, default: 'Print' },
    labelDate: { type: String, default: 'Date' }
    // price: { type: String, required: true },
    // quantiy: { type: String, required: true }
  },
  methods: {
    onPrint() {
      this.$refs.printer.exc({
        styles: '<link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Material+Icons"/>'
      })
    }
  }
}
</script>

<style>
</style>
