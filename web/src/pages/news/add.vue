<template>
  <div>
    <div class="row card-title">
      <div class="col-sm-auto col-xs-12 text-h6 card-title-text">
        <q-avatar v-if="dialog" :icon="$route.meta.icon" size="50px" />
        {{$store.state.news.item._id?$t('global.update'):$t('global.add')}}
        <span class="text-weight-bold">{{ $t("news.title") }}</span>
      </div>
      <q-space />
      <div class="col-sm-auto col-xs-12 text-right">
        <q-btn v-if="$store.state.news.item._id" flat type="submit" :dense="$store.getters.dense.button" color="amber"
               icon="offline_pin" :loading="$store.state.app.loading.put" @click.prevent="onSubmit">
          <!-- :label="dialog?'':$t('global.update')" -->
          <q-tooltip>{{$t('global.update')}}</q-tooltip>
        </q-btn>
        <q-btn v-if="!$store.state.news.item._id" flat type="submit" :dense="$store.getters.dense.button" color="blue"
               icon="check_circle" :loading="$store.state.app.loading.post" @click.prevent="onSubmit">
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
      <q-tabs v-model="tabs" narrow-indicator :dense="$store.getters.dense.form" class="text-deep-purple" align="justify">
        <q-tab name="main" :label="$t('tabs.main')" />
        <q-tab name="upload" :label="$t('files.upload')" />
        <q-tab name="attributes" :label="$t('global.attributes')" />
      </q-tabs>
      <q-separator />
      <!-- <q-card-section> -->
      <q-scroll-area style="height:calc(100vh - 180px)">
        <q-tab-panels v-model="tabs">
          <q-tab-panel name="main">
            <div class="row q-gutter-xs">
              <div class="col-12 col-md-5">
                <select-category v-model="data.categories" :categories="categories" option-value="_id" option-label="label"
                                 :dense="$store.getters.dense.input" :labelTitle="$t('category.titlenews')" :labelSelect="$t('category.select')"
                                 :labelAll="$t('category.selectAll')" :labelClose="$t('global.cancel')"
                                 :rules="[v=>v&&v.length>0||$t('error.required')]" />
                <!-- <select-category :categories="categories" v-model:selected="data.categories" data-key="_id" :dense="$store.getters.dense.input"
                                 :labelTitle="$t('category.titlenews')" :labelSelect="$t('category.select')" :labelClose="$t('global.cancel')"
                                 :rules="[v=>v&&v.length>0||$t('error.required')]" /> -->
              </div>
              <q-space />
              <div class="col-12 col-md-6">
                <q-input v-model.trim="data.code" :dense="$store.getters.dense.input" :label="$t('news.code')" />
              </div>
            </div>
            <div class="row q-gutter-xs">
              <div class="col-12 col-md-12">
                <q-input v-model.trim="data.title" v-upperCaseFirst :dense="$store.getters.dense.input" :label="$t('news.name')"
                         :rules="[v=>v&&v.length>0||$t('error.required')]" />
              </div>
              <!-- <q-space />
            <div class="col-12 col-md-3">
              <q-input v-model.trim="data.code" readonly v-upperCase debounce="300"
                :dense="$store.getters.dense.input" :label="$t('news.code')"
                :rules="[v=>v&&v.length>0||$t('error.required')]" />
            </div> -->
            </div>
            <div class="row q-gutter-xs">
              <div class="col-12 col-md-5">
                <q-input v-model.trim="data.author" :dense="$store.getters.dense.input" :label="$t('news.author')" />
              </div>
              <q-space />
              <div class="col-12 col-md-6">
                <q-input :model-value="data.date?$moment(data.date).format($store.getters.format.date):''" :dense="$store.getters.dense.input"
                         readonly :label="$t('news.date')" :hint="`${$t('global.format')}: ${$store.getters.format.date}`">
                  <template v-slot:append>
                    <q-icon name="event" class="cursor-pointer">
                      <q-popup-proxy ref="datePublish" transition-show="scale" transition-hide="scale">
                        <q-date v-model="data.date" today-btn mask="YYYY-MM-DD HH:mm:ss" @update:model-value="()=>$refs.datePublish.hide()" />
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input>
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
            </div>
            <div class="row q-gutter-sm q-mb-lg">
              <div class="col-12">
                <q-input v-model.trim="data.desc" autogrow :dense="$store.getters.dense.input" :label="$t('global.desc')" />
              </div>
            </div>
            <div class="row q-gutter-sm">
              <div class="col-12">{{$t('global.content')}}</div>
              <div class="col-12">
                <tm-editor v-model="data.content" :upload-url="$store.state.app.apiFileUpload" multiple :max-file-size="1024*1024*2"
                           :headers="[{name:'Upload-Path',value:'news'},{ name:'Upload-Rename',value:true},{name:'x-access-token',value:`Bearer ${$store.state.auth.token}`}]"
                           accept=".jpg,.jpeg,.png,.gif" iconAccept="add_task" :labelAccept="$t('global.accept')"
                           :labelViewList="$t('files.ViewList')" :labelViewBox="$t('files.viewBox')" :labelFileName="$t('files.fileName')"
                           :labelFileSize="$t('files.fileSize')" />
              </div>
            </div>
          </q-tab-panel>
          <q-tab-panel name="upload">
            <div class="row">
              <div class="col-12 q-gutter-sm images">
                <tm-upload v-model="data.images" :upload-url="$store.state.app.apiFileUpload" :max-file-size="1024*1024*2"
                           :headers="[{name:'Upload-Path',value:'news'},{ name:'Upload-Rename',value:true},{name:'x-access-token',value:`Bearer ${$store.state.auth.token}`}]"
                           accept=".jpg,.jpeg,.png,.gif,.jfif" :multiple="false" v-model:view-type="viewTypeImage" :size="121"
                           :labelTitleUpload="$t('files.upload')" :labelTitleFiles="$t('files.title')" :labelTitle="$t('files.title')"
                           :labelOpenFile="$t('files.openFile')" :labelOpenData="$t('files.openData')" iconAccept="add_task"
                           :labelAccept="$t('global.accept')" :labelViewList="$t('files.ViewList')" :labelViewBox="$t('files.viewBox')"
                           :labelIndex="$t('files.index')" :labelIcon="$t('files.icon')" :labelFileName="$t('files.fileName')"
                           :labelType="$t('files.type')" :labelFileSize="$t('files.fileSize')" :labelDeleteFile="$t('global.delete')"
                           :labelCancel="$t('global.cancel')" :labelConfirmTitle="$t('messageBox.confirm')"
                           :labelConfirmContent="$t('messageBox.delete')" />
              </div>
            </div>
            <q-separator class="q-mb-sm q-mt-sm" />
            <div class="row">
              <div class="col-12 q-gutter-sm images">
                <tm-upload v-model="data.attach" :upload-url="$store.state.app.apiFileUpload" :max-file-size="1024*1024*5"
                           :headers="[{name:'Upload-Path',value:'news'},{ name:'Upload-Rename',value:true},{name:'x-access-token',value:`Bearer ${$store.state.auth.token}`}]"
                           :multiple="true" v-model:view-type="viewTypeAttach" :size="121" :labelTitle="$t('global.attach')"
                           :labelTitleUpload="$t('files.upload')" :labelTitleFiles="$t('files.title')" :labelOpenFile="$t('files.openFile')"
                           :labelOpenData="$t('files.openData')" iconAccept="add_task" :labelAccept="$t('global.accept')"
                           :labelViewList="$t('files.ViewList')" :labelViewBox="$t('files.viewBox')" :labelIndex="$t('files.index')"
                           :labelIcon="$t('files.icon')" :labelFileName="$t('files.fileName')" :labelType="$t('files.type')"
                           :labelFileSize="$t('files.fileSize')" :labelDeleteFile="$t('global.delete')" :labelCancel="$t('global.cancel')"
                           :labelConfirmTitle="$t('messageBox.confirm')" :labelConfirmContent="$t('messageBox.delete')" />
              </div>
            </div>
          </q-tab-panel>
          <q-tab-panel name="attributes">
            <div class="q-pt-md q-pb-md">
              <div class="col-12">{{$t('global.pin')}}:</div>
              <div class="col-12">
                <q-option-group v-model="data.pin" :options="pins" type="checkbox" inline :dense="$store.getters.dense.input" />
              </div>
            </div>
            <q-separator class="q-mt-md" />
            <tm-tags v-model="data.tags" :dense="$store.getters.dense.input" :labelTitle="$t('global.keyword')+':'"
                     :labelBtnAdd="$t('global.add')" :labelInput="$t('global.tags')" btnIcon="add" btnColor="blue" tagsColor="primary"
                     tagsTextColor="white" :labelConfirmTitle="$t('messageBox.confirm')" :labelConfirmContent="$t('messageBox.delete')"
                     :labelWarningTitle="$t('messageBox.warning')" :labelWarningContent="$t('error.required')" />
            <q-separator class="q-mb-md q-mt-md" />
            <tm-attributes v-model="data.attr" :keys="attrKeys" :values="attrValues" :dense="$store.getters.dense.input"
                           :labelTitle="$t('global.attributes')+':'" :labelBtnAdd="$t('global.add')" :labelBtnUpdate="$t('global.update')"
                           :labelInputKey="$t('global.key')" :labelInputValue="$t('global.value')" :btnEditLabel="$t('global.edit')"
                           :btnDeleteLabel="$t('global.delete')" :labelConfirmTitle="$t('messageBox.confirm')"
                           :labelConfirmContent="$t('messageBox.delete')" :labelWarningTitle="$t('messageBox.warning')"
                           :labelWarningContent="$t('error.required')" :labelNoData="$t('table.noData')" :hintKey="$t('hint.newValue')"
                           :hintVal="$t('hint.newValue')" :on-filter-key="onFilterAttrKey" :on-filter-value="onFilterAttrValue" />
          </q-tab-panel>
        </q-tab-panels>
      </q-scroll-area>
      <!-- </q-card-section> -->
    </q-form>
  </div>
</template>

<script>
import { defineComponent, defineAsyncComponent, ref, computed } from 'vue';
import { useStore } from 'vuex'
export default defineComponent({
  name: 'NewsAdd',
  components: {
    tmEditor: defineAsyncComponent(() => import('components/tm-editor')),
    tmUpload: defineAsyncComponent(() => import('components/tm-upload')),
    tmTags: defineAsyncComponent(() => import('components/tm-tags')),
    tmAttributes: defineAsyncComponent(() => import('components/tm-attributes')),
    selectCategory: defineAsyncComponent(() => import('pages/category/components/select-category'))
  },
  props: {
    dialog: { type: Boolean, default: false },
    maximized: { type: Boolean, default: false }
  },
  setup () {
    const $store = useStore()
    const tabs = ref('main')
    const form = ref(null)
    const data = ref({})
    const attrKeys = ref([])
    const attrValues = ref([])
    const viewTypeImage = ref('box')
    const viewTypeAttach = ref('list')
    const pins = computed(() => $store.state.types.items.filter(x => x.key === 'pinNews').map(x => { return { label: x.name, value: x.code } }))
    const categories = ref([])

    $store.dispatch('categories/get', { type: 'news', flag: 1, x: true, generate: true }).then((x) => { categories.value = x })

    const onReset = () => {
      return new Promise((resolve, reject) => {
        if ($store.state.news.item) data.value = { ...$store.state.news.item }
        if ($store.state.news.item._id) { }
        resolve()
      }).then(() => { if (form.value) form.value.resetValidation() })
    }

    onReset()

    return {
      tabs, form, data, attrKeys, attrValues, viewTypeImage, viewTypeAttach, pins, categories,
      onFilterAttrKey (val) {
        if (!val) return
        attrKeys.value = []
        return $store.dispatch('news/getAttr', { key: true, filter: val, page: 1, rowsPerPage: 5 }).then((x) => {
          if (x) attrKeys.value = x.data
          return x.data
        })
      },
      onFilterAttrValue (val) {
        if (!val) return
        attrValues.value = []
        return $store.dispatch('news/getAttr', { filter: val, page: 1, rowsPerPage: 5 }).then((x) => {
          if (x) attrValues.value = x.data
          return x.data
        })
      },
      onSubmit () {
        form.value.validate().then(async (valid) => {
          if (valid) {
            if ($store.state.news.item._id) $store.dispatch('news/put', data.value)
            else $store.dispatch('news/post', data.value).then(() => { onReset() })
          }
        })
      }
    }
  }
})
</script>

<style>
</style>
