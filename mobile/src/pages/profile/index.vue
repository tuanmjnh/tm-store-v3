<template>
  <q-list separator class="q-mb-xl">
    <q-item clickable v-ripple @click="isDialogInformation=!isDialogInformation">
      <q-item-section avatar>
        <q-icon color="primary" name="assignment" />
      </q-item-section>
      <q-item-section>{{$t('route.information')}}</q-item-section>
      <q-item-section side>
        <q-icon name="chevron_right" />
      </q-item-section>
    </q-item>

    <q-item clickable v-ripple @click="isDialogSecurity=!isDialogSecurity">
      <q-item-section avatar>
        <q-icon color="primary" name="security" />
      </q-item-section>
      <q-item-section>{{$t('route.security')}}</q-item-section>
      <q-item-section side>
        <q-icon name="chevron_right" />
      </q-item-section>
    </q-item>

    <q-item clickable v-ripple @click="isDialogSetting=!isDialogSetting">
      <q-item-section avatar>
        <q-icon color="primary" name="settings" />
      </q-item-section>
      <q-item-section>{{$t('route.setting')}}</q-item-section>
      <q-item-section side>
        <q-icon name="chevron_right" />
      </q-item-section>
    </q-item>
  </q-list>

  <q-card-actions align="center">
    <q-btn class="q-btn--square" color="primary" no-caps @click="onLogout">{{$t('navbar.logOut')}}</q-btn>
  </q-card-actions>

  <!-- Dialog information -->
  <q-dialog v-model="isDialogInformation" :maximized="isMaximized">
    <q-card>
      <q-card-section class="row">
        <div class="col-2">
          <q-btn flat dense icon="arrow_back" v-close-popup></q-btn>
        </div>
        <q-space />
        <div class="col">
          <span class="text-h6">{{$t('users.information')}}</span>
        </div>
      </q-card-section>
      <q-card-section class="q-pt-none">
        <information />
      </q-card-section>
    </q-card>
  </q-dialog>

  <!-- Dialog security -->
  <q-dialog v-model="isDialogSecurity" :maximized="isMaximized">
    <q-card>
      <q-card-section class="row">
        <div class="col-2">
          <q-btn flat dense icon="arrow_back" v-close-popup></q-btn>
        </div>
        <q-space />
        <div class="col">
          <span class="text-h6">{{$t('route.security')}}</span>
        </div>
      </q-card-section>
      <q-card-section class="q-pt-none">
        <security />
      </q-card-section>
    </q-card>
  </q-dialog>

  <!-- Dialog setting -->
  <q-dialog v-model="isDialogSetting" :maximized="isMaximized">
    <q-card>
      <q-card-section class="row">
        <div class="col-2">
          <q-btn flat dense icon="arrow_back" v-close-popup></q-btn>
        </div>
        <q-space />
        <div class="col">
          <span class="text-h6">{{$t('route.setting')}}</span>
        </div>
      </q-card-section>
      <q-card-section class="q-pt-none">
        <setting />
      </q-card-section>
    </q-card>
  </q-dialog>

</template>

<script>
import { defineComponent, defineAsyncComponent, ref } from "vue";
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
export default defineComponent({
  name: "Profile",
  components: {
    information: defineAsyncComponent(() => import('./information')),
    security: defineAsyncComponent(() => import('./security')),
    setting: defineAsyncComponent(() => import('./setting'))
  },
  setup () {
    const $route = useRoute()
    const $router = useRouter()
    const $store = useStore()
    const isMaximized = ref(true)
    const isDialogInformation = ref(false)
    const isDialogSecurity = ref(false)
    const isDialogSetting = ref(false)
    return {
      isMaximized, isDialogInformation, isDialogSecurity, isDialogSetting,
      onLogout () {
        $store.dispatch('auth/logout').then(x => {
          $router.push(`/login?redirect=${$route.path}`)
        })
      }
    }
  }
})
</script>
