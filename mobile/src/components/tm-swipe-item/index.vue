<template>
  <div v-touch-swipe.mouse.left="onSlideLeft" v-touch-swipe.mouse.right="onSlideRight" class="q-swipe-item q-item-type overflow-hidden">
    <div v-if="slotRight" class="q-item__right absolute-full row no-wrap items-center justify-end" style="visibility:hidden">
      <slot name="right" />
    </div>
    <div v-if="slotLeft" class="q-item__left absolute-full row no-wrap items-center justify-start" style="visibility:hidden">
      <slot name="left" />
    </div>
    <div class="q-swipe-item__content" style="transform:translate(0px,0px)">
      <slot />
    </div>
  </div>
</template>

<script>
import { defineComponent, ref, computed } from "vue";
export default defineComponent({
  name: "TMSwipeItem",
  props: {
    translateXValue: { type: Number, default: 150 }
  },
  setup (props, { emit, slots }) {
    const slotLeft = computed(() => !!slots['left'])
    const slotRight = computed(() => !!slots['right'])
    // const translateXValue = 150
    const translateXDefault = ref('translate(0px, 0px)')
    const translateXRight = ref(`translateX(-${props.translateXValue}px)`)
    const translateXLeft = ref(`translateX(${props.translateXValue}px)`)
    // find element
    const findMainElement = (className) => {
      return /^q-swipe-item /.test(className)
    }
    const findContentElement = (className) => {
      return /^q-swipe-item__content/.test(className)
    }
    const findLeftElement = (className) => {
      return /^q-item__left/.test(className)
    }
    const findRightElement = (className) => {
      return /^q-item__right/.test(className)
    }
    // find children
    const findChildElements = (children) => {
      const rs = { content: null, left: null, right: null }
      if (children) {
        for (let i = 0; i < children.length; i++) {
          if (findContentElement(children[i].className)) {
            rs.content = children[i]
            continue
          } else if (findLeftElement(children[i].className)) {
            rs.left = children[i]
            continue
          } else if (findRightElement(children[i].className)) {
            rs.right = children[i]
            continue
          }
        }
      }
      return rs
    }
    return {
      slotLeft, slotRight,
      onSlideLeft (val) {
        val.evt.path.forEach(e => {
          if (findMainElement(e.className)) {
            const children = findChildElements(e.children)
            if (children.content.style.transform === translateXDefault.value && slotRight.value) {
              children.content.style.transform = translateXRight.value
              if (slotRight.value) children.right.style.visibility = 'visible'
              if (slotLeft.value) children.left.style.visibility = 'hidden'
            } else {
              children.content.style.transform = translateXDefault.value
              if (slotRight.value) children.right.style.visibility = 'hidden'
              if (slotLeft.value) children.left.style.visibility = 'hidden'
            }
          }
        })
      },

      onSlideRight (val) {
        val.evt.path.forEach(e => {
          if (findMainElement(e.className)) {
            const children = findChildElements(e.children)
            if (children.content.style.transform === translateXDefault.value && slotLeft.value) {
              children.content.style.transform = translateXLeft.value
              if (slotRight.value) children.right.style.visibility = 'hidden'
              if (slotLeft.value) children.left.style.visibility = 'visible'
            } else {
              const children = findChildElements(e.children)
              children.content.style.transform = translateXDefault.value
              if (slotRight.value) children.right.style.visibility = 'hidden'
              if (slotLeft.value) children.left.style.visibility = 'hidden'
            }
          }
        })
      }
    }
  }
})
</script>
<style>
/* .q-swipe-item__content {
  background-color: #fff;
} */
.q-swipe-item {
  position: relative;
}
.q-swipe-item .q-btn {
  height: 100% !important;
}
</style>
