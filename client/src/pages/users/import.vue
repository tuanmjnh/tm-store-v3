<template>
  <div>
    <div class="row card-title">
      <div class="col-sm-auto col-xs-12 text-h6 card-title-text">
        <q-avatar v-if="dialog" :icon="$route.meta.icon" size="50px" />
        {{$t('files.import')}} {{$t('users.title')}}
      </div>
      <q-space />
      <div class="col-sm-auto col-xs-12 text-right">
        <q-btn flat icon="publish" :label="dialog?'':$t('global.process')" color="indigo" @click="onSubmit">
          <q-tooltip v-if="dialog">{{$t('global.process')}}</q-tooltip>
        </q-btn>
        <q-btn v-if="dialog" flat round dense :color="$q.dark.isActive?'':'grey-7'" :icon="maximized?'fullscreen_exit':'fullscreen'"
               :disable="$store.state.app.loading.post||$store.state.app.loading.put" @click="$emit('update:maximized',!maximized)">
          <q-tooltip>{{maximized?$t('global.normalScreen'):$t('global.fullScreen')}}</q-tooltip>
        </q-btn>
        <q-btn v-if="dialog" flat round dense icon="close" :disable="$store.state.app.loading.post||$store.state.app.loading.put" v-close-popup>
          <q-tooltip>{{$t('global.cancel')}}</q-tooltip>
        </q-btn>
        <q-btn v-else flat round dense icon="reply" :disable="$store.state.app.loading.post||$store.state.app.loading.put"
               @click="$router.push('view')">
          <q-tooltip>{{$t('global.back')}}</q-tooltip>
        </q-btn>
      </div>
    </div>
    <q-separator />
    <div class="q-pa-md">
      <!-- <q-scroll-area style="height:calc(100vh - 180px)"> -->
      <!-- <q-card-section> -->
      <!-- <div class="row q-gutter-xs">
        <div class="col-12">
          <q-select v-model="group" input-debounce="200" :dense="$store.getters.dense.input"
            :options="groups" :label="$t('users.group')" option-value="code"
            :option-label="opt=>opt.name" :rules="[v=>!!v||$t('error.required')]" />
        </div>
      </div> -->
      <!-- https://docs.google.com/spreadsheets/d/15F3mYued4CDTzHrcpCvrWQrr_ULGxqhLTu5-CYRjOBk/edit?usp=sharing -->
      <div class="row">
        <div class="col-12 col-md-3">
          <q-checkbox v-model="append" :label="$t('global.append')" />
        </div>
        <!-- <q-separator vertical class="q-mr-sm" /> -->
        <div class="col-12 col-md-9">
          <!-- $t('files.open_file') -->
          <tm-load-files ref="tmLoadFiles" :button="true" :options="{header:2}" :labelBtnUpload="$t('files.openFile')"
                         :labelBtnUrl="$t('files.googleSheet')" :labelFile="$t('files.chooseFile')" :labelUrl="$t('files.inputUrl')"
                         :errorNoExist="$t('error.noExist')" accept=".xls,.xlsx,.csv,.tsv,.txt,.json,.xml" @on-start="isLoading=true"
                         @on-finish="onLoadedFile" />
        </div>
      </div>
      <!-- </q-card-section> -->
      <!-- <q-card-section v-if="columns&&columns.length"> -->
      <div class="row q-pa-md">
        <div v-if="loadedReport.wrong.length" class="col-12"
             v-html="$t('messageBox.totalWrong',{total:loadedReport.wrong.length})+'<br/>'+$t('messageBox.wrongIndex')+' '+loadedReport.wrong.join(', ')">
        </div>
      </div>
      <!-- <div class="row"> -->
      <!-- <div class="col-12"> -->
      <q-table v-if="columns&&columns.length" :rows="loadedData" :columns="columns" row-key="_id" flat :visible-columns="visibleColumns"
               :loading="isLoading" :dense="$store.getters.dense.table" :no-data-label="$t('table.noData')"
               :rows-per-page-label="$t('table.rowPerPage')" :selected-rows-label="()=>`${selected.length} ${$t('table.rowSelected')}`"
               :rows-per-page-options="[10, 20, 50, 100, 200, 0]" v-model:pagination="pagination" :filter="pagination.filter" binary-state-sort>
        <template v-slot:top="props">
          <div class="col-12 row">
            <div class="col-xs-12 col-sm-auto q-table__title text-h6">{{$t("files.dataList")}}</div>
            <q-space />
            <div class="col-xs-12 col-sm-auto self-center text-right">
              <div class="col-auto self-center">
                <q-btn flat round dense :color="$q.dark.isActive?'':'grey-7'" icon="menu_open">
                  <q-tooltip v-if="!$q.platform.is.mobile">{{$t("table.displayColumns")}}
                  </q-tooltip>
                  <q-menu fit>
                    <q-list dense style="min-width:100px">
                      <template v-for="(e,i) in columns">
                        <q-item clickable :key="i" v-if="!e.required" @click="onColumns(e.name)"
                                :active="visibleColumns.indexOf(e.name)>-1||false">
                          <q-item-section>{{e.label}}</q-item-section>
                        </q-item>
                      </template>
                    </q-list>
                  </q-menu>
                </q-btn>
                <q-btn flat round dense :color="$q.dark.isActive?'':'grey-7'"
                       :icon="props.inFullscreen?'fullscreen_exit':'fullscreen'" @click="props.toggleFullscreen">
                  <q-tooltip v-if="!$q.platform.is.mobile">
                    {{props.inFullscreen?$t("global.normalScreen"):$t("global.fullScreen")}}
                  </q-tooltip>
                </q-btn>
              </div>
            </div>
          </div>
          <div class="col-12 row">
            <div class="col-xs-12 col-sm-5">
              <q-select v-model="pagination.group" input-debounce="200" :dense="$store.getters.dense.input" :options="groups"
                        :label="$t('users.group')" option-value="code" :option-label="opt=>opt.name" />
            </div>
            <q-space />
            <div class="col-xs-12 col-sm-5">
              <q-input v-model="pagination.filter" :dense="$store.getters.dense.input" debounce="500" :placeholder="$t('global.search')">
                <template v-slot:append>
                  <q-icon v-if="pagination.filter===''" name="search" />
                  <q-icon v-else name="clear" class="cursor-pointer" @click="pagination.filter=''" />
                </template>
              </q-input>
            </div>
          </div>
        </template>
        <!-- <template v-slot:header="props">
            <q-tr :props="props">
              <q-th v-for="col in props.cols" :key="col.name" :props="props">
                <span :class="['text-bold',$q.dark.isActive?'':'text-blue-grey-10']">
                  {{ $t(col.label) }}
                </span>
              </q-th>
            </q-tr>
          </template> -->
        <!-- <template v-slot:body="props">
            <q-tr :props="props">
              <q-td key="username" :props="props">
                {{ props.row.username }}
              </q-td>
              <q-td key="fullName" :props="props">
                {{ props.row.fullName }}
              </q-td>
              <q-td key="email" :props="props">
                {{ props.row.email }}
              </q-td>
              <q-td key="phone" :props="props">
                {{ props.row.phone }}
              </q-td>
            </q-tr>
          </template> -->
      </q-table>
      <!-- </div> -->
      <!-- </div> -->
      <!-- </q-card-section> -->
      <!-- </q-scroll-area> -->
      <!-- </q-card> -->
    </div>
  </div>
</template>

<script>
import { defineComponent, defineAsyncComponent, ref, computed } from 'vue';
import { useStore } from 'vuex'
import { useQuasar } from 'quasar'
import { useI18n } from 'vue-i18n'
import regionData from '@/i18n/region'
import moment from 'moment'
export default defineComponent({
  name: 'UsersImport',
  components: { tmLoadFiles: defineAsyncComponent(() => import('components/tm-load-files')) },
  props: {
    dialog: { type: Boolean, default: false },
    maximized: { type: Boolean, default: false }
  },
  setup () {
    const $store = useStore()
    const $q = useQuasar()
    const { t } = useI18n({ useScope: 'global' })
    const roles = computed(() => $store.state.roles.items)
    const groups = computed(() => $store.state.types.items.filter(x => x.key === 'user_group'))
    const tmLoadFiles = ref(null)
    const isLoading = ref(false)
    const items = ref([])
    const loadedData = ref([])
    const regions = ref(regionData)
    const append = ref(false)
    const loadedReport = ref({ wrong: [], correct: [], success: [], error: [] })
    const pagination = ref({
      filter: '',
      group: '',
      sortBy: 'level',
      descending: false,
      page: 1,
      rowsPerPage: 10,
      // rowsNumber: 1,
      enable: true
    })
    const visibleColumns = ref([])
    const columns = ref([])

    const onReset = () => {
      new Promise((resolve, reject) => {
        loadedData.value = []
        items.value = []
        if (tmLoadFiles.value) tmLoadFiles.value.reset()
        loadedReport.value = { wrong: [], correct: [], success: [], error: [] }
        resolve()
      })
    }
    onReset()

    return {
      groups, tmLoadFiles, isLoading, loadedData, append, loadedReport, pagination, visibleColumns, columns,
      onLoadedFile (data) {
        try {
          if (!append.value) {
            items.value = []
            loadedData.value = []
            loadedReport.value = { wrong: [], correct: [], success: [], error: [] }
          }
          if (!data) {
            $q.notify({ message: t('error.exist'), color: 'warning' })
            return null
          }
          if (data.length < 2) return
          console.log(data)
          columns.value = []
          Object.keys(data[0]).forEach(e => {
            columns.value.push({
              name: e,
              field: e,
              label: data[0][e],
              align: 'left',
              sortable: true
            })
            visibleColumns.value.push(e)
          })
          for (let i = 1; i < data.length; i++) {
            const e = data[i]
            const item = {}
            // Check username
            if (e.A) {
              e.A = e.A.toString().trim()
              item.username = e.A
            } else {
              loadedReport.value.wrong.push(`${i}.A`)
              continue
            }
            if (e.B) {
              e.B = e.B.toString().trim()
              item.password = e.B
            } else {
              loadedReport.value.wrong.push(`${i}.B`)
              continue
            }
            if (e.C) {
              e.C = e.C.toString().trim()
              item.fullName = e.C
            } else {
              loadedReport.value.wrong.push(`${i}.B`)
              continue
            }
            if (e.D) {
              e.D = e.D.toString().trim()
              item.email = e.D
            }
            if (e.E) {
              e.E = e.E.toString().trim()
              // e.E = e.E.trim()
              item.phone = e.E
            }
            if (e.F) {
              e.F = e.F.toString().trim()
              item.personNumber = e.F
            }
            if (e.G) {
              e.G = e.G.toString().trim()
              item.region = regions.value.find(x => `${x.cc_iso}-${x.cc}` === e.G)
              if (item.region) {
                e.G = item.region.name_l
                item.region = item.region.id
              } else e.G = ''
            }
            if (e.H) {
              e.H = e.H.toString().trim()
              item.dateBirth = moment(e.H, 'DD/MM/YYYY')
            }
            if (e.I) {
              item.gender = $store.getters.genders.find(x => x.id === e.I)
              if (item.gender) {
                e.I = t(`gender.${item.gender.code}`)
                item.gender = item.gender.id
              } else e.I = ''
            }
            if (e.J) {
              e.J = e.J.toString().trim()
              item.address = e.J
            }
            if (e.K) {
              e.K = e.K.toString().trim()
              item.group = groups.value.find(x => x.code === e.K)
              if (item.group) {
                e.K = item.group.name
                item.group = item.group.code
              } else {
                loadedReport.value.wrong.push(`${i}.K`)
                continue
              }
            }
            if (e.L) {
              const _roles = e.L.toString().trim().split(';')
              if (!_roles.length) {
                loadedReport.value.wrong.push(`${i}.L1`)
                continue
              }
              item.roles = []
              e.L = []
              _roles.forEach(r => {
                const tmp = roles.value.find(x => x.key === r)
                if (tmp) {
                  item.roles.push(tmp.id)
                  e.L.push(tmp.label)
                }
              })
              if (!item.roles.length) {
                loadedReport.value.wrong.push(`${i}.L2`)
                continue
              }
              e.L = e.L.join(', ')
            }
            if (e.M) {
              item.enable = e.M.toString().trim().toLowerCase() === 'true'
              e.M = item.enable
            }
            if (e.N) {
              e.N = e.N.toString().trim()
              item.avatar = e.N
            }
            if (e.O) {
              e.O = e.O.toString().trim()
              item.note = e.O
            }
            items.value.push(item)
            loadedData.value.push(e)
          }
          // pagination
          // const pagination = Pagination(questions.value, pagination.value.page, pagination.value.rowsPerPage)
          // items.value = pagination.data
          // pagination.value.rowsNumber = pagination.totalPage
          // pagination.value.rowsNumber = Math.ceil(items.length / limit);
          isLoading.value = false
        } catch (error) {
          // console.log(error)
          $q.notify({ message: error, color: 'negative' })
          isLoading.value = false
        }
      },
      onColumns (val) {
        var i = visibleColumns.value.indexOf(val)
        if (i < 0) visibleColumns.value.push(val)
        else visibleColumns.value.splice(i, 1)
      },
      onSubmit () {
        isLoading.value = true
        if (!items.value) {
          $q.notify({ message: t('error.exist'), color: 'warning' })
          isLoading.value = false
          return null
        }
        $store.dispatch('users/imports').then((x) => {
          onReset()
          loadedReport.value.success = x.success
          loadedReport.value.error = x.error
        }).finally(() => { isLoading.value = false })
      }
    }
  }
})
</script>

<style>
</style>
