<template>
  <q-card flat>
    <q-toolbar>
      <q-toolbar-title>{{$t('report.title')}}</q-toolbar-title>
    </q-toolbar>
    <q-card-section class="q-pa-none">
      <report-list-button :selected.sync="typeTime" @on-selected="onGetData" />
    </q-card-section>
    <q-card-section>
      <div class="row" v-show="(imports&&imports.length)||(exports&&exports.length)">
        <q-chip v-for="(e,i) in groups" :key="i" clickable @click="onGetChart(e)" text-color="white"
          :color="typeGroup===e?'primary':'blue-grey'">
          {{$t(`report.${e}`)}}
        </q-chip>
      </div>
      <div class="row" v-show="(imports&&imports.length)||(exports&&exports.length)">
        <canvas ref="chartjs" />
      </div>
    </q-card-section>
  </q-card>
</template>

<script>
import Chart from 'chart.js'
import { dynamicColors } from '@/utils/color'
import * as api from '@/api/store/reports'
export default {
  components: { reportListButton: () => import('./components/report-list-button') },
  data() {
    return {
      loading: false,
      codes: [
        { label: 'import', value: 'import' },
        { label: 'export', value: 'export' },
        { label: 'orders', value: 'orders' }
      ],
      isShow: false,
      imports: null,
      exports: null,
      code: null,
      typeTime: 'date',
      groups: ['totalBill', 'totalProduct', 'totalPrice', 'totalQuantity'],
      typeGroup: null
    }
  },
  mounted() {
    this.onGetData()
  },
  methods: {
    onGetData(query) {
      if (this.typeTime === 'weekly') {
        api.weekly().then(x => {
          this.imports = x.imports
          this.exports = x.exports
          // this.groups = x ? Object.keys(x.imports[0].data) : null
          this.labels = this.imports.map(x => this.$t(`dayWeek.${x.labels}`))
          this.onGetChart(this.groups ? this.groups[0] : null)
        })
      } else if (this.typeTime === 'month') {
        api.month().then(x => {
          this.imports = x.imports
          this.exports = x.exports
          this.labels = this.imports.map(x => x.labels)
          this.onGetChart(this.groups ? this.groups[0] : null)
        })
      } else if (this.typeTime === 'quarter') {
        api.quarter().then(x => {
          this.imports = x.imports
          this.exports = x.exports
          this.labels = this.imports.map(x => this.$t(`quarter.${x.labels}`))
          this.onGetChart(this.groups ? this.groups[0] : null)
        })
      } else if (this.typeTime === 'year') {
        api.year().then(x => {
          this.imports = x.imports
          this.exports = x.exports
          this.labels = this.imports.map(x => x.labels)
          this.onGetChart(this.groups ? this.groups[0] : null)
        })
      } else if (this.typeTime === 'fiveYear') {
        api.fiveYear().then(x => {
          this.imports = x.imports
          this.exports = x.exports
          this.labels = this.imports.map(x => x.labels)
          this.onGetChart(this.groups ? this.groups[0] : null)
        })
      } else {
        api.date(query).then(x => {
          this.imports = x.imports
          this.exports = x.exports
          this.labels = this.imports.map(x => x.labels)
          this.onGetChart(this.groups ? this.groups[0] : null)
        })
      }
    },
    onGetChart(typeGroup, typeChart = 'bar', height = 100) {
      this.typeGroup = typeGroup
      if (this.chartjs) this.chartjs.destroy()
      if (!this.imports && !this.exports) return
      this.$refs.chartjs.height = height
      const ctx = this.$refs.chartjs.getContext('2d')
      // const ctx = document.getElementById('chartjs')
      this.chartjs = new Chart(ctx, {
        type: typeChart,
        data: {
          labels: this.labels,
          datasets: [
            {
              label: '# ' + this.$t(`report.${typeGroup}Import`),
              data: this.imports.map(x => x.data[typeGroup]),
              order: 1,
              // fill: false,
              borderWidth: 1,
              backgroundColor: this.onPoolColors(this.labels.length, 'rgba(255,159,64,0.2)'),
              borderColor: this.onPoolColors(this.labels.length, 'rgba(255,159,64,1)')
              // fillColor: 'rgba(255,159,64,0.2)'
              // strokeColor: 'black'
              // hoverBackgroundColor: 'rgba(232,105,90,0.8)',
              // hoverBorderColor: 'orange',
            },
            {
              label: '# ' + this.$t(`report.${typeGroup}Export`),
              data: this.exports.map(x => x.data[typeGroup]),
              order: 2,
              // fill: false,
              borderWidth: 1,
              backgroundColor: this.onPoolColors(this.labels.length, 'rgba(54,162,235,0.2)'),
              borderColor: this.onPoolColors(this.labels.length, 'rgba(54,162,235,1)')
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
    },
    onPoolColors(count, color, a = '0.2') {
      const rs = []
      for (let index = 0; index < count; index++) {
        rs.push(color || dynamicColors(a))
      }
      return rs
    }
  }
}
</script>

<style>
</style>
