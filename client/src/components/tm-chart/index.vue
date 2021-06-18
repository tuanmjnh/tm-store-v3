<template>
  <canvas ref="chartjs" />
</template>

<script>
import { defineComponent, ref } from 'vue';
import Chart from 'chart.js'
export default defineComponent({
  name: 'tm-chart',
  props: {
    // type: { type: String, default: 'bar' },
    // data: { type: Object, default: null },
    // options: { type: Array, default: null },
    width: { type: Number, default: 100 },
    height: { type: Number, default: 100 }
  },
  setup (props) {
    const myChart = ref(null)
    const chartjs = ref(null)

    const onRender = ({ type, data, options, height }) => {
      if (myChart.value) myChart.value.destroy()
      // this.$refs.chartjs.style.height = '50px'
      chartjs.value.height = height || 100
      // this.chartjs = this.$refs.chartjs
      // const ctx = this.chartjs.getContext('2d')
      // const ctx = document.getElementById('planet-chart')
      myChart.value = new Chart(chartjs.value, {
        type: type,
        data: data,
        options: options || {
          responsive: true,
          // maintainAspectRatio: false,
          // legend: {
          // labels: {
          //   fontColor: 'white' // set your desired color
          // }
          // },
          scales: {
            yAxes: [{
              ticks: {
                beginAtZero: true
              }
            }]
          }
        }
      })
    }
    const onDestroy = () => {
      if (this.myChart) this.myChart.destroy()
    }
    return { chartjs }
  }
})
</script>

<style>
</style>
