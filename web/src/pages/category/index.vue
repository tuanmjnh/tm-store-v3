<template>
  <div class="col-12 row">
    <div class="col-xs-12 col-sm-auto q-table__title text-h6">
      {{$t(`category.title${$route.meta.type}`)}}</div>
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

  <!-- <tm-tree :nodes="items" node-key="_id" node-label="label" :no-nodes-label="$t('table.noData')"
             v-model:selected="selected" v-model:ticked="ticked" v-model:expanded="expanded"
             tick-strategy="leaf-child" :draggable="true" :filter-method="onFilter"
             :filter="pagination.filter" @on-drag-changed="onTreeDragChanged">
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
                    class="q-pl-xs q-pr-xs" @click="onEdit(prop.node)" />
            <template v-if="isRoutes.trash">
              <q-icon v-if="prop.node.flag===1" name="clear" color="negative" size="16px"
                      class="q-pl-xs q-pr-xs" @click="onTrash(prop.node)" />
              <q-icon v-else name="restore" color="amber" size="16px" class="q-pl-xs q-pr-xs"
                      @click="onTrash(prop.node)" />
            </template>
          </template>
        </div>
      </template>
    </tm-tree> -->

  <q-tree :nodes="rows" v-model:selected="selected" v-model:ticked="ticked" v-model:expanded="expanded" node-key="_id"
          tick-strategy="leaf" :filter="pagination.filter" :filter-method="onFilter">
    <template v-slot:default-header="prop">
      <div class="row items-center" @mouseover="tooltipAction=prop.node._id" @mouseleave="tooltipAction=null">
        <q-icon :name="prop.node.icon||'share'" color="blue-grey" size="20px" class="q-mr-sm" />
        <div :class="['node-label q-pr-md']" :style="{color:prop.node.flag?(prop.node.color?prop.node.color:''):'#b0bec5'}">
          {{prop.node.label}}
        </div>
        <template v-if="prop.node._id===tooltipAction">
          <q-icon v-if="isRoutes.add" name="add" color="blue" size="16px" class="q-pl-xs q-pr-xs"
                  @click="onAdd(prop.node)" />
          <q-icon v-if="isRoutes.edit" name="edit" color="light-green" size="16px"
                  class="q-pl-xs q-pr-xs" @click="onEdit(prop.node)" />
          <template v-if="isRoutes.trash">
            <q-icon v-if="prop.node.flag===1" name="clear" color="negative" size="16px"
                    class="q-pl-xs q-pr-xs" @click="onTrash(prop.node)" />
            <q-icon v-else name="restore" color="amber" size="16px" class="q-pl-xs q-pr-xs"
                    @click="onTrash(prop.node)" />
          </template>
        </template>
      </div>
    </template>

    <!-- <template v-slot:default-body="prop">
        <div v-if="prop.node.story">
          <span class="text-weight-bold">This node has a story</span>: {{ prop.node.story }}
        </div>
        <span v-else class="text-weight-light text-black">This is some default content.</span>
      </template> -->
  </q-tree>
  <!-- Dialog add-->
  <q-dialog v-model="isDialogAdd" :maximized="isMaximizedView" persistent>
    <q-card flat :style="{minWidth:'60%'}">
      <tpl-add v-model:dialog="isDialogAdd" v-model:maximized="isMaximizedView" :expanded="expanded" />
    </q-card>
  </q-dialog>
</template>

<script>
import { defineComponent, defineAsyncComponent, ref, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { useQuasar } from 'quasar'
import { useI18n } from 'vue-i18n'
import { normalize } from '../../../../global/utils/search'
export default defineComponent({
  name: 'CategoryIndex',
  components: { tplAdd: defineAsyncComponent(() => import('./add')) },
  setup () {
    const $router = useRouter()
    const $route = useRoute()
    const $store = useStore()
    const $q = useQuasar()
    const { t } = useI18n({ useScope: 'global' })
    const isDialogAdd = ref(false)
    const isMaximizedView = ref(false)
    const rootItems = ref([])
    const selected = ref(null)
    const ticked = ref([])
    const expanded = ref([])
    const tooltipAction = ref('')
    const pagination = ref({
      filter: '',
      sortBy: 'orders',
      descending: false,
      page: 1,
      rowsPerPage: 10,
      rowsNumber: 1,
      // flag: 1,
      type: $route.meta.type
    })
    const isRoutes = ref({
      add: $router.hasRoute(`category-${$route.meta.type}-add`),
      edit: $router.hasRoute(`category-${$route.meta.type}-edit`),
      trash: $router.hasRoute(`category-${$route.meta.type}-trash`)
    })
    const rows = computed(() => $store.state.categories.items || [])
    // const positions = computed(() => $store.state.types.items.filter(x => x.key === 'position'))

    const onFetch = (props) => {
      const { page, rowsPerPage, sortBy, descending } = props.pagination
      $store.dispatch('categories/get', props.pagination).then(x => {
        pagination.value.rowsNumber = x.rowsNumber
        pagination.value.page = page
        pagination.value.rowsPerPage = rowsPerPage
        pagination.value.sortBy = sortBy
        pagination.value.descending = descending
      })
    }
    if ($store.state.auth.token) {
      onFetch({ pagination: pagination.value })
    }

    return {
      isDialogAdd, isMaximizedView, rows, rootItems, selected, ticked, expanded, tooltipAction, pagination, isRoutes,
      onFilter: (node, filter) => {
        const _filter = normalize(filter.toLowerCase())
        const title = normalize(node.title)
        return title && title.toLowerCase().indexOf(_filter) > -1
      },
      onChangeFlag: (val) => {
        if (val === pagination.value.flag) return
        selected.value = []
        pagination.value.flag = val
        onFetch({ pagination: pagination.value })
      },
      onAdd: (val) => {
        $store.dispatch('categories/set', { item: null, dependent: val ? val._id : null, type: $route.meta.type })
        isMaximizedView.value = false
        if ($q.platform.is.mobile || !$store.state.app.isDialog.add) $router.push('add')
        else isDialogAdd.value = true
      },
      onEdit: (val) => {
        $store.dispatch('categories/set', { item: val, dependent: val.dependent, type: $route.meta.type })
        isMaximizedView.value = false
        if ($q.platform.is.mobile || !$store.state.app.isDialog.edit) $router.push({ path: 'edit', query: { id: val._id } })
        else isDialogAdd.value = true
      },
      onTrash: (val) => {
        // $q.dialog({
        //   // dark: dark.value,
        //   title: t('messageBox.warning'),
        //   message: val.flag ? t('messageBox.trash') : t('messageBox.recover'),
        //   cancel: true,
        //   persistent: true
        // }).onOk(() => {
        //   if (val) selected.value = [val]
        //   api.lock({ _id: selected.value.map(x => x._id) }).then(x => {
        //     val.flag = val.flag === 1 ? 0 : 1
        //   }).finally(() => { selected.value = [] })
        // }).onOk(() => {
        //   // console.log('>>>> second OK catcher')
        // }).onCancel(() => {
        //   selected.value = []
        // }).onDismiss(() => {
        //   // console.log('I am triggered on both OK and Cancel')
        // })

        $q.dialog({
          title: t('messageBox.warning'),
          message: pagination.value.enable ? t('messageBox.lock') : t('messageBox.unlock'),
          cancel: true,
          ok: {
            label: t('global.accept'),
            flat: true,
            color: 'primary',
            noCaps: true
          },
          cancel: {
            label: t('global.cancel'),
            flat: true,
            color: 'blue-grey',
            noCaps: true
          }
        }).onOk(() => {
          if (val) selected.value = [val]
          $store.dispatch('categories/patch', { _id: selected.value.map(x => x._id) }).then(x => {
            selected.value = []
          })
        })
      },
      onDragTree: ({ node, index }) => {
        // $nextTick(() => {
        if (node.level.toString() === 'NaN') {
          onFetch({ pagination: pagination.value })
        } else {
          node.orders = index
          api.updateOrder(node).then((x) => {
            // console.log(index)
          })
        }
        // })
      },
      onTreeDragChanged: (e) => {
        if (e.added) return
        else if (e.removed) e = e.removed
        else if (e.moved) e = e.moved
        // console.log(e.element.dependent, e.element.level, e.element.orders)
        e.element.orders = e.newIndex
        api.updateOrder(e.element).then((x) => {
          // console.log(x)
        })
      }
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
