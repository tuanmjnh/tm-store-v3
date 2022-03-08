<template>
  <!-- <q-btn-dropdown class="self-stretch row no-wrap"> -->
  <!-- <q-btn v-if="!$q.platform.is.mobile" flat size="md"
      :icon="$q.fullscreen.isActive ? 'fullscreen_exit' : 'fullscreen'" @click="$q.fullscreen.toggle()" color="grey-1">
      <q-tooltip>{{$q.fullscreen.isActive ? $t('global.normal_screen') : $t('global.full_screen')}}</q-tooltip>
    </q-btn> -->
  <!-- <q-btn flat size="md" color="grey-1" icon="format_size">
      <template v-slot:label>
        <q-tooltip>{{$t('navbar.size')}}</q-tooltip>
      </template>
      <q-menu transition-show="jump-down" transition-hide="jump-up">
        <q-list dense>
          <template v-for="(item,index) in sizes">
            <q-item v-if="item.key==size" clickable v-close-popup :key="index" :active="true">
              <q-item-section>{{$t(`size.${item.key}`)}}</q-item-section>
            </q-item>
            <q-item v-else clickable v-close-popup :key="index" @click="onSetSize(item,true)">
              <q-item-section>{{$t(`size.${item.key}`)}}</q-item-section>
            </q-item>
          </template>
        </q-list>
      </q-menu>
    </q-btn> -->
  <!-- <q-btn flat size="sm" color="grey-1" icon="g_translate">
      <template v-slot:label>
        <q-tooltip>{{$t('navbar.switch_language')}}</q-tooltip>
      </template>
      <q-menu transition-show="jump-down" transition-hide="jump-up">
        <q-list dense>
          <template v-for="(item,index) in languages">
            <q-item v-if="`${item.cc_iso}-${item.cc}`===language" clickable v-close-popup :key="index" :active="true">
              <q-item-section>{{item.name_l}}</q-item-section>
            </q-item>
            <q-item v-else clickable v-close-popup :key="index" @click="onSetLanguage(item,true)">
              <q-item-section>{{item.name_l}}</q-item-section>
            </q-item>
          </template>
        </q-list>
      </q-menu>
    </q-btn> -->
  <!-- <q-btn-dropdown flat stretch>
      <template v-slot:label>
        <q-avatar size="33px">
          <img src="https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif?imageView2/1/w/80/h/80" />
        </q-avatar>
      </template>
      <q-list dense>
        <template v-for="(item,index) in items">
          <q-separator v-if="item.separator" :key="index" white inset />
          <q-item v-else clickable v-close-popup @click="onRouterLink(item)" :key="index">
            <q-item-section avatar>
              <q-icon :name="item.icon" />
            </q-item-section>
            <q-item-section>{{$t(item.title)}}</q-item-section>
          </q-item>
        </template>
      </q-list>
    </q-btn-dropdown> -->
  <q-btn-dropdown flat stretch>
    <template v-slot:label>
      <q-avatar size="33px">
        <img v-if="$store.state.auth.user.avatar" :src="$store.state.auth.user.avatar" />
        <img v-else :src="$store.state.avatar">
      </q-avatar>
    </template>
    <div class="row no-wrap q-pa-md">
      <div class="column">
        <div class="text-h6 q-mb-md">{{$t('setting.title')}}</div>
        <q-list dense class="p-fix">
          <q-item>
            <q-btn-dropdown flat no-caps :label="currentLanguage.name_l" icon="g_translate" size="md"
              class="btn-setting" :color="$store.state.app.darkMode?'':'blue-grey'">
              <q-list dense>
                <template v-for="(item,index) in languages">
                  <q-item v-if="`${item.cc_iso}-${item.cc}`===language" clickable v-close-popup :key="index"
                    :active="true">
                    <q-item-section>{{item.name_l}}</q-item-section>
                  </q-item>
                  <q-item v-else clickable v-close-popup :key="index" @click="onSetLanguage(item,true)">
                    <q-item-section>{{item.name_l}}</q-item-section>
                  </q-item>
                </template>
              </q-list>
            </q-btn-dropdown>
          </q-item>
          <q-item>
            <q-btn-dropdown flat no-caps :label="$t(`size.${currentSize.key}`)" icon="format_size" size="md"
              class="btn-setting" :color="$store.state.app.darkMode?'':'blue-grey'">
              <q-list dense>
                <template v-for="(e,i) in sizes">
                  <q-item v-if="e.key===font.size" clickable v-close-popup :key="i" :active="true">
                    <q-item-section>{{$t(`size.${e.key}`)}}</q-item-section>
                  </q-item>
                  <q-item v-else clickable v-close-popup :key="i" @click="onSetSize(e,true)">
                    <q-item-section>{{$t(`size.${e.key}`)}}</q-item-section>
                  </q-item>
                </template>
              </q-list>
            </q-btn-dropdown>
          </q-item>
          <q-item v-if="!$q.platform.is.mobile">
            <q-btn flat no-caps size="md" class="btn-setting"
              :label="$q.fullscreen.isActive ? $t('global.normal_screen') : $t('global.full_screen')"
              :icon="$q.fullscreen.isActive ? 'fullscreen_exit' : 'fullscreen'" @click="$q.fullscreen.toggle()"
              :color="$store.state.app.darkMode?'':'blue-grey'" v-close-popup>
              <!-- <q-tooltip>
                  {{$q.fullscreen.isActive ? $t('global.normal_screen') : $t('global.full_screen')}}
                </q-tooltip> -->
            </q-btn>
          </q-item>
          <q-item>
            <q-toggle dense v-model="darkMode" label="Dark mode" size="xs" color="blue-grey" style="white-space:nowrap"
              :class="$store.state.app.darkMode?'':'q-toggle-setting'" />
          </q-item>
        </q-list>
      </div>
      <q-separator vertical inset class="q-mx-lg" />
      <div class="column items-center cursor-pointer">
        <q-avatar size="72px" @click="onRouterLink('/profile')">
          <img v-if="$store.state.auth.user.avatar" :src="$store.state.auth.user.avatar">
          <img v-else :src="$store.state.avatar">
        </q-avatar>
        <!-- <router-link to="/profile"> -->
        <div class="q-mt-md q-mb-xs cursor-pointer text-blue" @click="onRouterLink('/profile')">
          {{$store.state.auth.user?
            ($store.state.auth.user.full_name?$store.state.auth.user.full_name:$store.state.auth.user.email):
            $t('global.undefined')}}
        </div>
        <!-- </router-link> -->
        <q-btn :label="$t('navbar.log_out')" @click.prevent="onLogout" color="blue-grey" size="sm"
          style="white-space:nowrap" v-close-popup />
      </div>
    </div>
  </q-btn-dropdown>
</template>

<script>
import { openURL } from 'quasar'
import { isExternal } from '@/utils/validate'
import { getLanguage, getAllLanguage } from '@/i18n'
export default {
  data() {
    return {
      currentLanguage: {},
      currentSize: '',
      items: []
      // avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif?imageView2/1/w/80/h/80'
    }
  },
  created() {
    const userSetting = this.$store.getters.userSetting
    console.log(userSetting)
    this.currentSize = this.sizes.find(x => x.key === this.font.size)
    this.onSetSize(this.currentSize)
    this.currentLanguage = this.languages.find(x => `${x.cc_iso}-${x.cc}` === this.language)
    this.onSetLanguage(this.currentLanguage)
  },
  computed: {
    font() {
      return this.$store.getters.font
    },
    sizes() {
      return this.$store.getters.sizes
    },
    language() {
      return this.$store.getters.language
    },
    languages() {
      return this.$store.getters.languages
    },
    darkMode: {
      // getter
      get: function() {
        return this.$q.dark.isActive
      },
      // setter
      set: function(val) {
        this.$q.dark.set(val)
        this.$store.commit('app/SET_DARK_MODE', val)
      }
    }
  },
  methods: {
    onSetSize(item, isNotify) {
      this.currentSize = item
      this.$store.commit('app/SET_FONT', { key: 'size', value: this.currentSize })
      if (isNotify) this.$q.notify({ message: this.$t('setting.msg_change_size'), color: 'positive' })
    },
    onSetLanguage(item, isNotify) {
      this.currentLanguage = item
      this.$store.commit('app/SET_LANGUAGE', `${item.cc_iso}-${item.cc}`)
      if (isNotify) this.$q.notify({ message: this.$t('setting.msg_change_language'), color: 'positive' })
    },
    onRouterLink(path) {
      if (isExternal(path)) {
        openURL(path)
      } else {
        this.$router.push(path).catch(err => { })
      }
    },
    onLogout() {
      this.$store.dispatch('auth/logout')
      this.$router.push(`/login?redirect=${this.$route.path}`)
    }
  }
}
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
