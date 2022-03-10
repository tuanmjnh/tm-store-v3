<template>
  <q-card style="min-width:700px;min-height:500px">
    <q-toolbar>
      <!-- <q-avatar text-color="primary" size="24px" icon="pageview" > -->
      <q-avatar>
        <i class="material-icons" style="font-size:26px;color:#027be3">pageview</i>
      </q-avatar>
      <q-toolbar-title>
        {{item.title}}
      </q-toolbar-title>
      <q-btn dense flat @click="onMaximized"
             :icon="maximized?'fullscreen_exit' : 'fullscreen'">
        <q-tooltip v-if="!$q.platform.is.mobile">
          {{maximized ? $t('navbar.normal_screen') : $t('navbar.full_screen')}}
        </q-tooltip>
      </q-btn>
      <q-btn flat round dense icon="close" v-close-popup>
        <q-tooltip v-if="!$q.platform.is.mobile">{{$t('global.cancel')}}</q-tooltip>
      </q-btn>
    </q-toolbar>
    <!-- <q-card-actions> -->
    <iframe class="iframe" :src="item.url" frameborder="0" allowfullscreen />
    <!-- </q-card-actions> -->
  </q-card>
</template>

<script>
import { defineComponent, ref } from 'vue';
export default defineComponent({
  name: 'view-file',
  props: {
    item: { type: Object, default: () => ({ title: '', url: '' }) },
    maximized: { type: Boolean, default: false }
  },
  setup (props, { emit }) {
    const maximizedToggle = ref(false)
    const onMaximized = () => {
      emit('update:maximized', !props.maximized)
    }
    return {
      props,
      onMaximized
    }
  }
})
</script>

<style lang="scss" scoped>
.iframe {
  width: 100%;
  height: 88%;
  min-height: 440px;
  min-width: 680px;
}
</style>
