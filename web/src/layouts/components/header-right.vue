<template>
  <q-btn-dropdown flat stretch>
    <template v-slot:label>
      <q-avatar size="33px">
        <img v-if="$store.state.auth.user.avatar" :src="$store.state.auth.user.avatar" />
        <img v-else :src="$store.state.app.avatar">
      </q-avatar>
    </template>
    <div class="row no-wrap q-pa-md">
      <div class="column">
        <div class="text-h6 q-mb-md">{{$t('setting.title')}}</div>
        <q-list dense class="p-fix">
          <q-item>
            <q-btn-dropdown flat no-caps :label="language.name_l" icon="g_translate" dense class="btn-setting"
                            :color="$store.getters.darkMode?'':'blue-grey'">
              <q-list dense>
                <template v-for="(e,i) in languages" :key="i">
                  <q-item :active="`${e.cc_iso}-${e.cc}`===$store.getters.language?true:false" clickable v-close-popup @click="onSetLanguage(e)">
                    <q-item-section>{{e.name_l}}</q-item-section>
                  </q-item>
                </template>
              </q-list>
            </q-btn-dropdown>
          </q-item>
          <q-item v-if="!$q.platform.is.mobile">
            <q-btn flat no-caps dense class="btn-setting" :label="$q.fullscreen.isActive ? $t('global.normalScreen') : $t('global.fullScreen')"
                   :icon="$q.fullscreen.isActive ? 'fullscreen_exit' : 'fullscreen'" @click="$q.fullscreen.toggle()"
                   :color="$store.getters.darkMode?'':'blue-grey'" v-close-popup>
            </q-btn>
          </q-item>
          <q-item>
            <q-toggle dense v-model="darkMode" label="Dark mode" size="xs" color="blue-grey" style="white-space:nowrap"
                      :class="$store.getters.darkMode?'':'q-toggle-setting'" />
          </q-item>
        </q-list>
      </div>
      <q-separator vertical inset class="q-mx-lg" />
      <div class="column items-center cursor-pointer">
        <q-avatar size="72px" @click="onRouterLink('/profile')">
          <img v-if="$store.state.auth.user.avatar" :src="$store.state.auth.user.avatar">
          <img v-else :src="$store.state.app.avatar">
        </q-avatar>
        <!-- <router-link to="/profile"> -->
        <div class="q-mt-md q-mb-xs cursor-pointer text-blue" @click="onRouterLink('/profile')">
          {{$store.state.auth.user? ($store.state.auth.user.full_name?$store.state.auth.user.full_name:$store.state.auth.user.email): $t('global.undefined')}}
        </div>
        <!-- </router-link> -->
        <q-btn :label="$t('navbar.logOut')" @click.prevent="onLogout" color="blue-grey" size="sm" class="q-btn--square" style="white-space:nowrap"
               v-close-popup />
      </div>
    </div>
  </q-btn-dropdown>
</template>

<script>
import { defineComponent, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { useQuasar } from 'quasar'
// import { useI18n } from 'vue-i18n'
import { openURL } from 'quasar'
import { isExternal } from '../../../../global/utils/validate'
// import { getLanguage, getAllLanguage } from '@/i18n'
export default defineComponent({
  name: 'drawer-search',
  setup () {
    const $route = useRoute()
    const $router = useRouter()
    const $store = useStore()
    const $q = useQuasar()
    // const { locale } = useI18n({ useScope: 'global' })
    const languages = computed(() => $store.getters.languages)
    const language = computed(() => { return languages.value.find(x => `${x.cc_iso}-${x.cc}` === $store.getters.language) })
    // fontSize() {
    //   return font_size.find(x => parseInt(x.value) === $store.getters.font.size) || font_size[0]
    // },
    const darkMode = computed({
      // getter
      get: () => {
        return $q.dark.isActive
      },
      // setter
      set: (val) => {
        $q.dark.set(val)
        const data = { darkMode: val }
        $store.dispatch('settings/set', data)
      }
    })
    return {
      languages, language, darkMode,
      onSetLanguage (item, isNotify) {
        if (language.value !== item) {
          const data = { language: `${item.cc_iso}-${item.cc}` }
          // locale.value = data.language
          // document.querySelector('html').setAttribute('lang', locale.value)
          $store.dispatch('settings/set', data)
        }
      },
      onSetFontSize (item, isNotify) {
        if (fontSize.key !== item.key) {
          const data = JSON.parse(JSON.stringify($store.getters.font))
          data.font.size = parseInt(item.value)
          $store.dispatch('settings/set', data)
        }
      },
      onRouterLink (path) {
        if (isExternal(path)) {
          openURL(path)
        } else {
          $router.push(path).catch(err => { })
        }
      },
      async onLogout () {
        // await $router.push(`/processing?redirect=${$route.path}`)
        // await $router.push(`/login?redirect=${$route.path}`)
        $store.dispatch('auth/logout').then(x => {
          // $router.push(`/processing`)
          $router.push(`/login?redirect=${$route.path}`)
        })
      }
    }
  }
})
</script>

<style>
.btn-setting {
  font-weight: initial;
}
.q-toggle-setting {
  color: #607d8b;
}
.p-fix > .q-item {
  padding: 2px 0 !important;
}
</style>
