<template>
  <!-- <transition name="fade"> -->
  <div>
    <ul v-if="isVisible" :style="{left:x+'px',top:y+'px'}" class="context-menu">
      <slot v-if="slotContent" name="content"></slot>
      <!-- <li>
        {{ $t('tagsView.refresh') }}
      </li>
      <li>
        {{ $t('tagsView.close') }}
      </li>
      <li>
        {{ $t('tagsView.closeOthers') }}
      </li>
      <li>
        {{ $t('tagsView.closeAll') }}
      </li> -->
    </ul>
  </div>
  <!-- </transition> -->
</template>

<script>
import { defineComponent, ref, watch, computed, getCurrentInstance } from 'vue';
export default defineComponent({
  name: 'context-menu',
  props: {
    // visible: { type: Boolean, default: false }
    left: { type: Number, default: 0 },
    top: { type: Number, default: 0 },
    data: null
  },
  setup (props, { emit, slots }) {
    const $instance = getCurrentInstance()
    const x = ref(0)
    const y = ref(0)
    const isVisible = ref(false)

    const onOpenMenu = (data, e) => {
      const menuMinWidth = 105
      const offsetLeft = $instance.el.getBoundingClientRect().left // container margin left
      const offsetWidth = $instance.el.offsetWidth // container width
      const maxLeft = offsetWidth - menuMinWidth // left boundary
      const left = e.clientX - offsetLeft + 15 // 15: margin right

      if (left > maxLeft) x.value = maxLeft + props.left
      else x.value = left + props.left

      y.value = e.clientY + props.top
      isVisible.value = true
      emit('update:data', data)
    }
    const onCloseMenu = () => {
      isVisible.value = false
    }

    watch(() => isVisible, (state, prevState) => {
      if (state) document.body.addEventListener('click', onCloseMenu)
      else document.body.removeEventListener('click', onCloseMenu)
    })

    const slotContent = computed(slots['content'] || false)

    return {
      props, x, y, isVisible,
      onOpenMenu, onCloseMenu,
      slotContent
    }
  }
})
</script>
<style scoped>
.context-menu {
  /* // transition: ease-out 0.5s; */
  margin: 0;
  background: #fff;
  z-index: 3000;
  position: absolute;
  list-style-type: none;
  padding: 5px 0;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 400;
  color: #333;
  box-shadow: 2px 2px 3px 0 rgba(0, 0, 0, 0.3);
}
.context-menu li {
  margin: 0;
  padding: 7px 16px;
  cursor: pointer;
}
.context-menu li:hover {
  background: #eee;
}
/* .fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
} */
/* .fade-leave-active below version 2.1.8 */
/* .fade-enter, .fade-leave-to  {
  opacity: 0;
} */
</style>
