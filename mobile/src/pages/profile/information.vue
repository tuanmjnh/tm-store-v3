<template>
  <q-list separator>
    <q-item clickable v-ripple>
      <q-item-section>{{$t('users.email')}}</q-item-section>
      <q-item-section>{{data.email}}</q-item-section>
      <q-item-section side>
        <q-icon name="chevron_right" />
      </q-item-section>
      <q-popup-edit v-model.trim="data.email" v-slot="scope" auto-save :validate="v=>v&&v.length>0&&validEmail(v)"
                    @update:model-value="onUpdateEmail">
        <q-input v-model="scope.value" dense autofocus counter @keyup.enter="scope.set"
                 :rules="[v=>v&&v.length>0||$t('error.required'),v=>validEmail(v)||$t('error.email')]" />
        <!-- <q-card-actions align="center" class="q-pa-none">
          <q-btn flat dense class="q-mr-xl" :label="$t('global.cancel')" @click.stop="scope.cancel" />
          <q-btn flat dense color="primary" :label="$t('global.update')" @click.stop="scope.set" />
        </q-card-actions> -->
      </q-popup-edit>
    </q-item>

    <q-item clickable v-ripple>
      <q-item-section>{{$t('users.fullName')}}</q-item-section>
      <q-item-section>{{data.fullName}}</q-item-section>
      <q-item-section side>
        <q-icon name="chevron_right" />
      </q-item-section>
      <q-popup-edit v-model.trim="data.fullName" v-slot="scope" auto-save :validate="v=>v&&v.length>0" @update:model-value="onUpdateFullName">
        <q-input v-model="scope.value" dense autofocus counter @keyup.enter="scope.set" :rules="[v=>v&&v.length>0||$t('error.required')]" />
      </q-popup-edit>
    </q-item>

    <q-item clickable v-ripple>
      <q-item-section>{{$t('users.dateBirth')}}</q-item-section>
      <q-item-section>{{data.dateBirth?$moment(data.dateBirth).format($store.getters.format.date):''}}</q-item-section>
      <q-item-section side>
        <q-icon name="chevron_right" />
      </q-item-section>
      <q-popup-proxy ref="refDateBirth" transition-show="scale" transition-hide="scale">
        <q-date v-model="data.dateBirth" today-btn mask="YYYY-MM-DD" @update:model-value="onUpdateDateBirth" />
      </q-popup-proxy>
    </q-item>

    <q-item clickable v-ripple>
      <q-item-section>{{$t('users.personNumber')}}</q-item-section>
      <q-item-section>{{data.personNumber}}</q-item-section>
      <q-item-section side>
        <q-icon name="chevron_right" />
      </q-item-section>
      <q-popup-edit v-model.number="data.personNumber" v-slot="scope" auto-save :validate="v=>v&&v.length>0"
                    @update:model-value="onUpdatePersonNumber">
        <q-input v-model="scope.value" dense autofocus counter @keyup.enter="scope.set" type="number"
                 :rules="[v=>v&&v.length>0||$t('error.required')]" />
      </q-popup-edit>
    </q-item>

    <q-item clickable v-ripple @click="onRegionClick">
      <q-item-section>{{$t('users.region')}}</q-item-section>
      <q-item-section>{{region.name_l}}</q-item-section>
      <q-item-section side>
        <q-icon name="chevron_right" />
      </q-item-section>
      <q-popup-proxy ref="refRegion" transition-show="scale" transition-hide="scale">
        <q-card style="min-width:300px">
          <q-card-section>
            <q-select v-model="region" id="regionSelect" use-input hide-selected fill-input input-debounce="0" :dense="$store.getters.dense.input"
                      :options="regions" @filter="onFilterRegion" :hint="$t('users.selectRegion')" option-value="id" option-label="name_l"
                      :rules="[v=>v||$t('error.required')]" @update:model-value="onUpdateRegion">
              <template v-slot:option="scope">
                <q-item v-bind="scope.itemProps">
                  <q-item-section>
                    <q-item-label v-html="scope.opt.name_l" />
                  </q-item-section>
                </q-item>
              </template>
              <template v-slot:no-option>
                <q-item>
                  <q-item-section class="text-grey">{{$t('table.noData')}}</q-item-section>
                </q-item>
              </template>
            </q-select>
          </q-card-section>
        </q-card>
      </q-popup-proxy>
    </q-item>

    <q-item clickable v-ripple>
      <q-item-section>{{$t('users.phone')}}</q-item-section>
      <q-item-section>{{data.phone}}</q-item-section>
      <q-item-section side>
        <q-icon name="chevron_right" />
      </q-item-section>
      <q-popup-edit v-model.number="data.phone" v-slot="scope" auto-save :validate="v=>v&&v.length>0" @update:model-value="onUpdatePhone">
        <q-input v-model="scope.value" dense autofocus counter @keyup.enter="scope.set" type="number"
                 :rules="[v=>v&&v.length>0||$t('error.required')]" />
      </q-popup-edit>
    </q-item>

    <q-item clickable v-ripple>
      <q-item-section>{{$t('users.gender')}}</q-item-section>
      <q-item-section>{{$t(`gender.${data.gender}`)}}</q-item-section>
      <q-item-section side>
        <q-icon name="chevron_right" />
      </q-item-section>
      <q-popup-proxy ref="refGender" transition-show="scale" transition-hide="scale">
        <q-card style="min-width:300px">
          <q-card-section>
            <q-list separator>
              <q-item clickable v-ripple v-for="e in genders" :key="e" @click="onUpdateGender(e.code)">
                <q-item-section :class="e.code===data.gender?'text-primary':''">{{$t(`gender.${e.code}`)}}</q-item-section>
              </q-item>
            </q-list>
          </q-card-section>
        </q-card>
      </q-popup-proxy>
    </q-item>

    <q-item clickable v-ripple>
      <q-item-section>{{$t('users.address')}}</q-item-section>
      <q-item-section>{{data.address}}</q-item-section>
      <q-item-section side>
        <q-icon name="chevron_right" />
      </q-item-section>
      <q-popup-edit v-model.trim="data.address" v-slot="scope" auto-save :validate="v=>v&&v.length>0" @update:model-value="onUpdateAddress">
        <q-input v-model="scope.value" dense autofocus counter @keyup.enter="scope.set" :rules="[v=>v&&v.length>0||$t('error.required')]" />
      </q-popup-edit>
    </q-item>

    <q-item clickable v-ripple>
      <q-item-section>{{$t('users.verify')}}</q-item-section>
      <q-item-section>
        <q-icon v-if="data.verified" name="check_circle" color="primary" />
        <q-icon v-else name="block" color="negative" />
      </q-item-section>
      <q-item-section side>
        <q-icon name="chevron_right" />
      </q-item-section>
    </q-item>
    <q-item clickable v-ripple>
      <q-item-section>{{$t('users.note')}}</q-item-section>
    </q-item>
    <!-- <q-item clickable v-ripple>
      <q-item-section>{{$t('users.note')}}</q-item-section>
      <q-item-section v-html="data.note?data.note:`<i style='color:#f2c037'>${$t('table.noData')}</i>`"></q-item-section>
      <q-item-section side>
        <q-icon name="chevron_right" />
      </q-item-section>
      <q-popup-edit v-model="data.note" v-slot="scope" auto-save @update:model-value="onUpdateNote">
        <q-editor v-model.trim="scope.value" min-height="5rem" autofocus />
      </q-popup-edit>
    </q-item> -->
  </q-list>
  <!-- <q-card-section style="1px solid rgba(0, 0, 0, 0.12)">
    {{$t('users.note')}}
  </q-card-section> -->
  <q-card-section class="rounded-borders">
    <div v-html="data.note?data.note:`<i style='color:#f2c037'>${$t('table.noData')}</i>`"></div>
    <q-popup-edit v-model.trim="data.note" v-slot="scope" auto-save @update:model-value="onUpdateNote">
      <q-editor v-model="scope.value" min-height="5rem" autofocus />
    </q-popup-edit>
  </q-card-section>
</template>

<script>
import { defineComponent, ref, computed, watch } from "vue";
import { useStore } from 'vuex'
import { regionConstant } from '@/boot/i18n'
import { validEmail } from '../../../../global/utils/validate'
export default defineComponent({
  name: "Information",
  setup () {
    const $store = useStore()
    const regions = ref(regionConstant)
    const region = ref(null)
    const form = ref(null)
    const data = ref({ ...$store.state.auth.user })
    const genders = computed(() => $store.state.types.items.filter(x => x.key === 'gender'))
    const gender = ref(genders.value.find(x => x.code === data.value.gender))
    const refDateBirth = ref(null)
    const refRegion = ref(null)
    const refGender = ref(null)
    if (data.value) {
      // if (data.value.dateBirth) data.value.dateBirth = $moment(data.value.dateBirth).format('DD/MM/YYYY')
      if (data.value.region) {
        region.value = regions.value.find(x => x.id === parseInt(data.value.region))
      } else {
        region.value = regions.value.find(x => x.id === 241)
        if (!region.value) region.value = regions.value[0]
      }
    }
    const onUpdate = (val) => {
      return $store.dispatch('users/update', { data: data.value, update: { ...val, ...{ _id: data.value._id } } }).then((x) => {
        if (x) {
          $store.commit('auth/SET_USER', { ...data.value })
          return x
        }
        return null
      }).catch(e => { return null })
    }
    return {
      form, data, regions, region, genders, gender, refDateBirth, refRegion, refGender, validEmail,
      onFilterRegion (val, update, abort) {
        update(() => {
          const needle = val.toLowerCase()
          // data.value.region = regions.value.filter(v => v.name.toLowerCase().indexOf(needle) > -1)
          regions.value = regionConstant.filter(v => v.name.toLowerCase().indexOf(needle) > -1)
        })
      },
      onUpdateEmail (val) {
        onUpdate({ email: val }).then(x => {
          if (!x) data.value = { ...$store.state.auth.user }
        })
      },
      onUpdateFullName (val) {
        onUpdate({ fullName: val }).then(x => {
          if (!x) data.value = { ...$store.state.auth.user }
        })
      },
      onUpdateDateBirth (val) {
        if (refDateBirth.value) refDateBirth.value.hide()
        onUpdate({ dateBirth: val }).then(x => {
          if (!x) data.value = { ...$store.state.auth.user }
        })
      },
      onUpdatePersonNumber (val) {
        onUpdate({ personNumber: val }).then(x => {
          if (!x) data.value = { ...$store.state.auth.user }
        })
      },
      onRegionClick (val) {
        setTimeout(() => {
          console.log(document.getElementById('regionSelect').click())
        }, 100)
      },
      onUpdateRegion (val) {
        if (refRegion.value) refRegion.value.hide()
        onUpdate({ region: val.id }).then(x => {
          if (!x) data.value = { ...$store.state.auth.user }
        })
      },
      onUpdatePhone (val) {
        onUpdate({ phone: val }).then(x => {
          if (!x) data.value = { ...$store.state.auth.user }
        })
      },
      onUpdateGender (val) {
        if (refGender.value) refGender.value.hide()
        onUpdate({ gender: val }).then(x => {
          if (!x) data.value = { ...$store.state.auth.user }
          else data.value.gender = val
        })
      },
      onUpdateAddress (val) {
        onUpdate({ address: val }).then(x => {
          if (!x) data.value = { ...$store.state.auth.user }
        })
      },
      onUpdateNote (val) {
        onUpdate({ note: val }).then(x => {
          if (!x) data.value.note = $store.state.auth.user.note || ''
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
