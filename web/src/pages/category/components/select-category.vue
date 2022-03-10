<template>
  <div class="dialog-categories">
    <q-input :modelValue="selectedLocal?selectedLocal.label:''" :dense="dense" :readonly="true" :label="labelTitle" :rules="rules">
      <template v-slot:after>
        <q-btn round dense flat icon="pageview" @click="isDialog=!isDialog">
          <q-tooltip>{{labelSelect}}</q-tooltip>
        </q-btn>
      </template>
    </q-input>
    <q-dialog v-model="isDialog">
      <q-card style="width:500px">
        <q-toolbar>
          <q-toolbar-title>{{labelTitle}}</q-toolbar-title>
          <q-btn flat round dense icon="close" v-close-popup>
            <q-tooltip>{{labelClose}}</q-tooltip>
          </q-btn>
        </q-toolbar>
        <q-separator />
        <q-scroll-area style="height:calc(100vh - 180px)">
          <q-card-section>
            <!-- <tm-tree :nodes="categoriesLocal" node-key="_id" node-label="label"
                     :no-nodes-label="$t('table.noData')" :expanded-all="true"
                     :selected="selectedLocal" @on-selected="onSelected">
              <template v-slot:content-after="prop">
                <div class="row items-center">
                  <q-icon :name="prop.node.icon" color="blue-grey" size="20px" class="q-mr-sm" />
                  <div :class="['node-label q-pr-md',prop.node.flag===1?'':'text-blue-grey-4']"
                       :style="{color:prop.node.color?prop.node.color:'#009688'}">
                    {{prop.node.label}}
                  </div>
                </div>
              </template>
            </tm-tree> -->

            <q-tree :nodes="categoriesLocal" v-model:selected="selectedTree" :node-key="optionValue" :default-expand-all="defaultExpandAll"
                    v-model:expanded="expandedLocal" :no-nodes-label="$t('table.noData')" :no-results-label="$t('table.noData')">
              <template v-slot:default-header="prop">
                <div class="row items-center" @click="onSelected(prop.node)" clickable v-close-popup>
                  <q-icon :name="prop.node.icon||'share'" color="blue-grey" size="20px" class="q-mr-sm" />
                  <div :class="['node-label q-pr-md']" :style="onStyleSelected(prop.node)">
                    {{prop.node[optionLabel]}}
                    <!-- :style="{color:selectedTree===prop.node[optionValue]?'#2196f3':(prop.node.color?prop.node.color:'#607d8b')}"> -->
                  </div>
                </div>
              </template>
            </q-tree>
          </q-card-section>
        </q-scroll-area>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import { defineComponent, ref, watch } from 'vue';
import { getParent, findNode } from '../../../../../global/utils/tree';
export default defineComponent({
  name: 'CategorySelectComponent',
  // components: { tmTree: defineAsyncComponent(() => import('components/tm-tree')) },
  props: {
    modelValue: { default: undefined },
    categories: { type: Array, default: null },
    parents: { type: Array, default: null },
    optionValue: { type: String, default: 'id' },
    optionLabel: { type: String, default: 'label' },
    dataAll: { type: Boolean, default: false },
    // dialog: { type: Boolean, default: true },
    dense: { type: Boolean, default: true },
    defaultExpandAll: { type: Boolean, default: false },
    expanded: { type: Array, default: null },
    labelTitle: { type: String, default: 'Category of product' },
    labelSelect: { type: String, default: 'Select category' },
    labelAll: { type: String, default: '-- Select all --' },
    labelClose: { type: String, default: 'Close' },
    rules: { default: null }
  },
  setup (props, { emit }) {
    const isDialog = ref(false)
    const selectedLocal = ref(null)
    const selectedTree = ref(null)
    const categoriesLocal = ref([])
    const expandedLocal = ref([])
    // onMounted(() => {
    //   const all = [{ _id: null, dependent: null, icon: 'graphic_eq', color: '#3f51b5', flag: 1, label: props.labelAll }]
    //   categoriesLocal.value = props.dataAll ? [...all, ...generateCategory(props.categories)] : generateCategory(props.categories)
    //   console.log(props.categories)
    //   console.log(categoriesLocal)
    // })
    // const categoriesLocal = computed(() => {
    //   const all = [{ _id: null, dependent: null, icon: 'graphic_eq', color: '#3f51b5', flag: 1, label: props.labelAll }]
    //   const rs = props.dataAll ? [...all, ...$store.state.categories.items] : $store.state.categories.items
    //   return rs
    // })
    watch(() => props.categories, (state, prevState) => {
      const all = [{ _id: null, dependent: null, icon: 'graphic_eq', color: '#607d8b', flag: 1, label: props.labelAll }]
      categoriesLocal.value = props.dataAll ? [...all, ...state] : state
      // if (!props.selected) selectedLocal.value = categoriesLocal.value[0]
      // else {
      const item = findNode(props.categories, props.modelValue, props.optionValue)
      // const item = props.categories.find(x => x[props.optionValue] === props.modelValue)
      if (props.dataAll) selectedLocal.value = item ? item : all[0]
      else selectedLocal.value = item
      selectedTree.value = item ? item[props.optionValue] : null
      if (props.expanded) expandedLocal.value = props.expanded
      // }
    }, { deep: true, immediate: true })

    // watch(() => props.modelValue, (state, prevState) => {
    //   console.log(state)
    // }, { deep: true, immediate: true })

    return {
      isDialog, categoriesLocal, selectedLocal, selectedTree, expandedLocal,
      // categories: [],
      onSelected: (val) => {
        // if (!props.selected) props.selected = value
        const parents = getParent(categoriesLocal.value, val, props.optionValue)
        expandedLocal.value = parents.map(x => x._id)
        if (val) selectedLocal.value = val
        if (props.modelValue !== val[props.optionValue]) {
          emit('update:modelValue', val[props.optionValue])
          emit('update:parents', parents)
          emit('on-selected', val)
        }
        isDialog.value = false
      },
      onStyleSelected (node) {
        if (selectedTree.value === node[props.optionValue]) {
          return {
            color: '#2196f3',
            // boxShadow: '0 3px 5px -1px #0003, 0 6px 10px #00000024, 0 1px 18px #0000001f'
            fontWeight: 600
          }
        } else {
          return {
            color: node.color ? node.color : '#607d8b'
          }
        }
      }
    }
  }
})
</script>

<style>
</style>
