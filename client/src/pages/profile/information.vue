<template>
  <q-card flat bordered class="my-card">
    <q-card-section>
      <div class="row">
        <div class="text-subtitle2 text-bold self-center">{{$t('profile.title')}}</div>
        <q-space />
        <q-btn color="primary" :label="$t('global.update')" class="q-btn--square"
          :loading="$store.state.loading.put" @click="onSubmit"></q-btn>
      </div>
    </q-card-section>
    <q-separator />
    <q-form ref="form">
      <q-card-section>
        <div class="row q-gutter-xs">
          <div class="col-12 col-md-5">
            <q-input v-model.trim="form.email" :dense="$store.getters.dense.input" v-lowercase
              :label="$t('users.email')"
              :rules="[v=>v&&v.length>0||$t('error.required'),v=>validEmail(v)||$t('error.email')]" />
          </div>
          <q-space />
          <div class="col-12 col-md-6">
            <q-input v-model.trim="form.fullName" :dense="$store.getters.dense.input"
              :label="$t('users.fullName')" :rules="[v=>v&&v.length>0||$t('error.required')]" />
          </div>
        </div>
        <div class="row q-gutter-xs">
          <div class="col-12 col-md-5">
            <q-input :value="form.dateBirth" :dense="$store.getters.dense.input" readonly
              :label="$t('users.dateBirth')" :hint="`${$t('global.format')}: DD/MM/YYYY`">
              <template v-slot:append>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy ref="dateBirth" transition-show="scale" transition-hide="scale">
                    <q-date v-model="form.dateBirth" mask="DD/MM/YYYY" today-btn
                      @input="()=>$refs.dateBirth.hide()" />
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
          </div>
          <q-space />
          <div class="col-12 col-md-6">
            <q-input v-model.trim="form.personNumber" type="number"
              :dense="$store.getters.dense.input" :label="$t('users.personNumber')"
              :rules="[v=>v&&v.length>0||$t('error.required')]" />
          </div>
        </div>
        <div class="row q-gutter-xs">
          <div class="col-3">
            <q-select v-model="region" use-input hide-selected fill-input input-debounce="0"
              :dense="$store.getters.dense.input" :options="regions" @filter="onFilterRegion"
              :hint="$t('users.selectRegion')" option-value="id" option-label="name_l"
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
            <q-input v-model.trim="form.phone" :hint="$t('users.phone')"
              :placeholder="$t('users.phone')" :dense="$store.getters.dense.input"
              :rules="[v=>v&&v.length>0||$t('error.required')]">
              <template v-if="region" v-slot:prepend>
                <span style="font-size:14px;line-height:0">+{{region.pc}}</span>
              </template>
            </q-input>
          </div>
          <q-space />
          <div class="col-6 col-md-3">
            <q-select v-model="gender" :options="$store.getters.genders" :hint="$t('users.gender')"
              option-value="_id" :dense="$store.getters.dense.input"
              :options-dense="$store.getters.dense.input" :option-label="v=>$t(`gender.${v.code}`)"
              :rules="[v=>v||$t('error.required')]" />
          </div>
        </div>
        <div class="row q-gutter-xs q-mb-sm">
          <div class="col-12">
            <q-input v-model="form.address" :label="$t('users.address')"
              :dense="$store.getters.dense.input" />
          </div>
        </div>
        <div class="row q-gutter-xs">
          <div class="col-12 col-md-5 self-center">
            <q-toggle v-model="form.verified" :true-value="true" :dense="$store.getters.dense.input"
              :label="$t('users.verified')" :text-color="form.verified?'green':'blue-grey-10'" />
          </div>
        </div>
        <div class="row q-gutter-xs q-mt-sm">
          <div class="col-12 col-md-12 self-center">
            {{$t('users.note')}}:
          </div>
          <div class="col-12">
            <!-- <q-input v-model.trim="form.note" autogrow :label="$t('users.note')" :dense="$store.getters.dense.input" /> -->
            <q-editor v-model.trim="form.note" min-height="5rem" />
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
import * as apiUsers from '@/api/users'
// import * as apiTypes from '@/api/types'
import regionData from '@/i18n/region'
export default {
  data() {
    return {
      loading: false,
      tabs: 'main',
      viewType: 'box',
      uploadUrl: process.env.API_FILE_UPLOAD,
      headers: [
        { name: 'Upload-Path', value: 'users' },
        { name: 'Upload-Rename', value: true },
        { name: 'x-access-token', value: `Bearer ${this.$store.state.auth.token}` }],
      regions: regionData,
      region: null,
      gender: null,
      form: { ...this.$store.state.auth.user }
    }
  },
  created() {
    this.gender = this.$store.getters.genders.find(x => x.id === this.form.gender)
    if (this.form) {
      if (this.form.dateBirth) this.form.dateBirth = this.$moment(this.form.dateBirth).format('DD/MM/YYYY')
      if (this.form.region) {
        this.region = this.regions.find(x => x.id === parseInt(this.form.region))
      } else {
        this.region = this.regions.find(x => x.id === 241)
        if (!this.region) this.region = this.regions[0]
      }
    }
  },
  methods: {
    // onGetGenders() {
    //   this.genders = []
    //   apiTypes.select({ key: 'gender' }).then(x => {
    //     if (x && x.data) this.genders = x.data
    //     if (this.form.gender) this.gender = this.genders.find(x => x._id === this.form.gender)
    //     else this.gender = this.gender = this.genders[0]
    //   })
    // },
    onFilterRegion(val, update, abort) {
      update(() => {
        const needle = val.toLowerCase()
        // this.form.region = this.regions.filter(v => v.name.toLowerCase().indexOf(needle) > -1)
        this.regions = regionData.filter(v => v.name.toLowerCase().indexOf(needle) > -1)
      })
    },
    validEmail(email) {
      var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      return re.test(email)
    },
    onSubmit() {
      this.$refs.form.validate().then(valid => {
        if (valid) {
          this.form.region = this.region.id
          this.form.gender = this.gender._id
          apiUsers.update(this.form).then(x => {
            if (x) {
              this.$store.commit('auth/SET_USER', { ...this.form })
            }
          })
        }
      })
    }
  }
}
</script>

<style>
</style>
