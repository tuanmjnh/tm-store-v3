<template>
  <q-card flat bordered class="my-card">
    <q-card-section>
      <div class="row">
        <div class="text-subtitle2 text-bold self-center">{{$t('profile.title')}}</div>
        <q-space />
        <q-btn color="primary" :label="$t('global.update')" class="q-btn--square" :loading="$store.state.app.loading.put" @click="onSubmit"></q-btn>
      </div>
    </q-card-section>
    <q-separator />
    <q-form ref="form">
      <q-card-section>
        <div class="row q-gutter-xs">
          <div class="col-12 col-md-5">
            <q-input v-model.trim="data.email" :dense="$store.getters.dense.input" :label="$t('users.email')"
                     :rules="[v=>v&&v.length>0||$t('error.required'),v=>validEmail(v)||$t('error.email')]" />
          </div>
          <q-space />
          <div class="col-12 col-md-6">
            <q-input v-model.trim="data.fullName" :dense="$store.getters.dense.input" :label="$t('users.fullName')"
                     :rules="[v=>v&&v.length>0||$t('error.required')]" />
          </div>
        </div>
        <div class="row q-gutter-xs">
          <div class="col-12 col-md-5">
            <q-input :model-value="data.dateBirth?$moment(data.dateBirth).format($store.getters.format.date):''" :dense="$store.getters.dense.input"
                     readonly :label="$t('users.dateBirth')" :hint="`${$t('global.format')}: ${$store.getters.format.date}`">
              <template v-slot:append>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy ref="dateBirth" transition-show="scale" transition-hide="scale">
                    <q-date v-model="data.dateBirth" today-btn mask="YYYY-MM-DD" @update:model-value="()=>$refs.dateBirth.hide()" />
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
          </div>
          <q-space />
          <div class="col-12 col-md-6">
            <q-input v-model.trim="data.personNumber" type="number" :dense="$store.getters.dense.input" :label="$t('users.personNumber')"
                     :rules="[v=>v&&v.length>0||$t('error.required')]" />
          </div>
        </div>
        <div class="row q-gutter-xs">
          <div class="col-3">
            <q-select v-model="region" use-input hide-selected fill-input input-debounce="0" :dense="$store.getters.dense.input" :options="regions"
                      @filter="onFilterRegion" :hint="$t('users.selectRegion')" option-value="id" option-label="name_l"
                      :rules="[v=>v||$t('error.required')]">
              <template v-slot:option="scope">
                <q-item v-bind="scope.itemProps" v-on="scope.itemEvents">
                  <q-item-section>
                    <q-item-label v-html="scope.opt.name_l" />
                    <q-item-label caption>{{`+${scope.opt.pc}`}}</q-item-label>
                  </q-item-section>
                </q-item>
              </template>
              <template v-slot:no-option>
                <q-item>
                  <q-item-section class="text-grey">{{$t('table.noData')}}</q-item-section>
                </q-item>
              </template>
            </q-select>
          </div>
          <div class="col-6 col-md-5">
            <q-input v-model.trim="data.phone" :hint="$t('users.phone')" :placeholder="$t('users.phone')" :dense="$store.getters.dense.input"
                     :rules="[v=>v&&v.length>0||$t('error.required')]">
              <template v-if="region" v-slot:prepend>
                <span style="font-size:14px;line-height:0">+{{region.pc}}</span>
              </template>
            </q-input>
          </div>
          <q-space />
          <div class="col-6 col-md-3">
            <q-select v-model="gender" :options="genders" :hint="$t('users.gender')" option-value="_id"
                      :dense="$store.getters.dense.input" :options-dense="$store.getters.dense.input" :option-label="v=>$t(`gender.${v.code}`)"
                      :rules="[v=>v||$t('error.required')]" />
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
        </div>
        <div class="row q-gutter-xs q-mt-sm">
          <div class="col-12 col-md-12 self-center">
            {{$t('users.note')}}:
          </div>
          <div class="col-12">
            <!-- <q-input v-model.trim="data.note" autogrow :label="$t('users.note')" :dense="$store.getters.dense.input" /> -->
            <q-editor v-model.trim="data.note" min-height="5rem" />
          </div>
        </div>
      </q-card-section>
      <!-- <q-card-actions align="right">
        <q-btn color="primary" :label="$t('global.update')" class="q-btn--square"></q-btn>
      </q-card-actions> -->
    </q-form>
    <!-- <q-separator inset />
        <q-card-section>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
          tempor incididunt ut labore et dolore magna aliqua.
        </q-card-section> -->
  </q-card>
</template>

<script>
import { defineComponent, ref, computed } from 'vue';
import { useStore } from 'vuex'
import { regionConstant } from '@/boot/i18n'
import { validEmail } from '../../../../global/utils/validate'
export default defineComponent({
  name: 'Information',
  setup () {
    const $store = useStore()
    const regions = ref(regionConstant)
    const region = ref(null)
    const form = ref(null)
    const data = ref({ ...$store.state.auth.user })
    const genders = computed(() => $store.state.types.items.filter(x => x.key === 'gender'))
    const gender = ref(genders.value.find(x => x.code === data.value.gender))

    if (data.value) {
      // if (data.value.dateBirth) data.value.dateBirth = $moment(data.value.dateBirth).format('DD/MM/YYYY')
      if (data.value.region) {
        region.value = regions.value.find(x => x.id === parseInt(data.value.region))
      } else {
        region.value = regions.value.find(x => x.id === 241)
        if (!region.value) region.value = regions.value[0]
      }
    }
    return {
      form, data, regions, region, genders, gender, validEmail,
      onFilterRegion (val, update, abort) {
        update(() => {
          const needle = val.toLowerCase()
          // data.value.region = regions.value.filter(v => v.name.toLowerCase().indexOf(needle) > -1)
          regions.value = regionConstant.filter(v => v.name.toLowerCase().indexOf(needle) > -1)
        })
      },
      onSubmit () {
        form.value.validate().then((valid) => {
          if (valid) {
            data.value.region = region.value.id
            data.value.gender = gender.value.code
            $store.dispatch('users/put', data.value).then(x => {
              if (x) $store.commit('auth/SET_USER', { ...data.value })
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
