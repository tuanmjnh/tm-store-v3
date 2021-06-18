<template>
  <q-card flat bordered class="my-card">
    <q-card-section class="row">
      <div class="text-subtitle2 text-bold self-center">{{$t('profile.security')}}</div>
      <q-space />
      <q-btn color="primary" :label="$t('global.update')" class="q-btn--square"
        :loading="$store.state.loading.post" @click="onSubmit"></q-btn>
    </q-card-section>
    <q-separator />
    <q-form ref="form">
      <q-card-section>
        <div class="row q-gutter-xs">
          <div class="col-12 col-md-6">
            <!-- <q-input v-model.trim="form.oldPassword" :dense="$store.getters.dense.input" :label="$t('users.oldPassword')"
              :rules="[v=>v&&v.length>0||$t('error.required')]" /> -->
            <q-input v-model.trim="oldPassword.value" :type="oldPassword.type"
              :dense="$store.getters.dense.input" :label="$t('users.oldPassword')"
              @keyup.native="oldPassword.caps=checkCapslock($event)" @blur="oldPassword.caps=false"
              :rules="[v=>v&&v.length>0||$t('error.required')]" class="capsTooltip">
              <template v-slot:append>
                <q-icon v-if="oldPassword.type==='password'" name="visibility_off"
                  @click="oldPassword.type='text'" class="cursor-pointer" />
                <q-icon v-else name="visibility" @click="oldPassword.type='password'"
                  class="cursor-pointer" />
                <q-tooltip v-model="oldPassword.caps" :no-parent-event="true" :offset="[10, 10]"
                  content-class="bg-indigo">
                  Caps lock
                </q-tooltip>
              </template>
            </q-input>
          </div>
        </div>
        <div class="row q-gutter-xs">
          <div class="col-12 col-md-6">
            <!-- <q-input v-model.trim="form.newPassword" :dense="$store.getters.dense.input"
              :label="$t('users.newPassword')" :rules="[v=>v&&v.length>0||$t('error.required')]" /> -->
            <q-input v-model.trim="newPassword.value" :type="newPassword.type"
              :dense="$store.getters.dense.input" :label="$t('users.newPassword')"
              @keyup.native="newPassword.caps=checkCapslock($event)" @blur="newPassword.caps=false"
              :rules="[v=>v&&v.length>0||$t('error.required')]" class="capsTooltip">
              <template v-slot:append>
                <q-icon v-if="newPassword.type==='password'" name="visibility_off"
                  @click="newPassword.type='text'" class="cursor-pointer" />
                <q-icon v-else name="visibility" @click="newPassword.type='password'"
                  class="cursor-pointer" />
                <q-tooltip v-model="newPassword.caps" :no-parent-event="true" :offset="[10, 10]"
                  content-class="bg-indigo">
                  Caps lock
                </q-tooltip>
              </template>
            </q-input>
          </div>
        </div>
        <!-- <div class="row q-gutter-xs">
          <div class="col-12 col-md-6">
            <q-input v-model.trim="rePassword.value" :type="rePassword.type" :dense="$store.getters.dense.input"
              :placeholder="$t('users.re_password')" @keyup.native="rePassword.caps=checkCapslock($event)"
              @blur="rePassword.caps=false" :rules="[v=>v&&v.length>0||$t('error.required')]" class="capsTooltip">
              <template v-slot:append>
                <q-icon v-if="rePassword.type==='password'" name="visibility_off" @click="rePassword.type='text'"
                  class="cursor-pointer" />
                <q-icon v-else name="visibility" @click="rePassword.type='password'" class="cursor-pointer" />
                <q-tooltip v-model="rePassword.caps" :no-parent-event="true" :offset="[10, 10]"
                  content-class="bg-indigo">
                  Caps lock
                </q-tooltip>
              </template>
            </q-input>
          </div>
        </div> -->
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
import * as api from '@/api/users'
export default {
  data() {
    return {
      oldPassword: {
        value: '',
        type: 'password',
        caps: false
      },
      newPassword: {
        value: '',
        type: 'password',
        caps: false
      },
      rePassword: {
        value: '',
        type: 'password',
        caps: false
      }
    }
  },
  methods: {
    checkCapslock({ shiftKey, key } = {}) {
      // console.log(shiftKey, key)
      let caps = false
      if (key && key.length === 1) {
        if (shiftKey && (key >= 'a' && key <= 'z') || !shiftKey && (key >= 'A' && key <= 'Z')) {
          caps = true
        } else {
          caps = false
        }
      }
      if (key === 'CapsLock' && caps === true) {
        caps = false
      }
      return caps
    },
    onSubmit(action) {
      this.$refs.form.validate().then(valid => {
        if (valid) {
          api.changePassword({ oldPassword: this.oldPassword.value, newPassword: this.newPassword.value }).then(x => {
            if (x) {
              this.reset()
              // console.log(x)
            }
          })
        }
      })
    },
    reset() {
      new Promise((resolve, reject) => {
        this.oldPassword.value = ''
        this.newPassword.value = ''
        resolve()
      }).then(() => {
        if (this.$refs.form) this.$refs.form.resetValidation()
      })
    }
  }
}
</script>

<style>
</style>
