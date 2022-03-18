<template>
  <q-card>
    <q-card-section class="headder-row row">
      <div class="col-auto">
        <q-btn flat dense icon="arrow_back" v-close-popup></q-btn>
      </div>
      <span class="text-subtitle1">{{$t('route.types')}}</span>
      <q-space />
      <q-btn icon="add" flat round dense color="blue" @click="onAdd" />
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
        </q-menu>
      </q-btn>
    </q-card-section>
    <!-- <q-separator /> -->
    <q-card-section class="q-pa-none">
      <q-scroll-area style="height:calc(100vh - 99px)">
        <q-list separator>
          <tm-swipeitem v-for="e in rows" :key="e._id" :translateXValue="111">
            <!-- <template v-slot:left>
            <q-btn no-caps flat label="test" color="primary" />
          </template> -->
            <template v-slot:right>
              <q-btn no-caps class="q-btn--square" @click="onEdit(e)">
                <q-icon name="edit" color="blue" size="18px" />
              </q-btn>
              <q-btn no-caps class="q-btn--square" @click="onTrash(e)">
                <q-icon name="clear" color="negative" size="18px" />
              </q-btn>
              <!-- <q-btn no-caps :color="$q.dark.isActive?'':'blue'" class="q-btn--square">
                <q-icon name="edit" :color="$q.dark.isActive?'blue':''" />
              </q-btn>
              <q-btn no-caps :color="$q.dark.isActive?'':'negative'" class="q-btn--square">
                <q-icon name="clear" :color="$q.dark.isActive?'negative':''" />
              </q-btn> -->
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
          </tm-swipeitem>
        </q-list>
      </q-scroll-area>
    </q-card-section>
  </q-card>
  <!-- Dialog Add -->
  <q-dialog v-model="isDialogAdd" :maximized="isMaximized">
    <add-item />
  </q-dialog>
</template>

<script>
import { defineComponent, defineAsyncComponent, ref, computed } from "vue";
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { useQuasar } from 'quasar'
import { useI18n } from 'vue-i18n'
import { normalize } from '../../../../global/utils/search'
export default defineComponent({
  name: "TypesIndex",
  components: {
    addItem: defineAsyncComponent(() => import('./add')),
    tmSwipeitem: defineAsyncComponent(() => import('components/tm-swipe-item'))
  },
  setup () {
    const $router = useRouter()
    const $store = useStore()
    const $q = useQuasar()
    const { t } = useI18n({ useScope: 'global' })
    const isDialogAdd = ref(false)
    const isMaximized = ref(true)
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


    return {
      isDialogAdd, isMaximized, rows, selected, isRoutes, isFilter, pagination,
      onAdd: () => {
        $store.dispatch('types/set')
        isDialogAdd.value = true
      },
      onEdit: (val) => {
        $store.dispatch('types/set', val)
        isDialogAdd.value = true
      },
      onTrash: (val) => {
        $q.dialog({
          // dark: dark.value,
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
