<template>
  <div>
    <div class="row card-title">
      <div class="col-sm-auto col-xs-12 text-h6 card-title-text">
        <q-avatar v-if="dialog" :icon="$route.meta.icon" size="50px" />
        {{$store.state.users.item._id?$t('global.update'):$t('global.add') }}
        <span class="text-weight-bold">{{ $t("users.title") }}</span>
      </div>
      <q-space />
      <div class="col-sm-auto col-xs-12 text-right">
        <q-btn v-if="$store.state.users.item._id" flat type="submit" :dense="$store.getters.dense.button" color="amber"
               icon="offline_pin" :loading="$store.state.app.loading.put" @click.prevent="onSubmit">
          <!-- :label="dialog?'':$t('global.update')" -->
          <q-tooltip>{{$t('global.update')}}</q-tooltip>
        </q-btn>
        <q-btn v-if="!$store.state.users.item._id" flat type="submit" :dense="$store.getters.dense.button" color="blue"
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
        <q-tab name="roles" :label="$t('roles.title')" />
        <q-tab name="avatar" :label="$t('users.avatar')" />
      </q-tabs>
      <q-separator />
      <!-- <q-card-section> -->
      <q-scroll-area style="height:calc(100vh - 180px)">
        <q-tab-panels v-model="tabs">
          <q-tab-panel name="main">
            <div class="row q-gutter-xs">
              <div class="col-12">
                <q-select v-model="group" input-debounce="200" :dense="$store.getters.dense.input" :options="groups" :label="$t('users.group')"
                          option-value="code" :option-label="opt=>opt.name" :rules="[v=>!!v||$t('error.required')]" />
              </div>
            </div>
            <div v-if="!$store.state.users.item._id" class="row q-gutter-xs">
              <div class="col-12 col-md-5">
                <q-input v-model.trim="data.username" :dense="$store.getters.dense.input" v-lowerCase :label="$t('users.username')"
                         :rules="[v=>!!v||$t('error.required'),v=>v.length>4||$t('error.minLength',{min:5})]" />
              </div>
              <q-space />
              <div class="col-12 col-md-6">
                <input type="password" class="hidden" />
                <q-input v-model.trim="data.password" :dense="$store.getters.dense.input" :label="$t('users.password')" autocomplete="new-password"
                         :type="passwordType" :rules="[v=>!!v||$t('error.required'),v=>v.length>5||$t('error.minLength',{min:6})]">
                  <template v-slot:append>
                    <q-icon v-if="passwordType === 'password'" name="visibility_off" @click="passwordType = 'text'" class="cursor-pointer" />
                    <q-icon v-else name="visibility" @click="passwordType = 'password'" class="cursor-pointer" />
                  </template>
                </q-input>
              </div>
            </div>
            <div class="row q-gutter-xs">
              <div class="col-12 col-md-5">
                <q-input v-model.trim="data.email" :dense="$store.getters.dense.input" v-lowerCase :label="$t('users.email')"
                         :rules="[v=>!!v||$t('error.required'),v=>validEmail(v)||$t('error.email')]" />
              </div>
              <q-space />
              <div class="col-12 col-md-6">
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
              <div class="col-12 col-md-6">
                <q-input v-model.trim="data.personNumber" type="number" :dense="$store.getters.dense.input"
                         :label="$t('users.personNumber')" :rules="[v=>!!v||$t('error.required')]" />
              </div>
            </div>
            <div class="row q-gutter-xs">
              <div class="col-3">
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
              <div class="col-6 col-md-5">
                <q-input v-model.trim="data.phone" :dense="$store.getters.dense.input" :hint="$t('users.phone')" :placeholder="$t('users.phone')"
                         :rules="[v=>!!v||$t('error.required')]">
                  <template v-if="selectedRegion" v-slot:prepend>
                    <span style="font-size:14px;line-height:0">+{{selectedRegion.pc}}</span>
                  </template>
                </q-input>
              </div>
              <q-space />
              <div class="col-6 col-md-3">
                <q-select v-model="gender" :options="genders" :dense="$store.getters.dense.input" :hint="$t('users.gender')"
                          :options-dense="$store.getters.dense.input" option-value="id" :option-label="v=>$t(`gender.${v.code}`)"
                          :rules="[v=>!!v||$t('error.required')]" />
              </div>
            </div>
            <div class="row q-gutter-xs q-mb-sm">
              <div class="col-12">
                <q-input v-model="data.address" :label="$t('users.address')" :dense="$store.getters.dense.input" />
              </div>
            </div>
            <div class="row q-gutter-xs">
              <div class="col-12 col-md-5 self-center">
                <q-toggle v-model="data.verified" :true-value="true" :dense="$store.getters.dense.input" :label="$t('users.verified')"
                          :text-color="data.verified?'green':'blue-grey-10'" />
              </div>
              <q-space />
              <div class="col-12 col-md-6 self-center">
                <q-toggle v-model="data.enable" :true-value="true" :dense="$store.getters.dense.input"
                          :label="data.enable?$t('global.working'):$t('global.lock')" />
              </div>
            </div>
            <div class="row q-gutter-xs q-mt-sm">
              <div class="col-12 col-md-12 self-center">{{$t("users.note")}}:</div>
              <div class="col-12">
                <!-- <q-input v-model.trim="data.note" autogrow :label="$t('users.note')" :dense="$store.getters.dense.input" /> -->
                <q-editor v-model.trim="data.note" min-height="2rem" />
              </div>
            </div>
          </q-tab-panel>
          <q-tab-panel name="roles">
            <q-tree class="col-12 col-sm-6" :nodes="roles" :dense="$store.getters.dense.input" v-model:ticked="data.roles" node-key="_id"
                    label-key="name" tick-strategy="leaf" :no-nodes-label="$t('table.noData')">
              <template v-slot:default-header="prop">
                <div class="row items-center">
                  <div :style="{color:prop.node.color}">{{prop.node.name}}</div>
                </div>
              </template>
            </q-tree>
            <!-- <q-btn flat color="positive" icon="check_circle" :label="$t('global.add')" @click="onTicked">
          </q-btn> -->
          </q-tab-panel>
          <q-tab-panel name="avatar">
            <div class="row">
              <div class="col-12 q-gutter-sm images">
                <tm-upload v-model="data.avatar" :upload-url="$store.state.app.apiFileUpload" :max-file-size="1024*1024*2"
                           :headers="[{name:'Upload-Path',value:'users'},{ name:'Upload-Rename',value:true},{name:'x-access-token',value:`Bearer ${$store.state.auth.token}`}]"
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
        </q-tab-panels>
      </q-scroll-area>
      <!-- </q-card-section> -->
    </q-form>
    <!-- </q-card> -->
  </div>
</template>

<script>
import { defineComponent, defineAsyncComponent, ref, computed } from 'vue';
import { useStore } from 'vuex'
import { useQuasar } from 'quasar'
import { normalize } from '../../../../global/utils/search'
import { regionConstant } from '@/boot/i18n'
export default defineComponent({
  name: 'UsersAdd',
  components: { tmUpload: defineAsyncComponent(() => import('components/tm-upload')) },
  props: {
    dialog: { type: Boolean, default: false },
    maximized: { type: Boolean, default: false }
  },
  setup () {
    const $store = useStore()
    const $q = useQuasar()
    const roles = computed(() => $store.state.roles.items)
    const groups = computed(() => $store.state.types.items.filter(x => x.key === 'userGroup'))
    const genders = computed(() => $store.state.types.items.filter(x => x.key === 'gender'))
    const tabs = ref('main')
    const form = ref(null)
    const data = ref({})
    const passwordType = ref('password')
    const viewType = ref('box')
    const regions = ref(regionConstant)
    const selectedRegion = ref(regions.value[202])
    const gender = ref(genders.value[0])
    const group = ref(groups.value[0])

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
      passwordType, tabs, viewType, regions, selectedRegion, form, data, genders, gender, group, roles, groups,
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
      onSubmit () {
        form.value.validate().then(async (valid) => {
          if (valid) {
            data.value.region = selectedRegion.value.id
            data.value.gender = gender.value.code
            data.value.group = group.value.code
            if ($store.state.users.item._id) $store.dispatch('users/put', data.value)
            else $store.dispatch('users/post', data.value).then((x) => {
              $q.notify({ color: 'teal', message: `Username: ${x.username} - Password: ${x.password}` })
              onReset()
            })
          }
        })
      }
    }
  }
})
</script>

<style>
</style>
