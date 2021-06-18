<template>
  <div>
    <div class="col-12 row">
      <div class="col-xs-12 col-sm-auto q-table__title text-h6">
        {{$t(`category.title_${$route.meta.type}`)}}</div>
    </div>
    <div class="col-12 row">
      <div class="col-1">
        <q-btn v-if="isRoutes.add" flat round dense icon="add" color="blue" @click="onAdd()">
          <q-tooltip v-if="!$q.platform.is.mobile">{{$t('global.add')}}</q-tooltip>
        </q-btn>
      </div>
      <q-space />
      <div class="col-xs-9 col-sm-5 col-md-4">
        <q-input v-model="pagination.filter" :dense="$store.getters.dense.input" debounce="500"
                 :placeholder="$t('global.search')">
          <template v-slot:append>
            <q-icon v-if="pagination.filter===''" name="search" />
            <q-icon v-else name="clear" class="cursor-pointer" @click="pagination.filter=''" />
          </template>
        </q-input>
      </div>
    </div>
    <!-- <q-tree ref="tree" class="col-12 col-sm-6" :nodes="items" :dense="$store.getters.dense.input" node-key="_id" :ticked.sync="ticked"
      :selected.sync="selected" :expanded.sync="expanded" tick-strategy="leaf" :filter="pagination.filter"
      :filter-method="onFilter" :no-nodes-label="$t('table.no_data')">
      <template v-slot:default-header="prop">
        <div class="row items-center" @mouseover="tooltipAction=prop.key" @mouseleave="tooltipAction=''">
          <q-icon :name="prop.node.icon" color="blue-grey" size="20px" class="q-mr-sm" />
          <div :class="['q-pr-md',prop.node.flag===1?'':'text-blue-grey-4']" :style="{color:prop.node.color}">
            {{ prop.node.meta && prop.node.meta.label ? $t(`category.${prop.node.meta.label}`) : prop.node.title }}
          </div>
          <template v-if="prop.key===tooltipAction">
            <q-icon v-if="isRoutes.add" name="add" color="blue" size="16px" class="q-pl-xs q-pr-xs"
              @click="onAdd(prop.node)" />
            <q-icon v-if="isRoutes.edit" name="edit" color="light-green" size="16px" class="q-pl-xs q-pr-xs"
              @click="onUpdate(prop.node)" />
            <template v-if="isRoutes.trash">
              <q-icon v-if="prop.node.flag===1" name="clear" color="negative" size="16px" class="q-pl-xs q-pr-xs"
                @click="onTrash(prop.node)" />
              <q-icon v-else name="restore" color="amber" size="16px" class="q-pl-xs q-pr-xs"
                @click="onTrash(prop.node)" />
            </template>
          </template>
        </div>
      </template>
    </q-tree>
    <q-separator></q-separator> -->
    <tm-tree :nodes="items" node-key="_id" node-label="label" :no-nodes-label="$t('table.noData')"
             v-model:selected="selected" v-model:ticked="ticked" v-model:expanded="expanded"
             tick-strategy="leaf-child" :draggable="true" :filter-method="onFilter"
             :filter="pagination.filter" @on-drag-changed="onTreeDragChanged">
      <!-- <template v-slot:content-after="prop">
        {{ prop.node.label }} a
      </template> -->
      <template v-slot:content-after="prop">
        <div class="row items-center" @mouseover="tooltipAction=prop.node._id"
             @mouseleave="tooltipAction=''">
          <q-icon :name="prop.node.icon" color="blue-grey" size="20px" class="q-mr-sm" />
          <div :class="['node-label q-pr-md',prop.node.flag===1?'':'text-blue-grey-4']"
               :style="{color:prop.node.color?prop.node.color:'#009688'}">
            {{ prop.node.label }}
          </div>
          <template v-if="prop.node._id===tooltipAction">
            <q-icon v-if="isRoutes.add" name="add" color="blue" size="16px" class="q-pl-xs q-pr-xs"
                    @click="onAdd(prop.node)" />
            <q-icon v-if="isRoutes.edit" name="edit" color="light-green" size="16px"
                    class="q-pl-xs q-pr-xs" @click="onUpdate(prop.node)" />
            <template v-if="isRoutes.trash">
              <q-icon v-if="prop.node.flag===1" name="clear" color="negative" size="16px"
                      class="q-pl-xs q-pr-xs" @click="onTrash(prop.node)" />
              <q-icon v-else name="restore" color="amber" size="16px" class="q-pl-xs q-pr-xs"
                      @click="onTrash(prop.node)" />
            </template>
          </template>
        </div>
      </template>
    </tm-tree>
    <!-- <div class="row">selected: {{selected}}</div>
    <div class="row">ticked: {{ticked}}</div>
    <div class="row">expanded: {{expanded}}</div> -->
    <!-- Add dialog -->
    <q-dialog v-model="dialogAdd" :maximized="maximizedView" persistent>
      <q-card flat :style="{minWidth:'60%'}">
        <tpl-add v-model:dialog="dialogAdd" v-model:maximized="maximizedView" v-model:item="item"
                 v-model:items="items" :dependent="dependent" :positions="positions" :expanded="expanded" />
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import { defineComponent, defineAsyncComponent, ref, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
// import * as api from '@/api/categories'
// import * as apiTypes from '@/api/types'
import * as treeRouters from '@/utils/tree'
import normalize from '@/utils/search'
export default defineComponent({
  name: 'CategoryIndex',
  components: {
    tplAdd: defineAsyncComponent(() => import('./add')),
    tmTree: defineAsyncComponent(() => import('components/tm-tree'))
  },
  setup () {
    const $router = useRouter()
    const $route = useRoute()
    const { $t } = useI18n({ useScope: 'global' })
    const dialogAdd = ref(false)
    const maximizedView = ref(false)
    const items = ref([])
    const rootItems = ref([])
    const item = ref(null)
    const dependent = ref(null)
    const selected = ref(null)
    const ticked = ref([])
    const expanded = ref([])
    const positions = ref([])
    const filter = ref('')
    const tooltipAction = ref('')
    const pagination = ref({
      filter: '',
      sortBy: 'orders',
      descending: false,
      page: 1,
      rowsPerPage: 10,
      rowsNumber: 1,
      flag: 1,
      type: $route.meta.type
    })
    const isRoutes = ref({
      add: $router.hasRoute(`category-${$route.meta.type}-add`),
      edit: $router.hasRoute(`category-${$route.meta.type}-edit`),
      trash: $router.hasRoute(`category-${$route.meta.type}-trash`)
    })

    const onGetPosition = (props) => {
      apiTypes.select(props).then((x) => {
        if (x && x.data && x.data.length > 0) positions.value = x.data.map(x => ({ label: $t(`position.${x.code}`), value: x.code }))
      })
    }
    const onSelect = (props) => {
      api.select(props.pagination).then((x) => {
        rootItems.value = x.data
        items.value = treeRouters.generateCategory(x.data)
        // console.log(items.value)
      })
    }
    const onFilter = (node, filter) => {
      const filt = normalize(filter.toLowerCase())
      const title = normalize(node.title)
      return title && title.toLowerCase().indexOf(filt) > -1
    }
    const onResetFilter = () => {
      filter.value = ''
      // this.$refs.filter.focus()
    }
    const onChangeFlag = (flag) => {
      if (flag === pagination.value.flag) return
      selected.value = []
      pagination.value.flag = flag
      onSelect({ pagination: pagination.value })
    }
    const onAdd = (item) => {
      // if ($q.platform.is.mobile) {
      //   $router.push('add')
      // } else {
      dialogAdd.value = true
      if (item) dependent.value = item
      // }
    }
    const onUpdate = (item) => {
      dialogAdd.value = true
      dependent.value = rootItems.value.find(x => x._id === item.dependent)
      item.value = item
    }
    const onTrash = (item) => {
      $q.dialog({
        // dark: dark.value,
        title: $t('messageBox.warning'),
        message: item.flag ? $t('messageBox.trash') : $t('messageBox.recover'),
        cancel: true,
        persistent: true
      }).onOk(() => {
        if (item) selected.value = [item]
        api.lock({ _id: selected.value.map(x => x._id) }).then(x => {
          item.flag = item.flag === 1 ? 0 : 1
          // x.success.forEach(e => {
          //   e.flag = e.flag === 1 ? 0 : 1
          //   // const index = items.value.findIndex(x => x._id === e)
          //   // items.value.splice(index, 1)
          // })
        }).finally(() => { selected.value = [] })
      }).onOk(() => {
        // console.log('>>>> second OK catcher')
      }).onCancel(() => {
        selected.value = []
      }).onDismiss(() => {
        // console.log('I am triggered on both OK and Cancel')
      })
    }
    const onDragTree = ({ node, index }) => {
      // $nextTick(() => {
      if (node.level.toString() === 'NaN') {
        onSelect({ pagination: pagination.value })
      } else {
        node.orders = index
        api.updateOrder(node).then((x) => {
          // console.log(index)
        })
      }
      // })
    }
    const onTreeDragChanged = (e) => {
      if (e.added) return
      else if (e.removed) e = e.removed
      else if (e.moved) e = e.moved
      // console.log(e.element.dependent, e.element.level, e.element.orders)
      e.element.orders = e.newIndex
      api.updateOrder(e.element).then((x) => {
        // console.log(x)
      })
    }

    onMounted(() => {
      onSelect({ pagination: pagination.value })
      onGetPosition({ key: 'position' })
    })
    watch(() => dialogAdd, (val) => {
      if (!val) {
        item.value = null
        dependent.value = null
      }
    })
    // watch: {
    // pagination: {
    //   handler(val) {
    //     onSelect({ pagination: pagination.value })
    //   },
    //   deep: true,
    //   immediate: true
    // }
    // },

    return {
      dialogAdd, maximizedView, items, rootItems, item, dependent, selected, ticked, expanded, positions, filter, tooltipAction, pagination, isRoutes,
      onGetPosition, onSelect, onFilter, onResetFilter, onChangeFlag, onAdd, onUpdate, onTrash, onDragTree, onTreeDragChanged
    }
  }
})
</script>

<style lang="scss" scope>
.selected .node-label {
  color: #2196f3 !important;
}
.tooltip-action {
  position: absolute;
  .q-btn__content {
    i {
      font-size: 16px !important;
    }
  }
  &.add {
    right: -23px;
  }
  &.edit {
    right: -43px;
  }
  &.delete {
    right: -63px;
  }
}
.q-tree__node--selected .q-tree__node-header-content {
  color: initial;
}
.delete {
  color: #9e9e9e;
}
</style>
