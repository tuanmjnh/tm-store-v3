<template>
  <q-card>
    <q-toolbar>
      <div class="col-auto">
        <q-btn flat dense icon="arrow_back" v-close-popup />
      </div>
      <q-toolbar-title class="text-subtitle1">
        {{data._id?`${$t('route.edit')} ${$t("route.roles").toLowerCase()}`:`${$t('route.add')} ${$t("route.roles").toLowerCase()}`}}
      </q-toolbar-title>
      <q-btn icon="offline_pin" flat round dense color="blue" class="q-mr-sm" @click="onSubmit(1)" />
      <q-btn icon="draw" flat round dense color="amber" @click="onSubmit(0)" />
    </q-toolbar>

    <q-separator />
    <q-card-section class="q-pa-none">
      <q-form ref="form">
        <tm-tabs v-model="tabs" narrow-indicator :dense="$store.getters.dense.form" class="text-blue" align="justify">
          <q-tab name="main" :label="$t('tabs.main')" />
          <q-tab name="routes" label="Menu" />
        </tm-tabs>
        <q-separator />
        <q-scroll-area style="height:calc(100vh - 99px)">
          <q-tab-panel name="main" id="tab-main">
            <div class="row">
              <div class="col-12">
                <q-input v-model.trim="data.name" :dense="$store.getters.dense.input"
                         :label="$t('roles.name')" :rules="[v=>v&&v.length>0||$t('error.required')]" />
              </div>
            </div>
            <div class="row">
              <div class="col-12">
                <q-input v-model.trim="data.key" :dense="$store.getters.dense.input" v-lowerCase
                         :label="$t('roles.key')" :rules="[v=>v&&v.length>0||$t('error.required')]" />
              </div>
            </div>
            <div class="row">
              <div class="col-12">
                <q-input v-model="data.level" type="number" :dense="$store.getters.dense.input"
                         :label="$t('global.level')" :rules="[v=>v!==null&&v!==''||$t('error.required')]" />
              </div>
            </div>
            <div class="row">
              <div class="col-12 col-md-6 self-center">
                {{$t('global.colorPick')}}:
                <q-badge class="cursor-pointer" :style="{backgroundColor:data.color}">
                  {{data.color}}
                  <q-popup-proxy>
                    <q-color v-model="data.color" />
                  </q-popup-proxy>
                </q-badge>
                <div class="float-right q-mr-sm">
                  <q-icon name="update" class="cursor-pointer text-secondary" style="font-size:20px" @click="data.color='#607d8b'" />
                  <q-icon name="sync" class="cursor-pointer text-primary" style="font-size:20px" @click="onRandomColor" />
                </div>
              </div>
            </div>
          </q-tab-panel>
          <q-tab-panel name="routes" id="tab-routes">
            <q-tree ref="treeRoute" class="col-12 col-sm-6" :nodes="routes"
                    :dense="$store.getters.dense.input" node-key="name" node-label="label"
                    v-model:ticked="data.routes"
                    tick-strategy="strict" :no-nodes-label="$t('table.noData')"
                    default-expand-all>
              <template v-slot:default-header="prop">
                <div class="row items-center">
                  <q-icon :name="prop.node.meta.icon" color="blue-grey" size="20px" class="q-mr-sm" />
                  <div class="q-pr-md">{{$t(`route.${prop.node.meta.title}`) }}</div>
                </div>
              </template>
            </q-tree>
          </q-tab-panel>
        </q-scroll-area>
      </q-form>
    </q-card-section>
  </q-card>
</template>

<script>
import { defineComponent, defineAsyncComponent, ref } from "vue";
import { useStore } from 'vuex'
import { dynamic } from '@/router/routes'
import { RandomColor } from '../../../../global/utils/color'
export default defineComponent({
  name: "RolesAdd",
  components: {
    tmTabs: defineAsyncComponent(() => import('components/tm-tabs'))
  },
  setup () {
    const $store = useStore()
    const tabs = ref('main')
    const form = ref(null)
    const data = ref({})
    const treeRoute = ref(null)
    // tree_nodes: this.routes,
    const routes = dynamic.slice()

    const onReset = () => {
      return new Promise((resolve, reject) => {
        if ($store.state.roles.item) data.value = { ...$store.state.roles.item }
        resolve()
      }).then(() => { if (form.value) form.value.resetValidation() })
    }

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

    onReset()

    return {
      tabs, form, data, treeRoute, routes,
      onRandomColor: () => {
        data.value.color = RandomColor(true)
      },
      onSubmit: (flag) => {
        form.value.validate().then(valid => {
          if (valid) {
            data.value.flag = flag
            if ($store.state.roles.item._id) $store.dispatch('roles/put', data.value)
            else $store.dispatch('roles/post', data.value).then(onReset())
          }
        })
      }
    }
  }
})
</script>
