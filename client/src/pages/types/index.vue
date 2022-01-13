<template>
  <div>
    <q-table :rows="rows" :columns="columns" row-key="_id" flat :visible-columns="visibleColumns"
             :loading="$store.state.app.loading.get||$store.state.app.loading.patch" v-model:selected="selected"
             :dense="$store.getters.dense.table" selection="multiple" :no-data-label="$t('table.noData')"
             :rows-per-page-label="$t('table.rowPerPage')"
             :selected-rows-label="()=>`${selected.length} ${$t('table.rowSelected')}`"
             :rows-per-page-options="$store.state.app.rowsPerPageOptions" :pagination="pagination"
             :filter="pagination.filter">
      <template v-slot:top="props">
        <div class="col-12 row">
          <div class="col-xs-12 col-sm-auto q-table__title text-h6">{{$t('types.titleList')}}</div>
          <q-space />
          <div class="col-xs-12 col-sm-auto self-center text-right">
            <q-btn v-if="isRoutes.add" flat round dense icon="add" color="blue" @click="onAdd">
              <q-tooltip v-if="!$q.platform.is.mobile">{{$t('global.add')}}</q-tooltip>
            </q-btn>
            <q-btn v-if="isRoutes.trash&&selected.length>0&&pagination.flag" flat round dense color="negative" icon="delete" @click="onTrash()">
              <q-tooltip v-if="!$q.platform.is.mobile">{{$t('global.delete')}}</q-tooltip>
            </q-btn>
            <q-btn v-if="isRoutes.trash&&selected.length>0&&!pagination.flag" flat round dense color="warning" icon="restore_page" @click="onTrash()">
              <q-tooltip v-if="!$q.platform.is.mobile">{{$t('global.recover')}}</q-tooltip>
            </q-btn>
            <q-btn flat round dense :color="$store.state.app.darkMode?'':'grey-7'" icon="menu_open">
              <q-tooltip v-if="!$q.platform.is.mobile">{{$t('table.displayColumns')}}</q-tooltip>
              <q-menu fit>
                <q-list dense style="min-width:100px">
                  <template v-for="(item,i) in columns">
                    <q-item clickable :key="i" v-if="!item.required" @click="onColumns(item.name)"
                            :active="visibleColumns.indexOf(item.name)>-1||false">
                      <q-item-section>{{$t(item.label)}}</q-item-section>
                    </q-item>
                  </template>
                </q-list>
              </q-menu>
            </q-btn>
            <q-btn flat round dense :color="$store.state.app.darkMode?'':'grey-7'" :icon="props.inFullscreen?'fullscreen_exit':'fullscreen'"
                   @click="props.toggleFullscreen">
              <q-tooltip v-if="!$q.platform.is.mobile">{{props.inFullscreen?$t('global.normalScreen'):$t('global.fullScreen')}}</q-tooltip>
            </q-btn>
            <q-btn v-if="isRoutes.trash" flat round dense :color="$store.state.app.darkMode?'':'grey-7'" icon="more_vert">
              <q-tooltip v-if="!$q.platform.is.mobile">{{$t('table.action')}}</q-tooltip>
              <q-menu auto-close>
                <q-list dense bordered>
                  <q-item clickable>
                    <q-item-section no-wrap @click="pagination.flag=1">{{$t('global.working')}}</q-item-section>
                  </q-item>
                  <q-item clickable>
                    <q-item-section no-wrap @click="pagination.flag=0">{{$t('global.trash')}}</q-item-section>
                  </q-item>
                </q-list>
              </q-menu>
            </q-btn>
          </div>
        </div>
        <div class="col-12 row">
          <div class="col-xs-12 col-sm-5 col-md-4">
            <q-select v-model="pagination.key" :options="$store.state.types.keys" dense options-dense :label="$t('global.types')">
              <template v-slot:selected>
                <div v-html="$t(`types.${pagination.key}`)"></div>
              </template>
              <template v-slot:option="scope">
                <q-item v-bind="scope.itemProps">
                  <q-item-section>
                    <q-item-label v-html="$t(`types.${scope.opt}`)" />
                  </q-item-section>
                </q-item>
              </template>
            </q-select>
          </div>
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
            <q-checkbox v-model="props.selected" indeterminate-value="some" :dense="$store.getters.dense.table" />
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
            {{ props.row.name }}
          </q-td>
          <q-td key="code" :props="props">
            {{ props.row.code }}
          </q-td>
          <!-- <q-td key="key" :props="props">
            {{ props.row.key }}
          </q-td> -->
          <q-td key="orders" :props="props">
            {{ props.row.orders }}
          </q-td>
          <q-td v-if="isRoutes.edit||isRoutes.trash" auto-width class="text-center">
            <!-- <router-link :to="`edit?id=${props.row._id}`">edit</router-link> -->
            <q-btn v-if="isRoutes.edit" flat round dense icon="edit" color="light-green"
                   :size="$store.getters.dense.table?'sm':'md'" @click="onEdit(props.row)">
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
        <tpl-add v-model:dialog="isDialogAdd" v-model:maximized="isMaximizedView" />
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import { defineComponent, defineAsyncComponent, ref, computed } from 'vue';
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { useQuasar } from 'quasar'
import { useI18n } from 'vue-i18n'

export default defineComponent({
  name: 'TypesIndex',
  components: { tplAdd: defineAsyncComponent(() => import('./add')) },
  setup () {
    const $router = useRouter()
    const $store = useStore()
    const $q = useQuasar()
    const { t } = useI18n({ useScope: 'global' })
    const isDialogAdd = ref(false)
    const isMaximizedView = ref(false)
    const selected = ref([])
    const isRoutes = ref({
      add: $router.hasRoute('manager-types-add'),
      edit: $router.hasRoute('manager-types-edit'),
      trash: $router.hasRoute('manager-types-trash')
    })
    const pagination = ref({
      filter: '',
      key: 'category',
      sortBy: 'orders',
      descending: false,
      page: 1,
      rowsPerPage: 10,
      // rowsNumber: 1,
      flag: 1
    })
    const visibleColumns = ref(['level'])
    const columns = ref([
      { name: 'name', field: 'name', label: 'global.name', align: 'left', sortable: true, required: true }, // row => $t(`roles.${row.name}`)
      { name: 'code', field: 'key', label: 'global.code', align: 'left', sortable: true, required: true },
      // { name: 'key', field: 'key', label: 'global.types', align: 'left', sortable: true, required: true },
      { name: 'orders', field: 'orders', label: 'global.order', align: 'right', sortable: true }
    ])

    const onFetch = () => {
      selected.value = []
      return $store.state.types.items.filter(x => x.key == pagination.value.key && x.flag == pagination.value.flag)
    }

    // computed
    const rows = computed(() => onFetch())

    // return
    return {
      isDialogAdd, isMaximizedView, rows, selected, isRoutes, pagination, visibleColumns, columns,
      onColumns: (val) => {
        var i = visibleColumns.value.indexOf(val)
        if (i < 0) visibleColumns.value.push(val)
        else visibleColumns.value.splice(i, 1)
      },
      onAdd: () => {
        $store.dispatch('types/set')
        isMaximizedView.value = false
        if ($q.platform.is.mobile || !$store.state.app.isDialog.add) $router.push('add')
        else isDialogAdd.value = true
      },
      onEdit: (val) => {
        $store.dispatch('types/set', val)
        isMaximizedView.value = false
        if ($q.platform.is.mobile || !$store.state.app.isDialog.edit) $router.push({ path: 'edit', query: { id: val._id } })
        else isDialogAdd.value = true
      },
      onTrash: (val) => {
        $q.dialog({
          // dark: dark.value,
          title: t('messageBox.warning'),
          message: pagination.value.flag ? t('messageBox.trash') : t('messageBox.recover'),
          cancel: true,
          persistent: true
        }).onOk(() => {
          if (val) selected.value = [val]
          $store.dispatch('types/patch', { _id: selected.value.map(x => x._id) })
        }).onOk(() => {
          // console.log('>>>> second OK catcher')
        }).onCancel(() => {
          selected.value = []
        }).onDismiss(() => {
          // console.log('I am triggered on both OK and Cancel')
        })
      }
    }
  }
})
</script>

<style>
</style>
