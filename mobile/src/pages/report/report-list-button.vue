<template>
  <div class="list-btn q-gutter-sm">
    <q-btn-dropdown split :label="$t(`report.date`)" :dense="$store.getters.dense.button" :color="modelValue==='date'?'primary':'blue-grey'" no-caps
                    class="q-btn--square" @click="onSelected('date')">
      <q-list>
        <q-item>
          <q-item-section>
            <q-input :model-value="dateData.start?$moment(dateData.start).format($store.getters.format.date):''" :dense="$store.getters.dense.input"
                     readonly :label="$t('global.startDate')" :hint="`${$t('global.format')}: ${$store.getters.format.date}`">
              <template v-slot:append>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy ref="dateStart" transition-show="scale" transition-hide="scale">
                    <q-date v-model="dateData.start" today-btn mask="YYYY-MM-DD" @update:model-value="()=>$refs.dateStart.hide()" />
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
          </q-item-section>
        </q-item>
        <q-item>
          <q-item-section>
            <q-input :model-value="dateData.end?$moment(dateData.end).format($store.getters.format.date):''" :dense="$store.getters.dense.input"
                     readonly :label="$t('global.endDate')" :hint="`${$t('global.format')}: ${$store.getters.format.date}`">
              <template v-slot:append>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy ref="dateEnd" transition-show="scale" transition-hide="scale">
                    <q-date v-model="dateData.end" today-btn mask="YYYY-MM-DD" @update:model-value="()=>$refs.dateEnd.hide()" />
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
          </q-item-section>
        </q-item>
        <q-item>
          <q-item-section>
            <q-btn v-close-popup dense no-caps :label="$t('global.getData')" color="blue" class="q-btn--square list-btn"
                   @click="onSubmitDate('date')" />
          </q-item-section>
        </q-item>
      </q-list>
    </q-btn-dropdown>
    <q-btn v-for="(e,i) in typeTime" :key="i" :dense="$store.getters.dense.button" :label="$t(`report.${e}`)"
           :color="modelValue===e?'primary':'blue-grey'" no-caps class="q-btn--square" @click="onSelected(e)" />
  </div>
</template>

<script>
import { defineComponent, ref } from 'vue';
export default defineComponent({
  name: 'ReportListButton',
  props: {
    modelValue: { type: String, default: null }
  },
  setup (props, { emit }) {
    const typeTime = ref(['weekly', 'month', 'quarter', 'year', 'fiveYear'])
    const dateData = ref({ start: Date.now(), end: Date.now() })
    return {
      typeTime, dateData,
      onSelected (item) {
        emit('update:modelValue', item)
        emit('on-selected', { typeTime: item })
      },
      onSubmitDate (item) {
        emit('update:modelValue', item)
        emit('on-selected', { typeTime: item, startDate: dateData.value.start, endDate: dateData.value.end })
      }
    }
  }
})
</script>

<style scoped>
.list-btn ::ng-deep .q-btn {
  font-weight: 400;
}
</style>
