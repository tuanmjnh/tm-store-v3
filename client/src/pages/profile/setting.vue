<template>
  <q-card flat bordered class="my-card">
    <q-card-section class="row">
      <div class="text-subtitle2 text-bold">{{$t('route.userSetting')}}</div>
      <q-space />
      <!-- <q-btn color="primary" :label="$t('global.update')" class="q-btn--square" :loading="$store.state.loading.post"
        @click="onSubmit"></q-btn> -->
    </q-card-section>
    <q-separator />
    <q-form ref="form">
      <q-card-section>
        <div class="row q-gutter-xs">
          <div class="col self-center">{{$t('setting.language')}}</div>
          <q-space />
          <div class="col-8">
            <q-btn-dropdown flat no-caps :label="language.name_l" icon="g_translate"
                            :dense="$store.getters.dense.button" class="btn-setting"
                            :color="$store.getters.darkMode?'':'blue-grey'">
              <q-list dense>
                <template v-for="(e,i) in languages">
                  <q-item clickable v-close-popup :key="i"
                          :active="`${e.cc_iso}-${e.cc}`===$store.getters.language?true:false"
                          @click="onSetLanguage(e)">
                    <q-item-section>{{e.name_l}}</q-item-section>
                  </q-item>
                </template>
              </q-list>
            </q-btn-dropdown>
          </div>
        </div>
        <div class="row q-gutter-xs">
          <div class="col self-center">{{$t('setting.darkMode')}}</div>
          <q-space />
          <div class="col-8">
            <q-toggle v-model="darkMode" color="blue-grey" style="white-space:nowrap"
                      :dense="$store.getters.dense.input"
                      :class="$store.getters.darkMode?'':'q-toggle-setting'" />
          </div>
        </div>
        <q-separator inset class="q-mt-md q-mb-md" />
        <div class="row q-gutter-xs">
          <div class="col self-center">{{$t('setting.fontSize')}}</div>
          <q-space />
          <div class="col-8">
            <q-btn-dropdown flat no-caps :label="fontSize?$t(`size.${fontSize.key}`):''"
                            icon="format_size" :dense="$store.getters.dense.button" class="btn-setting"
                            :color="$store.getters.darkMode?'':'blue-grey'">
              <q-list dense>
                <template v-for="(e,i) in font_size">
                  <q-item clickable v-close-popup :key="i"
                          :active="fontSize&&e.key===fontSize.key?true:false" @click="onSetFontSize(e)">
                    <q-item-section>{{$t(`size.${e.key}`)}}</q-item-section>
                  </q-item>
                </template>
              </q-list>
            </q-btn-dropdown>
          </div>
        </div>
        <div class="row q-gutter-xs">
          <div class="col self-center">{{$t('setting.fontFamily')}}</div>
          <q-space />
          <div class="col-8">
            <q-btn-dropdown flat no-caps :label="fontFamily?fontFamily.key:''" icon="font_download"
                            :dense="$store.getters.dense.button" class="btn-setting"
                            :color="$store.getters.darkMode?'':'blue-grey'">
              <q-list dense>
                <template v-for="(e,i) in font_family">
                  <q-item clickable v-close-popup :key="i"
                          :active="fontFamily&&e.key===fontFamily.key?true:false"
                          @click="onSetFontFamily(e)">
                    <q-item-section :style="{fontFamily:e.value}">{{e.key}}</q-item-section>
                  </q-item>
                </template>
              </q-list>
            </q-btn-dropdown>
          </div>
        </div>
        <div class="row q-gutter-xs">
          <div class="col self-center">{{$t('setting.fontColor')}}</div>
          <q-space />
          <div class="col-8">
            <q-btn-dropdown flat no-caps :label="fontColor?fontColor.key:''" icon="color_lens"
                            :dense="$store.getters.dense.button" class="btn-setting"
                            :color="$store.getters.darkMode?'':'blue-grey'">
              <q-list dense>
                <template v-for="(e,i) in font_color">
                  <q-item clickable v-close-popup :key="i"
                          :active="fontColor&&e.key===fontColor.key?true:false"
                          @click="onSetFontColor(e)">
                    <q-item-section :style="{color:e.value}">{{e.key}}</q-item-section>
                  </q-item>
                </template>
              </q-list>
            </q-btn-dropdown>
          </div>
        </div>
        <!-- <div class="row q-gutter-xs">
          <div class="col">
            {{$t('setting.font_line_height')}}
          </div>
          <q-space />
          <div class="col-8">
            <q-input v-model.trim="lineHeight" type="number" :dense="$store.getters.dense.input" :label="$t('setting.font_line_height')"
              :rules="[v=>v&&v.length>0||$t('error.required')]" />
          </div>
        </div> -->
        <q-separator inset class="q-mt-md q-mb-md" />
        <div class="row q-gutter-xs q-mb-sm">
          <div class="col self-center">{{$t('setting.formatDate')}}</div>
          <q-space />
          <div class="col-8">
            <q-btn-dropdown flat no-caps :label="formatDate?formatDate.key:''" icon="date_range"
                            :dense="$store.getters.dense.button" class="btn-setting"
                            :color="$store.getters.darkMode?'':'blue-grey'">
              <q-list dense>
                <template v-for="(e,i) in format_date">
                  <q-item clickable v-close-popup :key="i"
                          :active="formatDate&&e.key===formatDate.key?true:false"
                          @click="onSetFormatDate(e)">
                    <q-item-section>{{e.key}}</q-item-section>
                  </q-item>
                </template>
              </q-list>
            </q-btn-dropdown>
          </div>
        </div>
        <div class="row q-gutter-xs q-mb-sm">
          <div class="col self-center">{{$t('setting.formatDate')}}</div>
          <q-space />
          <div class="col-8">
            <q-btn-dropdown flat no-caps :label="formatTime?formatTime.key:''" icon="access_time"
                            :dense="$store.getters.dense.button" class="btn-setting"
                            :color="$store.getters.darkMode?'':'blue-grey'">
              <q-list dense>
                <template v-for="(e,i) in format_time">
                  <q-item clickable v-close-popup :key="i"
                          :active="formatTime&&e.key===formatTime.key?true:false"
                          @click="onSetFormatTime(e)">
                    <q-item-section>{{e.key}}</q-item-section>
                  </q-item>
                </template>
              </q-list>
            </q-btn-dropdown>
          </div>
        </div>
        <q-separator inset class="q-mt-md q-mb-md" />
        <div class="row q-gutter-xs q-mb-sm">
          <div class="col self-center">{{$t('setting.denseForm')}}</div>
          <q-space />
          <div class="col-8">
            <q-toggle v-model="denseForm" color="blue-grey" style="white-space:nowrap"
                      :dense="$store.getters.dense.input"
                      :class="$store.getters.darkMode?'':'q-toggle-setting'" />
          </div>
        </div>
        <div class="row q-gutter-xs q-mb-sm">
          <div class="col self-center">{{$t('setting.denseTable')}}</div>
          <q-space />
          <div class="col-8">
            <q-toggle v-model="denseTable" color="blue-grey" style="white-space:nowrap"
                      :dense="$store.getters.dense.input"
                      :class="$store.getters.darkMode?'':'q-toggle-setting'" />
          </div>
        </div>
        <div class="row q-gutter-xs q-mb-sm">
          <div class="col self-center">{{$t('setting.denseInput')}}</div>
          <q-space />
          <div class="col-8">
            <q-toggle v-model="denseInput" color="blue-grey" style="white-space:nowrap"
                      :dense="$store.getters.dense.input"
                      :class="$store.getters.darkMode?'':'q-toggle-setting'" />
          </div>
        </div>
        <div class="row q-gutter-xs q-mb-sm">
          <div class="col self-center">{{$t('setting.denseButton')}}</div>
          <q-space />
          <div class="col-8">
            <q-toggle v-model="denseButton" color="blue-grey" style="white-space:nowrap"
                      :dense="$store.getters.dense.input"
                      :class="$store.getters.darkMode?'':'q-toggle-setting'" />
          </div>
        </div>
        <div class="row q-gutter-xs q-mb-sm">
          <div class="col self-center">{{$t('setting.denseMenu')}}</div>
          <q-space />
          <div class="col-8">
            <q-toggle v-model="denseMenu" color="blue-grey" style="white-space:nowrap"
                      :dense="$store.getters.dense.input"
                      :class="$store.getters.darkMode?'':'q-toggle-setting'" />
          </div>
        </div>
        <div class="row q-gutter-xs q-mb-sm">
          <div class="col self-center">{{$t('setting.shadowTable')}}</div>
          <q-space />
          <div class="col-8">
            <q-toggle v-model="shadowTable" color="blue-grey" style="white-space:nowrap"
                      :dense="$store.getters.dense.input"
                      :class="$store.getters.darkMode?'':'q-toggle-setting'" />
          </div>
        </div>
      </q-card-section>
    </q-form>
  </q-card>
</template>

<script>
import * as api from '@/api/users/setting'
import * as apiTypes from '@/api/types'
export default {
  data() {
    return {
      font_size: [],
      font_family: [],
      font_color: [],
      format_date: [],
      format_time: []
      // language: {},
      // size: {}
    }
  },
  created() {
    this.onInit()
    // console.log(this.$store.state.userSetting)
    // this.language = this.languages.find(x => `${x.cc_iso}-${x.cc}` === this.$store.getters.language)
    // this.size = this.sizes.find(x => x.value === this.$store.getters.font.size)
  },
  computed: {
    languages() {
      return this.$store.getters.languages
    },
    // sizes() {
    //   return this.$store.getters.sizes
    // },
    language() {
      return this.languages.find(x => `${x.cc_iso}-${x.cc}` === this.$store.getters.language)
    },
    fontSize() {
      return this.font_size.find(x => parseInt(x.value) === this.$store.getters.font.size) || this.font_size[0]
    },
    fontFamily() {
      return this.font_family.find(x => x.value === this.$store.getters.font.family) || this.font_family[0]
    },
    fontColor() {
      return this.font_color.find(x => x.value === this.$store.getters.font.color) || this.font_color[0]
    },
    formatDate() {
      return this.format_date.find(x => x.value === this.$store.getters.format.date) || this.format_date[0]
    },
    formatTime() {
      return this.format_time.find(x => x.value === this.$store.getters.format.time) || this.format_time[0]
    },
    darkMode: {
      // getter
      get: function () { return this.$q.dark.isActive },
      // setter
      set: function (val) {
        this.$q.dark.set(val)
        this.$store.commit('userSetting/SET_DARK_MODE', val)
        this.onUpdate()
      }
    },
    denseForm: {
      get: function () { return this.$store.getters.dense.form },
      set: function (val) {
        this.$store.commit('userSetting/SET_DENSE', { 'form': val })
        this.onUpdate()
      }
    },
    denseTable: {
      get: function () { return this.$store.getters.dense.table },
      set: function (val) {
        this.$store.commit('userSetting/SET_DENSE', { 'table': val })
        this.onUpdate()
      }
    },
    denseInput: {
      get: function () { return this.$store.getters.dense.input },
      set: function (val) {
        this.$store.commit('userSetting/SET_DENSE', { 'input': val })
        this.onUpdate()
      }
    },
    denseButton: {
      get: function () { return this.$store.getters.dense.button },
      set: function (val) {
        this.$store.commit('userSetting/SET_DENSE', { 'button': val })
        this.onUpdate()
      }
    },
    denseMenu: {
      get: function () { return this.$store.getters.dense.menu },
      set: function (val) {
        this.$store.commit('userSetting/SET_DENSE', { 'menu': val })
        this.onUpdate()
      }
    },
    shadowTable: {
      get: function () { return this.$store.getters.shadow && this.$store.getters.shadow.table ? this.$store.getters.shadow.table : false },
      set: function (val) {
        this.$store.commit('userSetting/SET_SHADOW', { 'table': val })
        this.onUpdate()
      }
    }
  },
  methods: {
    onInit() {
      apiTypes.select({ key: 'user_setting' }).then((x) => {
        if (x && x.data) {
          // font_size
          this.font_size = x.data.find(x => x.code === 'font_size')
          if (this.font_size) this.font_size = this.font_size.meta
          else this.font_size = []
          // font_family
          this.font_family = x.data.find(x => x.code === 'font_family')
          if (this.font_family) this.font_family = this.font_family.meta
          else this.font_family = []
          // font_color
          this.font_color = x.data.find(x => x.code === 'font_color')
          if (this.font_color) this.font_color = this.font_color.meta
          else this.font_color = []
          // format_date
          this.format_date = x.data.find(x => x.code === 'format_date')
          if (this.format_date) this.format_date = this.format_date.meta
          else this.format_date = []
          // format_time
          this.format_time = x.data.find(x => x.code === 'format_time')
          if (this.format_time) this.format_time = this.format_time.meta
          else this.format_time = []
        }
      })
    },
    onSetLanguage(item) {
      if (this.language !== item) {
        // const data = JSON.parse(JSON.stringify(this.$store.state.userSetting.data))
        const val = `${item.cc_iso}-${item.cc}`
        this.$store.commit('userSetting/SET_LANGUAGE', val)
        this.onUpdate()
      }
    },
    onSetFontSize(item) {
      if (this.fontSize.key !== item.key) {
        this.$store.commit('userSetting/SET_FONT', { key: 'size', value: item.value })
        this.onUpdate()
      }
    },
    onSetFontFamily(item) {
      if (this.fontFamily.key !== item.key) {
        this.$store.commit('userSetting/SET_FONT', { key: 'family', value: item.value })
        this.onUpdate()
      }
    },
    onSetFontColor(item) {
      if (this.fontColor.key !== item.key) {
        this.$store.commit('userSetting/SET_FONT', { key: 'color', value: item.value })
        this.onUpdate()
      }
    },
    onSetFormatDate(item) {
      if (this.formatDate.key !== item.key) {
        this.$store.commit('userSetting/SET_FORMAT', { 'date': item.value })
        this.onUpdate()
      }
    },
    onSetFormatTime(item) {
      if (this.formatTime.key !== item.key) {
        this.$store.commit('userSetting/SET_FORMAT', { 'time': item.value })
        this.onUpdate()
      }
    },
    onUpdate() {
      this.$refs.form.validate().then(valid => {
        if (valid) {
          api.update(this.$store.state.userSetting).then(x => { })
        }
      })
    }
  }
}
</script>

<style>
</style>
