<template>
  <div>
    <div class="row card-title">
      <div class="col-sm-auto col-xs-12 text-h6 card-title-text">
        <q-avatar v-if="dialog" :icon="$route.meta.icon" size="50px" />
        {{$store.state.categories.item._id?$t('global.update'):$t('global.add') }}
        <span class="text-weight-bold">{{$t(`category.title${$route.meta.type}`)}}</span>
      </div>
      <q-space />
      <div class="col-sm-auto col-xs-12 text-right">
        <q-btn v-if="$store.state.categories.item._id" flat type="submit" :dense="$store.getters.dense.button" color="amber"
               icon="offline_pin" :loading="$store.state.app.loading.put" @click.prevent="onSubmit">
          <q-tooltip>{{$t('global.update')}}</q-tooltip>
        </q-btn>
        <q-btn v-if="!$store.state.categories.item._id" flat type="submit" :dense="$store.getters.dense.button" color="blue"
               icon="check_circle" :loading="$store.state.app.loading.post" @click.prevent="onSubmit">
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
      <q-tabs v-model="tabs" narrow-indicator :dense="$store.getters.dense.form" class="text-deep-purple" align="justify">
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
                {{$t('global.dependent')}}:
                <q-badge color="blue">{{$store.state.categories.dependent?$store.state.categories.dependent.label:'Root'}}</q-badge>
              </div>
              <q-space />
              <div class="col-12 col-md-6">
                {{$t('global.level')}}: <q-badge color="blue">{{data.level}}</q-badge>
              </div>
            </div>
            <div class="row q-gutter-xs">
              <div class="col-12 col-md-5">
                <q-input v-model.trim="data.title" :dense="$store.getters.dense.input" :label="$t('global.title')" v-upperCaseFirst
                         :rules="[v=>v&&v.length>0||$t('error.required')]" />
              </div>
              <q-space />
              <div class="col-12 col-md-6">
                <q-input v-model.trim="data.code" :dense="$store.getters.dense.input" :label="$t('global.code')" v-uppercase
                         :rules="[v=>v&&v.length>0||$t('error.required'),v=>checkExistCode(v)]" debounce="500" :hint="$t('category.hitCode')" />
              </div>
            </div>
            <div class="row q-gutter-xs">
              <div class="col-12 col-md-5">
                <q-input v-model.trim="data.url" :dense="$store.getters.dense.input" v-lowerCase label="URL" />
              </div>
              <q-space />
              <div class="col-12 col-md-6">
                <q-input v-model="data.quantity" type="number" :dense="$store.getters.dense.input" :label="$t('global.quantity')" />
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
                <q-badge class="cursor-pointer" :style="{backgroundColor:data.color}" @click="isDialogColorPick=true">{{data.color}}</q-badge>
                <div class="float-right q-mr-sm">
                  <q-icon name="update" class="cursor-pointer text-secondary" style="font-size:20px" @click="data.color='#607d8b'" />
                  <q-icon name="sync" class="cursor-pointer text-primary" style="font-size:20px" @click="onRandomColor" />
                </div>
              </div>
            </div>
            <div class="row q-gutter-xs">
              <div class="col-12 col-md-5">
                <q-input :model-value="data.startAt?$moment(data.startAt).format($store.getters.format.date):''" :dense="$store.getters.dense.input"
                         readonly :label="$t('global.startDate')" :hint="`${$t('global.format')}: ${$store.getters.format.date}`">
                  <template v-slot:append>
                    <q-icon name="event" class="cursor-pointer">
                      <q-popup-proxy ref="startAt" transition-show="scale" transition-hide="scale">
                        <q-date v-model="data.startAt" today-btn mask="YYYY-MM-DD HH:mm:ss" @update:model-value="()=>$refs.startAt.hide()" />
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input>
              </div>
              <q-space />
              <div class="col col-md-6">
                <q-input :model-value="data.endAt?$moment(data.endAt).format($store.getters.format.date):''" :dense="$store.getters.dense.input"
                         readonly :label="$t('global.endDate')" :hint="`${$t('global.format')}: ${$store.getters.format.date}`">
                  <template v-slot:append>
                    <q-icon name="event" class="cursor-pointer">
                      <q-popup-proxy ref="endAt" transition-show="scale" transition-hide="scale">
                        <q-date v-model="data.endAt" today-btn mask="YYYY-MM-DD HH:mm:ss" @update:model-value="()=>$refs.endAt.hide()" />
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input>
              </div>
            </div>
            <div class="row q-gutter-xs">
              <div class="col-3">
                <q-input v-model="data.orders" type="number" :dense="$store.getters.dense.input" :label="$t('global.order')"
                         :rules="[v=>v!==null&&v!==''||$t('error.required')]" class="col-md-4" />
              </div>
              <q-space />
              <div class="col-5 self-center">
                <q-toggle v-model="data.flag" :true-value="1" :dense="$store.getters.dense.input"
                          :label="data.flag?$t('global.publish'):$t('global.drafts')" />
              </div>
            </div>
            <div class="q-gutter-sm">
              <q-input v-model.trim="data.desc" autogrow :dense="$store.getters.dense.input" :label="$t('global.desc')" />
            </div>
          </q-tab-panel>
          <q-tab-panel name="content">
            <q-editor v-model="data.content" min-height="5rem" />
          </q-tab-panel>
          <q-tab-panel name="images">
            <div class="row">
              <div class="col-12 q-gutter-sm images">
                <tm-upload v-model="data.images" :upload-url="$store.state.app.apiFileUpload" :max-file-size="1024*1024*2"
                           :headers="[{name:'Upload-Path',value:'category'},{ name:'Upload-Rename',value:true},{name:'x-access-token',value:`Bearer ${$store.state.auth.token}`}]"
                           accept=".jpg,.jpeg,.png,.gif,.jfif" :multiple="false" v-model:view-type="viewType" :size="121"
                           :labelTitleUpload="$t('files.upload')" :labelTitleFiles="$t('files.title')" :labelTitle="$t('files.title')"
                           :labelOpenFile="$t('files.openFile')" :labelOpenData="$t('files.openData')" iconAccept="add_task"
                           :labelAccept="$t('global.accept')" :labelViewList="$t('files.ViewList')" :labelViewBox="$t('files.viewBox')"
                           :labelIndex="$t('files.index')" :labelIcon="$t('files.icon')" :labelFileName="$t('files.fileName')"
                           :labelType="$t('files.type')" :labelFileSize="$t('files.fileSize')" :labelCancel="$t('global.cancel')"
                           :labelConfirmTitle="$t('messageBox.confirm')" :labelConfirmContent="$t('messageBox.delete')" />
              </div>
            </div>
          </q-tab-panel>
          <q-tab-panel name="attributes">
            <div class="q-pt-md q-pb-md">
              <span>{{$t('global.position')}}:</span>
              <q-option-group v-model="data.position" :options="positions" color="green" type="checkbox" inline :dense="$store.getters.dense.input" />
            </div>
            <q-separator class="q-mb-md q-mt-md" />
            <tm-attributes v-model="data.meta" :keys="metaKeys" :values="metaValues"
                           :dense="$store.getters.dense.input" :labelTitle="$t('global.attributes')+':'"
                           :labelBtnAdd="$t('global.add')" :labelBtnUpdate="$t('global.update')" :labelInputKey="$t('global.key')"
                           :labelInputValue="$t('global.value')" :btnEditLabel="$t('global.edit')" :btnDeleteLabel="$t('global.delete')"
                           :labelConfirmTitle="$t('messageBox.confirm')" :labelConfirmContent="$t('messageBox.delete')"
                           :labelWarningTitle="$t('messageBox.warning')" :labelWarningContent="$t('error.required')"
                           :labelNoData="$t('table.noData')" :hintKey="$t('hint.newValue')" :hintVal="$t('hint.newValue')"
                           :on-filter-key="onFilterMetaKey" :on-filter-value="onFilterMetaValue" />
            <q-separator class="q-mb-md q-mt-md" />
            <tm-tags v-model="data.tags" :dense="$store.getters.dense.input"
                     :labelBtnAdd="$t('global.add')"
                     :labelInput="$t('global.tags')" btnIcon="add" btnColor="blue" tagsColor="primary"
                     tagsTextColor="white" :labelConfirmTitle="$t('messageBox.confirm')"
                     :labelConfirmContent="$t('messageBox.delete')"
                     :labelWarningTitle="$t('messageBox.warning')"
                     :labelWarningContent="$t('error.required')" />
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
import { defineComponent, defineAsyncComponent, ref, computed } from 'vue';
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'
import { RandomColor } from '@/utils/color'
export default defineComponent({
  name: 'CategoryAdd',
  components: {
    tmUpload: defineAsyncComponent(() => import('components/tm-upload')),
    tmTags: defineAsyncComponent(() => import('components/tm-tags')),
    tmAttributes: defineAsyncComponent(() => import('components/tm-attributes'))
  },
  props: {
    dialog: { type: Boolean, default: false },
    maximized: { type: Boolean, default: false }
  },
  setup () {
    const $store = useStore()
    const { t } = useI18n({ useScope: 'global' })
    const isDialogColorPick = ref(false)
    const tabs = ref('main')
    const form = ref(null)
    const data = ref({})
    const metaKeys = ref([])
    const metaValues = ref([])
    const viewType = ref('box')
    const existCode = ref(false)

    const positions = computed(() => $store.state.types.items.filter(x => x.key === 'position').map(x => { return { label: x.name, value: x.code } }))

    const onReset = () => {
      new Promise((resolve, reject) => {
        if ($store.state.categories.item) data.value = { ...$store.state.categories.item }
        resolve()
      }).then(() => { if (form.value) form.value.resetValidation() })
    }
    onReset()

    return {
      isDialogColorPick, tabs, form, data, metaKeys, metaValues, viewType, positions, existCode,
      onFilterMetaKey: (val) => {
        if (!val) return
        metaKeys.value = []
        return $store.dispatch('categories/getMeta', { key: true, filter: val, page: 1, rowsPerPage: 5 }).then((x) => {
          if (x) metaKeys.value = x.data
          return x.data
        })
      },
      onFilterMetaValue: (val) => {
        if (!val) return
        metaValues.value = []
        return $store.dispatch('categories/getMeta', { filter: val, page: 1, rowsPerPage: 5 }).then((x) => {
          if (x) metaValues.value = x.data
          return x.data
        })
      },
      checkExistCode: async (val) => {
        if (val) {
          if ($store.state.categories.item._id) {
            if ($store.state.categories.item.code === data.value.code) return
          }
          const rs = await $store.dispatch('categories/exist', { code: val })
          return rs ? t('error.exist') : true
        }
      },
      onRandomColor: () => {
        data.value.color = RandomColor(true)
      },
      onSubmit: () => {
        form.value.validate().then(valid => {
          if (valid) {
            if (data.value.code) data.value.code = data.value.code.toUpperCase()
            if ($store.state.categories.item._id) $store.dispatch('categories/put', data.value)
            else $store.dispatch('categories/post', data.value).then(() => onReset())
          }
        })
      }
    }
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
