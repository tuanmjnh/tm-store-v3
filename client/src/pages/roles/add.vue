<template>
  <div>
    <div class="row card-title">
      <div class="col-sm-auto col-xs-12 text-h6 card-title-text">
        <q-avatar v-if="dialog" :icon="$route.meta.icon" size="50px" />
        {{ $store.state.roles.item._id ? $t('global.update') : $t('global.add') }}
        <span class="text-weight-bold">{{ $t("roles.title") }}</span>
      </div>
      <q-space />
      <div class="col-sm-auto col-xs-12 text-right">
        <q-btn v-if="$store.state.roles.item._id" flat type="submit" :dense="$store.getters.dense.button" color="amber"
               icon="offline_pin" :loading="$store.state.app.loading.put" @click.prevent="onSubmit">
          <!-- :label="dialog?'':$t('global.update')" -->
          <q-tooltip>{{$t('global.update')}}</q-tooltip>
        </q-btn>
        <q-btn v-if="!$store.state.roles.item._id" flat type="submit" :dense="$store.getters.dense.button" color="blue"
               icon="check_circle" :loading="$store.state.app.loading.post"
               @click.prevent="onSubmit">
          <!-- :label="dialog?'':$t('global.add')" -->
          <q-tooltip>{{$t('global.add')}}</q-tooltip>
        </q-btn>
        <q-btn v-if="dialog" flat round dense :color="$store.state.app.darkMode?'':'grey-7'"
               :icon="maximized?'fullscreen_exit':'fullscreen'" :disable="$store.state.app.loading.post||$store.state.app.loading.put"
               @click="$emit('update:maximized',!maximized)">
          <q-tooltip>
            {{maximized?$t('global.normalScreen'):$t('global.fullScreen')}}
          </q-tooltip>
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
              <div class="col-12 col-md-6">
                <q-input v-model.trim="data.name" :dense="$store.getters.dense.input"
                         :label="$t('roles.name')" :rules="[v=>v&&v.length>0||$t('error.required')]" />
              </div>
              <q-space />
              <div class="col-12 col-md-5">
                <q-input v-model.trim="data.key" :dense="$store.getters.dense.input" v-lowerCase
                         :label="$t('roles.key')" :rules="[v=>v&&v.length>0||$t('error.required')]" />
              </div>
            </div>
            <div class="row q-gutter-xs">
              <div class="col">
                <q-input v-model="data.level" type="number" :dense="$store.getters.dense.input"
                         :label="$t('global.level')" :rules="[v=>v!==null&&v!==''||$t('error.required')]"
                         class="col-md-4" />
              </div>
              <q-space />
              <div class="col-5 self-center">
                <q-toggle v-model="data.flag" :true-value="1" :dense="$store.getters.dense.input"
                          :label="data.flag?$t('global.publish'):$t('global.drafts')" />
              </div>
              <q-space />
              <div class="col self-center">
                {{$t('global.colorPick')}}:
                <q-badge class="cursor-pointer" :style="{backgroundColor:data.color}" @click="isDialogColorPick=true">{{data.color}}</q-badge>
                <div class="float-right q-mr-sm">
                  <q-icon name="sync" class="cursor-pointer text-primary" style="font-size:20px" @click="onRandomColor" />
                </div>
              </div>
            </div>
            <q-input v-model.trim="data.desc" autogrow :dense="$store.getters.dense.input"
                     :label="$t('global.desc')" />
          </q-tab-panel>
          <q-tab-panel name="routes">
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
import { defineComponent, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useStore } from 'vuex'
import { dynamic } from '@/router/routes'
import { RandomColor } from '@/utils/color'
export default defineComponent({
  name: 'RolesAdd',
  props: {
    dialog: { type: Boolean, default: false },
    maximized: { type: Boolean, default: false }
  },
  setup () {
    const $route = useRoute()
    const $store = useStore()
    const isDialogColorPick = ref(false)
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
      isDialogColorPick, tabs, form, data, treeRoute, routes,
      onRandomColor: () => {
        data.value.color = RandomColor(true)
      },
      onSubmit: () => {
        form.value.validate().then(valid => {
          if (valid) {
            if ($store.state.roles.item._id) $store.dispatch('roles/put', data.value)
            else $store.dispatch('roles/post', data.value).then(onReset())
          }
        })
      }
    }
  }
})
</script>

<style>
</style>
