<template>
  <div v-touch-swipe.mouse.left="onSlideLeft" v-touch-swipe.mouse.right="onSlideRight" class="q-swipe-item q-item-type overflow-hidden"
       @click="onClick">
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
    leftValue: { type: String, default: 'max' },
    rightValue: { type: String, default: 'max' },
    reset: { type: Boolean, default: false }
  },
  setup (props, { emit, slots }) {
    const slotLeft = computed(() => !!slots['left'])
    const slotRight = computed(() => !!slots['right'])
    const swipeItem = ref({ content: null, left: null, right: null })
    const translateXDefault = ref('translate(0px, 0px)')
    const translateXLeft = (val) => {
      return `translateX(${val}px)`
    }
    const translateXRight = (val) => {
      return `translateX(-${val}px)`
    }
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
      // const rs = { content: null, left: null, right: null }
      if (children) {
        for (let i = 0; i < children.length; i++) {
          if (findContentElement(children[i].className)) {
            swipeItem.value.content = children[i]
            continue
          } else if (findLeftElement(children[i].className)) {
            swipeItem.value.left = children[i]
            continue
          } else if (findRightElement(children[i].className)) {
            swipeItem.value.right = children[i]
            continue
          }
        }
      }
      return swipeItem.value
    }
    // const Reset = () => {
    //   swipeItem.content.style.transform = translateXDefault.value
    //   if (slotRight.value) swipeItem.right.style.visibility = 'hidden'
    //   if (slotLeft.value) swipeItem.left.style.visibility = 'hidden'
    // }
    const onReset = () => {
      // children.content.style.transform = translateXDefault.value
      // if (slotRight.value) children.right.style.visibility = 'hidden'
      // if (slotLeft.value) children.left.style.visibility = 'hidden'
      swipeItem.value.content.style.transform = translateXDefault.value
      if (slotRight.value) swipeItem.value.right.style.visibility = 'hidden'
      if (slotLeft.value) swipeItem.value.left.style.visibility = 'hidden'
    }
    return {
      slotLeft, slotRight,
      onSlideLeft (val) {
        val.evt.path.forEach(e => {
          if (findMainElement(e.className)) {
            const children = findChildElements(e.children)
            // console.log(children.content.style.transform === translateXDefault.value)
            // console.log(children.content.style.transform, translateXDefault.value)
            if (children.content.style.transform === translateXDefault.value) {
              if (slotRight.value) {
                children.content.style.transform = translateXRight(props.rightValue === 'max' ? e.offsetWidth : props.rightValue)
                if (slotRight.value) children.right.style.visibility = 'visible'
                if (slotLeft.value) children.left.style.visibility = 'hidden'
              }
              emit('swipe-left', { el: swipeItem.value, reset: onReset })
            } else {
              children.content.style.transform = translateXDefault.value
              if (slotRight.value) children.right.style.visibility = 'hidden'
              if (slotLeft.value) children.left.style.visibility = 'hidden'
              emit('swipe-reset', { el: swipeItem.value, reset: onReset })
            }
          }
        })

      },
      onSlideRight (val) {
        val.evt.path.forEach(e => {
          if (findMainElement(e.className)) {
            const children = findChildElements(e.children)
            if (children.content.style.transform === translateXDefault.value) {
              if (slotLeft.value) {
                children.content.style.transform = translateXLeft(props.leftValue === 'max' ? e.offsetWidth : props.leftValue)
                if (slotRight.value) children.right.style.visibility = 'hidden'
                if (slotLeft.value) children.left.style.visibility = 'visible'
              }
              emit('swipe-right', { el: swipeItem.value, reset: onReset })
            } else {
              const children = findChildElements(e.children)
              children.content.style.transform = translateXDefault.value
              if (slotRight.value) children.right.style.visibility = 'hidden'
              if (slotLeft.value) children.left.style.visibility = 'hidden'
              emit('swipe-reset', { el: swipeItem.value, reset: onReset })
            }
          }
        })

      },
      onClick (val) {
        val.path.forEach(e => {
          if (findMainElement(e.className)) {
            const children = findChildElements(e.children)
            emit('handleClick', { evt: children, reset: onReset })
            // onReset(children.content)
          }
        })
      },
      Reset () {
        onReset()
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
.q-swipe-item__content,
.q-item__left,
.q-item__right {
  transition: transform 0.3s;
}
</style>
