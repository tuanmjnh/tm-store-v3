<template>
  <q-card>
    <q-toolbar>
      <div class="col-auto">
        <q-btn flat dense icon="arrow_back" v-close-popup />
      </div>
      <q-toolbar-title class="text-subtitle1">
        {{data._id?`${$t('route.edit')} ${$t("route.news").toLowerCase()}`:`${$t('route.add')} ${$t("route.news").toLowerCase()}`}}
      </q-toolbar-title>
      <q-btn icon="offline_pin" flat round dense color="blue" class="q-mr-sm" @click="onSubmit(1)" />
      <q-btn icon="draw" flat round dense color="amber" @click="onSubmit(0)" />
    </q-toolbar>
    <q-separator />
    <q-card-section class="q-pa-none">
      <q-form ref="form">
        <tm-tabs v-model="tabs" narrow-indicator :dense="$store.getters.dense.form" class="text-blue" align="justify">
          <q-tab name="main" :label="$t('tabs.main')" />
          <q-tab name="upload" :label="$t('files.upload')" />
          <q-tab name="attributes" :label="$t('global.attributes')" />
        </tm-tabs>
        <q-separator />
        <!-- <q-scroll-area style="height:calc(100vh - 99px)"> -->
        <q-tab-panel name="main" id="tab-main" class="scroll" style="height:calc(100vh - 99px)">
          <div class="row q-gutter-xs">
            <div class="col-12">
              <select-category v-model="data.categories" :categories="categories" option-value="_id" option-label="label"
                               :dense="$store.getters.dense.input" :labelTitle="$t('category.titlenews')" :labelSelect="$t('category.select')"
                               :labelAll="$t('category.selectAll')" :labelClose="$t('global.cancel')"
                               :rules="[v=>v&&v.length>0||$t('error.required')]" />
            </div>
          </div>
          <div class="row q-gutter-xs">
            <div class="col-12 col-md-5">
              <q-input v-model.trim="data.code" :dense="$store.getters.dense.input" :label="$t('news.code')" />
            </div>
            <q-space />
            <div class="col-12 col-md-5">
              <q-input v-model.trim="data.title" v-upperCaseFirst :dense="$store.getters.dense.input" :label="$t('news.name')"
                       :rules="[v=>v&&v.length>0||$t('error.required')]" />
            </div>
          </div>
          <div class="row q-gutter-xs">
            <div class="col-12 col-md-5">
              <q-input v-model.trim="data.author" :dense="$store.getters.dense.input" :label="$t('news.author')" />
            </div>
            <q-space />
            <div class="col-12 col-md-5">
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
            <div class="col-12 col-md-5">
              <q-input v-model.number="data.orders" type="number" :dense="$store.getters.dense.input" :label="$t('global.order')"
                       :rules="[v=>v!==null&&v!==''||$t('error.required')]" class="col-md-4" />
            </div>
            <!-- <q-space />
            <div class="col-12 col-md-5">
              <q-input v-model="data.priceExport" type="number" :dense="$store.getters.dense.input" :label="$t('product.priceExport')" />
            </div> -->
          </div>
          <div class="row q-gutter-xs q-mb-lg">
            <div class="col-12">
              <q-input v-model.trim="data.desc" autogrow :dense="$store.getters.dense.input" :label="$t('global.desc')" />
            </div>
          </div>
          <div class="row q-gutter-sm">
            <div class="col-12">{{$t('global.content')}}</div>
            <div class="col-12">
              <tm-editor v-model="data.content" :upload-url="$store.getters.apiUpload" multiple accept=".jpg,.jpeg,.png,.gif"
                         :labelFileSize="$t('files.fileSize')" :labelFileName="$t('files.fileName')"
                         :labelViewList="$t('files.ViewList')" :labelViewBox="$t('files.viewBox')"
                         :headers="[{name:'Upload-Path',value:'products'},{ name:'Upload-Rename',value:true},{name:'x-access-token',value:`Bearer ${$store.state.auth.token}`}]" />
            </div>
          </div>
        </q-tab-panel>
        <q-tab-panel name="upload" id="tab-upload" class="q-pt-none q-pb-none" style="height:calc(100vh - 99px)">
          <div class="row" style="height:45%">
            <div class="col-12 q-gutter-sm images">
              <tm-fileList ref="refTMFileListImages" v-model="data.images" v-model:view-type="viewTypeImage" :title="$t('global.avatar')"
                           :multiple="false" :size="290" :lblConfirmTitle="$t('messageBox.warning')" minHeight="280px"
                           :lblConfirmContent="$t('messageBox.delete')" :lblOk="$t('global.accept')" :lblCancel="$t('global.cancel')">
                <template v-slot:tool-bar>
                  <q-btn round dense flat icon="file_upload" color="primary" @click="onUpload('images')" />
                  <q-btn round dense flat icon="cloud_circle" color="secondary" @click="onFileManager('images')" />
                  <q-separator vertical class="q-ml-sm q-mr-sm" />
                  <q-btn dense flat icon="view_module" :color="viewTypeImage!=='list'?'indigo':'blue-grey'"
                         @click="$refs.refTMFileListImages.onChangeView('box')">
                    <q-tooltip v-if="!$q.platform.is.mobile">{{labelViewBox}}</q-tooltip>
                  </q-btn>
                  <q-btn dense flat icon="view_list" :color="viewTypeImage==='list'?'indigo':'blue-grey'"
                         @click="$refs.refTMFileListImages.onChangeView('list')">
                    <q-tooltip v-if="!$q.platform.is.mobile">{{labelViewList}}</q-tooltip>
                  </q-btn>
                </template>
              </tm-fileList>
            </div>
          </div>
          <q-separator class="q-mb-sm q-mt-sm" />
          <div class="row" style="height:45%">
            <div class="col-12 q-gutter-sm images">
              <tm-fileList ref="refTMFileListAttack" v-model="data.attach" v-model:view-type="viewTypeAttach" :title="$t('global.attach')"
                           :multiple="true" :size="82" :lblConfirmTitle="$t('messageBox.warning')" minHeight="282px"
                           :lblConfirmContent="$t('messageBox.delete')" :lblOk="$t('global.accept')" :lblCancel="$t('global.cancel')">
                <template v-slot:tool-bar>
                  <q-btn round dense flat icon="file_upload" color="primary" @click="onUpload('attack')" />
                  <q-btn round dense flat icon="cloud_circle" color="secondary" @click="onFileManager('attack')" />
                  <q-separator vertical class="q-ml-sm q-mr-sm" />
                  <q-btn dense flat icon="view_module" :color="viewTypeAttach!=='list'?'indigo':'blue-grey'"
                         @click="$refs.refTMFileListAttack.onChangeView('box')">
                    <q-tooltip v-if="!$q.platform.is.mobile">{{labelViewBox}}</q-tooltip>
                  </q-btn>
                  <q-btn dense flat icon="view_list" :color="viewTypeAttach==='list'?'indigo':'blue-grey'"
                         @click="$refs.refTMFileListAttack.onChangeView('list')">
                    <q-tooltip v-if="!$q.platform.is.mobile">{{labelViewList}}</q-tooltip>
                  </q-btn>
                </template>
              </tm-fileList>
            </div>
          </div>
        </q-tab-panel>
        <q-tab-panel name="attributes" id="tab-attributes" class="scroll" style="height:calc(100vh - 99px)">
          <div class="row q-gutter-md">
            <div class="col-12">{{$t('global.pin')}}:</div>
            <div class="col-12">
              <q-option-group v-model="data.pin" :options="pins" type="checkbox" inline :dense="$store.getters.dense.input" />
            </div>
          </div>
          <q-separator class="q-mt-md" />
          <tm-tags v-model="data.tags" :dense="$store.getters.dense.input" :labelTitle="$t('global.keyword')+':'"
                   :labelBtnAdd="$t('global.add')" :labelInput="$t('global.tags')" btnIcon="add" :labelConfirmTitle="$t('messageBox.confirm')"
                   :labelConfirmContent="$t('messageBox.delete')" :labelWarningContent="$t('error.required')" :lblOk="$t('global.accept')"
                   :lblCancel="$t('global.cancel')" />
          <q-separator class="q-mb-md q-mt-md" />
          <tm-attributes v-model="data.attr" :keys="attrKeys" :values="attrValues" :dense="$store.getters.dense.input"
                         :labelTitle="$t('global.attributes')+':'" :labelBtnAdd="$t('global.add')" :labelBtnUpdate="$t('global.update')"
                         :labelInputKey="$t('global.key')" :labelInputValue="$t('global.value')" :btnEditLabel="$t('global.edit')"
                         :btnDeleteLabel="$t('global.delete')" :labelConfirmTitle="$t('messageBox.confirm')"
                         :labelConfirmContent="$t('messageBox.delete')" :labelWarningContent="$t('error.required')"
                         :labelNoData="$t('table.noData')" :hintKey="$t('hint.newValue')" :hintVal="$t('hint.newValue')"
                         :on-filter-key="onFilterAttrKey" :on-filter-value="onFilterAttrValue" />
        </q-tab-panel>
        <!-- </q-scroll-area> -->
      </q-form>
    </q-card-section>
  </q-card>
  <!-- Dialog FileManager -->
  <q-dialog v-model="isDialogFileManager" maximized>
    <q-card>
      <q-card-section class="q-pl-md q-pr-md q-pt-none q-pb-none" style="height:93%">
        <!---->
        <tm-fileManager lblAccept="" :lblConfirmTitle="$t('messageBox.warning')" :lblConfirmContent="$t('messageBox.delete')"
                        :size="113" :lblOk="$t('global.accept')" :lblCancel="$t('global.cancel')" :accept="accept"
                        :url="$store.state.app.apiUpload" @onAccept="onAccept" :multiple="multiple" :mimeType="mimeType"
                        :headers="[{name:'Upload-Path',value:'news'},{ name:'Upload-Rename',value:true},{name:'x-access-token',value:`Bearer ${$store.state.auth.token}`}]">
          <template v-slot:headerLeft>
            <q-btn flat dense icon="arrow_back" v-close-popup />
            <span class="text-subtitle1">{{$t('files.manager')}}</span>
          </template>
        </tm-fileManager>
      </q-card-section>
    </q-card>
  </q-dialog>
  <!-- Dialog Upload -->
  <q-dialog v-model="isDialogUpload" maximized>
    <q-card>
      <q-card-section class="q-pl-md q-pr-md q-pt-none q-pb-none" style="height:93%">
        <tm-upload :multiple="multiple" :lblConfirmTitle="$t('messageBox.warning')" :lblConfirmContent="$t('messageBox.delete')"
                   :lblOk="$t('global.accept')" :lblCancel="$t('global.cancel')" :size="113" :mimeType="mimeType"
                   :accept="accept" :upload-url="$store.state.app.apiUpload" @on-finish="onUploaded"
                   :headers="[{name:'Upload-Path',value:'news'},{ name:'Upload-Rename',value:true},{name:'x-access-token',value:`Bearer ${$store.state.auth.token}`}]">
          <template v-slot:headerLeft>
            <q-btn flat dense icon="arrow_back" v-close-popup />
            <span class="text-subtitle1">{{$t('files.upload')}}</span>
          </template>
        </tm-upload>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script>
import { defineComponent, defineAsyncComponent, ref, computed } from 'vue';
import { useStore } from 'vuex'
export default defineComponent({
  name: "NewsAdd",
  components: {
    tmTabs: defineAsyncComponent(() => import('components/tm-tabs')),
    tmEditor: defineAsyncComponent(() => import('@/components/tm-editor')),
    tmFileList: defineAsyncComponent(() => import('@/components/tm-file-list')),
    tmUpload: defineAsyncComponent(() => import('@/components/tm-upload')),
    tmFileManager: defineAsyncComponent(() => import('@/components/tm-file-manager')),
    tmTags: defineAsyncComponent(() => import('@/components/tm-tags')),
    tmAttributes: defineAsyncComponent(() => import('@/components/tm-attributes')),
    selectCategory: defineAsyncComponent(() => import('pages/category/components/select-category'))
  },
  setup (props, { emit }) {
    const $store = useStore()
    const tabs = ref('main')
    const form = ref(null)
    const data = ref({})
    const attrKeys = ref([])
    const attrValues = ref([])
    const categories = computed(() => $store.state.categories.all.news || [])
    const pins = computed(() => $store.state.types.items.filter(x => x.key === 'pinNews').map(x => { return { label: x.name, value: x.code } }))
    const selectedCategory = ref(null)
    const selectedCategories = ref([])
    const selectedFileList = ref(null)
    const uploadUrl = ref(false)
    // TMFileList
    const viewTypeImage = ref('box')
    const viewTypeAttach = ref('list')
    const refTMFileListImages = ref(null)
    const refTMFileListAttack = ref(null)
    const multiple = ref(false)
    const accept = ref('*')
    const mimeType = ref(null)
    const targetFilesList = ref('images')
    // TMUpload
    const isDialogUpload = ref(false)
    const isDialogFileManager = ref(false)
    // const imagesList = ref([])
    if ($store.state.auth.token) {
      if (!$store.state.categories.all.news || $store.state.categories.all.news.length < 1)
        $store.dispatch('categories/get', { type: 'news', flag: 1, all: true })//.then((x) => { categories.value = x })
    }
    const onReset = () => {
      return new Promise((resolve, reject) => {
        if ($store.state.news.item) data.value = JSON.parse(JSON.stringify($store.state.news.item))
        resolve()
      }).then(() => { if (form.value) form.value.resetValidation() })
    }

    onReset()

    return {
      tabs, form, data, attrKeys, attrValues, categories, pins, selectedCategory, selectedCategories, selectedFileList, viewTypeImage,
      viewTypeAttach, refTMFileListImages, refTMFileListAttack, isDialogUpload, isDialogFileManager, multiple, accept, mimeType,
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
      onSubmit (flag) {
        form.value.validate().then(async (valid) => {
          if (valid) {
            data.value.flag = flag
            if ($store.state.news.item._id) $store.dispatch('news/put', data.value)
            else $store.dispatch('news/post', data.value).then(() => { onReset() })
          }
        })
      },
      onUpload (val) {
        if (val === 'images') {
          accept.value = '.jpg,.jpeg,.png,.gif,.jfif'
          multiple.value = false
        } else {
          accept.value = '*'
          multiple.value = true
        }
        targetFilesList.value = val
        isDialogUpload.value = true
      },
      onFileManager (val) {
        if (val === 'images') {
          accept.value = '.jpg,.jpeg,.png,.gif,.jfif'
          mimeType.value = 'image'
          multiple.value = false
        } else {
          accept.value = '*'
          mimeType.value = null
          multiple.value = true
        }
        targetFilesList.value = val
        isDialogFileManager.value = true
      },
      onUploaded (val) {
        isDialogUpload.value = false
        if (val)
          if (targetFilesList.value === 'images') {
            data.value.images = uploadUrl.value ? val.url : val
          } else {
            if (data.value.attach) {
              val.forEach(e => {
                if (data.value.attach.findIndex(x => x === (uploadUrl.value ? e.url : e)) < 0)
                  data.value.attach.push(uploadUrl.value ? e.url : e)
              })
            } else {
              data.value.attach = val.map(x => uploadUrl.value ? x.url : x)
            }
          }
      },
      onAccept (val) {
        isDialogFileManager.value = false
        if (val)
          if (targetFilesList.value === 'images') {
            data.value.images = uploadUrl.value ? val.url : val
          } else {
            if (data.value.attach) {
              val.forEach(e => {
                if (data.value.attach.findIndex(x => x === (uploadUrl.value ? e.url : e)) < 0)
                  data.value.attach.push(uploadUrl.value ? e.url : e)
              })
            } else {
              data.value.attach = val.map(x => uploadUrl.value ? x.url : x)
            }
          }
      }
    }
  }
})
</script>
