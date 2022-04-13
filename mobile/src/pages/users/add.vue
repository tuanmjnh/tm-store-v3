<template>
  <q-card>
    <q-toolbar>
      <div class="col-auto">
        <q-btn flat dense icon="arrow_back" v-close-popup />
      </div>
      <q-toolbar-title class="text-subtitle1">
        {{data._id?`${$t('route.edit')} ${$t("route.users").toLowerCase()}`:`${$t('route.add')} ${$t("route.users").toLowerCase()}`}}
      </q-toolbar-title>
      <q-btn icon="offline_pin" flat round dense color="blue" class="q-mr-sm" @click="onSubmit(true)" />
      <q-btn icon="draw" flat round dense color="amber" @click="onSubmit(false)" />
    </q-toolbar>
    <q-separator />
    <q-card-section class="q-pa-none">
      <q-form ref="form">
        <tm-tabs v-model="tabs" narrow-indicator :dense="$store.getters.dense.form" class="text-blue" align="justify">
          <q-tab name="main" :label="$t('tabs.main')" />
          <q-tab name="roles" :label="$t('roles.title')" />
          <q-tab name="avatar" :label="$t('global.avatar')" />
        </tm-tabs>
        <q-separator />
        <q-tab-panel name="main" id="tab-main" class="scroll" style="height:calc(100vh - 99px)">
          <div class="row q-gutter-xs">
            <div class="col-12">
              <q-select v-model="group" input-debounce="200" :dense="$store.getters.dense.input" :options="groups" :label="$t('users.group')"
                        option-value="code" :option-label="opt=>opt.name" :rules="[v=>!!v||$t('error.required')]" />
            </div>
          </div>
          <div class="row q-gutter-xs">
            <div class="col-12 col-md-5">
              <q-input v-model.trim="data.username" :dense="$store.getters.dense.input" v-lowerCase :label="$t('users.username')"
                       :rules="[v=>!!v||$t('error.required'),v=>v.length>4||$t('error.minLength',{min:5})]" />
            </div>
            <!-- <q-space /> -->
            <!-- <div class="col-12 col-md-5">
              <q-input v-model.trim="data.password" :dense="$store.getters.dense.input" :label="$t('users.password')" autocomplete="new-password"
                       :type="passwordType" :rules="[v=>!!v||$t('error.required'),v=>v.length>5||$t('error.minLength',{min:6})]">
                <template v-slot:append>
                  <q-icon v-if="passwordType === 'password'" name="visibility_off" @click="passwordType = 'text'" class="cursor-pointer" />
                  <q-icon v-else name="visibility" @click="passwordType = 'password'" class="cursor-pointer" />
                </template>
              </q-input>
            </div> -->
          </div>
          <div class="row q-gutter-xs">
            <div class="col-12 col-md-5">
              <q-input v-model.trim="data.email" :dense="$store.getters.dense.input" v-lowerCase :label="$t('users.email')"
                       :rules="[v=>!!v||$t('error.required'),v=>validEmail(v)||$t('error.email')]" />
            </div>
            <q-space />
            <div class="col-12 col-md-5">
              <q-input v-model.trim="data.fullName" :dense="$store.getters.dense.input" :label="$t('users.fullName')"
                       :rules="[v=>!!v||$t('error.required')]" />
            </div>
          </div>
          <div class="row q-gutter-xs">
            <div class="col-12 col-md-5">
              <q-input :model-value="data.dateBirth?$moment(data.dateBirth).format($store.getters.format.date):''"
                       :dense="$store.getters.dense.input" readonly :label="$t('users.dateBirth')"
                       :hint="`${$t('global.format')}: ${$store.getters.format.date}`">
                <template v-slot:append>
                  <q-icon name="event" class="cursor-pointer">
                    <q-popup-proxy ref="dateBirth" transition-show="scale" transition-hide="scale">
                      <q-date v-model="data.dateBirth" today-btn @update:model-value="()=>$refs.dateBirth.hide()" />
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>
            </div>
            <q-space />
            <div class="col-12 col-md-5">
              <q-input v-model.trim="data.personNumber" type="number" :dense="$store.getters.dense.input"
                       :label="$t('users.personNumber')" :rules="[v=>!!v||$t('error.required')]" />
            </div>
          </div>
          <div class="row q-gutter-xs">
            <div class="col-12 col-md-5">
              <q-select v-model="selectedRegion" use-input hide-selected fill-input
                        input-debounce="0" :dense="$store.getters.dense.input" :options="regions"
                        @filter="onFilterRegion" :hint="$t('users.selectRegion')" option-value="id"
                        option-label="name_l" :rules="[v=>!!v||$t('error.required')]">
                <!-- <template v-slot:selected-item="scope">
                  <q-item-label v-html="scope.opt.name_l" />
                  <q-item-label caption>{{`+${scope.opt.pc}`}}</q-item-label>
                </template> -->
                <!-- <template v-slot:selected>
                  <q-chip v-if="data.region" dense square color="white" text-color="primary"
                    class="q-my-none q-ml-xs q-mr-none">
                    <q-avatar color="primary" text-color="white" />
                    {{ data.region.name_l }}
                  </q-chip>
                  <q-badge v-else>*none*</q-badge>
                </template> -->
                <template v-slot:option="scope">
                  <q-item v-bind="scope.itemProps">
                    <q-item-section>
                      <q-item-label v-html="scope.opt.name_l" />
                      <q-item-label caption>{{`+${scope.opt.pc}`}}</q-item-label>
                    </q-item-section>
                  </q-item>
                </template>
                <template v-slot:no-option>
                  <q-item>
                    <q-item-section class="text-grey">{{$t("table.noData")}}</q-item-section>
                  </q-item>
                </template>
              </q-select>
            </div>
            <q-space />
            <div class="col-12 col-md-5">
              <q-input v-model.trim="data.phone" :dense="$store.getters.dense.input" :hint="$t('users.phone')" :placeholder="$t('users.phone')"
                       :rules="[v=>!!v||$t('error.required')]">
                <template v-if="selectedRegion" v-slot:prepend>
                  <span style="font-size:14px;line-height:0">+{{selectedRegion.pc}}</span>
                </template>
              </q-input>
            </div>
          </div>
          <div class="row q-gutter-sm">
            <div class="col-5">
              <q-select v-model="gender" :options="genders" :dense="$store.getters.dense.input" :hint="$t('users.gender')"
                        :options-dense="$store.getters.dense.input" option-value="id" :option-label="v=>$t(`gender.${v.code}`)"
                        :rules="[v=>!!v||$t('error.required')]" />
            </div>
            <q-space />
            <div class="col-5 self-center">
              <q-toggle v-model="data.verified" :true-value="true" :dense="$store.getters.dense.input" :label="$t('users.verified')"
                        :text-color="data.verified?'green':'blue-grey-10'" />
            </div>
          </div>
          <!-- <div class="row q-gutter-sm q-mb-lg">
            <div class="col-12 col-md-5 self-center">
              <q-toggle v-model="data.verified" :true-value="true" :dense="$store.getters.dense.input" :label="$t('users.verified')"
                        :text-color="data.verified?'green':'blue-grey-10'" />
            </div>
            <q-space />
            <div class="col-12 col-md-6 self-center">
              <q-toggle v-model="data.enable" :true-value="true" :dense="$store.getters.dense.input"
                        :label="data.enable?$t('global.working'):$t('global.lock')" />
            </div>
          </div> -->
          <div class="row q-gutter-xs q-mb-md">
            <div class="col-12">
              <q-input v-model="data.address" :label="$t('users.address')" :dense="$store.getters.dense.input" />
            </div>
          </div>
          <div class="row q-gutter-sm">
            <div class="col-12 col-md-12 self-center">{{$t("users.note")}}:</div>
            <div class="col-12">
              <q-editor v-model.trim="data.note" min-height="5rem" />
            </div>
          </div>
        </q-tab-panel>
        <q-tab-panel name="roles" id="tab-roles" class="scroll" style="height:calc(100vh - 99px)">
          <q-tree class="col-12 col-sm-6" :nodes="roles" :dense="$store.getters.dense.input" v-model:ticked="data.roles" node-key="_id"
                  label-key="name" tick-strategy="leaf" :no-nodes-label="$t('table.noData')">
            <template v-slot:default-header="prop">
              <div class="row items-center">
                <div :style="{color:prop.node.color}">{{prop.node.name}}</div>
              </div>
            </template>
          </q-tree>
        </q-tab-panel>
        <q-tab-panel name="avatar" id="tab-avatar" style="height:calc(100vh - 99px)">
          <tm-fileList ref="refTMFileList" v-model="data.avatar" v-model:view-type="viewType" :multiple="false" :size="353"
                       minHeight="360px" :isDelete="false" :lblConfirmTitle="$t('messageBox.warning')" :lblConfirmContent="$t('messageBox.delete')"
                       :lblOk="$t('global.accept')" :lblCancel="$t('global.cancel')">
            <template v-slot:tool-bar>
              <q-toolbar-title></q-toolbar-title>
              <q-btn round dense flat icon="file_upload" color="primary" @click="isDialogUpload=!isDialogUpload" />
              <q-btn round dense flat icon="cloud_circle" color="secondary" @click="isDialogFileManager=!isDialogFileManager" />
            </template>
          </tm-fileList>
        </q-tab-panel>
      </q-form>
    </q-card-section>
  </q-card>
  <!-- Dialog FileManager -->
  <q-dialog v-model="isDialogFileManager" maximized>
    <q-card>
      <q-card-section class="q-pl-md q-pr-md q-pt-none q-pb-none" style="height:93%">
        <!---->
        <tm-fileManager lblAccept="" :lblConfirmTitle="$t('messageBox.warning')" :lblConfirmContent="$t('messageBox.delete')"
                        :size="113" :lblOk="$t('global.accept')" :lblCancel="$t('global.cancel')" accept=".jpg,.jpeg,.png,.gif,.jfif"
                        :url="$store.state.app.apiUpload" @onAccept="onAccept" :multiple="false" mimeType="image"
                        :headers="[{name:'Upload-Path',value:`users`},{ name:'Upload-Rename',value:true},{name:'x-access-token',value:`Bearer ${$store.state.auth.token}`}]">
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
        <tm-upload :multiple="false" :lblConfirmTitle="$t('messageBox.warning')" :lblConfirmContent="$t('messageBox.delete')"
                   :lblOk="$t('global.accept')" :lblCancel="$t('global.cancel')" :size="353" mimeType="image"
                   accept=".jpg,.jpeg,.png,.gif,.jfif" :upload-url="$store.state.app.apiUpload" @on-finish="onUploaded"
                   :headers="[{name:'Upload-Path',value:`users${data.username?'/'+data.username:''}`},{ name:'Upload-Rename',value:true},{name:'x-access-token',value:`Bearer ${$store.state.auth.token}`}]">
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
import { useQuasar } from 'quasar'
import { normalize } from '../../../../global/utils/search'
import { regionConstant } from '@/boot/i18n'
export default defineComponent({
  name: "UserAdd",
  components: {
    tmTabs: defineAsyncComponent(() => import('components/tm-tabs')),
    tmFileList: defineAsyncComponent(() => import('@/components/tm-file-list')),
    tmUpload: defineAsyncComponent(() => import('@/components/tm-upload')),
    tmFileManager: defineAsyncComponent(() => import('@/components/tm-file-manager')),
    // tmQrcodegenerator: defineAsyncComponent(() => import('@/components/tm-qrcode-generator')),
  },
  setup (props, { emit }) {
    const $store = useStore()
    const $q = useQuasar()
    const roles = computed(() => $store.state.roles.all || [])
    const groups = computed(() => $store.state.types.items.filter(x => x.key === 'userGroup'))
    const genders = computed(() => $store.state.types.items.filter(x => x.key === 'gender'))
    const tabs = ref('main')
    const form = ref(null)
    const data = ref({})
    const passwordType = ref('password')
    const regions = ref(regionConstant)
    const selectedRegion = ref(regions.value[202])
    const gender = ref(genders.value[0])
    const group = ref(groups.value[0])
    const uploadUrl = ref(false)
    // TMFileList
    const viewType = ref('box')
    const refTMFileList = ref(null)
    // TMUpload
    const isDialogUpload = ref(false)
    const isDialogFileManager = ref(false)
    // const imagesList = ref([])

    if ($store.state.auth.token) {
      if (!$store.state.roles.all || $store.state.roles.all.length < 1)
        $store.dispatch('roles/get', { flag: 1, all: true })
    }
    const onReset = () => {
      return new Promise((resolve, reject) => {
        if ($store.state.users.item) data.value = { ...$store.state.users.item }
        if ($store.state.users.item._id) {
          const userRegion = regions.value.find(x => x.id === parseInt(data.value.region))
          if (userRegion) selectedRegion.value = userRegion
          gender.value = genders.value.find(x => x.code === data.value.gender)
          group.value = groups.value.find(x => x.code === data.value.group)
          data.value.note = data.value.note || ''
        }
        resolve()
      }).then(() => { if (form.value) form.value.resetValidation() })
    }

    onReset()

    return {
      tabs, form, data, viewType, refTMFileList, isDialogUpload, isDialogFileManager,
      passwordType, regions, selectedRegion, genders, gender, group, roles, groups,
      onSelectCategory (item) {
        if (!item.children || !item.children.length) {
          data.value.group = item._id
        }
      },
      onFilterRegion (val, update, abort) {
        update(() => { regions.value = regionConstant.filter(v => normalize(v.name.toLowerCase()).indexOf(normalize(val.toLowerCase())) > -1) })
      },
      validEmail (email) {
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        return re.test(email)
      },
      onSubmit (enable) {
        form.value.validate().then(async (valid) => {
          if (valid) {
            data.value.enable = enable
            data.value.region = selectedRegion.value.id
            data.value.gender = gender.value.code
            data.value.group = group.value.code
            data.value.userRoles = roles.value.filter(x => data.value.roles.includes(x._id))
            if ($store.state.users.item._id) $store.dispatch('users/put', data.value)
            else $store.dispatch('users/post', data.value).then((x) => {
              $q.notify({ color: 'teal', message: `Username: ${x.username} - Password: ${x.password}` })
              onReset()
            })
          }
        })
      },
      onUploaded (val) {
        isDialogUpload.value = false
        if (val) data.value.avatar = uploadUrl.value ? val.url : val
      },
      onAccept (val) {
        isDialogFileManager.value = false
        if (val) data.value.avatar = uploadUrl.value ? val.url : val
        console.log(data.value.avatar)
      }
    }
  }
})
</script>
