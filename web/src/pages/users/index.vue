<template>
  <div>
    <q-table :rows="rows" :columns="columns" row-key="_id" flat :visible-columns="visibleColumns"
             :loading="$store.state.app.loading.get||$store.state.app.loading.patch" v-model:selected="selected"
             :dense="$store.getters.dense.table" selection="multiple" :no-data-label="$t('table.noData')"
             :rows-per-page-label="$t('table.rowPerPage')" :selected-rows-label="()=>`${selected.length} ${$t('table.rowSelected')}`"
             :rows-per-page-options="$store.state.app.rowsPerPageOptions" v-model:pagination="pagination" @request="onFetch"
             :filter="pagination.filter" binary-state-sort>
      <template v-slot:top="props">
        <div class="col-12 row">
          <div class="col-xs-12 col-sm-auto q-table__title text-h6">{{$t("users.titleList")}}</div>
          <q-space />
          <div class="col-xs-12 col-sm-auto self-center text-right">
            <div class="col-auto self-center">
              <q-btn v-if="isRoutes.add" flat round dense icon="add" color="blue" @click="onAdd">
                <q-tooltip v-if="!$q.platform.is.mobile">{{$t("global.add")}}</q-tooltip>
              </q-btn>
              <q-btn v-if="isRoutes.add" flat round dense icon="cloud_upload" color="indigo" @click="onImport">
                <q-tooltip v-if="!$q.platform.is.mobile">{{$t("files.openFile")}}</q-tooltip>
              </q-btn>
              <q-btn v-if="isRoutes.trash && selected.length > 0 && pagination.enable" flat round
                     dense color="negative" icon="delete" @click="onTrash()">
                <q-tooltip v-if="!$q.platform.is.mobile">{{$t("global.delete")}}</q-tooltip>
              </q-btn>
              <q-btn v-if="isRoutes.trash && selected.length > 0 && !pagination.enable" flat round
                     dense color="warning" icon="restore_page" @click="onTrash()">
                <q-tooltip v-if="!$q.platform.is.mobile">{{$t("global.recover")}}</q-tooltip>
              </q-btn>
              <q-btn flat round dense :color="$store.getters.darkMode ? '' : 'grey-7'"
                     icon="menu_open">
                <q-tooltip v-if="!$q.platform.is.mobile">{{ $t("table.displayColumns")}}
                </q-tooltip>
                <q-menu fit>
                  <q-list dense style="min-width:100px">
                    <template v-for="(item, i) in columns">
                      <q-item clickable :key="i" v-if="!item.required" :active="visibleColumns.indexOf(item.name) > -1||false"
                              @click="onColumns(item.name)">
                        <q-item-section>{{ $t(item.label) }}</q-item-section>
                      </q-item>
                    </template>
                  </q-list>
                </q-menu>
              </q-btn>
              <q-btn flat round dense :color="$store.getters.darkMode?'':'grey-7'" :icon="props.inFullscreen?'fullscreen_exit':'fullscreen'"
                     @click="props.toggleFullscreen">
                <q-tooltip v-if="!$q.platform.is.mobile">{{props.inFullscreen?$t("global.normalScreen"):$t("global.fullScreen")}}</q-tooltip>
              </q-btn>
              <q-btn v-if="isRoutes.trash" flat round dense :color="$store.getters.darkMode?'':'grey-7'" icon="more_vert">
                <q-tooltip v-if="!$q.platform.is.mobile">{{$t("table.action")}}</q-tooltip>
                <q-menu auto-close>
                  <q-list dense bordered>
                    <q-item clickable :active="pagination.enable">
                      <q-item-section no-wrap @click="onChangeEnable(true)">{{$t("global.working")}}</q-item-section>
                    </q-item>
                    <q-item clickable :active="!pagination.enable">
                      <q-item-section no-wrap @click="onChangeEnable(false)">{{$t("global.locked")}}</q-item-section>
                    </q-item>
                  </q-list>
                </q-menu>
              </q-btn>
            </div>
          </div>
        </div>
        <div class="col-12 row">
          <div class="col-xs-12 col-sm-5 col-md-4">
            <q-select v-model="group" input-debounce="200" :dense="$store.getters.dense.input" :options-dense="$store.getters.dense.input"
                      :options="groups" :label="$t('users.group')" option-value="code" option-label="name"
                      @update:model-value="onChangeGroup" />
          </div>
          <q-space />
          <div class="col-xs-12 col-sm-5 col-md-4">
            <q-input v-model="pagination.filter" :dense="$store.getters.dense.input" debounce="500" :placeholder="$t('global.search')">
              <template v-slot:append>
                <q-icon v-if="pagination.filter===''" name="search" />
                <q-icon v-else name="clear" class="cursor-pointer" @click="pagination.filter = ''" />
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
            <span :class="['text-bold',$store.getters.darkMode?'':'text-blue-grey-10']">{{$t(col.label)}}</span>
          </q-th>
          <q-th v-if="isRoutes.edit||isRoutes.trash" auto-width>#</q-th>
        </q-tr>
      </template>
      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td auto-width>
            <q-checkbox v-model="props.selected" color="primary" :dense="$store.getters.dense.table" />
          </q-td>
          <q-td key="username" :props="props">{{props.row.username}}</q-td>
          <q-td key="fullName" :props="props">{{props.row.fullName}}</q-td>
          <q-td key="email" :props="props">{{props.row.email}}</q-td>
          <q-td key="phone" :props="props">{{props.row.phone}}</q-td>
          <q-td key="roles" :props="props" class="q-gutter-xs">
            <!-- <q-badge :style="{backgroundColor:props.row.color}">{{ props.row.name }}</q-badge> -->
            <template v-if="props.row.roles && props.row.roles.length > 0">
              <q-badge class="bri" v-for="(item,i) in onFilterRoles(props.row.roles)" :key="i" :style="{backgroundColor:item.color}">
                {{ item.name }}
              </q-badge>
            </template>
            <q-badge class="bri" v-else color="blue-grey-10">{{$t("global.undefined")}}</q-badge>
            <!-- {{ props.row.roles.length>0?props.row.roles.length:$t('global.undefined') }} -->
          </q-td>
          <q-td key="verified" :props="props">
            <!-- {{ props.row.verified }} -->
            <q-avatar icon="done" :text-color="props.row.verified?'green':'blue-grey-10'" />
          </q-td>
          <q-td v-if="isRoutes.edit || isRoutes.trash" auto-width class="text-center">
            <q-btn v-if="pagination.enable" flat round dense color="green" icon="vpn_key" :loading="loadingResetPassword"
                   :size="$store.getters.dense.table?'sm':'md'" @click="onResetPassword(props.row)">
              <q-tooltip v-if="!$q.platform.is.mobile">{{$t("users.resetPassword")}}</q-tooltip>
            </q-btn>
            <q-btn v-if="isRoutes.edit" flat round dense icon="edit" color="light-green" :size="$store.getters.dense.table?'sm':'md'"
                   @click="onEdit(props.row)">
              <q-tooltip v-if="!$q.platform.is.mobile">{{$t("global.update")}}</q-tooltip>
            </q-btn>
            <template v-if="isRoutes.trash">
              <q-btn v-if="pagination.enable" flat round dense color="negative" icon="clear" :size="$store.getters.dense.table?'sm':'md'"
                     @click="onTrash(props.row)">
                <q-tooltip v-if="!$q.platform.is.mobile">{{$t("global.lock")}}</q-tooltip>
              </q-btn>
              <q-btn v-else flat round dense color="amber" icon="restore" :size="$store.getters.dense.table?'sm':'md'" @click="onTrash(props.row)">
                <q-tooltip v-if="!$q.platform.is.mobile">{{$t("global.unlock")}}</q-tooltip>
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
    <!-- Import dialog -->
    <q-dialog v-model="isDialogImport" :maximized="isMaximizedView" persistent>
      <q-card flat :style="{minWidth:'60%'}">
        <tpl-import v-model:dialog="isDialogImport" v-model:maximized="isMaximizedView" />
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
  name: 'UsersIndex',
  components: {
    tplAdd: defineAsyncComponent(() => import('./add')),
    tplImport: defineAsyncComponent(() => import('./import'))
  },
  setup () {
    const $router = useRouter()
    const $store = useStore()
    const $q = useQuasar()
    const { t } = useI18n({ useScope: 'global' })
    const isDialogAdd = ref(false)
    const isDialogImport = ref(false)
    const isMaximizedView = ref(false)
    const loadingResetPassword = ref(false)
    const selected = ref([])
    const isRoutes = ref({
      add: $router.hasRoute('manager-users-add'),
      edit: $router.hasRoute('manager-users-edit'),
      trash: $router.hasRoute('manager-users-trash')
    })
    const pagination = ref({
      filter: '',
      group: 'client',
      sortBy: 'level',
      descending: false,
      page: 1,
      rowsPerPage: 10,
      rowsNumber: 1,
      enable: true
    })
    const visibleColumns = ref(['email', 'phone', 'roles', 'verified'])
    const columns = ref([
      { name: 'username', field: 'username', label: 'users.username', align: 'left', sortable: true, required: true },
      { name: 'fullName', field: 'fullName', label: 'users.fullName', align: 'left', sortable: true, required: true },
      { name: 'email', field: 'email', label: 'users.email', align: 'left', sortable: true },
      { name: 'phone', field: 'phone', label: 'users.phone', align: 'right', sortable: true },
      { name: 'roles', field: 'roles', label: 'roles.title', align: 'left', sortable: true },
      { name: 'verified', field: 'verified', label: 'users.verified', align: 'left', sortable: true }
    ])
    const rows = computed(() => $store.state.users.items || [])
    const roles = computed(() => $store.state.roles.items)
    const groups = computed(() => $store.state.types.items.filter(x => x.key === 'userGroup'))
    const group = ref(groups.value ? groups.value[0] : { code: 'client', name: 'Client' }) // client or manager

    const onFetch = (props) => {
      const { page, rowsPerPage, sortBy, descending, group } = props.pagination
      // apiUsers.select(props.pagination).then((x) => {
      //   rows.value = x.data
      //   // don't forget to update local pagination object
      //   pagination.value.rowsNumber = x.rowsNumber
      //   pagination.value.page = page
      //   pagination.value.rowsPerPage = rowsPerPage
      //   pagination.value.sortBy = sortBy
      //   pagination.value.descending = descending
      // })
      $store.dispatch('users/get', props.pagination).then(x => {
        pagination.value.group = group
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
      isDialogAdd, isDialogImport, isMaximizedView, rows, selected, roles,
      group, groups, loadingResetPassword, isRoutes, pagination, visibleColumns, columns,
      onFetch,
      onFilterRoles (val) {
        return roles.value.filter(x => val.includes(x._id))
      },
      onChangeEnable (val) {
        if (val === pagination.value.enable) return
        selected.value = []
        pagination.value.enable = val
        onFetch({ pagination: pagination.value })
      },
      onChangeGroup () {
        pagination.value.group = group.value.code
        onFetch({ pagination: pagination.value })
      },
      onColumns (val) {
        var i = visibleColumns.value.indexOf(val)
        if (i < 0) visibleColumns.value.push(val)
        else visibleColumns.value.splice(i, 1)
      },
      onAdd: () => {
        $store.dispatch('users/set')
        isMaximizedView.value = false
        if ($q.platform.is.mobile || !$store.state.app.isDialog.add) $router.push('add')
        else isDialogAdd.value = true
      },
      onEdit: (val) => {
        $store.dispatch('users/set', val)
        isMaximizedView.value = false
        if ($q.platform.is.mobile || !$store.state.app.isDialog.edit) $router.push({ path: 'edit', query: { id: val._id } })
        else isDialogAdd.value = true
      },
      onTrash (val) {
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
          $store.dispatch('users/patch', { _id: selected.value.map(x => x._id) }).then(x => { selected.value = [] })
        })
      },
      onImport: () => {
        isMaximizedView.value = false
        if ($q.platform.is.mobile || !$store.state.app.isDialog.import) $router.push('import')
        else isDialogImport.value = true
      },
      onResetPassword (val) {
        $q.dialog({
          title: t('messageBox.warning'),
          message: t('messageBox.resetPassword', { username: val.email }),
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
          loadingResetPassword.value = true
          $store.dispatch('users/resetPassword', {
            _id: val._id,
            password: $store.state.app.passwordResetDefault ? $store.state.app.passwordResetDefault : null
          }).then((x) => {
            $q.notify({ color: 'teal', message: t('users.msgResetPassword', { username: val.email, password: x.password }) })
            selected.value = []
            loadingResetPassword.value = false
          })
        }).onCancel(() => { selected.value = [] })
      }
    }
  }
})
</script>

<style>
</style>
