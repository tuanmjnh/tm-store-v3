<template>
  <div>
    <q-table :rows="rows" :columns="columns" row-key="_id" flat :visible-columns="visibleColumns"
             :loading="$store.state.app.loading.get||$store.state.app.loading.patch" v-model:selected="selected"
             :dense="$store.getters.dense.table" selection="multiple" :no-data-label="$t('table.noData')"
             :rows-per-page-label="$t('table.rowPerPage')"
             :selected-rows-label="()=>`${selected.length} ${$t('table.rowSelected')}`"
             :rows-per-page-options="$store.state.app.rowsPerPageOptions" v-model:pagination="pagination"
             @request="onSelect" :filter="pagination.filter" binary-state-sort>
      <template v-slot:top="props">
        <div class="col-12 row">
          <div class="col-xs-12 col-sm-auto q-table__title text-h6">{{$t('roles.list')}}</div>
          <q-space />
          <div class="col-xs-12 col-sm-auto self-center text-right">
            <q-btn v-if="isRoutes.add" flat round dense icon="add" color="blue"
                   @click="onAdd">
              <q-tooltip v-if="!$q.platform.is.mobile">{{$t('global.add')}}</q-tooltip>
            </q-btn>
            <q-btn v-if="isRoutes.trash&&selected.length>0&&pagination.flag" flat round dense
                   color="negative" icon="delete" @click="onTrash()">
              <q-tooltip v-if="!$q.platform.is.mobile">{{$t('global.delete')}}</q-tooltip>
            </q-btn>
            <q-btn v-if="isRoutes.trash&&selected.length>0&&!pagination.flag" flat round dense
                   color="warning" icon="restore_page" @click="onTrash()">
              <q-tooltip v-if="!$q.platform.is.mobile">{{$t('global.recover')}}</q-tooltip>
            </q-btn>
            <q-btn flat round dense :color="$store.state.app.darkMode?'':'grey-7'" icon="menu_open">
              <q-tooltip v-if="!$q.platform.is.mobile">{{$t('table.displayColumns')}}</q-tooltip>
              <q-menu fit>
                <q-list dense style="min-width:100px">
                  <template v-for="(item,index) in columns">
                    <q-item clickable :key="index" v-if="!item.required"
                            @click="onColumns(item.name)"
                            :active="visibleColumns.indexOf(item.name)>-1||false">
                      <q-item-section>{{$t(item.label)}}</q-item-section>
                    </q-item>
                  </template>
                </q-list>
              </q-menu>
            </q-btn>
            <q-btn flat round dense :color="$store.state.app.darkMode?'':'grey-7'"
                   :icon="props.inFullscreen ? 'fullscreen_exit' : 'fullscreen'"
                   @click="props.toggleFullscreen">
              <q-tooltip v-if="!$q.platform.is.mobile">
                {{props.inFullscreen?$t('global.normalScreen'):$t('global.fullScreen')}}</q-tooltip>
            </q-btn>
            <q-btn v-if="isRoutes.trash" flat round dense
                   :color="$store.state.app.darkMode?'':'grey-7'" icon="more_vert">
              <q-tooltip v-if="!$q.platform.is.mobile">{{$t('table.action')}}</q-tooltip>
              <q-menu auto-close>
                <q-list dense bordered>
                  <q-item clickable>
                    <q-item-section no-wrap @click="onChangeFlag(1)">{{$t('global.working')}}
                    </q-item-section>
                  </q-item>
                  <q-item clickable>
                    <q-item-section no-wrap @click="onChangeFlag(0)">{{$t('global.trash')}}
                    </q-item-section>
                  </q-item>
                </q-list>
              </q-menu>
            </q-btn>
          </div>
        </div>
        <div class="col-12 row">
          <q-space />
          <div class="col-xs-12 col-sm-5 col-md-4">
            <q-input v-model="pagination.filter" :dense="$store.getters.dense.input" debounce="500"
                     :placeholder="$t('global.search')">
              <template v-slot:append>
                <q-icon v-if="pagination.filter===''" name="search" />
                <q-icon v-else name="clear" class="cursor-pointer" @click="pagination.filter=''" />
              </template>
            </q-input>
          </div>
        </div>
      </template>
      <template v-slot:header="props">
        <q-tr :props="props">
          <q-th auto-width>
            <q-checkbox v-if="props.multipleSelect" v-model="props.selected"
                        indeterminate-value="some" :dense="$store.getters.dense.table" />
          </q-th>
          <q-th v-for="col in props.cols" :key="col.name" :props="props">
            <span v-if="$store.state.app.darkMode" class="text-bold">{{ $t(col.label) }}</span>
            <span v-else class="text-bold text-blue-grey-10">{{ $t(col.label) }}</span>
          </q-th>
          <q-th v-if="isRoutes.edit||isRoutes.trash" auto-width>#</q-th>
        </q-tr>
      </template>
      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td auto-width>
            <q-checkbox v-model="props.selected" color="primary"
                        :dense="$store.getters.dense.table" />
          </q-td>
          <q-td key="name" :props="props">
            <q-badge class="bri" :style="{backgroundColor:props.row.color}">
              {{ props.row.name }}
            </q-badge>
          </q-td>
          <q-td key="key" :props="props">
            {{ props.row.key }}
          </q-td>
          <q-td key="level" :props="props">
            {{ props.row.level }}
          </q-td>
          <q-td v-if="isRoutes.edit||isRoutes.trash" auto-width class="text-center">
            <q-btn v-if="isRoutes.edit" flat round dense icon="edit" color="light-green"
                   :size="$store.getters.dense.table?'sm':'md'" @click="onUpdate(props.row)">
              <q-tooltip v-if="!$q.platform.is.mobile">
                {{$t('global.update')}}</q-tooltip>
            </q-btn>
            <template v-if="isRoutes.trash">
              <q-btn v-if="pagination.flag" flat round dense color="negative" icon="clear"
                     :size="$store.getters.dense.table?'sm':'md'" @click="onTrash(props.row)">
                <q-tooltip v-if="!$q.platform.is.mobile">{{$t('global.trash')}}</q-tooltip>
              </q-btn>
              <q-btn v-else flat round dense color="amber" icon="restore"
                     :size="$store.getters.dense.table?'sm':'md'" @click="onTrash(props.row)">
                <q-tooltip v-if="!$q.platform.is.mobile">{{$t('global.recover')}}</q-tooltip>
              </q-btn>
            </template>
          </q-td>
        </q-tr>
      </template>
    </q-table>
    <!-- Add dialog -->
    <q-dialog v-model="isDialogAdd" :maximized="isMaximizedView" persistent>
      <q-card flat :style="{minWidth:'60%'}">
        <tpl-add v-model:dialog="isDialogAdd" v-model:maximized="isMaximizedView" v-model:item="item" />
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import { defineComponent, defineAsyncComponent, ref, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { useI18n } from 'vue-i18n'
import * as apiRoles from '@/api/roles'
// import * as apiRoutes from '@/api/routes'
// import * as treeRouters from '@/utils/tree'
// import { dynamic } from '@/router/routes'
export default defineComponent({
  name: 'RolesIndex',
  components: { tplAdd: defineAsyncComponent(() => import('./add')) },
  setup () {
    const $router = useRouter()
    const $q = useQuasar()
    const { t } = useI18n({ useScope: 'global' })
    const dialogFilter = ref(false)
    const isDialogAdd = ref(false)
    const isMaximizedView = ref(false)
    const rows = ref([])
    const selected = ref([])
    const item = ref(null)
    // const routes = ref([])
    // const rootRoutes = ref([])
    const isRoutes = ref({
      add: $router.hasRoute('manager-roles-add'),
      edit: $router.hasRoute('manager-roles-edit'),
      trash: $router.hasRoute('manager-roles-trash')
    })
    const pagination = ref({
      filter: '',
      sortBy: 'level',
      descending: false,
      page: 1,
      rowsPerPage: 10,
      rowsNumber: 1,
      flag: 1
    })
    const visibleColumns = ref(['level'])
    const columns = ref([
      { name: 'name', field: 'name', label: 'roles.name', align: 'left', sortable: true, required: true }, // row => $t(`roles.${row.name}`)
      { name: 'key', field: 'key', label: 'roles.key', align: 'left', sortable: true, required: true },
      { name: 'level', field: 'level', label: 'global.level', align: 'right', sortable: true }
    ])

    const onSelect = (props) => {
      const { page, rowsPerPage, sortBy, descending } = props.pagination
      apiRoles.select(props.pagination).then((x) => {
        rows.value = x.data
        // don't forget to update local pagination object
        pagination.value.rowsNumber = x.rowsNumber
        pagination.value.page = page
        pagination.value.rowsPerPage = rowsPerPage
        pagination.value.sortBy = sortBy
        pagination.value.descending = descending
      })
    }
    // const onSelectRoutes=(props)=> {
    //   apiRoutes.select(props).then(async x => {
    //     if (x && x.data && x.data.length > 0) {
    //       rootRoutes.value = x.data
    //       routes.value = await treeRouters.generateRoutes(x.data)
    //       console.log(routes.value)
    //     }
    //   })
    // }
    const onChangeFlag = (flag) => {
      if (flag === pagination.value.flag) return
      selected.value = []
      pagination.value.flag = flag
      onSelect({ pagination: pagination.value })
    }
    const onColumns = (value) => {
      var index = visibleColumns.value.indexOf(value)
      if (index < 0) visibleColumns.value.push(value)
      else visibleColumns.value.splice(index, 1)
    }
    const onAdd = () => {
      if ($q.platform.is.mobile) $router.push('add')
      else isDialogAdd.value = true
    }
    const onUpdate = (val) => {
      if ($q.platform.is.mobile) $router.push({ path: 'edit', query: { id: val._id } })
      else {
        item.value = val
        isDialogAdd.value = true
      }
    }
    const onTrash = (val) => {
      $q.dialog({
        // dark: dark.value,
        title: t('messageBox.warning'),
        message: pagination.value.flag ? t('messageBox.trash') : t('messageBox.recover'),
        cancel: true,
        persistent: true
      }).onOk(() => {
        if (val) selected.value = [val]
        apiRoles.lock({ _id: selected.value.map(x => x._id) }).then((x) => {
          x.success.forEach(e => {
            const index = rows.value.findIndex(x => x._id === e)
            rows.value.splice(index, 1)
          })
        }).finally(() => {
          selected.value = []
        })
      }).onOk(() => {
        // console.log('>>>> second OK catcher')
      }).onCancel(() => {
        selected.value = []
      }).onDismiss(() => {
        // console.log('I am triggered on both OK and Cancel')
      })
    }

    // routes.value = treeRouters.generateRoutesRoles(dynamic)
    onSelect({ pagination: pagination.value })
    // onSelectRoutes({ flag: 1 })

    watch(() => isDialogAdd, (state, prevState) => {
      if (!state.value) {
        if (item.value.m) {
          if (item.value.m === 1) {
            rows.value.push(item.value.data)
          } else {
            const i = rows.value.findIndex((x) => x._id === item.value.data._id)
            if (i > -1) rows.value.splice(i, 1, item.value.data)
          }
          item.value = null
        }
      }
    }, { deep: true })

    return {
      isDialogAdd, isMaximizedView, rows, selected, item, isRoutes, pagination, visibleColumns, columns,
      onSelect, onChangeFlag, onColumns, onAdd, onUpdate, onTrash
    }
  }
})
</script>

<style>
</style>
