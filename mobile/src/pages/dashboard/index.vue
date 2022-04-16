<template>
  <div class="q-pa-md">
    <div class="row q-mb-md">
      <q-btn-dropdown outline no-caps color="blue" :label="$t(`report.${typeTotal}`)" class="report-type">
        <q-list separator>
          <q-item clickable v-close-popup v-for="e in typesTotal" :key="e" :class="typeTotal===e?'text-blue':''"
                  @click="onChangeTypeTotal(e)">
            <q-item-section>
              <q-item-label>{{$t(`report.${e}`)}}</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-btn-dropdown>
    </div>
    <div class="row q-col-gutter-md">
      <div class="col-6">
        <div class="list-content">
          <div>{{$t('report.orders')}}</div>
          <div class="text-blue">{{parseInt(results.total.orders).NumberFormat($store.getters.language)}}</div>
        </div>
      </div>
      <div class="col-6">
        <div class="list-content">
          <div>{{$t('report.revenue')}}</div>
          <div class="text-red">{{parseInt(results.total.prices).NumberFormat($store.getters.language)}}</div>
        </div>
      </div>
    </div>
  </div>
  <div class="q-pa-md">
    <div class="row q-mb-md">
      <div>{{$t('report.reportOrders')}}</div>
    </div>
    <div class="row scroll full-width q-pb-md">
      <line-chart v-if="chartData" :chartData="chartData" />
    </div>
  </div>
</template>

<script>
import { defineComponent, defineAsyncComponent, computed, ref, onMounted } from "vue";
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'
export default defineComponent({
  name: "Dashboard",
  components: {
    lineChart: defineAsyncComponent(() => import('components/chartjs/lineChart.vue')),
  },
  setup () {
    const $store = useStore()
    const { t } = useI18n({ useScope: 'global' })
    const isLoading = ref(false)
    const typesTotal = ref(['day', 'week', 'month', 'quarter', 'year'])
    const typeTotal = ref('day')
    const group = ref('orders')
    const results = ref({ total: { orders: 0, prices: 0, products: 0, quantities: 0 }, data: [] })
    const chartData = ref(null)
    const getTotalOrders = (params) => {
      isLoading.value = true
      $store.dispatch('reports/getTotalOrders', params).then(x => {
        results.value = x
        chartData.value = {
          labels: results.value.data.map(x => `${x.labels}:00`),
          datasets: [
            {
              label: t('report.orders'),
              backgroundColor: '#2196f3',
              data: results.value.data.map(x => x.data['orders'])
            },
            {
              label: t('report.prices'),
              backgroundColor: '#f87979',
              data: results.value.data.map(x => x.data['prices'])
            }
          ]
        }
      }).finally(isLoading.value = false)
    }
    onMounted(() => {
      getTotalOrders({ type: typeTotal.value })
    })
    // const chartData = {
    //   labels: results.value.data.map(x => `D${x.labels}`),//['January', 'February', 'March', 'April', 'May', 'June', 'July'],
    //   datasets: [
    //     {
    //       label: 'Data One',
    //       backgroundColor: '#f87979',
    //       data: results.value.data.map(x => x.data[group.value])//[40, 39, 10, 40, 39, 80, 40]
    //     }
    //   ]
    // }
    return {
      results, typesTotal, typeTotal, chartData,
      onChangeTypeTotal (val) {
        if (typeTotal.value !== val) {
          typeTotal.value = val
          getTotalOrders({ type: typeTotal.value })
        }
      }
    }
  }
})
</script>
<style lang="scss">
.list-content {
  padding: 10px 15px;
  // background: rgba(86,61,124,.15);
  border: 1px solid #dfdfdf;
}
.report-type {
  width: 100%;
  .q-btn__content {
    position: relative;
    justify-content: left;
    .block {
      text-align: left;
    }
    .q-btn-dropdown__arrow {
      position: absolute;
      right: 0;
    }
  }
}
</style>
