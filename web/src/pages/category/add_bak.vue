<template>
  <div>
    <div class="row card-title">
      <div class="col-sm-auto col-xs-12 text-h6 card-title-text">
        <q-avatar v-if="dialog" :icon="$route.meta.icon" size="50px" />
        {{ this.item ? $t('global.update') : $t('global.add') }}
        <span class="text-weight-bold">{{  $t(`category.title_${$route.meta.type}`) }}</span>
      </div>
      <q-space />
      <div class="col-sm-auto col-xs-12 text-right">
        <q-btn v-if="item" flat type="submit" :dense="$store.getters.dense.button" color="amber"
               icon="offline_pin" :loading="loadingAdd" @click.prevent="onSubmit">
          <!-- :label="dialog?'':$t('global.update')" -->
          <q-tooltip>{{$t('global.update')}}</q-tooltip>
        </q-btn>
        <q-btn v-if="!item" flat type="submit" :dense="$store.getters.dense.button" color="blue"
               icon="check_circle" :loading="loadingAdd" :disable="loadingDrafts"
               @click.prevent="onSubmit(1)">
          <!-- :label="dialog?'':$t('global.add')" -->
          <q-tooltip>{{$t('global.add')}}</q-tooltip>
        </q-btn>
        <q-btn v-if="!item" flat type="submit" :dense="$store.getters.dense.button" color="amber"
               icon="receipt" :loading="loadingDrafts" :disable="loadingAdd"
               @click.prevent="onSubmit(0)">
          <!-- :label="dialog?'':$t('global.drafts')" -->
          <q-tooltip>{{$t('global.drafts')}}</q-tooltip>
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
      <q-tabs v-model="tabs" narrow-indicator :dense="$store.getters.dense.form"
              class="text-deep-purple" align="justify">
        <q-tab name="main" :label="$t('tabs.main')" />
        <q-tab name="content" :label="$t('global.content')" />
        <q-tab name="images" :label="$t('global.images')" />
        <q-tab name="attributes" :label="$t('global.attributes')" />
      </q-tabs>
      <q-separator />
      <!-- <q-card-section> -->
      <q-scroll-area style="height:calc(100vh - 180px)">
        <q-tab-panels v-model="tabs">
          <q-tab-panel name="main">
            <div class="row q-gutter-xs">
              <div class="col-12 col-md-5">
                Parent: <q-badge color="blue">{{dependent?dependent.label:'Root'}}</q-badge>
              </div>
              <q-space />
              <div class="col-12 col-md-6">
                Level: <q-badge color="blue">{{data.level}}</q-badge>
              </div>
            </div>
            <div class="row q-gutter-xs">
              <div class="col-12 col-md-5">
                <q-input v-model.trim="data.title" v-uppercaseFirst
                         :dense="$store.getters.dense.input" :label="$t('global.title')"
                         :rules="[v=>v&&v.length>0||$t('error.required')]" />
              </div>
              <q-space />
              <div class="col-12 col-md-6">
                <q-input v-model.trim="data.code" v-uppercase :dense="$store.getters.dense.input"
                         :label="$t('global.code')" :rules="[v=>v&&v.length>0||$t('error.required')]"
                         :hint="$t('category.hitCode')" />
              </div>
            </div>
            <div class="row q-gutter-xs">
              <div class="col-12 col-md-5">
                <q-input v-model.trim="data.url" :dense="$store.getters.dense.input" v-lowercase
                         label="URL" />
              </div>
              <q-space />
              <div class="col-12 col-md-6">
                <q-input v-model="data.quantity" type="number" :dense="$store.getters.dense.input"
                         :label="$t('global.quantity')" />
              </div>
            </div>
            <div class="row q-gutter-xs">
              <div class="col-12 col-md-5">
                <q-input v-model.trim="data.icon" :dense="$store.getters.dense.input" label="Icon">
                  <template v-slot:append>
                    <q-icon :name="data.icon" />
                  </template>
                </q-input>
              </div>
              <q-space />
              <div class="col col-md-6 self-center">
                {{$t('global.colorPick')}}:
                <q-badge :style="{backgroundColor:data.color}" @click="dialogColorPick=true">
                  {{data.color}}</q-badge>
              </div>
            </div>
            <div class="row q-gutter-xs">
              <div class="col-12 col-md-5">
                <q-input :value="data.startAt" :dense="$store.getters.dense.input" readonly
                         :label="$t('global.startDate')" :hint="`${$t('global.format')}: DD/MM/YYYY`">
                  <template v-slot:append>
                    <q-icon name="event" class="cursor-pointer">
                      <q-popup-proxy ref="startAt" transition-show="scale" transition-hide="scale">
                        <q-date v-model="data.startAt" mask="DD/MM/YYYY" today-btn
                                @input="()=>$refs.startAt.hide()" />
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input>
              </div>
              <q-space />
              <div class="col col-md-6">
                <q-input :value="data.endAt" :dense="$store.getters.dense.input" readonly
                         :label="$t('global.endDate')" :hint="`${$t('global.format')}: DD/MM/YYYY`">
                  <template v-slot:append>
                    <q-icon name="event" class="cursor-pointer">
                      <q-popup-proxy ref="endAt" transition-show="scale" transition-hide="scale">
                        <q-date v-model="data.endAt" mask="DD/MM/YYYY" today-btn
                                @input="()=>$refs.endAt.hide()" />
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input>
              </div>
            </div>
            <div class="row q-gutter-xs">
              <div class="col-3">
                <q-input v-model="data.orders" type="number" :dense="$store.getters.dense.input"
                         :label="$t('global.order')" :rules="[v=>v!==null&&v!==''||$t('error.required')]"
                         class="col-md-4" />
              </div>
              <q-space v-if="item" />
              <div class="col-5 self-center" v-if="item">
                <q-toggle v-model="data.flag" :true-value="1" :dense="$store.getters.dense.input"
                          :label="data.flag?$t('global.publish'):$t('global.drafts')" />
              </div>
            </div>
            <div class="q-gutter-sm">
              <q-input v-model.trim="data.desc" autogrow :dense="$store.getters.dense.input"
                       :label="$t('global.desc')" />
            </div>
          </q-tab-panel>
          <q-tab-panel name="content">
            <q-editor v-model="data.content" min-height="5rem" />
          </q-tab-panel>
          <q-tab-panel name="images">
            <div class="row">
              <div class="col-12 q-gutter-sm images">
                <tm-upload v-model:data="data.images" :upload-url="uploadUrl" :headers="headers"
                           :max-file-size="1024*1024*2" accept=".jpg,.jpeg,.png,.gif" :multiple="false"
                           v-model:view-type="viewType" :size="121" :labelTitle="$t('files.title')"
                           :labelViewList="$t('files.ViewList')" :labelViewBox="$t('files.viewBox')"
                           :labelFileName="$t('files.fileName')" :labelFileSize="$t('files.fileSize')"
                           :labelConfirmTitle="$t('messageBox.confirm')"
                           :labelConfirmContent="$t('messageBox.delete')">
                </tm-upload>
              </div>
            </div>
          </q-tab-panel>
          <q-tab-panel name="attributes">
            <div class="q-pt-md q-pb-md">
              <span>{{$t('global.position')}}:</span>
              <q-option-group v-model="data.position" :options="positions" color="green"
                              type="checkbox" inline :dense="$store.getters.dense.input" />
            </div>
            <q-separator class="q-mt-md" />
            <tm-tags v-model:data="data.tags" :dense="$store.getters.dense.input"
                     :labelTitle="$t('global.keyword')+':'" :labelBtnAdd="$t('global.add')"
                     :labelInput="$t('global.tags')" btnIcon="add" btnColor="blue" tagsColor="primary"
                     tagsTextColor="white" :labelConfirmTitle="$t('messageBox.confirm')"
                     :labelConfirmContent="$t('messageBox.delete')"
                     :labelWarningTitle="$t('messageBox.warning')"
                     :labelWarningContent="$t('error.required')"></tm-tags>
            <q-separator class="q-mb-md q-mt-md" />
            <tm-attributes v-model:data="data.attr" :keys="attrKeys" :values="attrValues"
                           :dense="$store.getters.dense.input" :labelTitle="$t('product.attributes')+':'"
                           :labelBtnAdd="$t('global.add')" :labelInputKey="$t('global.key')"
                           :labelInputValue="$t('global.value')" btnIcon="add" btnColor="blue"
                           :btnEditLabel="$t('global.edit')" :btnDeleteLabel="$t('global.delete')"
                           :labelConfirmTitle="$t('messageBox.confirm')"
                           :labelConfirmContent="$t('messageBox.delete')"
                           :labelWarningTitle="$t('messageBox.warning')"
                           :labelWarningContent="$t('error.required')" :labelNoData="$t('table.noData')"
                           @on-filter-key="onFilterAttrKey" @on-filter-value="onFilterAttrValue">
            </tm-attributes>
          </q-tab-panel>
        </q-tab-panels>
      </q-scroll-area>
      <!-- </q-card-section> -->
    </q-form>
    <!-- Dialog color pick -->
    <q-dialog v-model="dialogColorPick">
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
import { defineComponent, defineAsyncComponent, ref, watch, getCurrentInstance } from 'vue';
import { useRoute } from 'vue-router'
// import * as apiCategories from '@/api/categories'
export default defineComponent({
  name: 'CategoryAdd',
  components: {
    tmUpload: defineAsyncComponent(() => import('components/tm-upload')),
    tmTags: defineAsyncComponent(() => import('components/tm-tags')),
    tmAttributes: defineAsyncComponent(() => import('components/tm-attributes'))
  },
  props: {
    dialog: { type: Boolean, default: false },
    item: { type: Object, default: () => { } },
    items: { type: Array, default: () => [] },
    dependent: { type: Object, default: () => null },
    positions: { type: Array, default: () => [] },
    expanded: { type: Array, default: () => [] },
    maximized: { type: Boolean, default: false }
  },
  setup (props) {
    const $route = useRoute()
    const $instance = getCurrentInstance()
    const loading = ref(false)
    const loadingAdd = ref(false)
    const loadingDrafts = ref(false)
    const dialogColorPick = ref(false)
    const dialogFiles = ref(false)
    const dialogUpload = ref(false)
    const tabs = ref('main')
    const form = ref(null)
    const data = ref({})
    const attrKeys = ref([])
    const attrValues = ref([])
    const viewType = ref('box')
    const uploadUrl = ref(process.env.API_FILE_UPLOAD)
    const headers = ref([
      { name: 'Upload-Path', value: 'category' },
      { name: 'Upload-Rename', value: true },
      { name: 'x-access-token', value: `Bearer ${$store.state.auth.token}` }])
    const constant = ref({
      type: $route.meta.type,
      code: null,
      dependent: null,
      level: 1,
      title: '',
      desc: null,
      content: '',
      url: null,
      images: null,
      quantity: null,
      position: [],
      tags: null,
      icon: 'spa',
      color: '#009688',
      meta: null,
      startAt: null, // this.$moment().format('YYYY/MM/DD'),
      endAt: null, // this.$moment().format('YYYY/MM/DD'),
      orders: 1,
      flag: 1
    })

    const onFilterAttrKey = (val) => {
      if (!val) return
      attrKeys.value = []
      apiCategories.getAttr({ key: true, filter: val, page: 1, rowsPerPage: 5 }).then((x) => {
        if (x) attrKeys.value = x.data
      })
    }
    const onFilterAttrValue = (val) => {
      if (!val) return
      attrValues.value = []
      apiCategories.getAttr({ filter: val, page: 1, rowsPerPage: 5 }).then((x) => {
        if (x) attrValues.value = x.data
      })
    }
    const getDependent = () => {
      if (dependent.value) return dependent.value.label
      else return 'Root'
    }
    const onSubmit = (action) => {
      form.value.validate().then(valid => {
        if (valid) {
          if (props.item) {
            loadingAdd.value = true
            apiCategories.update(data.value).then((x) => {
              if (x.ok) {
                if (!dependent.value) {
                  const i = props.items.indexOf(props.item)
                  if (i > -1) $instance.emit(props.items, props.items.slice().splice(i, 1, data.value))
                } else {
                  const i = dependent.value.children.indexOf(props.item)
                  if (i > -1) dependent.value.children.splice(i, 1, data.value)
                }
              }
            }).finally(() => {
              loadingAdd.value = false
            })
          } else {
            data.value.flag = action
            if (action) loadingAdd.value = true
            else loadingDrafts.value = true
            apiCategories.insert(data.value).then((x) => {
              if (dependent.value) {
                $instance.emit(props.expanded, props.expanded.slice().push(x._id))
                if (!dependent.value.children) dependent.value.children = []
                dependent.value.children.push(x)
              } else $instance.emit(props.items, props.items.slice().push(x))
            }).finally(() => {
              loadingAdd.value = false
              loadingDrafts.value = false
              onReset()
            })
          }
        }
      })
    }
    const findRoutes = (routes, val, by) => {
      const rs = []
      for (let e of routes) {
        if (e[by] === val) return e
      }
    }
    const onReset = () => {
      new Promise((resolve, reject) => {
        $instance.emit('update:maximized', false)
        data.value = { ...constant }
        if (dependent.value) {
          data.value.dependent = dependent.value._id
          data.value.level = dependent.value.level + 1
        }
        data.value.attr = {}
        data.value.tag = ''
        resolve()
      }).then(() => {
        if (form.value) form.value.resetValidation()
      })
    }

    watch(() => dialog, (state, prevState) => {
      onReset()
      if (props.item) {
        if (props.item) data.value = { ...props.item }
      }
    }, { deep: true, immediate: true })

    return {}
  }
})
</script>

<style>
.images .q-img {
  height: 100px;
  max-width: 100px;
}
.img-delete {
  color: #fff;
  cursor: pointer;
  position: absolute;
  right: 0;
  top: 0;
  background-color: #b71c1c;
  display: none;
}
.images .q-img:hover .img-delete {
  display: initial;
}
</style>
