<template>
  <div v-if="nodes&&nodes.length>0" class="tm-tree">
    <draggable v-if="draggable" :list="nodes" @change="onDragChanged" :group="{ name: 'people' }" tag="div"
               class="tm-nodes">
      <tm-tree-node v-for="(node, index) in nodes" :key="index" :node="node" :node-key="nodeKey" :node-label="nodeLabel"
                    :selected="selected" :ticked="ticked" :expanded="expanded" :expanded-all="expandedAll"
                    :expanded-express="expandedExpress" :add-button="addButtonChild" :add-express="addExpress" :parent="null"
                    :draggable="draggable" :filter="filter" :filter-method="filterMethod" @on-tick="onTick"
                    @make-folder="onMakeFolder" @add-node="onAddChildNode" @click-node="onClickNode" @on-expand="onExpand"
                    @on-drag-changed="onDragChanged" :slot-content-after="slotContentAfter">
        <template v-if="slotContentAfter" v-slot:content-after="prop">
          <slot name="content-after" :node="prop.node"></slot>
        </template>
      </tm-tree-node>
    </draggable>
    <div v-else class="tm-nodes">
      <tm-tree-node v-for="(node, index) in nodes" :key="index" :node="node" :node-key="nodeKey" :node-label="nodeLabel"
                    :selected="selected" :ticked="ticked" :expanded="expanded" :expanded-all="expandedAll"
                    :expanded-express="expandedExpress" :add-button="addButtonChild" :add-express="addExpress" :parent="null"
                    :filter="filter" :filter-method="filterMethod" @on-tick="onTick" @make-folder="onMakeFolder"
                    @add-node="onAddChildNode" @click-node="onClickNode" @on-expand="onExpand" @on-drag-changed="onDragChanged"
                    :slot-content-after="slotContentAfter">
        <template v-if="slotContentAfter" v-slot:content-after="prop">
          <slot name="content-after" :node="prop.node"></slot>
        </template>
      </tm-tree-node>
    </div>
    <div v-if="addButtonMain" class="node-add" @click="onAddRootNode">+</div>
  </div>
  <label v-else class="no-data-label">{{noNodesLabel}}</label>
</template>

<script>
import { defineComponent, defineAsyncComponent, onMounted, watch } from 'vue';
import _ from 'lodash'
export default defineComponent({
  name: 'tm-tree',
  components: {
    tmTreeNode: defineAsyncComponent(() => import('./node')),
    draggable: defineAsyncComponent(() => import('vuedraggable'))
  },
  props: {
    nodes: { type: Array, default: () => [] },
    nodeKey: { type: String, default: 'id' },
    nodeLabel: { type: String, default: 'label' },
    selected: { type: Object, default: () => { } },
    ticked: { type: Array, default: () => undefined },
    tickStrategy: { type: String, default: undefined },
    expanded: { type: Array, default: () => [] },
    expandedExpress: { type: Boolean, default: false },
    expandedAll: { type: Boolean, default: false },
    addExpress: { type: Boolean, default: false },
    addButtonMain: { type: Boolean, default: false },
    addButtonChild: { type: Boolean, default: false },
    noNodesLabel: { type: String, default: 'No data available' },
    draggable: { type: Boolean, default: false },
    filter: { type: String, default: '' },
    filterMethod: { type: Function }
  },
  setup (props, { emit, slots }) {
    onMounted(() => {
      if (props.ticked && props.ticked.length) {
        props.ticked.forEach(e => {
          props.onTickedParentAll(props.nodes, e, props.nodeKey)
        })
      }
    })

    const onClickNode = (node) => {
      if (props.selected && props.selected[props.nodeKey] === node[props.nodeKey]) {
        emit('update:selected', null)
      } else {
        emit('update:selected', node)
      }
      emit('on-selected', node)
      // console.log(node)
    }
    const onMakeFolder = (node) => {
      // Vue.set(node, 'children', [])
      this.$set(node, 'children', [])
      onAddChildNode(node)
    }
    const onAddRootNode = (node) => {
      // props.nodes.push({ [props.nodeKey]: 'new stuff' })
      emit(props.nodes, props.data.slice().push({ [props.nodeKey]: 'new stuff' }))
    }
    const onAddChildNode = (node) => {
      const newNode = { _id: Math.random(), [props.nodeKey]: 'new stuff' }
      // if (!node.children) this.$set(node, 'children', [])
      // const tmp = node.children.push(node)
      node.children.push(newNode)
      // props.expanded.push(node[props.nodeKey])
      emit(props.expanded, props.expanded.slice().push(node[props.nodeKey]))
      // this.$set(node, 'children', tmp)
      // node.children.push({ title: 'new stuff' })
    }
    const onTick = (node, ticked, children = false) => {
      if (props.tickStrategy === 'leaf' || props.tickStrategy === 'leaf-child' || props.tickStrategy === 'leaf-filtered') { // leaf
        onTickedChildren(node, ticked)
        onTickedParentAll(props.nodes, node, props.nodeKey)
      } else { // strict
        if (node.ticked) {
          if (props.ticked.indexOf(node[props.nodeKey]) < 0)
            // props.ticked.push(node[props.nodeKey])
            emit(props.ticked, props.ticked.slice().push(node[props.nodeKey]))
        } else {
          const i = props.ticked.indexOf(node[props.nodeKey])
          if (i > -1)
            // props.ticked.splice(i, 1)
            emit(props.ticked, props.ticked.slice().splice(i, 1))
        }
      }
    }
    const onExpand = (node) => {
      if (node.expanded && props.expanded.indexOf(node[props.nodeKey]) < 0)
        //props.expanded.push(node[props.nodeKey])
        emit(props.expanded, props.expanded.slice().push(node[props.nodeKey]))
      else {
        const i = props.expanded.indexOf(node[props.nodeKey])
        if (i > -1)
          // props.expanded.splice(i, 1)
          emit(props.expanded, props.expanded.slice().splice(i, 1))
      }
    }
    const getParent = (root, node, key, reset = true) => {
      for (let i = 0; i < root.length; i++) {
        const e = root[i]
        if (reset) emit(props.parents, []) //props.parents = []
        emit(props.parents, props.parents.slice().push(e))
        // props.parents.push(e)
        // console.log(e[key] === node[key], e[key], node[key])
        if (e[key] === node[key]) {
          // return rs
          // console.log('break')
          return e
        }
        if (e.children) {
          props.getParent(e.children, node, key, false)
        }
      }
      return props.parents
    }
    const onTickedChildren = (node, ticked, children = false) => {
      if (children) node.ticked = ticked
      if (node.ticked) {
        // if (props.tickStrategy === 'leaf') {
        if (props.tickStrategy === 'leaf-filtered') {
          if (props.ticked.indexOf(node[props.nodeKey] && node.show) < 0)
            //props.ticked.push(node[props.nodeKey])
            emit(props.ticked, props.ticked.slice().push(node[props.nodeKey]))
        } else {
          if (props.ticked.indexOf(node[props.nodeKey]) < 0)
            //props.ticked.push(node[props.nodeKey])
            emit(props.ticked, props.ticked.slice().push(node[props.nodeKey]))
        }
        // }
        if (node.children && node.children.length > 0) {
          node.children.forEach(e => { onTickedChildren(e, node.ticked, true) })
        }
      } else {
        // if (props.tickStrategy === 'leaf') {
        const i = props.ticked.indexOf(node[props.nodeKey])
        if (i > -1)
          emit(props.ticked, props.ticked.slice().splice(i, 1))
        //props.ticked.splice(i, 1)
        // }
        if (node.children && node.children.length > 0) {
          node.children.forEach(e => { onTickedChildren(e, node.ticked, true) })
        }
      }
    }
    const onTickedParentAll = (nodes, node, key) => {
      const x = onTickedParent(nodes, node, key)
      if (x && x.dependent) onTickedParentAll(nodes, x, key)
    }
    const onTickedParent = (nodes, node, key) => {
      if (node.dependent) {
        for (const e of nodes) {
          if (e[props.nodeKey].toString() === node.dependent) {
            const tickedChild = e.children.filter(x => x.ticked === true || x.ticked === null)
            if (tickedChild.length === 0) e.ticked = false
            else if (tickedChild.length === e.children.length) e.ticked = node.ticked
            else if (tickedChild.length <= e.children.length) e.ticked = null
            if (node.ticked || node.ticked == null) {
              if (!props.ticked.includes(e[props.nodeKey]))
                //props.ticked.push(e[props.nodeKey])
                emit(props.ticked, props.ticked.slice().push(e[props.nodeKey]))
            } else {
              if (tickedChild.length === 0) {
                const i = props.ticked.indexOf(e[props.nodeKey])
                if (i > -1)
                  //props.ticked.splice(i, 1)
                  emit(props.ticked, props.ticked.slice().splice(i, 1))
              }
            }
            return e
          }
          if (e.children && e.children.length > 0) {
            const x = onTickedParent(e.children, node, key)
            if (x) return x
          }
        }
      }
    }
    const getParentDrag = (nodes, node, child = false) => {
      for (const e of nodes) {
        if (e[props.nodeKey].toString() === node[props.nodeKey]) {
          return child
        }
        if (e.children && e.children.length > 0) {
          const x = getParentDrag(e.children, node, true)
          if (x) return { child: true, node: e }
        }
      }
    }
    const updateNodes = (nodes, node, dependent = null, level = 1) => {
      return new Promise(async (resolve, reject) => {
        let rs
        for await (const e of nodes) {
          e.dependent = dependent
          e.level = level
          if (e[props.nodeKey] === node[props.nodeKey]) {
            rs = e
            return resolve(e)
          }
          if (e.children && e.children.length > 0) {
            const x = await updateNodes(e.children, node, e[props.nodeKey], e.level + 1)
            if (x) {
              rs = e
              return resolve(e)
            }
          }
        }
        resolve(rs)
      })
    }
    const onFilter = (nodes, show = false) => {
      const rs = []
      nodes.forEach(e => {
        if (show) e.show = true
        e.show = props.filterMethod(e, props.filter)
        if (e.show) rs.push(e)
        if (e.children && e.children.length > 0) {
          if (e.show) onFilter(e.children, props.filter, true)
          else {
            const x = onFilter(e.children, props.filter)
            if (x.length) {
              e.show = true
              rs.push(e)
            }
          }
        }
      })
      return rs
    }
    // checkMove: _.debounce(function(e) {
    // console.log(e)
    // this.$nextTick(() => {
    // const related = relatedContext
    // const dragged = draggedContext
    // this.updateNodes(this.nodes, e.draggedContext.element).then((x) => {
    //   // console.log(draggedContext.element)
    //   emit('on-drag', { node: x, index: e.draggedContext.index })
    // })
    // console.log(related, dragged)
    // this.$nextTick(() => {
    //   const x = this.getParentDrag(this.nodes, element)
    //   console.log(x)
    // })
    // })
    // }, 1000),
    const onDragChanged = (e) => { // _.debounce(function(e) {
      setTimeout(() => {
        // console.log(e)
        if (e.removed) {
          updateNodes(props.nodes, e.removed.element).then((x) => {
            emit('on-drag-changed', e)
          })
          // console.log(e)
        } else if (e.added) {
          // updateNodes(props.nodes, e.added.element).then((x) => {
          //   emit('on-drag-changed', e)
          // })
          emit('on-drag-changed', e)
        } else if (e.moved) {
          updateNodes(props.nodes, e.moved.element).then((x) => {
            emit('on-drag-changed', e)
          })
        }
        // }, 500)
      }, 500)
    }

    // watch: {
    // nodes: {
    //   handler(val) {
    //     props.nodesClone = [...props.nodes]
    //     console.log(props.nodes === props.nodesClone)
    //     console.log(val)
    //   }
    // deep: true
    // immediate: true
    // },
    // },
    watch(() => filter, (state, prevState) => {
      if (typeof props.filterMethod === 'function') {
        onFilter(props.nodes)
      }
    })

    const slotContentAfter = computed(() => !!slots['content-after'])

    return {
      props,
      onClickNode, onMakeFolder, onAddRootNode, onAddChildNode, onTick, onExpand, getParent, onTickedChildren,
      onTickedParentAll, onTickedParent, getParentDrag, updateNodes, onFilter, onDragChanged,
      slotContentAfter
    }
  }
})
</script>

<style lang="scss">
$base-color: #9e9e9e;
.selected .node-label {
  color: #2196f3 !important;
}
.no-data-label {
  color: $base-color;
  font-size: 18px;
}
.tm-tree {
  position: relative;
  padding-left: 5px;
  width: fit-content;
  .tm-node {
    // .q-checkbox .q-checkbox__inner {
    //   width: 20px;
    //   min-width: 20px;
    //   height: 20px;
    //   padding: 0;
    //   .q-checkbox__bg {
    //     left: 1px;
    //     top: 1px;
    //     width: 18px;
    //     height: 18px;
    //   }
    // }
    // position: relative;
    .tm-node-child > .tm-node {
      position: relative;
      padding-left: 25px;
    }
    .tm-node-child .tm-node-content {
      position: relative;
    }
    .tm-node-child .tm-node-content::before {
      content: "";
      position: absolute;
      top: -8px;
      bottom: 45%;
      width: 30px;
      left: -16px;
      border-left: 1px solid $base-color;
      border-bottom: 1px solid $base-color;
    }
    .tm-node-child .tm-node-content.tm-node-expand::before {
      width: 15px;
    }
    // .tm-node-child .tm-node-content:last-child:before {
    //   border-left: none;
    //   border-bottom: none;
    // }
    .tm-node-child {
      .tm-node::after {
        content: "";
        position: absolute;
        top: 15px;
        bottom: 0;
        width: 2px;
        right: auto;
        left: 9px;
        border-left: 1px solid $base-color;
      }
      .tm-node:nth-last-of-type(1):after {
        border-left: none;
      }
    }
    // .tm-node-child .tm-node-content:nth-last-child(2):after {
    //   border-left: none;
    // }
  }
  .tm-node-child {
    padding: 3px 0px;
  }
}
</style>
