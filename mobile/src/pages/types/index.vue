<template>
  <q-card>
    <q-toolbar>
      <div v-if="$route.path!=='/manager/types/view'" class="col-auto">
        <q-btn flat dense icon="arrow_back" v-close-popup />
      </div>
      <q-toolbar-title class="text-subtitle1">{{$t('route.types')}} </q-toolbar-title>
      <q-btn v-if="isRoutes.add" icon="add" flat round dense color="blue" @click="onAdd" />
      <q-btn icon="filter_list" flat round dense color="teal">
        <q-tooltip v-if="!$q.platform.is.mobile">{{$t('global.filter')}}</q-tooltip>
        <q-menu v-model="isFilter" class="q-pa-md">
          <!-- <div class="q-pa-md"> -->
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
          <div class="row">
            <div class="col-12">
              <q-select v-model="pagination.key" :options="$store.state.types.keys" dense options-dense :label="$t('global.types')"
                        @update:model-value="isFilter=!isFilter">
                <template v-slot:selected>
                  <div v-html="`${$t(`types.${pagination.key}`)} - ${pagination.key}`"></div>
                </template>
                <template v-slot:option="scope">
                  <q-item v-bind="scope.itemProps">
                    <q-item-section>
                      <q-item-label v-html="`${$t(`types.${scope.opt}`)} - ${scope.opt}`" />
                    </q-item-section>
                  </q-item>
                </template>
              </q-select>
            </div>
          </div>
          <div class="row">
            <div class="col-12">
              <q-toggle v-model="pagination.flag" left-label :label="pagination.flag?$t('global.working'):$t('global.trash')"
                        :false-value="0" :true-value="1" @update:model-value="onChangeFlag" />
            </div>
          </div>
        </q-menu>
      </q-btn>
    </q-toolbar>
    <!-- <q-separator /> -->
    <q-card-section class="q-pa-none">
      <q-scroll-area style="height:calc(100vh - 99px)">
        <!-- <q-list separator>
          <q-slide-item v-for="(e,i) in rows" :key="i" @left="onSlideLeft" @right="onSlideRight" left-color="red" right-color="blue"
                        v-touch-hold.mouse="()=>{onTouchHold(e)}">
            <template v-slot:right>
              <q-icon name="alarm" />
            </template>
            <q-item clickable v-ripple>
              <q-item-section>
                <q-item-label>{{e.name}}</q-item-label>
                <q-item-label caption lines="1">{{`${$t('global.code')}: ${e.code}`}}</q-item-label>
              </q-item-section>
              <q-item-section side>
                {{e.orders}}
              </q-item-section>
            </q-item>
          </q-slide-item>
        </q-list> -->
        <q-list separator>
          <q-item v-for="(e,i) in rows" :key="i" clickable v-ripple v-touch-swipe.mouse.left="()=>{onTrash(e)}"
                  v-touch-swipe.mouse.right="()=>{onEdit(e)}" v-touch-hold.mouse="()=>{onTouchHold(e)}">
            <q-item-section>
              <q-item-label>{{e.name}}</q-item-label>
              <q-item-label caption lines="1">{{`${$t('global.code')}: ${e.code}`}}</q-item-label>
            </q-item-section>
            <q-item-section side>
              {{e.orders}}
            </q-item-section>
          </q-item>
        </q-list>
      </q-scroll-area>
    </q-card-section>
  </q-card>
  <!-- Dialog Add -->
  <q-dialog v-model="isDialogAdd" :maximized="isMaximized">
    <add-item />
  </q-dialog>
  <!-- Dialog Actions -->
  <q-dialog v-model="isDialogTouchHold" position="bottom">
    <q-card class="full-width" style="border-radius:initial">
      <q-card-section class="q-pa-none">
        <q-list separator>
          <q-item clickable v-ripple class="text-center" @click="()=>{isDialogTouchHold=!isDialogTouchHold;onEdit()}">
            <q-item-section>{{$t('global.edit')}}</q-item-section>
          </q-item>
          <q-item clickable v-ripple class="text-center" @click="()=>{isDialogTouchHold=!isDialogTouchHold;onTrash()}">
            <q-item-section>
              <q-item-label v-if="pagination.flag" class="text-red">{{$t('global.trash')}}</q-item-label>
              <q-item-label v-else class="text-warning">{{$t('global.recover')}}</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
        <q-separator size="3px" />
        <q-list>
          <q-item clickable v-ripple class="text-center" v-close-popup>
            <q-item-section>
              <q-item-label>{{$t('global.cancel')}}</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script>
import { defineComponent, defineAsyncComponent, ref, computed, onBeforeUnmount } from "vue";
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { useQuasar } from 'quasar'
import { useI18n } from 'vue-i18n'
import { normalize } from '../../../../global/utils/search'
export default defineComponent({
  name: "TypesIndex",
  components: {
    addItem: defineAsyncComponent(() => import('./add')),
    // tmSwipeitem: defineAsyncComponent(() => import('components/tm-swipe-item'))
  },
  setup () {
    const $router = useRouter()
    const $store = useStore()
    const $q = useQuasar()
    const { t } = useI18n({ useScope: 'global' })
    const isDialogAdd = ref(false)
    const isMaximized = ref(true)
    const isDialogTouchHold = ref(false)
    const isFilter = ref(false)
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
    const onFetch = () => {
      selected.value = []
      if (pagination.value.filter) {
        return $store.state.types.items.filter(x =>
          x.key == pagination.value.key &&
          x.flag == pagination.value.flag &&
          (normalize(x.name)) === normalize(pagination.value.filter) || x.code === normalize(pagination.value.filter))
      } else {
        return $store.state.types.items.filter(x => x.key == pagination.value.key && x.flag == pagination.value.flag)
      }
    }

    // computed
    const rows = computed(() => onFetch())
    let Reset = null
    let timer
    function finalize (reset) {
      if (timer) clearTimeout(timer)
      timer = setTimeout(() => {
        reset()
      }, 3000)
    }
    onBeforeUnmount(() => {
      clearTimeout(timer)
    })
    return {
      isDialogAdd, isMaximized, isDialogTouchHold, rows, selected, isRoutes, isFilter, pagination,
      onSlideLeft ({ reset }) {
        // $q.notify('Left action triggered. Resetting in 1 second.')
        // finalize(reset)
        if (Reset) Reset()
        Reset = reset
        finalize(reset)
      },
      onSlideRight ({ reset }) {
        // $q.notify('Right action triggered. Resetting in 1 second.')
        // finalize(reset)
        if (Reset) Reset()
        Reset = reset
        finalize(reset)
      },
      onAdd: () => {
        $store.dispatch('types/set')
        isDialogAdd.value = true
      },
      onEdit: (val) => {
        if (!isRoutes.value.edit) return
        if (val) selected.value = [val]
        $store.dispatch('types/set', selected.value[0]).then(x => selected.value = [])
        isDialogAdd.value = true
      },
      onTrash: (val) => {
        if (!isRoutes.value.trash) return
        $q.dialog({
          title: t('messageBox.warning'),
          message: pagination.value.flag ? t('messageBox.trash') : t('messageBox.recover'),
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
          $store.dispatch('types/patch', { _id: selected.value.map(x => x._id) }).then(x => { selected.value = [] })
        })
      },
      onTouchHold (val) {
        if (val) selected.value = [val]
        isDialogTouchHold.value = !isDialogTouchHold.value
      }
    }
  }
})
</script>
