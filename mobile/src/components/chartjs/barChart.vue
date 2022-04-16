<script>
import { defineComponent, h, PropType } from 'vue'

import { Bar } from 'vue-chartjs'

import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  Plugin
} from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

export default defineComponent({
  name: 'BarChart',
  components: {
    Bar
  },
  props: {
    chartId: {
      type: String,
      default: 'bar-chart'
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
      type: Array,//Array as PropType<Plugin<'bubble'>[]>,
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
    //   labels: [
    //     'January',
    //     'February',
    //     'March',
    //     'April',
    //     'May',
    //     'June',
    //     'July',
    //     'August',
    //     'September',
    //     'October',
    //     'November',
    //     'December'
    //   ],
    //   datasets: [
    //     {
    //       label: 'Data One',
    //       backgroundColor: '#f87979',
    //       data: [40, 20, 12, 39, 10, 40, 39, 80, 40, 20, 12, 11]
    //     }
    //   ]
    // }

    // const chartOptions = {
    //   responsive: true,
    //   maintainAspectRatio: false
    // }

    return () =>
      h(Bar, {
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
