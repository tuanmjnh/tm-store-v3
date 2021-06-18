<template>
  <q-card style="width:700px;max-width:80vw">
    <q-toolbar>
      <q-avatar :icon="$route.meta.icon" size="50px" />
      <q-toolbar-title>
        {{this.item?$t('global.update'):$t('global.add')}}
        <span class="text-weight-bold">routes</span>
      </q-toolbar-title>
      <q-btn flat round dense icon="close" v-close-popup :disable="loading">
        <q-tooltip v-if="!$q.platform.is.mobile">{{$t('global.cancel')}}</q-tooltip>
      </q-btn>
    </q-toolbar>
    <q-separator />
    <q-form ref="form">
      <q-card-actions v-if="item" align="right">
        <q-btn flat type="submit" :dense="$store.getters.dense.button" color="amber"
          icon="offline_pin" :label="$t('global.update')" :loading="loading"
          @click.prevent="onSubmit">
          <!-- <q-tooltip>{{$t('global.add')}}</q-tooltip> -->
        </q-btn>
      </q-card-actions>
      <q-card-actions v-else align="right">
        <q-btn flat type="submit" :dense="$store.getters.dense.button" color="blue"
          icon="check_circle" :label="$t('global.add')" :loading="loading"
          @click.prevent="onSubmit()">
          <!-- <q-tooltip>{{$t('global.add')}}</q-tooltip> -->
        </q-btn>
      </q-card-actions>
      <q-tabs v-model="tabs" narrow-indicator :dense="$store.getters.dense.form"
        class="text-deep-purple" align="justify">
        <q-tab name="main" :label="$t('tabs.main')" />
        <q-tab name="attributes" :label="$t('global.attributes')" />
      </q-tabs>
      <q-separator />
      <!-- <q-card-section> -->
      <q-tab-panels v-model="tabs" animated>
        <q-tab-panel name="main">
          <div class="row q-gutter-xs">
            <div class="col-12 col-md-5">
              Dependent: <q-badge color="blue">{{dependent?dependent.label:'Root'}}</q-badge>
            </div>
            <q-space />
            <div class="col-12 col-md-6">
              Level: <q-badge color="blue">{{form.level||1}}</q-badge>
            </div>
          </div>
          <div class="row q-gutter-xs">
            <div class="col-12 col-md-5">
              <q-input v-model.trim="form.path" :dense="$store.getters.dense.input" v-lowercase
                label="Path" :rules="[v=>v&&v.length>0||$t('error.required')]" />
            </div>
            <q-space />
            <div class="col-12 col-md-6">
              <q-input v-model.trim="form.name" :dense="$store.getters.dense.input" label="Name"
                :rules="[v=>v&&v.length>0||$t('error.required')]"
                :prefix="!item&&dependent?`${dependent.name}-`:''" />
            </div>
          </div>
          <div class="row q-gutter-xs">
            <div class="col-12 col-md-5">
              <q-input v-model.trim="form.component" :dense="$store.getters.dense.input" v-lowercase
                label="Component" :rules="[v=>v&&v.length>0||$t('error.required')]">
                <template v-slot:append>
                  <q-icon name="view_quilt" @click="form.component='layout'" />
                </template>
              </q-input>
            </div>
            <q-space />
            <div class="col-12 col-md-6">
              <q-input v-model.trim="form.redirect" :dense="$store.getters.dense.input"
                label="Redirect" />
            </div>
          </div>
          <div class="row q-gutter-xs">
            <div v-if="form.meta&&form.meta.title" class="col-12 col-md-5">
              <q-input v-model.trim="form.meta.title" :dense="$store.getters.dense.input"
                v-lowercase label="Title" :rules="[v=>v&&v.length>0||$t('error.required')]" />
            </div>
            <q-space />
            <div v-if="form.meta&&form.meta.icon" class="col-12 col-md-6">
              <q-input v-model.trim="form.meta.icon" :dense="$store.getters.dense.input"
                label="Icon">
                <template v-slot:append>
                  <q-icon :name="form.meta.icon" /></template>
              </q-input>
            </div>
          </div>
          <div class="row q-gutter-xs">
            <div class="col-8 col-md-3">
              <q-input v-model="form.orders" type="number" :dense="$store.getters.dense.input"
                :label="$t('global.order')" :rules="[v=>v!==null&&v!==''||$t('error.required')]"
                class="col-md-4" />
            </div>
            <q-space />
            <div v-if="form.meta&&form.meta.hidden" class="col-5 col-md-3 self-center">
              <q-toggle v-model="form.meta.hidden" :dense="$store.getters.dense.input"
                :true-value="true" label="Hidden" />
            </div>
            <div class="col-1 col-md-3 self-center">
              <q-toggle v-model="form.flag" :dense="$store.getters.dense.input" :true-value="1"
                label="Flag" />
            </div>
          </div>
        </q-tab-panel>
        <q-tab-panel name="attributes">
          <tm-attributes :data.sync="metas" :keys="metaKeys" :values="metaValues"
            :dense="$store.getters.dense.input" :labelTitle="$t('product.attributes')+':'"
            :labelBtnAdd="$t('global.add')" :labelInputKey="$t('global.key')"
            :labelInputValue="$t('global.value')" btnIcon="add" btnColor="blue"
            :btnEditLabel="$t('global.edit')" :btnDeleteLabel="$t('global.delete')"
            :labelConfirmTitle="$t('messageBox.confirm')"
            :labelConfirmContent="$t('messageBox.delete')"
            :labelWarningTitle="$t('messageBox.warning')"
            :labelWarningContent="$t('error.required')" :labelNoData="$t('table.no_data')"
            @on-filter-key="onFilterAttrKey" @on-filter-value="onFilterAttrValue">
          </tm-attributes>
        </q-tab-panel>
      </q-tab-panels>
      <!-- </q-card-section> -->
    </q-form>
  </q-card>
</template>

<script>
import * as apiRoutes from '@/api/routes'
export default {
  components: { tmAttributes: () => import('@/components/tm-attributes') },
  props: {
    dialog: { type: Boolean, default: false },
    item: { type: Object, default: null },
    items: { type: Array, default: () => [] },
    dependent: { type: Object, default: () => null },
    expanded: { type: Array, default: () => [] }
  },
  data() {
    return {
      loading: false,
      tabs: 'main',
      form: {},
      metas: [],
      metaKeys: [],
      metaValues: [],
      default: {
        path: '',
        name: '',
        component: 'layout',
        dependent: null,
        level: 1,
        redirect: '',
        orders: 1,
        meta: [], // { title: '', icon: '', hidden: false },
        flag: 1
      }
    }
  },
  watch: {
    dialog: {
      handler(val) {
        this.reset()
        if (this.item) {
          this.form = { ...this.item }
          if (this.form.meta) this.metas = [...this.form.meta]
        }
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    onFilterAttrKey(val) {
      if (!val) return
      this.metaKeys = []
      apiRoutes.getMeta({ key: true, filter: val, page: 1, rowsPerPage: 5 }).then((x) => {
        if (x) this.metaKeys = x.data
      })
    },
    onFilterAttrValue(val) {
      if (!val) return
      this.metaValues = []
      apiRoutes.getMeta({ filter: val, page: 1, rowsPerPage: 5 }).then((x) => {
        if (x) this.metaValues = x.data
      })
    },
    onSubmit() {
      // console.log(this.item)
      this.$refs.form.validate().then(valid => {
        if (valid) {
          if (!this.form.component) this.form.component = 'layout'
          this.form.meta = this.metas
          if (this.item) {
            this.loading = true
            apiRoutes.update(this.form).then((x) => {
              if (x.ok) {
                if (!this.dependent) {
                  const index = this.items.indexOf(this.item)
                  if (index > -1) this.items.splice(index, 1, this.form)
                } else {
                  const index = this.dependent.children.indexOf(this.item)
                  if (index > -1) this.dependent.children.splice(index, 1, this.form)
                }
              }
            }).finally(() => {
              this.loading = false
            })
          } else {
            this.loading = true
            if (this.dependent) this.form.name = `${this.dependent.name}-${this.form.name}`
            apiRoutes.insert(this.form).then((x) => {
              if (this.dependent) {
                this.expanded.push(x._id)
                if (!this.dependent.children) this.dependent.children = []
                this.dependent.children.push(x)
              } else this.items.push(x)
            }).finally(() => {
              this.loading = false
              this.reset()
            })
          }
        }
      })
    },
    getDependent() {
      if (this.dependent) return this.$t(`route.${this.dependent.label}`)
      else return 'Root'
    },
    reset() {
      new Promise((resolve, reject) => {
        this.form = { ...this.default }
        if (this.dependent) {
          this.form.dependent = this.dependent._id
          this.form.level = this.dependent.level + 1
        }
        this.attributes = {}
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
