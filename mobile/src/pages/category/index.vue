<template>
  <q-card flat>
    <q-toolbar>
      <div v-if="$route.path!=='/news/category/view'&&$route.path!=='/product/category/view'" class="col-auto">
        <q-btn flat dense icon="arrow_back" v-close-popup />
      </div>
      <q-toolbar-title class="text-subtitle1">{{$t(`category.title${onGetType()}`)}}</q-toolbar-title>
      <q-btn v-if="isRoutes.add" icon="add" flat round dense color="blue" @click="onAdd" />
      <q-btn icon="filter_list" flat round dense color="teal">
        <q-tooltip v-if="!$q.platform.is.mobile">{{$t('global.filter')}}</q-tooltip>
        <q-menu v-model="isFilter" class="q-pa-md">
          <div class="row">
            <div class="col-12">
              <q-input v-model="pagination.filter" :dense="$store.getters.dense.input" debounce="500" :placeholder="$t('global.search')">
                <template v-slot:append>
                  <q-icon v-if="pagination.filter===''" name="search" />
                  <q-icon v-else name="clear" class="cursor-pointer" @click="pagination.filter=''" />
                </template>
              </q-input>
            </div>
          </div>
        </q-menu>
      </q-btn>
    </q-toolbar>
    <q-separator />
    <q-card-section class="q-pt-sm q-pl-md p-pr-md">
      <q-scroll-area style="height:calc(100vh - 180px)">
        <q-tree :nodes="rows" v-model:selected="selected" v-model:ticked="ticked" v-model:expanded="expanded" node-key="_id"
                tick-strategy="leaf" :filter="pagination.filter" :filter-method="onFilter">
          <template v-slot:default-header="prop">
            <div class="row items-center" @mouseover="tooltipAction=prop.node._id" @mouseleave="tooltipAction=null">
              <q-icon :name="prop.node.icon||'share'" color="blue-grey" size="20px" class="q-mr-sm" />
              <div :class="['node-label q-pr-md']" :style="{color:prop.node.flag?(prop.node.color?prop.node.color:''):'#b0bec5'}">
                {{prop.node.label}}
              </div>
              <div class="tooltip-action">
                <!-- v-if="prop.node._id===tooltipAction" -->
                <q-icon v-if="isRoutes.add" name="add" color="blue" size="16px" class="q-pl-xs q-pr-xs"
                        @click="onAdd(prop.node)" />
                <q-icon v-if="isRoutes.edit" name="edit" color="light-green" size="16px"
                        class="q-pl-xs q-pr-xs" @click="onEdit(prop.node)" />
                <q-icon v-if="isRoutes.trash&&prop.node.flag===1" name="clear" color="negative" size="16px"
                        class="q-pl-xs q-pr-xs" @click="onTrash(prop.node)" />
                <q-icon v-if="isRoutes.trash&&prop.node.flag!==1" name="restore" color="amber" size="16px" class="q-pl-xs q-pr-xs"
                        @click="onTrash(prop.node)" />
              </div>
            </div>
          </template>
        </q-tree>
      </q-scroll-area>
    </q-card-section>
  </q-card>
  <!-- Dialog add-->
  <q-dialog v-model="isDialogAdd" :maximized="isMaximized">
    <add-item />
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
  components: {
    addItem: defineAsyncComponent(() => import('./add'))
  },
  setup () {
    const $router = useRouter()
    const $route = useRoute()
    const $store = useStore()
    const $q = useQuasar()
    const { t } = useI18n({ useScope: 'global' })
    const onGetType = () => {
      if ($route.name === 'category-product-view' || $route.name === 'category-news-view')
        return $route.meta.type
      else return $store.getters.componentLoaded.meta.type
    }

    const isDialogAdd = ref(false)
    const isMaximized = ref(true)
    const isFilter = ref(false)
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
      type: onGetType()// $store.getters.componentLoaded.meta.type
    })
    const isRoutes = ref({
      add: $router.hasRoute(`category-${onGetType()}-add`),
      edit: $router.hasRoute(`category-${onGetType()}-edit`),
      trash: $router.hasRoute(`category-${onGetType()}-trash`)
    })
    const rows = computed(() => $store.state.categories.items || [])

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
      isDialogAdd, isMaximized, isFilter, rows, rootItems, selected, ticked, expanded, tooltipAction, pagination, isRoutes, onGetType,
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
        $store.dispatch('categories/set', { item: null, dependent: val ? val._id : null, type: onGetType() })
        isDialogAdd.value = true
      },
      onEdit: (val) => {
        $store.dispatch('categories/set', { item: val, dependent: val.dependent, type: onGetType() })
        isDialogAdd.value = true
      },
      onTrash: (val) => {
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
        if (node.level.toString() === 'NaN') {
          onFetch({ pagination: pagination.value })
        } else {
          node.orders = index
          api.updateOrder(node).then((x) => {
          })
        }
      },
      onTreeDragChanged: (e) => {
        if (e.added) return
        else if (e.removed) e = e.removed
        else if (e.moved) e = e.moved
        e.element.orders = e.newIndex
        api.updateOrder(e.element).then((x) => {
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
  right: 0;
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
