<template>
  <q-card flat>
    <q-toolbar>
      <div class="col-auto">
        <q-btn flat dense icon="arrow_back" v-close-popup />
      </div>
      <q-toolbar-title class="text-subtitle1">{{$t('report.title')}}</q-toolbar-title>
      <q-btn icon="filter_list" flat round dense color="teal">
        <q-menu v-model="isFilter">
          <q-list separator>
            <q-item clickable v-ripple>
              <q-item-section @click="onGetData({type:'date'})">{{$t('report.date')}}</q-item-section>
              <q-item-section side>
                <q-icon color="blue" name="date_range" />
                <q-popup-proxy>
                  <q-card>
                    <q-card-section>
                      <q-list>
                        <q-item>
                          <q-item-section>
                            <q-input :model-value="dateData.start?$moment(dateData.start).format($store.getters.format.date):''"
                                     :dense="$store.getters.dense.input"
                                     readonly :label="$t('global.startDate')" :hint="`${$t('global.format')}: ${$store.getters.format.date}`">
                              <template v-slot:append>
                                <q-icon name="event" class="cursor-pointer">
                                  <q-popup-proxy ref="dateStart" transition-show="scale" transition-hide="scale">
                                    <q-date v-model="dateData.start" today-btn mask="YYYY-MM-DD" @update:model-value="()=>$refs.dateStart.hide()" />
                                  </q-popup-proxy>
                                </q-icon>
                              </template>
                            </q-input>
                          </q-item-section>
                        </q-item>
                        <q-item>
                          <q-item-section>
                            <q-input :model-value="dateData.end?$moment(dateData.end).format($store.getters.format.date):''"
                                     :dense="$store.getters.dense.input"
                                     readonly :label="$t('global.endDate')" :hint="`${$t('global.format')}: ${$store.getters.format.date}`">
                              <template v-slot:append>
                                <q-icon name="event" class="cursor-pointer">
                                  <q-popup-proxy ref="dateEnd" transition-show="scale" transition-hide="scale">
                                    <q-date v-model="dateData.end" today-btn mask="YYYY-MM-DD" @update:model-value="()=>$refs.dateEnd.hide()" />
                                  </q-popup-proxy>
                                </q-icon>
                              </template>
                            </q-input>
                          </q-item-section>
                        </q-item>
                        <q-item>
                          <q-item-section>
                            <q-btn v-close-popup dense no-caps :label="$t('global.getData')" color="blue" class="q-btn--square list-btn"
                                   @click="onGetData({type:'date',startDate: dateData.start, endDate: dateData.end})" />
                          </q-item-section>
                        </q-item>
                      </q-list>
                    </q-card-section>
                  </q-card>
                </q-popup-proxy>
              </q-item-section>
            </q-item>
            <q-item clickable v-ripple @click="onGetData({type:'weekly'})">
              <q-item-section>
                <q-item-label>{{$t('report.weekly')}}</q-item-label>
              </q-item-section>
            </q-item>
            <q-item clickable v-ripple @click="onGetData({type:'month'})">
              <q-item-section>
                <q-item-label>{{$t('report.month')}}</q-item-label>
              </q-item-section>
            </q-item>
            <q-item clickable v-ripple @click="onGetData({type:'quarter'})">
              <q-item-section>
                <q-item-label>{{$t('report.quarter')}}</q-item-label>
              </q-item-section>
            </q-item>
            <q-item clickable v-ripple @click="onGetData({type:'year'})">
              <q-item-section>
                <q-item-label>{{$t('report.year')}}</q-item-label>
              </q-item-section>
            </q-item>
            <q-item clickable v-ripple @click="onGetData({type:'fiveYear'})">
              <q-item-section>
                <q-item-label>{{$t('report.fiveYear')}}</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-menu>
      </q-btn>
    </q-toolbar>
    <q-card-section v-if="(data.imports&&data.imports.length)||(data.exports&&data.exports.length)">
      <q-tabs v-model="group">
        <q-tab v-for="(e,i) in groups" :key="i" :name="e.value" :icon="e.icon" :disable="isLoading" @click="onChartUpdate(e.value)" />
      </q-tabs>
      <!-- <q-chip v-for="(e,i) in groups" :key="i" dense clickable @click="onChartUpdate(e)" text-color="white" :color="group===e?'primary':'blue-grey'">
        {{$t(`report.${e}`)}}
      </q-chip> -->
    </q-card-section>
    <q-card-section :class="isLoading?'hidden':''" id="chartjs">
    </q-card-section>
  </q-card>
</template>

<script>
import { defineComponent, defineAsyncComponent, ref, onMounted } from 'vue'
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'
// import Vue3ChartJs from '@j-t-mcc/vue3-chartjs'
import Chart from 'chart.js/auto'
import { DynamicColors } from '../../../../global/utils/color'
export default defineComponent({
  name: "ReportIndex",
  setup () {
    const $store = useStore()
    const { t } = useI18n({ useScope: 'global' })
    const isLoading = ref(false)
    const isFilter = ref(false)
    const dateData = ref({ start: Date.now(), end: Date.now() })
    const chartBarRef = ref(null)
    const data = ref({ imports: [], exports: [] })
    const groups = ref([
      { label: 'bills', value: 'bills', icon: 'receipt_long' },
      { label: 'products', value: 'products', icon: 'category' },
      { label: 'prices', value: 'prices', icon: 'monetization_on' },
      { label: 'quantities', value: 'quantities', icon: 'pin' }
    ])
    const group = ref(groups.value[0].value)

    const onPoolColors = (count, color, a = '0.2') => {
      const rs = []
      for (let index = 0; index < count; index++) {
        rs.push(color || DynamicColors(a))
      }
      return rs
    }
    const onDataImport = (group, backgroundColor, borderColor) => {
      return {
        label: '# ' + t(`report.${group}Import`),
        data: data.value.imports.map(x => x.data[group]),
        order: 1,
        borderWidth: 1,
        borderColor: borderColor || 'rgba(54,162,235,1)',
        backgroundColor: backgroundColor || 'rgba(255,159,64,0.2)',
        // fill: false,
        // fillColor: 'rgba(255,159,64,0.2)'
        // strokeColor: 'black'
        // hoverBackgroundColor: 'rgba(232,105,90,0.8)',
        // hoverBorderColor: 'orange',
      }
    }
    const onDataExport = (group, backgroundColor, borderColor) => {
      return {
        label: '# ' + t(`report.${group}Export`),
        data: data.value.exports.map(x => x.data[group]),
        order: 2,
        borderWidth: 1,
        borderColor: borderColor || 'rgba(54,162,235,1)',
        backgroundColor: backgroundColor || 'rgba(54,162,235,0.2)',
        // fill: false,
        // fillColor: 'rgba(255,159,64,0.2)'
        // strokeColor: 'black'
        // hoverBackgroundColor: 'rgba(232,105,90,0.8)',
        // hoverBorderColor: 'orange',
      }
    }
    const onChartBarRef = ({ chartType, labels, datasets }) => {
      const mainEl = document.getElementById('chartjs')
      const canvasEl = document.createElement('canvas')
      const canvasElCTX = canvasEl.getContext('2d')
      mainEl.innerHTML = ''
      mainEl.appendChild(canvasEl)
      // setTimeout(() => {
      // return new Promise((resolve, reject) => {
      const rs = new Chart(canvasElCTX, {
        type: chartType || 'bar',
        data: {
          labels: labels,
          datasets: datasets
        },
        options: {
          plugins: {
            title: {
              display: true,
              text: 'Chart.js Bar Chart - Stacked'
            },
          },
          responsive: true,
          interaction: {
            intersect: false,
          },
          scales: {
            x: {
              stacked: true,
            },
            y: {
              stacked: true
            }
          }
        },
        // plugins:{}
        // })
        // resolve(rs)
      })
      return rs
      // }, 300)
    }
    // const onChartBarRefUpdate = (data) => {
    //   if (data.labels) chartBarRef.value.data.labels = data.labels
    //   if (data.datasets) chartBarRef.value.data.datasets = data.datasets
    //   chartBarRef.value.update()
    // }
    onMounted(() => {
      // const canvasEl = document.getElementById('chartBarRef')
      // chartBarRef.value = new Chart(canvasEl, { planetChartData })
      // onChartBarRef({
      //   chartType: planetChartData.type,
      //   labels: planetChartData.data.labels,
      //   datasets: planetChartData.data.datasets
      // }).then(x => chartBarRef.value = x)
      // console.log(chartBarRef.value)
      // chartBarRef.value.destroy()
      // chartBarRef.value.data = planetChartData.data
      // chartBarRef.value.update()
    })

    return {
      isFilter, isLoading, data, groups, group, dateData,
      onGetData (params) {
        isLoading.value = false
        isFilter.value = false
        if (chartBarRef.value) chartBarRef.value.destroy()
        if (params.type === 'weekly') {
          $store.dispatch('reports/getWeekly', params).then((x) => {
            importData.value = x.imports
            exportData.value = x.exports
            // groups.value = x ? Object.keys(x.imports[0].data) : null
            labels.value = importData.value.map(x => t(`dayWeek.${x.labels}`))
          }).then(() => {
            onChartBarRef(groups.value ? groups.value[0] : null)
          })
        } else if (params.type === 'month') {
          $store.dispatch('reports/getMonth', params).then((x) => {
            importData.value = x.imports
            exportData.value = x.exports
            labels.value = importData.value.map(x => `${t('global.day')} ${x.labels}`)
          }).then(() => {
            onChartBarRef(groups.value ? groups.value[0] : null)
          })
        } else if (params.type === 'quarter') {
          $store.dispatch('reports/getQuarter', params).then((x) => {
            importData.value = x.imports
            exportData.value = x.exports
            labels.value = importData.value.map(x => t(`quarter.${x.labels}`))
          }).then(() => {
            onChartBarRef(groups.value ? groups.value[0] : null)
          })
        } else if (params.type === 'year') {
          $store.dispatch('reports/getYear', params).then((x) => {
            importData.value = x.imports
            exportData.value = x.exports
            labels.value = importData.value.map(x => `${t('global.month')} ${x.labels}`)
          }).then(() => {
            onChartBarRef(groups.value ? groups.value[0] : null)
          })
        } else if (params.type === 'fiveYear') {
          $store.dispatch('reports/getFiveYear', params).then((x) => {
            importData.value = x.imports
            exportData.value = x.exports
            labels.value = importData.value.map(x => `${t('global.year')} ${x.labels}`)
          }).then(() => {
            onChartBarRef(groups.value ? groups.value[0] : null)
          })
        } else {
          $store.dispatch('reports/getDate', params).then((x) => {
            data.value = x
            chartBarRef.value = onChartBarRef({
              labels: data.value.imports.map(x => x.labels),
              datasets: [
                onDataImport(group.value),
                onDataExport(group.value)
              ]
            })
            // .then(x => {
            //   chartBarRef.value = x
            //   isLoading.value = false
            // })
          })
        }
      },
      onChartUpdate (val) {
        group.value = val
        isLoading.value = false
        console.log(chartBarRef.value)
        const labels = chartBarRef.value.data.labels
        if (chartBarRef.value) chartBarRef.value.destroy()
        chartBarRef.value = onChartBarRef({
          labels: labels,
          datasets: [
            onDataImport(group.value),
            onDataExport(group.value)
          ]
        })
        // .then(x => {
        //   chartBarRef.value = x
        //   isLoading.value = false
        // })
      }
    }
  }
})
</script>
