<template>
  <q-card flat>
    <q-toolbar>
      <q-toolbar-title>{{$t('report.title')}}</q-toolbar-title>
    </q-toolbar>
    <q-card-section class="q-pa-none">
      <report-list-button v-model:selected="typeTime" @on-selected="onGetData" />
    </q-card-section>
    <q-card-section>
      <div class="row" v-show="(importData&&importData.length)||(exportData&&exportData.length)">
        <q-chip v-for="(e,i) in groups" :key="i" clickable @click="onGetChart(e)" text-color="white" :color="typeGroup===e?'primary':'blue-grey'">
          {{$t(`report.${e}`)}}
        </q-chip>
      </div>
      <div class="row" v-show="(importData&&importData.length)||(exportData&&exportData.length)">
        <canvas ref="chartjs" />
      </div>
    </q-card-section>
  </q-card>
</template>

<script>
import { defineComponent, defineAsyncComponent, ref, computed } from 'vue';
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'
import { Chart } from 'chart.js'
import { dynamicColors } from '@/utils/color'
export default defineComponent({
  name: 'StoreReport',
  components: { reportListButton: defineAsyncComponent(() => import('./components/report-list-button')) },
  setup () {
    const $store = useStore()
    const { t } = useI18n({ useScope: 'global' })
    const isLoading = ref(false)
    const codes = ref([
      { label: 'import', value: 'import' },
      { label: 'export', value: 'export' },
      { label: 'orders', value: 'orders' }
    ])
    const chartjs = ref(null)
    const chartjsContent = ref(null)
    const labels = ref(null)
    const isShow = ref(false)
    const importData = ref(null)
    const exportData = ref(null)
    const code = ref(null)
    const typeTime = ref('date')
    const groups = ref(['totalBill', 'totalProduct', 'totalPrice', 'totalQuantity'])
    const typeGroup = ref(null)

    const onPoolColors = (count, color, a = '0.2') => {
      const rs = []
      for (let index = 0; index < count; index++) {
        rs.push(color || dynamicColors(a))
      }
      return rs
    }
    const onGetChart = (typeGroupValue, typeChartValue = 'bar', height = 100) => {
      typeGroup.value = typeGroupValue
      if (chartjsContent.value) chartjsContent.value.destroy()
      if (!importData.value && !exportData.value) return
      chartjs.value.height = height
      const ctx = chartjs.value.getContext('2d')
      // const ctx = document.getElementById('chartjs')
      chartjsContent.value = new Chart(ctx, {
        type: typeChartValue,
        data: {
          labels: labels.value,
          datasets: [
            {
              label: '# ' + t(`report.${typeGroup.value}Import`),
              data: importData.value.map(x => x.data[typeGroup.value]),
              order: 1,
              // fill: false,
              borderWidth: 1,
              backgroundColor: onPoolColors(labels.value.length, 'rgba(255,159,64,0.2)'),
              borderColor: onPoolColors(labels.value.length, 'rgba(255,159,64,1)')
              // fillColor: 'rgba(255,159,64,0.2)'
              // strokeColor: 'black'
              // hoverBackgroundColor: 'rgba(232,105,90,0.8)',
              // hoverBorderColor: 'orange',
            },
            {
              label: '# ' + t(`report.${typeGroup.value}Export`),
              data: exportData.value.map(x => x.data[typeGroup.value]),
              order: 2,
              // fill: false,
              borderWidth: 1,
              backgroundColor: onPoolColors(labels.value.length, 'rgba(54,162,235,0.2)'),
              borderColor: onPoolColors(labels.value.length, 'rgba(54,162,235,1)')
              // fillColor: 'rgba(54,162,235,0.2)'
              // strokeColor: 'black'
            }
          ]
        },
        options: {
          responsive: true
          // maintainAspectRatio: false,
          // legend: {
          // labels: {
          //   fontColor: 'white' // set your desired color
          // }
          // },
          // scales: {
          //   yAxes: [{
          //     ticks: {
          //       beginAtZero: true
          //     }
          //   }]
          // }
        }
      })
    }
    const onGetData = (query) => {
      if (typeTime.value === 'weekly') {
        $store.dispatch('store/getReportWeekly', query).then((x) => {
          importData.value = x.imports
          exportData.value = x.exports
          // groups.value = x ? Object.keys(x.imports[0].data) : null
          labels.value = importData.value.map(x => t(`dayWeek.${x.labels}`))
          onGetChart(groups.value ? groups.value[0] : null)
        })
      } else if (typeTime.value === 'month') {
        $store.dispatch('store/getReportMonth', query).then((x) => {
          importData.value = x.imports
          exportData.value = x.exports
          labels.value = importData.value.map(x => x.labels)
          onGetChart(groups.value ? groups.value[0] : null)
        })
      } else if (typeTime.value === 'quarter') {
        $store.dispatch('store/getReportQuarter', query).then((x) => {
          importData.value = x.imports
          exportData.value = x.exports
          labels.value = importData.value.map(x => t(`quarter.${x.labels}`))
          onGetChart(groups.value ? groups.value[0] : null)
        })
      } else if (typeTime.value === 'year') {
        $store.dispatch('store/getReportYear', query).then((x) => {
          importData.value = x.imports
          exportData.value = x.exports
          labels.value = importData.value.map(x => x.labels)
          onGetChart(groups.value ? groups.value[0] : null)
        })
      } else if (typeTime.value === 'fiveYear') {
        $store.dispatch('store/getReportFiveYear', query).then((x) => {
          importData.value = x.imports
          exportData.value = x.exports
          labels.value = importData.value.map(x => x.labels)
          onGetChart(groups.value ? groups.value[0] : null)
        })
      } else {
        $store.dispatch('store/getReportDate', query).then((x) => {
          importData.value = x.imports
          exportData.value = x.exports
          labels.value = importData.value.map(x => x.labels)
          onGetChart(groups.value ? groups.value[0] : null)
        })
      }
    }
    onGetData()

    return { chartjs, importData, exportData, typeTime, groups, typeGroup, onGetData, onGetChart }
  }
})
</script>

<style>
</style>
