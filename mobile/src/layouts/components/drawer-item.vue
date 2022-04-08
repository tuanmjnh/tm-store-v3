<template>
  <div class="drawer-item" v-if="item && item.meta && !item.meta.hidden">
    <q-expansion-item v-if="isExpansion(item.children)" expand-separator :default-opened="isOpen()"
                      :dense="dense" :header-class="[onActive(item.name) ? 'text-primary' : '']">
      <template v-slot:header>
        <q-item-section avatar>
          <q-icon v-if="isIcon" :color="iconColor" :name="item.meta.icon" />
        </q-item-section>
        <q-item-section>{{ $t(`route.${item.meta.title}`) }}</q-item-section>
      </template>
      <drawer-item v-for="(e, i) in item.children" :key="i" :dense="dense" :item="e"
                   :active="onActive(item.name)" :base-path="`${basePath ? `${basePath}/` : ''}${item.path}`"
                   :isIcon="!e.level || e.level < 3" />
    </q-expansion-item>
    <q-item v-else clickable v-ripple @click="onRouterLink(item.path)" :active="onActive(item.name)"
            :dense="dense">
      <q-item-section avatar>
        <q-icon v-if="isIcon" :name="item.meta.icon" :color="iconColor" />
      </q-item-section>
      <q-item-section>{{ $t(`route.${item.meta.title}`) }}</q-item-section>
    </q-item>
  </div>
</template>
<script>
import { defineComponent, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router'
import { openURL } from 'quasar'
import { isExternal } from '../../../../global/utils/validate'
export default defineComponent({
  name: 'drawer-item',
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
    const isActive = computed(() => { return $route.matched.map(x => x.name).indexOf(props.item.name) > -1 || false })
    const onRouterLink = (path) => {
      if (isExternal(path)) openURL(path)
      else {
        const url = props.basePath ? `${props.basePath}/${path}` : path
        $router.push(url).catch(e => { })
      }
    }
    const onActive = (name) => {
      const x = $route.matched.map(x => x.name).indexOf(props.item.name) > -1 || false
      return x
    }
    const isOpen = () => {
      const x = $route.matched.map(x => x.name).indexOf(props.item.name) > -1 || false
      if (x) {
        // this.$children[0].$el.classList.remove('q-expansion-item--collapsed')
        // this.$children[0].$el.classList.add('q-expansion-item--expanded')
        // this.$children[0].$children[1].$el.style.display = ''
        // console.log(this.$children[0])
        // console.log(this, this.$children[0].$el.classList)
      }
      return x
    }
    const isExpansion = (children) => {
      if (children && children.length) {
        const x = children.filter(x => !x.meta || !x.meta.hidden)
        if (x && x.length > 0) return true
        else return false
      } else return false
    }
    return { isActive, onRouterLink, onActive, isOpen, isExpansion, props }
  }
})
</script>

<style>
.drawer-item.active > div > div > .q-item {
  color: #027be3;
}
/* .drawer-item.active .q-expansion-item__content {
  display: initial !important;
} */
.drawer-item .q-item__section {
  min-width: 36px;
  padding-right: 0px;
}
.q-expansion-item
  .drawer-item
  > .q-expansion-item
  > .q-expansion-item__container
  > .q-item,
.q-expansion-item .drawer-item .q-item {
  padding-left: 40px;
}
/* .q-expansion-item--standard.q-expansion-item--expanded
  > div
  > .q-expansion-item__border {
  opacity: 1;
} */
.q-expansion-item--expanded
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
}
</style>
