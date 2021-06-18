<template>
  <div
       :class="['absolute-top layout-drawer-toolbar',$store.state.app.darkMode?'bg-black':'bg-primary',isPlaceholder?'':'fix-icon-search']">
    <q-input dark borderless v-model="appSearch" class="q-ml-md" style="height:50px"
             :placeholder="isPlaceholder?$t('global.search'):''">
      <template v-slot:append>
        <q-icon v-if="appSearch===''" name="search" />
        <q-icon v-else name="clear" class="cursor-pointer" @click="appSearch=''" />
      </template>
    </q-input>
    <!-- <form autocorrect="off" autocapitalize="off" autocomplete="off" spellcheck="false"><label
        for="qf_69c638cb-da46-a683-9e27-2c9acb65f60c"
        class="q-field row no-wrap items-start full-width doc-algolia bg-primary q-input q-field--borderless q-field--square q-field--dense q-field--dark">
        <div class="q-field__inner relative-position col self-stretch column justify-center">
          <div tabindex="-1" class="q-field__control relative-position row no-wrap">
            <div class="q-field__control-container col relative-position row no-wrap q-anchor--skip"><span
                class="algolia-autocomplete" style="position: relative; display: inline-block; direction: ltr;"><input
                  tabindex="0" :placeholder="$t('global.search')" id="qf_c3801136-0f64-a3d2-6fd2-b8e1575b557a"
                  type="text" value="" class="q-field__native q-placeholder ds-input" autocomplete="off"
                  spellcheck="false" role="combobox" aria-autocomplete="list" aria-expanded="false"
                  aria-owns="algolia-autocomplete-listbox-0" dir="auto"
                  style="position: relative; vertical-align: top;">
                <pre aria-hidden="true"
                  style="position: absolute; visibility: hidden; white-space: pre; font-family: Roboto, -apple-system, &quot;Helvetica Neue&quot;, Helvetica, Arial, sans-serif; font-size: 14px; font-style: normal; font-variant: normal; font-weight: 400; word-spacing: 0px; letter-spacing: 0.13118px; text-indent: 0px; text-rendering: auto; text-transform: none;"></pre>
                <span class="ds-dropdown-menu" role="listbox" id="algolia-autocomplete-listbox-0"
                  style="position: absolute; top: 100%; z-index: 100; left: 0px; right: auto; display: none;">
                  <div class="ds-dataset-1"></div>
                </span></span></div>
            <div class="q-field__append q-field__marginal row no-wrap items-center"><i aria-hidden="true"
                class="material-icons q-icon">search</i></div>
          </div>
        </div>
      </label></form> -->
    <div class="layout-drawer-toolbar__shadow absolute-full overflow-hidden no-pointer-events">
    </div>
  </div>
</template>

<script>
import { defineComponent, computed } from 'vue';
import { useStore } from 'vuex'
// import { useI18n } from 'vue-i18n'
export default defineComponent({
  name: 'drawer-search',
  props: {
    isPlaceholder: { type: Boolean, default: true }
  },
  setup (props) {
    const $store = useStore()
    const appSearch = computed({
      get: () => { return $store.state.app.search },
      set: value => { $store.commit('app/SET_SEARCH', value) }
    })
    return { appSearch }
  }
})
</script>

<style lang="scss" scoped>
.doc-algolia {
  height: 50px;
  .q-field__control {
    padding: 0 18px 0 16px !important;
  }
}
.layout-drawer-toolbar {
  right: -1px;
}
.fix-icon-search {
  i.material-icons {
    position: absolute;
    left: 0;
  }
}
</style>
