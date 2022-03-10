<template>
  <q-layout view="lHh Lpr lFf">
    <loading v-if="isSpinner" />
    <!-- <div v-if="!$store.state.auth.verified" class="window-height window-width row justify-center items-center"> -->
    <div v-else class="window-height window-width row justify-center items-center">
      <q-form ref="form" class="col-9 col-md-4">
        <q-card flat square inline bordered>
          <q-card-section class="bg-teal text-white">
            <div class="text-h6">{{$t('login.title')}}</div>
            <!-- <div class="text-subtitle2">by John Doe</div> -->
          </q-card-section>
          <q-card-section>
            <div class="q-pl-md q-pr-md q-pt-md">
              <q-input v-model.trim="data.username" :dense="$store.getters.dense.input" v-lowerCase :hint="$t('login.username')"
                       :placeholder="$t('login.username')" :rules="[v=>v&&v.length>0||$t('error.required')]" />
            </div>
            <div class="q-pl-md q-pr-md q-pt-md">
              <q-input v-model.trim="data.password" :type="passwordType" :dense="$store.getters.dense.input" :hint="$t('login.password')"
                       :placeholder="$t('login.password')" @keyup="onCheckCapslock" @blur="isCapsTooltip=false"
                       :rules="[v=>v&&v.length>0||$t('error.required')]" class="capsTooltip">
                <template v-slot:append>
                  <q-icon v-if="passwordType==='password'" name="visibility_off" @click="passwordType='text'" class="cursor-pointer" />
                  <q-icon v-else name="visibility" @click="passwordType='password'" class="cursor-pointer" />
                  <q-tooltip v-model="isCapsTooltip" :no-parent-event="true" :offset="[10,10]" content-class="bg-indigo">
                    Caps lock
                  </q-tooltip>
                </template>
              </q-input>
            </div>
            <div class="q-pl-xs q-pr-md q-pt-md">
              <q-checkbox v-model="data.remember" :label="$t('login.remember')" />
            </div>
          </q-card-section>
          <!-- <q-separator dark inset /> -->
          <q-card-actions align="right">
            <q-btn type="submit" flat :dense="$store.getters.dense.button" color="blue" :label="$t('login.login')"
                   :loading="$store.state.app.loading.post" :disable="$store.state.app.loading.post" @click.prevent="onSubmit">
              <!-- <q-tooltip>{{$t('global.add')}}</q-tooltip> -->
            </q-btn>
            <!-- <q-btn flat>Action 2</q-btn> -->
          </q-card-actions>
        </q-card>
      </q-form>
    </div>
  </q-layout>
</template>

<script>
// import * as apiUserSetting from '@/api/users/setting'
import { defineComponent, defineAsyncComponent, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
export default defineComponent({
  name: 'Login',
  components: {
    loading: defineAsyncComponent(() => import('../loading'))
  },
  setup () {
    // library core
    const $route = useRoute()
    const $router = useRouter()
    const $store = useStore()

    // Data
    const isSpinner = ref(false)
    const form = ref(null)
    const data = ref({
      username: '',
      password: '',
      remember: true
    })
    const passwordType = ref('password')
    const isCapsTooltip = ref(false)
    // Return data for html
    return {
      form, data, passwordType, isCapsTooltip, isSpinner,
      onCheckCapslock: ({ shiftKey, key } = {}) => {
        if (key && key.length === 1) {
          if (shiftKey && (key >= 'a' && key <= 'z') || !shiftKey && (key >= 'A' && key <= 'Z')) isCapsTooltip.value = true
          else isCapsTooltip.value = false
        }
        if (key === 'CapsLock' && isCapsTooltip.value === true) isCapsTooltip.value = false
      },
      validEmail: (email) => {
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        return re.test(email)
      },
      onSubmit: () => {
        form.value.validate().then(valid => {
          if (valid) {
            isSpinner.value = true
            setTimeout(() => {
              $store.dispatch('auth/verify', data.value).then((rs) => {
                if (rs) {
                  const redirect = $route.query && $route.query.redirect ? $route.query.redirect : '/'
                  $router.push(redirect).catch((e) => { })
                }
              })
            }, 1000)
          }
        })
      }
    }
  }
})
</script>

<style>
</style>
