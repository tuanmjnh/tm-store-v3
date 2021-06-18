<template>
  <div class="row">
    {{darkMode}}
    <div v-if="$q.platform.is.desktop" class="col-12 col-md-3">
      <q-card flat bordered class="q-mb-md">
        <q-card-section class="text-center">
          <!-- <q-avatar>
            <img size="150px" :src="$store.state.auth.user.avatar">
          </q-avatar> -->
          <q-img transition="fade" :src="avatarUrl" style="width:80%;border-radius:50%;" ratio="1"
                 spinner-color="blue-grey" class="rounded-borders">
          </q-img>
        </q-card-section>
        <q-separator inset />
        <q-card-section>
          <div v-if="$store.state.auth.user&&$store.state.auth.user.note"
               v-html="$store.state.auth.user.note"></div>
        </q-card-section>
      </q-card>
      <q-card flat bordered>
        <q-card-section>
          <q-list dense>
            <q-item v-for="(e,i) of linkProfile" :key="i" clickable v-ripple @click="tab=e.name">
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
              <q-item v-for="(e,i) of linkProfile" :key="i" clickable v-ripple @click="tab=e.name">
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
            <q-img transition="fade" :src="avatarUrl" style="width:80%;border-radius:50%;" ratio="1"
                   spinner-color="blue-grey" class="rounded-borders">
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
      <!-- <router-view :key="$route.path" /> -->
      <!-- <router-view /> -->
      <tpl-security v-if="tab==='security'" />
      <tpl-setting v-else-if="tab==='setting'" />
      <tpl-information v-else />
    </div>
  </div>
</template>

<script>
export default {
  components: {
    tplInformation: () => import('./information'),
    tplSecurity: () => import('./security'),
    tplSetting: () => import('./setting')
  },
  data() {
    return {
      linkProfileActive: 'information',
      linkProfile: [
        { path: '/profile/information', name: 'information', title: this.$t('profile.title'), icon: 'folder_shared' },
        { path: '/profile/security', name: 'security', title: this.$t('profile.security'), icon: 'security' },
        { path: '/profile/setting', name: 'setting', title: this.$t('profile.setting'), icon: 'settings' }
      ],
      tab: 'information'
    }
  },
  computed: {
    avatarUrl() {
      if (this.$store.state.auth.user && this.$store.state.auth.user.avatar) {
        return this.$store.state.auth.user.avatar
      } else return this.$store.state.avatar
    },
    darkMode() {
      return this.$store.state.userSetting.darkMode;
    }
  },
  methods: {
    onChangeView(name) {
      this.linkProfileActive = name
    }
  }
}
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
