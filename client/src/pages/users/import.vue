<template>
  <div>
    <div class="row card-title">
      <div class="col-sm-auto col-xs-12 text-h6 card-title-text">
        <q-avatar v-if="dialog" :icon="$route.meta.icon" size="50px" />
        {{ $t('files.import')}} {{$t('users.title') }}
      </div>
      <q-space />
      <div class="col-sm-auto col-xs-12 text-right">
        <q-btn flat icon="publish" :label="dialog?'':$t('global.process')" color="indigo"
               @click="onSubmit">
          <q-tooltip v-if="dialog">{{$t('global.process')}}</q-tooltip>
        </q-btn>
        <q-btn v-if="dialog" flat round dense :color="$store.state.app.darkMode?'':'grey-7'"
               :icon="maximized?'fullscreen_exit':'fullscreen'" :disable="loading"
               @click="$emit('update:maximized',!maximized)">
          <q-tooltip>
            {{maximized?$t('global.normalScreen'):$t('global.fullScreen')}}
          </q-tooltip>
        </q-btn>
        <q-btn v-if="dialog" flat round dense icon="close" :disable="loading" v-close-popup>
          <q-tooltip>{{$t('global.cancel')}}</q-tooltip>
        </q-btn>
        <q-btn v-else flat round dense icon="reply" :disable="loading"
               @click="$router.push('view')">
          <q-tooltip>{{$t('global.back')}}</q-tooltip>
        </q-btn>
      </div>
    </div>
    <q-separator />
    <q-form ref="form">
      <q-scroll-area style="height:calc(100vh - 180px)">
        <q-card-section>
          <!-- <div class="row q-gutter-xs">
        <div class="col-12">
          <q-select v-model="group" input-debounce="200" :dense="$store.getters.dense.input"
            :options="groups" :label="$t('users.group')" option-value="code"
            :option-label="opt=>opt.name" :rules="[v=>!!v||$t('error.required')]" />
        </div>
      </div> -->
          <!-- https://docs.google.com/spreadsheets/d/15F3mYued4CDTzHrcpCvrWQrr_ULGxqhLTu5-CYRjOBk/edit?usp=sharing -->
          <div class="row q-gutter-xs">
            <div class="col-5">
            </div>
          </div>
          <div class="row q-gutter-xs">
            <div class="col-3">
              <q-checkbox v-model="append" :label="$t('global.append')" />
            </div>
            <q-space />
            <div class="col-8">
              <!-- $t('files.open_file') -->
              <tm-load-files ref="tmLoadFiles" :button="true" label="" attachLabel="template"
                             attach="https://docs.google.com/spreadsheets/d/15F3mYued4CDTzHrcpCvrWQrr_ULGxqhLTu5-CYRjOBk"
                             :placeholder="$t('files.chooseFile')" accept=".xls,.xlsx,.csv,.tsv,.txt,.json,.xml"
                             @on-start="loading=true" @on-finish="onLoadedFile"
                             :options="{header:'A',raw:true}" />
            </div>
          </div>
        </q-card-section>
        <q-card-section>
          <div v-if="loadedReport.wrong.length" class="col-12"
               v-html="$t('question.msgPushWrong',{total:loadedReport.wrong.length})+'<br/>'+$t('question.msgPushWrongDetails')+loadedReport.wrong.join(', ')">
          </div>
          <div class="col-12">
            <q-table :data="loadedData" :columns="columns" row-key="_id" flat
                     :visible-columns="visibleColumns" :loading="loading"
                     :dense="$store.getters.dense.table" :no-data-label="$t('table.noData')"
                     :rows-per-page-label="$t('table.rowPerPage')"
                     :selected-rows-label="()=>`${selected.length} ${$t('table.rowSelected')}`"
                     :rows-per-page-options="[10, 20, 50, 100, 200, 0]" v-model:pagination="pagination"
                     :filter="pagination.filter" binary-state-sort>
              <template v-slot:top="props">
                <div class="col-12 row">
                  <div class="col-xs-12 col-sm-auto q-table__title text-h6">
                    {{ $t("files.dataList") }}
                  </div>
                  <q-space />
                  <div class="col-xs-12 col-sm-auto self-center text-right">
                    <div class="col-auto self-center">
                      <q-btn flat round dense :color="$store.getters.darkMode ? '' : 'grey-7'"
                             icon="menu_open">
                        <q-tooltip v-if="!$q.platform.is.mobile">{{ $t("table.displayColumns")}}
                        </q-tooltip>
                        <q-menu fit>
                          <q-list dense style="min-width:100px">
                            <template v-for="(e,i) in columns">
                              <q-item clickable :key="i" v-if="!e.required"
                                      @click="onColumns(e.name)"
                                      :active="visibleColumns.indexOf(e.name) > -1 || false">
                                <q-item-section>{{ e.label }}</q-item-section>
                              </q-item>
                            </template>
                          </q-list>
                        </q-menu>
                      </q-btn>
                      <q-btn flat round dense :color="$store.getters.darkMode ? '' : 'grey-7'"
                             :icon="props.inFullscreen ? 'fullscreen_exit' : 'fullscreen'"
                             @click="props.toggleFullscreen">
                        <q-tooltip v-if="!$q.platform.is.mobile">
                          {{props.inFullscreen? $t("global.normalScreen"): $t("global.fullScreen")}}
                        </q-tooltip>
                      </q-btn>
                    </div>
                  </div>
                </div>
                <div class="col-12 row">
                  <div class="col-xs-12 col-sm-5">
                    <q-select v-model="pagination.group" input-debounce="200"
                              :dense="$store.getters.dense.input" :options="groups"
                              :label="$t('users.group')" option-value="code"
                              :option-label="opt=>opt.name" />
                  </div>
                  <q-space />
                  <div class="col-xs-12 col-sm-5">
                    <q-input v-model="pagination.filter" :dense="$store.getters.dense.input"
                             debounce="500" :placeholder="$t('global.search')">
                      <template v-slot:append>
                        <q-icon v-if="pagination.filter === ''" name="search" />
                        <q-icon v-else name="clear" class="cursor-pointer"
                                @click="pagination.filter = ''" />
                      </template>
                    </q-input>
                  </div>
                </div>
              </template>
              <!-- <template v-slot:header="props">
            <q-tr :props="props">
              <q-th v-for="col in props.cols" :key="col.name" :props="props">
                <span :class="['text-bold',$store.getters.darkMode ? '' : 'text-blue-grey-10']">
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
          </div>
        </q-card-section>
      </q-scroll-area>
    </q-form>
    <!-- </q-card> -->
  </div>
</template>

<script>
import * as apiUsers from '@/api/users'
import regionData from '@/i18n/region'
export default {
  components: { tmLoadFiles: () => import('@/components/tm-load-files') },
  props: {
    dialog: { type: Boolean, default: false },
    groups: { type: Array, default: () => [] },
    roles: { type: Array, default: () => [] },
    maximized: { type: Boolean, default: false }
  },
  data () {
    return {
      loading: false,
      items: [],
      loadedData: [],
      regions: regionData,
      append: false,
      loadedReport: { wrong: [], correct: [], success: [], error: [] },
      pagination: {
        filter: '',
        group: '',
        sortBy: 'level',
        descending: false,
        page: 1,
        rowsPerPage: 10,
        // rowsNumber: 1,
        enable: true
      },
      visibleColumns: [],
      columns: []
      // columns: [
      //   { name: 'username', field: 'username', label: 'users.username', align: 'left', sortable: true, required: true },
      //   { name: 'fullName', field: 'fullName', label: 'users.fullName', align: 'left', sortable: true, required: true },
      //   { name: 'email', field: 'email', label: 'users.email', align: 'left', sortable: true },
      //   { name: 'phone', field: 'phone', label: 'users.phone', align: 'right', sortable: true },
      //   { name: 'roles', field: 'roles', label: 'roles.title', align: 'left', sortable: true },
      //   { name: 'verified', field: 'verified', label: 'users.verified', align: 'left', sortable: true }
      // ]
    }
  },
  watch: {
    dialog: {
      handler (val) {
        this.reset()
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    onLoadedFile (data) {
      try {
        if (!this.append) {
          this.items = []
          this.loadedData = []
          this.loadedReport = { wrong: [], correct: [], success: [], error: [] }
        }
        if (!data) {
          this.$q.notify({
            message: this.$t('error.exist'),
            color: 'warning'
          })
          return null
        }
        if (data.length < 2) return
        this.columns = []
        Object.keys(data[0]).forEach(e => {
          this.columns.push({
            name: e,
            field: e,
            label: data[0][e],
            align: 'left',
            sortable: true
          })
          this.visibleColumns.push(e)
        })
        for (let i = 1; i < data.length; i++) {
          const e = data[i]
          const item = {}
          // Check username
          if (e.A) {
            e.A = e.A.toString().trim()
            item.username = e.A
          } else {
            this.loadedReport.wrong.push(`${i}.A`)
            continue
          }
          if (e.B) {
            e.B = e.B.toString().trim()
            item.password = e.B
          } else {
            this.loadedReport.wrong.push(`${i}.B`)
            continue
          }
          if (e.C) {
            e.C = e.C.toString().trim()
            item.fullName = e.C
          } else {
            this.loadedReport.wrong.push(`${i}.B`)
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
            item.region = this.regions.find(x => `${x.cc_iso}-${x.cc}` === e.G)
            if (item.region) {
              e.G = item.region.name_l
              item.region = item.region.id
            } else e.G = ''
          }
          if (e.H) {
            e.H = e.H.toString().trim()
            item.dateBirth = this.$moment(e.H, 'DD/MM/YYYY')
          }
          if (e.I) {
            item.gender = this.$store.getters.genders.find(x => x.id === e.I)
            if (item.gender) {
              e.I = this.$t(`gender.${item.gender.code}`)
              item.gender = item.gender.id
            } else e.I = ''
          }
          if (e.J) {
            e.J = e.J.toString().trim()
            item.address = e.J
          }
          if (e.K) {
            e.K = e.K.toString().trim()
            item.group = this.groups.find(x => x.code === e.K)
            if (item.group) {
              e.K = item.group.name
              item.group = item.group.code
            } else {
              this.loadedReport.wrong.push(`${i}.K`)
              continue
            }
          }
          if (e.L) {
            const roles = e.L.toString().trim().split(';')
            if (!roles.length) {
              this.loadedReport.wrong.push(`${i}.L1`)
              continue
            }
            item.roles = []
            e.L = []
            roles.forEach(r => {
              const tmp = this.roles.find(x => x.key === r)
              if (tmp) {
                item.roles.push(tmp.id)
                e.L.push(tmp.label)
              }
            })
            if (!item.roles.length) {
              this.loadedReport.wrong.push(`${i}.L2`)
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
          this.items.push(item)
          this.loadedData.push(e)
        }
        // pagination
        // const pagination = Pagination(this.questions, this.pagination.page, this.pagination.rowsPerPage)
        // this.items = pagination.data
        // this.pagination.rowsNumber = pagination.totalPage
        // this.pagination.rowsNumber = Math.ceil(items.length / limit);
        this.loading = false
      } catch (error) {
        // console.log(error)
        this.$q.notify({
          message: error,
          color: 'negative'
        })
        this.loading = false
      }
    },
    onColumns (value) {
      var index = this.visibleColumns.indexOf(value)
      if (index < 0) this.visibleColumns.push(value)
      else this.visibleColumns.splice(index, 1)
    },
    onSubmit () {
      this.loading = true
      if (!this.items) {
        this.$q.notify({
          message: this.$t('error.exist'),
          color: 'warning'
        })
        this.loading = false
        return null
      }
      apiUsers.imports(this.items).then((x) => {
        this.reset()
        this.loadedReport.success = x.success
        this.loadedReport.error = x.error
      }).finally(() => {
        this.loading = false
      })
    },
    reset () {
      new Promise((resolve, reject) => {
        this.$emit('update:maximized', false)
        this.loadedData = []
        this.items = []
        if (this.$refs.tmLoadFiles) this.$refs.tmLoadFiles.reset()
        this.loadedReport = { wrong: [], correct: [], success: [], error: [] }
        resolve()
      }).then(() => {
        if (this.$refs.form) this.$refs.form.resetValidation()
      })
    }
  }
}
</script>

<style>
</style>
