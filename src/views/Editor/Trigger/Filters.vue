<template>
  <div
    data-test="filter-group"
    v-for="(group, index) in EditorData.workflow.tasks[filterIdx].config.conditions"
    :key="index"
  >
    <n-divider title-placement="left" v-if="index !== 0"> OR </n-divider>

    <FilterConditionInput
      v-for="(condition, conditionIdx) in group"
      :key="condition.key"
      :index="index"
      :conditionIdx="conditionIdx"
      :condition="condition"
      @remove="removeItem(index, conditionIdx)"
      @input="updateForm($event, index, conditionIdx)"
    />

    <n-space>
      <n-button
        attr-type="button"
        @click="EditorData.addAnd(index)"
        :type="darkMode ? 'default' : 'info'"
        data-test="add-and-btn"
      >
        <Icon icon="fluent:add-16-filled" style="margin-right: 4px" />
        <span>And</span>
      </n-button>

      <n-button
        data-test="add-or-btn"
        attr-type="button"
        v-if="index === conditionLength - 1"
        :type="darkMode ? 'default' : 'info'"
        @click="() => EditorData.addOr()"
      >
        <Icon icon="fluent:add-16-filled" style="margin-right: 4px" />
        <span>Or</span>
      </n-button>
    </n-space>
  </div>

  <n-button
    data-test="editor-add-filters-btn"
    @click="() => EditorData.addOr()"
    :type="darkMode ? 'default' : 'info'"
    v-if="!EditorData.workflow.tasks[filterIdx].config.conditions.length"
  >
    <Icon icon="fluent:add-16-filled" style="margin-right: 4px" />
    <span>Add filter conditions</span>
  </n-button>
</template>

<script setup>
import FilterConditionInput from '@/views/Editor/Trigger/FilterConditionInput';
import EditorData from '@/store/localStore/EditorData';
import { computed } from 'vue';
import { useStore } from 'vuex';

const store = useStore();
const darkMode = computed(() => store.state.global.isDarkMode);
const filterIdx = computed(() => EditorData.filterIdx);
const conditionLength = computed(() => EditorData.workflow.tasks[filterIdx.value].config.conditions.length);

function removeItem(groupIdx, conditionIdx) {
  EditorData.setError('trigger', false);
  EditorData.removeCondition(groupIdx, conditionIdx);

  if (conditionLength.value === 0) {
    EditorData.setError('trigger', false);
  }
}

function updateForm(payload, groupIdx, conditionIdx) {
  EditorData.updateCondition(payload, groupIdx, conditionIdx);
}
</script>

<style lang="scss">
.grid_area {
  width: 100%;
  flex: 1;
}
</style>
