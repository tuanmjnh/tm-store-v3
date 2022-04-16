<script>
import { defineComponent, h, PropType } from 'vue'

import { Scatter } from 'vue-chartjs'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Plugin
} from 'chart.js'

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement
)

export default defineComponent({
  name: 'ScatterChart',
  components: {
    Scatter
  },
  props: {
    chartId: {
      type: String,
      default: 'scatter-chart'
    },
    width: {
      type: Number,
      default: 400
    },
    height: {
      type: Number,
      default: 400
    },
    cssClasses: {
      default: '',
      type: String
    },
    styles: {
      type: Object,//Object as PropType<Partial<CSSStyleDeclaration>>,
      default: () => { }
    },
    plugins: {
      type: Array,//Array as PropType<Plugin<'scatter'>[]>,
      default: () => []
    },
    chartData: {
      type: Object,//Object as PropType<Partial<CSSStyleDeclaration>>,
      default: () => { }
    },
    chartOptions: {
      type: Object,
      default: () => { return { responsive: true, maintainAspectRatio: false } }
    }
  },
  setup (props) {
    // const chartData = {
    //   datasets: [
    //     {
    //       label: 'Scatter Dataset 1',
    //       fill: false,
    //       borderColor: '#f87979',
    //       backgroundColor: '#f87979',
    //       data: [
    //         {
    //           x: -2,
    //           y: 4
    //         },
    //         {
    //           x: -1,
    //           y: 1
    //         },
    //         {
    //           x: 0,
    //           y: 0
    //         },
    //         {
    //           x: 1,
    //           y: 1
    //         },
    //         {
    //           x: 2,
    //           y: 4
    //         }
    //       ]
    //     },
    //     {
    //       label: 'Scatter Dataset 2',
    //       fill: false,
    //       borderColor: '#7acbf9',
    //       backgroundColor: '#7acbf9',
    //       data: [
    //         {
    //           x: -2,
    //           y: -4
    //         },
    //         {
    //           x: -1,
    //           y: -1
    //         },
    //         {
    //           x: 0,
    //           y: 1
    //         },
    //         {
    //           x: 1,
    //           y: -1
    //         },
    //         {
    //           x: 2,
    //           y: -4
    //         }
    //       ]
    //     }
    //   ]
    // }

    // const chartOptions = {
    //   responsive: true,
    //   maintainAspectRatio: false
    // }

    return () =>
      h(Scatter, {
        chartData: props.chartData,
        chartOptions: props.chartOptions,
        chartId: props.chartId,
        width: props.width,
        height: props.height,
        cssClasses: props.cssClasses,
        styles: props.styles,
        plugins: props.plugins
      })
  }
})
</script>
