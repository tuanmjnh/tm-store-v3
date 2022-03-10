<template>
  <div>
    <div class="row card-title">
      <div class="col-sm-auto col-xs-12 text-h6 card-title-text">
        <q-avatar v-if="dialog" :icon="$route.meta.icon" size="50px" />
        {{ item ? $t('global.update') : $t('global.add') }}
        <span class="text-weight-bold">{{ $t("roles.title") }}</span>
      </div>
      <q-space />
      <div class="col-sm-auto col-xs-12 text-right">
        <q-btn v-if="item" flat type="submit" :dense="$store.getters.dense.button" color="amber"
               icon="offline_pin" :loading="isLoadingAdd" @click.prevent="onSubmit">
          <!-- :label="dialog?'':$t('global.update')" -->
          <q-tooltip>{{$t('global.update')}}</q-tooltip>
        </q-btn>
        <q-btn v-if="!item" flat type="submit" :dense="$store.getters.dense.button" color="blue"
               icon="check_circle" :loading="isLoadingAdd" :disable="isLoadingDrafts"
               @click.prevent="onSubmit(1)">
          <!-- :label="dialog?'':$t('global.add')" -->
          <q-tooltip>{{$t('global.add')}}</q-tooltip>
        </q-btn>
        <q-btn v-if="!item" flat type="submit" :dense="$store.getters.dense.button" color="amber"
               icon="receipt" :loading="isLoadingDrafts" :disable="isLoadingAdd"
               @click.prevent="onSubmit(0)">
          <!-- :label="dialog?'':$t('global.drafts')" -->
          <q-tooltip>{{$t('global.drafts')}}</q-tooltip>
        </q-btn>
        <q-btn v-if="dialog" flat round dense :color="$store.state.app.darkMode?'':'grey-7'"
               :icon="maximized?'fullscreen_exit':'fullscreen'" :disable="isLoading"
               @click="$emit('update:maximized',!maximized)">
          <q-tooltip>
            {{maximized?$t('global.normalScreen'):$t('global.fullScreen')}}
          </q-tooltip>
        </q-btn>
        <q-btn v-if="dialog" flat round dense icon="close" :disable="isLoading" v-close-popup>
          <q-tooltip>{{$t('global.cancel')}}</q-tooltip>
        </q-btn>
        <q-btn v-else flat round dense icon="reply" :disable="isLoading"
               @click="$router.push('view')">
          <q-tooltip>{{$t('global.back')}}</q-tooltip>
        </q-btn>
      </div>
    </div>
    <q-separator />
    <q-form ref="form">
      <q-tabs v-model="tabs" narrow-indicator :dense="$store.getters.dense.form"
              class="text-deep-purple" align="justify">
        <q-tab name="main" :label="$t('tabs.main')" />
        <q-tab name="routes" label="Menu" />
      </q-tabs>
      <q-separator />
      <!-- <q-card-section> -->
      <q-scroll-area style="height:calc(100vh - 180px)">
        <q-tab-panels v-model="tabs">
          <q-tab-panel name="main">
            <div class="row q-gutter-xs">
              <div class="col-12 col-md-5">
                <q-input v-model.trim="data.key" :dense="$store.getters.dense.input" v-lowercase
                         :label="$t('roles.key')" :rules="[v=>v&&v.length>0||$t('error.required')]" />
              </div>
              <q-space />
              <div class="col-12 col-md-6">
                <q-input v-model.trim="data.name" :dense="$store.getters.dense.input"
                         :label="$t('roles.name')" :rules="[v=>v&&v.length>0||$t('error.required')]" />
              </div>
            </div>
            <div class="row q-gutter-xs">
              <div class="col">
                <q-input v-model="data.level" type="number" :dense="$store.getters.dense.input"
                         :label="$t('global.level')" :rules="[v=>v!==null&&v!==''||$t('error.required')]"
                         class="col-md-4" />
              </div>
              <q-space v-if="item" />
              <div class="col-5 self-center" v-if="item">
                <q-toggle v-model="data.flag" :true-value="1" :dense="$store.getters.dense.input"
                          :label="data.flag?$t('global.publish'):$t('global.drafts')" />
              </div>
              <q-space />
              <div class="col self-center">
                {{$t('global.colorPick')}}:
                <q-badge :style="{backgroundColor:data.color}" @click="isDialogColorPick=true">
                  {{data.color}}</q-badge>
              </div>
            </div>
            <q-input v-model.trim="data.desc" autogrow :dense="$store.getters.dense.input"
                     :label="$t('global.desc')" />
          </q-tab-panel>
          <q-tab-panel name="routes">
            <q-tree ref="treeRoute" class="col-12 col-sm-6" :nodes="routes"
                    :dense="$store.getters.dense.input" node-key="name" node-label="label"
                    v-model:selected="selected" v-model:ticked="data.routes" v-model:expanded="expanded"
                    tick-strategy="strict" :no-nodes-label="$t('table.noData')"
                    default-expand-all>
              <template v-slot:default-header="prop">
                <div class="row items-center">
                  <q-icon :name="prop.node.meta.icon" color="blue-grey" size="20px" class="q-mr-sm" />
                  <div class="q-pr-md">{{$t(`route.${prop.node.meta.title}`) }}</div>
                </div>
              </template>
            </q-tree>
            <div class="row">
              {{data.routes}}
            </div>
            <!-- <q-btn flat color="positive" icon="check_circle" :label="$t('global.add')" @click="onTicked">
          </q-btn> -->
          </q-tab-panel>
        </q-tab-panels>
      </q-scroll-area>
      <!-- </q-card-section> -->
    </q-form>
    <!-- Dialog color pick -->
    <q-dialog v-model="isDialogColorPick">
      <q-card>
        <q-toolbar>
          <q-toolbar-title>{{$t('global.colorPick')}}</q-toolbar-title>
          <q-btn flat round dense icon="close" v-close-popup>
            <q-tooltip>{{$t('global.cancel')}}</q-tooltip>
          </q-btn>
        </q-toolbar>
        <q-card-section>
          <q-color v-model="data.color" />
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import { defineComponent, ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import * as apiRoles from '@/api/roles'
import { dynamic } from '@/router/routes'
export default defineComponent({
  name: 'RolesAdd',
  props: {
    dialog: { type: Boolean, default: false },
    item: { type: Object, default: () => { } },
    // routes: { type: Array, default: () => [] },
    rootRoutes: { type: Array, default: () => [] },
    maximized: { type: Boolean, default: false }
  },
  setup (props, { emit }) {
    const $route = useRoute()
    const isLoading = ref(false)
    const isLoadingAdd = ref(false)
    const isLoadingDrafts = ref(false)
    const isDialogColorPick = ref(false)
    const tabs = ref('main')
    const form = ref(null)
    const data = ref({})
    const treeRoute = ref(null)
    const selected = ref('')
    const expanded = ref([])
    // tree_nodes: this.routes,
    const routes = dynamic.slice()
    const constant = ref({
      key: '',
      name: '',
      desc: '',
      level: 1,
      color: '#027be3',
      routes: ['dashboard'],
      flag: 1
    })

    const onFindById = (id) => {
      apiRoles.find({ '_id': id }).then((x) => { data.value = x })
    }
    // getRoles() {
    //   roles.getAll()
    //     .then((x) => { roles.value = x })
    //     .catch((err) => { this.$message.error(this.$t(err.message)) })
    // },
    const onSubmit = (action) => {
      // console.log(props.item)
      form.value.validate().then(valid => {
        if (valid) {
          if (props.item || $route.query.id) {
            isLoadingAdd.value = true
            apiRoles.update(data.value).then((x) => {
              if (x.ok) emit('update:item', { m: 2, data: data.value })
            }).finally(() => {
              isLoadingAdd.value = false
            })
          } else {
            data.value.flag = action
            if (action) isLoadingAdd.value = true
            else isLoadingDrafts.value = true
            apiRoles.insert(data.value).then((x) => {
              if (x) emit('update:item', { m: 1, data: data.value })
              onReset()
            }).finally(() => {
              isLoadingAdd.value = false
              isLoadingDrafts.value = false
            })
          }
        }
      })
    }
    // const onTickedUpdate = (ticked) => {
    //   nextTick(() => {
    //     // onGetNodeParents(treeRoute.value.nodes, ticked, 'name')
    //     // console.log(treeRoute.value)
    //     console.log(ticked)
    //   })
    // }
    const onGetNodeParents = (nodes, ticked, key) => {
      for (const e of nodes) {
        if (e.children && e.children.length) {
          const rs = onGetNodeParents(e.children, ticked, key)
          if (rs) {
            if (ticked.indexOf(e[key]) > -1) continue
            else {
              ticked.pushIfNotExist(e[key])
              return e
            }
          } else {
            const i = ticked.indexOf(e[key])
            if (i > -1) ticked.splice(i, 1)
            continue
          }
        } else {
          if (ticked.indexOf(e[key]) > -1) return e
        }
      }
    }
    const onReset = () => {
      new Promise((resolve, reject) => {
        emit('update:maximized', false)
        data.value = { ...constant.value }
        resolve()
      }).then(() => {
        if (form.value) form.value.resetValidation()
      })
    }

    onMounted(() => {
      if ($route.query.id) onFindById($route.query.id)
    })

    watch(() => props.dialog, (state, prevState) => {
      onReset()
      if (props.item) data.value = { ...props.item }
    }, { deep: true, immediate: true })

    return {
      isLoading, isLoadingAdd, isLoadingDrafts, isDialogColorPick, tabs, form, data, treeRoute, selected, expanded, constant, routes,
      onSubmit
    }
  }
})
</script>

<style>
</style>
