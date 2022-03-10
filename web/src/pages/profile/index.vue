<template>
  <div class="row">
    <div v-if="$q.platform.is.desktop" class="col-12 col-md-3">
      <q-card flat bordered class="q-mb-md">
        <q-card-section class="text-center">
          <!-- <q-avatar>
            <img size="150px" :src="$store.state.auth.user.avatar">
          </q-avatar> -->
          <q-img transition="fade" :src="avatarUrl" style="width:80%;border-radius:50%;" ratio="1" spinner-color="blue-grey" class="rounded-borders">
          </q-img>
        </q-card-section>
        <q-separator inset />
        <q-card-section>
          <div v-if="$store.state.auth.user&&$store.state.auth.user.note" v-html="$store.state.auth.user.note"></div>
        </q-card-section>
      </q-card>
      <q-card flat bordered>
        <q-card-section>
          <q-list dense>
            <q-item v-for="(e,i) of linkProfile" :key="i" clickable v-ripple @click="onRouterLink(e.path)">
              <q-item-section>{{e.title}}</q-item-section>
              <q-item-section avatar>
                <q-icon color="blue-grey" :name="e.icon" />
              </q-item-section>
            </q-item>
          </q-list>
        </q-card-section>
      </q-card>
    </div>
    <div v-else class="col-12 col-md-3">
      <q-card flat bordered class="q-mb-md">
        <q-card-section class="row">
          <div class="col-6">
            <q-list dense class="link-profile">
              <q-item v-for="(e,i) of linkProfile" :key="i" clickable v-ripple @click="onRouterLink(e.path)">
                <q-item-section avatar>
                  <q-icon color="blue-grey" :name="e.icon" />
                </q-item-section>
                <q-item-section>{{e.title}}</q-item-section>
              </q-item>
            </q-list>
          </div>
          <q-separator inset vertical />
          <q-space />
          <div class="col-5 text-center">
            <q-img transition="fade" :src="avatarUrl" style="width:80%;border-radius:50%;" ratio="1" spinner-color="blue-grey"
                   class="rounded-borders">
            </q-img>
          </div>
        </q-card-section>
        <q-card-section>
          <div v-html="$store.state.auth.user.note"></div>
        </q-card-section>
      </q-card>
    </div>
    <q-space />
    <div class="col-12 col-md-8">
      <router-view :key="$route.path" />
      <!-- <tpl-security v-if="tab==='security'" />
      <tpl-setting v-else-if="tab==='setting'" />
      <tpl-information v-else /> -->
    </div>
  </div>
</template>

<script>
import { defineComponent, ref, computed } from 'vue';
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'
export default defineComponent({
  name: 'Profile',
  // components: {
  //   tplInformation: defineAsyncComponent(() => import('./information')),
  //   tplSecurity: defineAsyncComponent(() => import('./security')),
  //   tplSetting: defineAsyncComponent(() => import('./setting'))
  // },
  setup () {
    const $router = useRouter()
    const $store = useStore()
    const { t } = useI18n({ useScope: 'global' })
    const tab = 'information'
    const linkProfileActive = ref('information')
    const linkProfile = ref([
      { path: '/profile/information', name: 'information', title: t('profile.title'), icon: 'folder_shared' },
      { path: '/profile/security', name: 'security', title: t('profile.security'), icon: 'security' },
      { path: '/profile/setting', name: 'setting', title: t('profile.setting'), icon: 'settings' }
    ])
    const avatarUrl = computed(() => {
      if ($store.state.auth.user && $store.state.auth.user.avatar) {
        return $store.state.auth.user.avatar
      } else return $store.state.avatar
    })
    const darkMode = computed(() => $store.state.userSetting.darkMode)
    return {
      tab, darkMode, avatarUrl, linkProfileActive, linkProfile,
      onChangeView (val) {
        linkProfileActive.value = val
      },
      onRouterLink (path) {
        $router.push(path).catch(err => { })
      }
    }
  }
})
</script>

<style>
.q-item.q-router-link--active .q-icon {
  color: #027be3 !important;
}
.link-profile .q-item {
  padding: 0 !important;
}
.link-profile .q-item .q-item__section--avatar {
  min-width: initial;
  padding-right: 8px;
}
</style>
