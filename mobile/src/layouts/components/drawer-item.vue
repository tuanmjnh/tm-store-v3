<template>
  <template v-if="item && item.meta && !item.meta.hidden">
    <q-expansion-item v-if="isExpansion(item.children)" expand-separator :default-opened="isOpen()" :dense="dense"
                      :header-class="[onActive(item.name) ? 'text-primary' : '']">
      <template v-slot:header>
        <q-item-section avatar>
          <q-icon v-if="isIcon" :color="iconColor" :name="item.meta.icon" />
        </q-item-section>
        <q-item-section>{{ $t(`route.${item.meta.title}`) }}</q-item-section>
      </template>
      <drawer-item v-for="(e, i) in item.children" :key="i" :dense="dense" :item="e" :active="onActive(item.name)"
                   :base-path="`${basePath ? `${basePath}/` : ''}${item.path}`" :isIcon="!e.level || e.level < 3" />
    </q-expansion-item>
    <q-item v-else clickable v-ripple @click.prevent="onRouterLink(item)" :active="onActive(item.name)" :dense="dense">
      <q-item-section avatar>
        <q-icon v-if="isIcon" :name="item.meta.icon" :color="iconColor" />
      </q-item-section>
      <q-item-section>{{ $t(`route.${item.meta.title}`) }}</q-item-section>
    </q-item>
  </template>
  <!-- Dialog -->
  <q-dialog v-model="isDialog" :maximized="isMaximized">
    <fake-component :componentName="component" />
  </q-dialog>
</template>
<script>
import { defineComponent, defineAsyncComponent, ref, computed, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { openURL } from 'quasar'
import { isExternal } from '../../../../global/utils/validate'
export default defineComponent({
  name: 'DrawerItemLayout',
  components: {
    fakeComponent: defineAsyncComponent(() => import('layouts/fake-component'))
  },
  props: {
    // items: { type: Array, default: () => [] }
    basePath: { type: String, default: '' },
    item: { type: Object, default: () => { } },
    active: { type: Boolean, default: () => false },
    dense: { type: Boolean, default: () => false },
    isIcon: { type: Boolean, default: () => false },
    iconColor: { type: String, default: 'blue-grey' }
  },
  setup (props) {
    const $route = useRoute()
    const $router = useRouter()
    const $store = useStore()
    const isActive = computed(() => { return $route.matched.map(x => x.name).indexOf(props.item.name) > -1 || false })
    const isDialog = ref(false)
    const isMaximized = ref(true)
    const component = ref(null)
    watch(() => isDialog.value, (state, prevState) => {
      if (!state) $store.dispatch('app/setComponentLoaded')
    }, { deep: true })
    return {
      isActive, isDialog, isMaximized, component,
      onActive () {
        const x = $route.matched.map(x => x.name).indexOf(props.item.name) > -1 || false
        return x
      },
      isOpen () {
        const x = $route.matched.map(x => x.name).indexOf(props.item.name) > -1 || false
        if (x) {
          // this.$children[0].$el.classList.remove('q-expansion-item--collapsed')
          // this.$children[0].$el.classList.add('q-expansion-item--expanded')
          // this.$children[0].$children[1].$el.style.display = ''
          // console.log(this.$children[0])
          // console.log(this, this.$children[0].$el.classList)
        }
        return x
      },
      isExpansion (children) {
        if (children && children.length) {
          const x = children.filter(x => !x.meta || !x.meta.hidden)
          if (x && x.length > 0) return true
          else return false
        } else return false
      },
      onRouterLink (val) {
        if (val.meta.dialog) {
          $store.commit('app/LEFT_DRAWER', false)
          component.value = val.meta.component
          $store.dispatch('app/setComponentLoaded', val)
          isDialog.value = !isDialog.value
        } else {
          if (isExternal(val.path)) openURL(val.path)
          else {
            const url = props.basePath ? `${props.basePath}/${val.path}` : val.path
            $router.push(url).catch(e => { })
          }
        }
      }
    }
  }
})
</script>

<style>
.q-drawer .drawer-item.active > div > div > .q-item {
  color: #027be3;
}
/* .drawer-item.active .q-expansion-item__content {
  display: initial !important;
} */
.q-drawer .q-item__section {
  min-width: 36px;
  padding-right: 0px;
}
.q-drawer
  .q-expansion-item
  > .q-expansion-item__container
  > .q-expansion-item__content
  > .q-item,
.q-expansion-item .drawer-item .q-item {
  padding-left: 30px;
}
/* .q-expansion-item--standard.q-expansion-item--expanded
  > div
  > .q-expansion-item__border {
  opacity: 1;
} */
/* .q-expansion-item--expanded
  + .q-expansion-item--expanded
  > div
  > .q-expansion-item__border--top,
.drawer-item:first-child
  > .q-expansion-item
  > div
  > .q-expansion-item__border--top,
.drawer-item:last-child
  > .q-expansion-item
  > div
  > .q-expansion-item__border--bottom {
  opacity: 0;
}
.q-expansion-item--standard.q-expansion-item--expanded
  > div
  > .q-expansion-item__border {
  opacity: 1;
} */
.q-drawer .q-list > div:nth-child(3) .q-expansion-item__border--top {
  opacity: 0 !important;
}
</style>
