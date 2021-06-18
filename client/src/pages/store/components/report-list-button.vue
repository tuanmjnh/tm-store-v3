<template>
  <div class="list-btn q-gutter-sm">
    <q-btn-dropdown split :label="$t(`report.date`)" :dense="$store.getters.dense.button"
      :color="selected==='date'?'primary':'blue-grey'" no-caps class="q-btn--square"
      @click="onSelected('date')">
      <q-list>
        <q-item>
          <q-item-section>
            <q-input :value="startDate" :dense="$store.getters.dense.input" readonly
              :label="$t('global.startDate')"
              :hint="`${$t('global.format')}: ${$store.getters.format.date}`">
              <template v-slot:append>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy ref="startDate" transition-show="scale" transition-hide="scale">
                    <q-date v-model="startDate" mask="DD/MM/YYYY" today-btn
                      @input="()=>$refs.startDate.hide()" />
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
          </q-item-section>
        </q-item>
        <q-item>
          <q-item-section>
            <q-input :value="endDate" :dense="$store.getters.dense.input" readonly
              :label="$t('global.endDate')"
              :hint="`${$t('global.format')}: ${$store.getters.format.date}`">
              <template v-slot:append>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy ref="endDate" transition-show="scale" transition-hide="scale">
                    <q-date v-model="endDate" mask="DD/MM/YYYY" today-btn
                      @input="()=>$refs.endDate.hide()" />
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
          </q-item-section>
        </q-item>
        <q-item>
          <q-item-section>
            <q-btn v-close-popup dense no-caps :label="$t('global.getData')" color="blue"
              class="q-btn--square list-btn" @click="onSubmitDate('date')" />
          </q-item-section>
        </q-item>
      </q-list>
    </q-btn-dropdown>
    <q-btn v-for="(e,i) in typeTime" :key="i" :dense="$store.getters.dense.button"
      :label="$t(`report.${e}`)" :color="selected===e?'primary':'blue-grey'" no-caps
      class="q-btn--square" @click="onSelected(e)" />
  </div>
</template>

<script>
export default {
  props: {
    selected: { type: String, default: null }
  },
  data() {
    return {
      typeTime: ['weekly', 'month', 'quarter', 'year', 'fiveYear'],
      startDate: null,
      endDate: null
    }
  },
  methods: {
    onSelected(item) {
      this.$emit('update:selected', item)
      this.$emit('on-selected', { typeTime: item })
    },
    onSubmitDate(item) {
      this.$emit('update:selected', item)
      this.$emit('on-selected', { typeTime: item, startDate: this.startDate, endDate: this.endDate })
    }
  }
}
</script>

<style scoped>
.list-btn >>> .q-btn {
  font-weight: 400;
}
</style>
