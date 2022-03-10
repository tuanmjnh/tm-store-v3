<template>
  <!-- <draggable :list="nodes" :move="checkMove" :group="{ name: 'g1' }" tag="div" class="tm-nodes"> -->
  <div class="tm-node" v-if="node.show">
    <div :class="['tm-node-content',node.children&&node.children.length?'tm-node-expand':'']">
      <div :class="selected&&selected[nodeKey]===node[nodeKey]?'selected':''">
        <!-- <div :class="node.selected?'selected':''"> -->
        <div class="node-expand">
          <i v-if="node.children&&node.children.length" :class="['material-icons tree-arrow',node.expanded?'open':'']"
             @click="onToggle">play_arrow</i>
        </div>
        <!-- <i v-else class="node-prefix"></i> -->
        <q-checkbox :value="node.ticked" v-if="ticked!==undefined" @input="$emit('on-tick',node)" dense
                    class="node-checkbox" />
        <div class="node-item" @click="onClickNode" @dblclick="onMakeFolder">
          <slot v-if="slotContentAfter" name="content-after" :node="node"></slot>
          <div v-if="!slotContentAfter" class="node-icon material-icons">{{node.icon}}</div>
          <div v-if="!slotContentAfter" class="node-label">{{ node[nodeLabel] }}</div>
        </div>
      </div>
    </div>
    <!-- <transition name="slide"> -->
    <draggable v-if="draggable" :list="node.children" :group="{ name: 'people' }" tag="div"
               class="tm-nodes tm-node-child" transition-show="flip-up" transition-hide="flip-down"
               @change="$emit('on-drag-changed', $event)">
      <!-- <div class="tm-node-child" v-show="node.expanded" v-if="isFolder"> -->
      <tm-tree-node v-show="node.expanded" v-for="(child, index) in node.children" :key="index" :node="child"
                    :node-key="nodeKey" :node-label="nodeLabel" :is-children="true" :selected="selected" :ticked="ticked"
                    :expanded="expanded" :expanded-all="expandedAll" :expanded-express="expandedExpress" :parent="node"
                    :draggable="draggable" :filter="filter" :filter-method="filterMethod"
                    @make-folder="$emit('make-folder', $event)" @add-node="$emit('add-node', $event)"
                    @click-node="$emit('click-node', $event)" @on-tick="$emit('on-tick', $event)"
                    @on-expand="$emit('on-expand', $event)" @on-drag-changed="$emit('on-drag-changed', $event)"
                    :slot-content-after="slotContentAfter">
        <template v-if="slotContentAfter" v-slot:content-after="prop">
          <slot name="content-after" :node="prop.node"></slot>
        </template>
      </tm-tree-node>
      <q-btn v-if="addButton" flat round size="sm" color="primary" icon="add" class="node-add" />
      <!-- </div> -->
    </draggable>
    <div v-else class="tm-nodes tm-node-child">
      <tm-tree-node v-show="node.expanded" v-for="(child, index) in node.children" :key="index" :node="child"
                    :node-key="nodeKey" :node-label="nodeLabel" :is-children="true" :selected="selected" :ticked="ticked"
                    :expanded="expanded" :expanded-all="expandedAll" :expanded-express="expandedExpress" :parent="node"
                    :filter="filter" :filter-method="filterMethod" @make-folder="$emit('make-folder', $event)"
                    @add-node="$emit('add-node', $event)" @click-node="$emit('click-node', $event)"
                    @on-tick="$emit('on-tick', $event)" @on-expand="$emit('on-expand', $event)"
                    @on-drag-changed="$emit('on-drag-changed', $event)" :slot-content-after="slotContentAfter">
        <template v-if="slotContentAfter" v-slot:content-after="prop">
          <slot name="content-after" :node="prop.node"></slot>
        </template>
      </tm-tree-node>
    </div>
    <!-- </transition> -->
  </div>
  <!-- </draggable> -->
</template>

<script>
import { defineComponent, ref, onMounted, computed } from 'vue';
export default defineComponent({
  name: 'tm-tree-node',
  components: { draggable: defineAsyncComponent(() => import('vuedraggable')) },
  props: {
    // nodes: { type: Array, default: () => [] },
    node: { type: Object, default: () => { } },
    nodeKey: { type: String, default: 'id' },
    nodeLabel: { type: String, default: 'label' },
    selected: { type: Object, default: () => { } },
    ticked: { type: Array, default: () => undefined },
    expanded: { type: Array, default: () => [] },
    expandedExpress: { type: Boolean, default: false },
    expandedAll: { type: Boolean, default: false },
    addExpress: { type: Boolean, default: false },
    parent: { type: Object, default: null },
    addButton: { type: Boolean, default: false },
    draggable: { type: Boolean, default: false },
    filter: { type: String, default: '' },
    filterMethod: { type: Function },
    slotContentAfter: { type: Boolean, default: false }
  },
  setup (props, { emit }) {
    const isOpen = ref(false)
    const checkBox = ref(false)

    onMounted(() => {
      // selected
      if (props.selected && props.selected[props.nodeKey] === props.node[props.nodeKey]) emit(props.node.selected, true) //props.node.selected = true
      // expanded
      if (props.expandedAll) emit(props.node.expanded, true) //props.node.expanded = true
      else {
        if (props.expanded && props.expanded.length && props.expanded.includes(props.node[props.nodeKey])) emit(props.node.expanded, true) //props.node.expanded = true
        // if (props.expanded.includes(props.node[props.nodeKey])) props.isOpen = true
      }
      // ticked
      if (props.ticked && props.ticked.length) {
        if (props.ticked.includes(props.node[props.nodeKey])) {
          emit(props.node.ticked, true)// props.node.ticked = true
          emit('on-tick', props.node, true)
        } else emit(props.node.ticked, false) //props.node.ticked = false
        if (props.parent) {
          // props.node.dependent = props.parent[props.nodeKey]
          emit(props.node.dependent, props.parent[props.nodeKey])
          // props.node.level = props.parent.level + 1
          emit(props.node.level, props.parent.level + 1)
        }
      } else emit(props.node.ticked, false) // props.node.ticked = false
      // Show
      // props.node.show = true
      emit(props.node.show, true)
    })

    const onToggle = () => {
      if (props.node.children && props.node.children.length) {
        // props.node.expanded = !props.node.expanded
        emit(props.node.expanded, !props.node.expanded)
        // isOpen.value = !isOpen.value
        emit('on-expand', props.node)
      }
    }
    const onClickNode = () => {
      if (props.node.children && props.node.children.length && props.expandedExpress) emit(props.node.expanded, !props.node.expanded) // props.node.expanded = !props.node.expanded
      // isOpen.value = !isOpen.value
      // props.node.selected = !props.node.selected
      emit(props.node.selected, !props.node.selected)
      emit('click-node', props.node)
      // if (props.selected === props.node[props.nodeKey]) props.$emit('update:selected', null)
      // else emit('update:selected', props.node[props.nodeKey])
      // console.log(props.selected)
    }
    const onMakeFolder = () => {
      if (!props.node.children && props.node.children.length < 1 && props.addExpress) {
        emit('make-folder', props.node)
        emit(props.node.expanded, true)// props.node.expanded = true
        // isOpen.value = true
      }
    }
    const onAddNode = (node) => {
      emit('add-node', node)
    }
    const getSelected = () => {
      // props.node.selected = !props.node.selected
      return props.node.selected ? 'selected' : ''
    }
    const checkMove = (e) => {
      emit('on-drag', e)
      // window.console.log('Future index: ' + e.draggedContext.futureIndex)
    }

    const nodeSelected = computed(() => props.node.selected || false)

    // watch: {
    // ticked(val) {
    //   if (props.ticked.includes(props.node[props.nodeKey])) props.node.ticked = true
    //   else props.node.ticked = false
    // }
    // parent: {
    //   handler(val) {
    //     if (val) {
    //       props.node.dependent = val[props.nodeKey]
    //       props.node.level = val.level + 1
    //       console.log(props.parent.title)
    //     } else {
    //       props.node.dependent = null
    //       props.node.level = 1
    //     }
    //   },
    //   deep: true,
    //   immediate: true
    // }
    // parent(val) {
    //   console.log(val)
    // },
    // filter(val) {
    //   if (typeof props.filterMethod === 'function') {
    //     props.node.show = props.filterMethod(props.node, val)
    //     if (props.parent && props.node.show) {
    //       props.parent.show = true
    //       console.log(props.parent)
    //     }
    //   }
    // }
    // },

    return {
      props,
      onToggle, onClickNode, onMakeFolder, onAddNode, getSelected, checkMove,
      nodeSelected
    }
  }
})
</script>

<style lang="scss">
// .tm-nodes {
// min-height: 50px;
// outline: 1px dashed;
// }
.tm-node {
  color: #607d8b;
  cursor: pointer;
  padding: 5px 0px;
  // padding-left: 25px;
  .node-prefix {
    padding-left: 25px;
  }
  .node-checkbox {
    margin-right: 5px;
  }
  .node-item {
    display: inline-flex;
    vertical-align: middle;
    flex-wrap: nowrap;
    .node-icon {
      font-size: 20px;
      margin-right: 8px;
    }
  }
  .node-expand {
    display: inline-flex;
    vertical-align: middle;
    width: 20px;
    .tree-arrow {
      transition: transform 0.3s;
      font-size: 16px;
      color: #9e9e9e;
      padding-right: 3px;
      &.open {
        transform: rotate3d(0, 0, 1, 90deg);
      }
    }
  }
  .selected {
    color: #2196f3;
  }
  // .checkbox{
  // padding-left: 3px;
  // }
}
</style>
