<template>
  <component :is="component"></component>
</template>

<script>
//Vue 3 is having a special function to define these async functions
import { defineAsyncComponent } from "vue";

export default {
  name: "DynamicComponent",
  //I am passing the name of the Component as a prop
  props: {
    componentName: { type: String, required: true }
  },
  computed: {
    component () {
      return defineAsyncComponent(() => import(`@/${this.componentName}.vue`))
    }
  }
}
</script>
