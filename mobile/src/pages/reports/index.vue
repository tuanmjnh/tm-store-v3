<template>
  <q-card flat>
    <q-toolbar>
      <div v-if="$route.path!=='/warehouse/report'" class="col-auto">
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
    <q-card-section>

    </q-card-section>
    <q-card-actions :class="isLoading?'hidden':''">
      <vue3-chart-js ref="chartBarRef" :id="chartJS.id" :type="chartJS.type" :data="chartJS.data" />
    </q-card-actions>
    <q-card-section v-if="(data.imports&&data.imports.length)||(data.exports&&data.exports.length)">
      <q-tabs v-model="group" :class="isLoading?'hidden':''">
        <q-tab v-for="(e,i) in groups" :key="i" :name="e.value" :icon="e.icon" :disable="isLoading" @click="onChartBarRef({group:e.value})" />
      </q-tabs>
    </q-card-section>
  </q-card>
</template>

<script>
import { defineComponent, ref } from 'vue'
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'
import { DynamicColors } from '../../../../global/utils/color'
import Vue3ChartJs from '@j-t-mcc/vue3-chartjs'
import zoomPlugin from 'chartjs-plugin-zoom'
Vue3ChartJs.registerGlobalPlugins([zoomPlugin])
export default defineComponent({
  name: 'StoreReport',
  components: {
    Vue3ChartJs
  },
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
    const chartJS = ref({
      id: 'charJS',
      type: 'line',
      data: {
        labels: [],
        datasets: []
      },
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: 'Chart.js Bar Chart - Stacked'
          },
          zoom: {
            zoom: {
              wheel: {
                enabled: true,
              },
              pinch: {
                enabled: true,
              },
              mode: "y",
            },
          },
        },
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
    const onChartBarRef = ({ group, labels, type }) => {
      chartJS.value.type = type || 'bar'
      if (labels) chartJS.value.data.labels = labels
      chartJS.value.data.datasets = [
        {
          label: '# ' + t(`report.${group}Import`),
          data: data.value.imports.map(x => x.data[group]),
          order: 1,
          // fill: false,
          borderWidth: 1,
          backgroundColor: onPoolColors(chartJS.value.data.labels.length, 'rgba(255,159,64,0.2)'),
          borderColor: onPoolColors(chartJS.value.data.labels.length, 'rgba(255,159,64,1)')
          // fillColor: 'rgba(255,159,64,0.2)'
          // strokeColor: 'black'
          // hoverBackgroundColor: 'rgba(232,105,90,0.8)',
          // hoverBorderColor: 'orange',
        },
        {
          label: '# ' + t(`report.${group}Export`),
          data: data.value.exports.map(x => x.data[group]),
          order: 2,
          // fill: false,
          borderWidth: 1,
          backgroundColor: onPoolColors(chartJS.value.data.labels.length, 'rgba(54,162,235,0.2)'),
          borderColor: onPoolColors(chartJS.value.data.labels.length, 'rgba(54,162,235,1)')
          // fillColor: 'rgba(54,162,235,0.2)'
          // strokeColor: 'black'
        }
      ]
      chartBarRef.value.update(1000)
    }

    return {
      chartBarRef, isFilter, isLoading, data, groups, group, dateData, chartJS, onChartBarRef,
      onGetData (params) {
        isLoading.value = true
        isFilter.value = false
        if (params.type === 'weekly') {
          $store.dispatch('reports/getWeekly', params).then((x) => {
            data.value = x
            onChartBarRef({
              group: group.value,
              labels: data.value.imports.map(x => t(`dayWeek.${x.labels}`))
            })
          }).then(isLoading.value = false)
        } else if (params.type === 'month') {
          $store.dispatch('reports/getMonth', params).then((x) => {
            data.value = x
            onChartBarRef({
              group: group.value,
              labels: data.value.imports.map(x => `${t('global.day')} ${x.labels}`)
            })
          }).then(isLoading.value = false)
        } else if (params.type === 'quarter') {
          $store.dispatch('reports/getQuarter', params).then((x) => {
            data.value = x
            onChartBarRef({
              group: group.value,
              labels: data.value.imports.map(x => t(`quarter.${x.labels}`))
            })
          }).then(isLoading.value = false)
        } else if (params.type === 'year') {
          $store.dispatch('reports/getYear', params).then((x) => {
            data.value = x
            onChartBarRef({
              group: group.value,
              labels: data.value.imports.map(x => `${t('global.month')} ${x.labels}`)
            })
          }).then(isLoading.value = false)
        } else if (params.type === 'fiveYear') {
          $store.dispatch('reports/getFiveYear', params).then((x) => {
            data.value = x
            onChartBarRef({
              group: group.value,
              labels: data.value.imports.map(x => `${t('global.year')} ${x.labels}`)
            })
          }).then(isLoading.value = false)
        } else {
          $store.dispatch('reports/getDate', params).then((x) => {
            data.value = x
            onChartBarRef({
              group: group.value,
              labels: data.value.imports.map(x => `D${x.labels}`)
            })
          }).then(isLoading.value = false)
        }
      }
    }
  }
})
</script>

<style>
</style>
