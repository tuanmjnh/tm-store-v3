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
    <div class="row q-col-gutter-md q-mb-md">
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
    <div class="row q-col-gutter-md">
      <div class="col-6"><span>{{$t('report.products')}}:</span> <span
              class="text-indigo">{{parseInt(results.total.products).NumberFormat($store.getters.language)}}</span></div>
      <div class="col-6"><span>{{$t('report.quantities')}}:</span> <span
              class="text-teal">{{parseInt(results.total.quantities).NumberFormat($store.getters.language)}}</span></div>
    </div>
  </div>
  <div class="q-pa-md">
    <div class="row q-mb-md">
      <div>{{$t('report.reportOrders')}}</div>
    </div>
    <div class="row scroll full-width q-pb-md">
      <!-- <line-chart v-if="chartData" :chartData="chartData" class="line-chart full-width" /> -->
      <bar-chart v-if="chartData" :chartData="chartData" class="line-chart full-width" />
    </div>
  </div>
</template>

<script>
import { defineComponent, defineAsyncComponent, ref, onMounted } from "vue";
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'
export default defineComponent({
  name: "Dashboard",
  components: {
    // lineChart: defineAsyncComponent(() => import('components/chartjs/lineChart.vue')),
    barChart: defineAsyncComponent(() => import('components/chartjs/barChart.vue')),
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
    const onGetLabels = (data) => {
      if (typeTotal.value === 'week') {
        return data.map(x => t(`dayWeek.${x.labels}`))
      } else if (typeTotal.value === 'month') {
        return data.map(x => `${t('global.day')} ${x.labels}`)
      } else if (typeTotal.value === 'quarter') {
        return data.map(x => t(`quarter.${x.labels}`))
      } else if (typeTotal.value === 'year') {
        return data.map(x => `${t('global.month')} ${x.labels}`)
      } else {
        return data.map(x => `${x.labels}:00`)
      }
    }
    const getTotalOrders = (params) => {
      isLoading.value = true
      $store.dispatch('reports/getTotalOrders', params).then(x => {
        results.value = x
        chartData.value = {
          labels: onGetLabels(results.value.data),//results.value.data.map(x => `${x.labels}:00`),
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
            },
            {
              label: t('report.products'),
              backgroundColor: '#3f51b5',
              data: results.value.data.map(x => x.data['products'])
            },
            {
              label: t('report.quantities'),
              backgroundColor: '#009688',
              data: results.value.data.map(x => x.data['quantities'])
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
