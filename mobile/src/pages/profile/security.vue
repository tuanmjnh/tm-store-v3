<template>
  <q-list separator>
    <q-item clickable v-ripple @click="isDialogChangePassword=!isDialogChangePassword">
      <q-item-section avatar>
        <q-icon color="primary" name="password" />
      </q-item-section>
      <q-item-section>{{$t('users.changePassword')}}</q-item-section>
      <q-item-section side>
        <q-icon name="chevron_right" />
      </q-item-section>
    </q-item>
    <q-item clickable v-ripple @click="isDialogLoginHistory=!isDialogLoginHistory">
      <q-item-section avatar>
        <q-icon color="primary" name="manage_history" />
      </q-item-section>
      <q-item-section>{{$t('users.loginHistory')}}</q-item-section>
      <q-item-section side>
        <q-icon name="chevron_right" />
      </q-item-section>
    </q-item>
    <q-item clickable v-ripple @click="isDialogSecurityCheck=!isDialogSecurityCheck">
      <q-item-section avatar>
        <q-icon color="primary" name="health_and_safety" />
      </q-item-section>
      <q-item-section>{{$t('users.securityCheck')}}</q-item-section>
      <q-item-section side>
        <q-icon name="chevron_right" />
      </q-item-section>
    </q-item>
  </q-list>

  <!-- Dialog change password -->
  <q-dialog v-model="isDialogChangePassword" :maximized="isMaximized">
    <q-card>
      <q-card-section class="row">
        <div class="col-2">
          <q-btn flat dense icon="arrow_back" v-close-popup></q-btn>
        </div>
        <q-space />
        <div class="col">
          <span class="text-h6">{{$t('users.changePassword')}}</span>
        </div>
      </q-card-section>
      <q-form ref="form">
        <q-card-section class="q-pt-none">
          <div class="row">
            <div class="col">
              <q-input v-model.trim="oldPassword.value" :type="oldPassword.type" :dense="$store.getters.dense.input" :label="$t('users.oldPassword')"
                       @keyup="oldPassword.caps=onCheckCapslock($event)" @blur="oldPassword.caps=false"
                       :rules="[v=>v&&v.length>0||$t('error.required')]"
                       class="capsTooltip">
                <template v-slot:append>
                  <q-icon v-if="oldPassword.type==='password'" name="visibility_off" @click="oldPassword.type='text'" class="cursor-pointer" />
                  <q-icon v-else name="visibility" @click="oldPassword.type='password'" class="cursor-pointer" />
                  <q-tooltip v-model="oldPassword.caps" :no-parent-event="true" :offset="[10, 10]" content-class="bg-indigo">
                    Caps lock
                  </q-tooltip>
                </template>
              </q-input>
            </div>
          </div>
          <div class="row">
            <div class="col">
              <q-input v-model.trim="newPassword.value" :type="newPassword.type" :dense="$store.getters.dense.input" :label="$t('users.newPassword')"
                       @keyup="newPassword.caps=onCheckCapslock($event)" @blur="newPassword.caps=false"
                       :rules="[v=>v&&v.length>0||$t('error.required')]"
                       class="capsTooltip">
                <template v-slot:append>
                  <q-icon v-if="newPassword.type==='password'" name="visibility_off" @click="newPassword.type='text'" class="cursor-pointer" />
                  <q-icon v-else name="visibility" @click="newPassword.type='password'" class="cursor-pointer" />
                  <q-tooltip v-model="newPassword.caps" :no-parent-event="true" :offset="[10, 10]" content-class="bg-indigo">
                    Caps lock
                  </q-tooltip>
                </template>
              </q-input>
            </div>
          </div>
          <div class="row">
            <div class="col">
              <q-input v-model.trim="rePassword.value" :type="rePassword.type" :dense="$store.getters.dense.input" :label="$t('users.rePassword')"
                       @keyup="rePassword.caps=onCheckCapslock($event)" @blur="rePassword.caps=false"
                       :rules="[v=>v&&v.length>0||$t('error.required'),v=>v===newPassword.value||$t('users.msgNewRePassword')]"
                       class="capsTooltip">
                <template v-slot:append>
                  <q-icon v-if="rePassword.type==='password'" name="visibility_off" @click="rePassword.type='text'" class="cursor-pointer" />
                  <q-icon v-else name="visibility" @click="rePassword.type='password'" class="cursor-pointer" />
                  <q-tooltip v-model="rePassword.caps" :no-parent-event="true" :offset="[10, 10]" content-class="bg-indigo">
                    Caps lock
                  </q-tooltip>
                </template>
              </q-input>
            </div>
          </div>
        </q-card-section>
      </q-form>
      <q-card-actions align="center">
        <q-btn color="primary" :label="$t('global.update')" class="q-btn--square"
               :loading="$store.state.app.loading.post" @click="onSubmit"></q-btn>
      </q-card-actions>
    </q-card>
  </q-dialog>

  <!-- Dialog Login History -->
  <q-dialog v-model="isDialogLoginHistory" :maximized="isMaximized">
    <q-card>
      <q-card-section class="row">
        <div class="col-2">
          <q-btn flat dense icon="arrow_back" v-close-popup></q-btn>
        </div>
        <q-space />
        <div class="col">
          <span class="text-h6">{{$t('users.loginHistory')}}</span>
        </div>
      </q-card-section>
      <q-card-section class="q-pt-none">
        <span class="text-warning">{{$t('table.noData')}}</span>
      </q-card-section>
    </q-card>
  </q-dialog>


  <!-- Dialog Login History -->
  <q-dialog v-model="isDialogSecurityCheck" :maximized="isMaximized">
    <q-card>
      <q-card-section class="row">
        <div class="col-2">
          <q-btn flat dense icon="arrow_back" v-close-popup></q-btn>
        </div>
        <q-space />
        <div class="col">
          <span class="text-h6">{{$t('users.securityCheck')}}</span>
        </div>
      </q-card-section>
      <q-card-section align="center" class="q-pt-none">
        <q-icon size="50px" name="verified_user" color="primary" />
      </q-card-section>
      <q-card-section align="center" class="q-pt-none">
        <span class="text-h6">{{$t('users.securityStatus')}}</span>:
        <span class="text-h6 text-positive text-uppercase">{{$t('global.strong')}}</span>
      </q-card-section>
      <q-card-section align="center" class="q-pt-none">
        <span class="text-overline">{{$t('messageBox.noProblem')}}</span>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script>
import { defineComponent, ref } from "vue";
import { useStore } from 'vuex'
export default defineComponent({
  name: "Security",
  setup () {
    const $store = useStore()
    const isMaximized = ref(true)
    const isDialogChangePassword = ref(false)
    const isDialogLoginHistory = ref(false)
    const isDialogSecurityCheck = ref(false)
    const form = ref(null)
    const oldPassword = ref({
      value: '',
      type: 'password',
      caps: false
    })
    const newPassword = ref({
      value: '',
      type: 'password',
      caps: false
    })
    const rePassword = ref({
      value: '',
      type: 'password',
      caps: false
    })
    const onReset = () => {
      return new Promise((resolve, reject) => {
        oldPassword.value.value = ''
        newPassword.value.value = ''
        rePassword.value.value = ''
        resolve()
      }).then(() => { if (form.value) form.value.resetValidation() })
    }
    onReset()
    return {
      isMaximized, isDialogChangePassword, isDialogLoginHistory, isDialogSecurityCheck, form, oldPassword, newPassword, rePassword,
      onCheckCapslock ({ shiftKey, key } = {}) {
        let caps = false
        if (key && key.length === 1) {
          if (shiftKey && (key >= 'a' && key <= 'z') || !shiftKey && (key >= 'A' && key <= 'Z')) caps = true
          else caps = false
        }
        if (key === 'CapsLock' && caps === true) caps = false
        return caps
      },
      onSubmit () {
        form.value.validate().then((valid) => {
          if (valid) {
            $store.dispatch('users/changePassword', {
              oldPassword: oldPassword.value.value,
              newPassword: newPassword.value.value
            }).then(x => {
              if (x) onReset()
            })
          }
        })
      }
    }
  }
})
</script>
