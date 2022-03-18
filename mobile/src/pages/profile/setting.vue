<template>
  <q-form ref="form" class="settings">
    <q-list>
      <q-item-label header>{{$t('setting.userControl')}}</q-item-label>
      <q-item clickable v-ripple>
        <q-item-section>{{$t('setting.darkMode')}}</q-item-section>
        <q-item-section side>
          <q-toggle v-model="darkMode" class="text-no-wrap" :dense="$store.getters.dense.input" />
        </q-item-section>
        <!-- <q-item-section side>
          <q-icon name="chevron_right" />
        </q-item-section> -->
      </q-item>
      <q-item clickable v-ripple>
        <q-item-section>{{$t('setting.language')}}</q-item-section>
        <q-item-section side>
          <q-btn-dropdown flat no-caps :dense="$store.getters.dense.button">
            <template v-slot:label>
              <div class="row items-center no-wrap">
                <span :class="`fi fi-${$store.getters.language} q-mr-sm`" />
                <span>{{language.name_l}}</span>
              </div>
            </template>
            <q-list dense class="btn-language-list">
              <template v-for="(e,i) in languages" :key="i">
                <q-item clickable v-close-popup :active="`${e.cc_iso}-${e.cc}`===$store.getters.language?true:false" @click="onSetLanguage(e)">
                  <q-item-section avatar><span :class="`fi fi-${e.cc_iso}-${e.cc}`" /></q-item-section>
                  <q-item-section>{{e.name_l}}</q-item-section>
                </q-item>
              </template>
            </q-list>
          </q-btn-dropdown>
        </q-item-section>
      </q-item>
      <q-item clickable v-ripple>
        <q-item-section>{{$t('types.unitPrice')}}</q-item-section>
        <q-item-section side>
          <q-btn-dropdown flat no-caps :label="unitPrice.name.toHtml()" :dense="$store.getters.dense.button">
            <q-list dense>
              <template v-for="(e,i) in unitsPrices" :key="i">
                <q-item clickable v-close-popup :active="e.code===$store.getters.unitPrice?true:false" @click="onSetUnitPrice(e)">
                  <q-item-section>{{e.name.toHtml()}}</q-item-section>
                </q-item>
              </template>
            </q-list>
          </q-btn-dropdown>
        </q-item-section>
      </q-item>

      <q-separator spaced />

      <q-item-label header>{{$t('setting.font')}}</q-item-label>
      <q-item clickable v-ripple>
        <q-item-section>{{$t('setting.fontSize')}}</q-item-section>
        <q-item-section side>
          <q-btn-dropdown flat no-caps :label="fontSize?$t(`size.${fontSize.key}`):''" icon="format_size" :dense="$store.getters.dense.button">
            <q-list dense>
              <template v-for="(e,i) in fontSizes" :key="i">
                <q-item clickable v-close-popup :active="fontSize&&e.key===fontSize.key?true:false" @click="onSetFontSize(e)">
                  <q-item-section>{{$t(`size.${e.key}`)}}</q-item-section>
                </q-item>
              </template>
            </q-list>
          </q-btn-dropdown>
        </q-item-section>
      </q-item>
      <q-item clickable v-ripple>
        <q-item-section>{{$t('setting.fontFamily')}}</q-item-section>
        <q-item-section side>
          <q-btn-dropdown flat no-caps :label="fontFamily?fontFamily.key:''" icon="font_download" :dense="$store.getters.dense.button">
            <q-list dense>
              <template v-for="(e,i) in fontFamilys" :key="i">
                <q-item clickable v-close-popup :active="fontFamily&&e.key===fontFamily.key?true:false" @click="onSetFontFamily(e)">
                  <q-item-section :style="{fontFamily:e.value}">{{e.key}}</q-item-section>
                </q-item>
              </template>
            </q-list>
          </q-btn-dropdown>
        </q-item-section>
      </q-item>
      <q-item clickable v-ripple>
        <q-item-section>{{$t('setting.fontColor')}}</q-item-section>
        <q-item-section side>
          <q-btn-dropdown flat no-caps :label="fontColor?fontColor.key:''" icon="color_lens" :dense="$store.getters.dense.button">
            <q-list dense>
              <template v-for="(e,i) in fontColors" :key="i">
                <q-item clickable v-close-popup :active="fontColor&&e.key===fontColor.key?true:false" @click="onSetFontColor(e)">
                  <q-item-section :style="{color:e.value}">{{e.key}}</q-item-section>
                </q-item>
              </template>
            </q-list>
          </q-btn-dropdown>
        </q-item-section>
      </q-item>
      <q-item clickable v-ripple>
        <q-item-section>{{$t('setting.fontLineHeight')}}</q-item-section>
        <q-item-section side>
          <q-btn-dropdown flat no-caps :label="fontColor?fontColor.key:''" icon="color_lens" :dense="$store.getters.dense.button">
            <q-list dense>
              <template v-for="(e,i) in fontColors" :key="i">
                <q-item clickable v-close-popup :active="fontColor&&e.key===fontColor.key?true:false" @click="onSetFontColor(e)">
                  <q-item-section :style="{color:e.value}">{{e.key}}</q-item-section>
                </q-item>
              </template>
            </q-list>
          </q-btn-dropdown>
        </q-item-section>
      </q-item>

      <q-separator spaced />

      <q-item-label header>{{$t('setting.format')}}</q-item-label>
      <q-item clickable v-ripple>
        <q-item-section>{{$t('setting.formatDate')}}</q-item-section>
        <q-item-section side>
          <q-btn-dropdown flat no-caps :label="formatDate?formatDate.key:''" icon="date_range" :dense="$store.getters.dense.button">
            <q-list dense>
              <template v-for="(e,i) in formatDates" :key="i">
                <q-item clickable v-close-popup :active="formatDate&&e.key===formatDate.key?true:false" @click="onSetFormatDate(e)">
                  <q-item-section>{{e.key}}</q-item-section>
                </q-item>
              </template>
            </q-list>
          </q-btn-dropdown>
        </q-item-section>
      </q-item>
      <q-item clickable v-ripple>
        <q-item-section>{{$t('setting.formatTime')}}</q-item-section>
        <q-item-section side>
          <q-btn-dropdown flat no-caps :label="formatTime?formatTime.key:''" icon="access_time" :dense="$store.getters.dense.button">
            <q-list dense>
              <template v-for="(e,i) in formatTimes" :key="i">
                <q-item clickable v-close-popup :active="formatTime&&e.key===formatTime.key?true:false" @click="onSetFormatTime(e)">
                  <q-item-section>{{e.key}}</q-item-section>
                </q-item>
              </template>
            </q-list>
          </q-btn-dropdown>
        </q-item-section>
      </q-item>

      <q-separator spaced />
      <q-item-label header>{{$t('setting.dense')}}</q-item-label>
      <q-item clickable v-ripple>
        <q-item-section>{{$t('setting.denseForm')}}</q-item-section>
        <q-item-section side>
          <q-toggle v-model="denseForm" class="text-no-wrap" :dense="$store.getters.dense.input" />
        </q-item-section>
      </q-item>
      <q-item clickable v-ripple>
        <q-item-section>{{$t('setting.denseTable')}}</q-item-section>
        <q-item-section side>
          <q-toggle v-model="denseTable" class="text-no-wrap" :dense="$store.getters.dense.input" />
        </q-item-section>
      </q-item>
      <q-item clickable v-ripple>
        <q-item-section>{{$t('setting.denseInput')}}</q-item-section>
        <q-item-section side>
          <q-toggle v-model="denseInput" class="text-no-wrap" :dense="$store.getters.dense.input" />
        </q-item-section>
      </q-item>
      <q-item clickable v-ripple>
        <q-item-section>{{$t('setting.denseButton')}}</q-item-section>
        <q-item-section side>
          <q-toggle v-model="denseButton" class="text-no-wrap" :dense="$store.getters.dense.input" />
        </q-item-section>
      </q-item>
      <q-item clickable v-ripple>
        <q-item-section>{{$t('setting.denseMenu')}}</q-item-section>
        <q-item-section side>
          <q-toggle v-model="denseMenu" class="text-no-wrap" :dense="$store.getters.dense.input" />
        </q-item-section>
      </q-item>

      <q-separator spaced />
      <q-item-label header>{{$t('setting.shadow')}}</q-item-label>
      <q-item clickable v-ripple>
        <q-item-section>{{$t('setting.shadowTable')}}</q-item-section>
        <q-item-section side>
          <q-toggle v-model="shadowTable" class="text-no-wrap" :dense="$store.getters.dense.input" />
        </q-item-section>
      </q-item>

    </q-list>
  </q-form>
</template>

<script>
import { defineComponent, ref, computed } from "vue";
import { useStore } from 'vuex'
import { useQuasar } from 'quasar'
export default defineComponent({
  name: "Setting",
  setup () {
    const $store = useStore()
    const $q = useQuasar()
    const form = ref(null)
    const unitsPrices = computed(() => $store.state.types.items.filter(x => x.key === 'unitPrice'))
    const unitPrice = computed(() => unitsPrices.value.find(x => x.code === $store.getters.unitPrice) || unitsPrices.value[0])
    const languages = computed(() => $store.getters.languages || [])
    const language = computed(() => languages.value.find(x => `${x.cc_iso}-${x.cc}` === $store.getters.language))
    const settings = computed(() => $store.state.types.items.filter(x => x.key === 'settings'))
    const fontSizes = ref([])
    const fontSize = ref(null)
    const fontFamilys = ref([])
    const fontFamily = ref(null)
    const fontColors = ref([])
    const fontColor = ref(null)
    const lineHeights = ref([])
    const lineHeight = ref(null)
    const formatDates = ref([])
    const formatDate = ref(null)
    const formatTimes = ref([])
    const formatTime = ref(null)

    const onInit = () => {
      const _settings = settings.value.map(x => ({ [x.code]: x.meta })).reduce(function (result, item) {
        var key = Object.keys(item)[0] //first property: a, b, c
        result[key] = item[key]
        return result
      }, {})
      if (settings.value && settings.value.length) {
        // fontSizes
        fontSizes.value = _settings.fontSize
        fontSize.value = fontSizes.value.find(x => parseInt(x.value) === $store.getters.font.size)
        //fontFamilys
        fontFamilys.value = _settings.fontFamily
        fontFamily.value = fontFamilys.value.find(x => x.value === $store.getters.font.family)
        //fontColors
        fontColors.value = _settings.fontColor
        fontColor.value = fontColors.value.find(x => x.value === $store.getters.font.color)
        //lineHeight
        lineHeights.value = _settings.fontColor
        lineHeight.value = lineHeights.value.find(x => x.value === $store.getters.font.color)
        //formatDates
        formatDates.value = _settings.formatDate
        formatDate.value = formatDates.value.find(x => x.value === $store.getters.format.date)
        //formatTimes
        formatTimes.value = _settings.formatTime
        formatTime.value = formatTimes.value.find(x => x.value === $store.getters.format.time)
      } else {

      }
    }
    const onUpdate = () => {
      form.value.validate().then((valid) => {
        if (valid) $store.dispatch('settings/set')
      })
    }

    const darkMode = computed({
      get: () => $q.dark.isActive,
      set: val => {
        $q.dark.set(val)
        $store.commit('settings/SET_DARK_MODE', val)
        onUpdate()
      }
    })
    const denseForm = computed({
      get: () => $store.getters.dense.form,
      set: val => {
        $store.commit('settings/SET_DENSE', { 'form': val })
        onUpdate()
      }
    })
    const denseTable = computed({
      get: () => $store.getters.dense.table,
      set: val => {
        $store.commit('settings/SET_DENSE', { 'table': val })
        onUpdate()
      }
    })
    const denseInput = computed({
      get: () => $store.getters.dense.input,
      set: val => {
        $store.commit('settings/SET_DENSE', { 'input': val })
        onUpdate()
      }
    })
    const denseButton = computed({
      get: () => $store.getters.dense.button,
      set: val => {
        $store.commit('settings/SET_DENSE', { 'button': val })
        onUpdate()
      }
    })
    const denseMenu = computed({
      get: () => $store.getters.dense.menu,
      set: val => {
        $store.commit('settings/SET_DENSE', { 'menu': val })
        onUpdate()
      }
    })
    const shadowTable = computed({
      get: () => $store.getters.shadow && $store.getters.shadow.table ? $store.getters.shadow.table : false,
      set: val => {
        $store.commit('settings/SET_SHADOW', { 'table': val })
        onUpdate()
      }
    })

    onInit()
    return {
      form, darkMode, languages, language, denseForm, denseTable, denseInput, denseButton, denseMenu, shadowTable,
      unitsPrices, unitPrice, fontSizes, fontSize, fontFamilys, fontFamily, fontColors, fontColor, formatDates, formatDate, formatTimes, formatTime,
      onSetLanguage (item) {
        if (language.value !== item) {
          // const data = JSON.parse(JSON.stringify(this.$store.state.settings.data))
          $store.commit('settings/SET_LANGUAGE', `${item.cc_iso}-${item.cc}`)
          onUpdate()
        }
      },
      onSetUnitPrice (item) {
        if (unitPrice.value !== item.code) {
          $store.commit('settings/SET_UNIT_PRICE', item.code)
          onUpdate()
        }
      },
      onSetFontSize (item) {
        if (fontSize.value.value !== item.value) {
          fontSize.value = item
          $store.commit('settings/SET_FONT', { key: 'size', value: item.value })
          onUpdate()
        }
      },
      onSetFontFamily (item) {
        if (fontFamily.value.value !== item.value) {
          fontFamily.value = item
          $store.commit('settings/SET_FONT', { key: 'family', value: item.value })
          onUpdate()
        }
      },
      onSetFontColor (item) {
        if (fontColor.value.value !== item.value) {
          fontColor.value = item
          $store.commit('settings/SET_FONT', { key: 'color', value: item.value })
          onUpdate()
        }
      },
      onSetFormatDate (item) {
        if (formatDate.value.value !== item.value) {
          formatDate.value = item
          $store.commit('settings/SET_FORMAT', { 'date': item.value })
          onUpdate()
        }
      },
      onSetFormatTime (item) {
        if (formatTime.value.value !== item.value) {
          formatTime.value = item
          $store.commit('settings/SET_FORMAT', { 'time': item.value })
          onUpdate()
        }
      }
    }
  }
})
</script>
<style scoped>
.settings .q-btn {
  font-weight: initial;
}
</style>
