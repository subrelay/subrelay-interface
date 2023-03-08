<template>
  <div v-for="(group, index) in EditorData.workflow.tasks[0].config.conditions" :key="index">
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
      >
        <SubIcon icon="fluent:add-16-filled" style="margin-right: 4px" />
        <span>And</span>
      </n-button>

      <n-button
        attr-type="button"
        v-if="index === conditionLength - 1"
        :type="darkMode ? 'default' : 'info'"
        @click="() => EditorData.addOr()"
      >
        <SubIcon icon="fluent:add-16-filled" style="margin-right: 4px" />
        <span>Or</span>
      </n-button>
    </n-space>
  </div>

  <n-button
    @click="() => EditorData.addOr()"
    :type="darkMode ? 'default' : 'info'"
    v-if="!EditorData.workflow.tasks[0].config.conditions.length"
  >
    <SubIcon icon="fluent:add-16-filled" style="margin-right: 4px" />
    <span>Add filter conditions</span>
  </n-button>
</template>

<script setup>
import FilterConditionInput from '@/views/Editor/Trigger/FilterConditionInput';
import EditorData from '@/store/localStore/EditorData';
import { useContinueWithValidation } from '@/composables';
import { inject, computed, watch } from 'vue';
import { useStore } from 'vuex';

const store = useStore();
const darkMode = computed(() => store.state.global.isDarkMode);
const step = computed(() => store.state.editor.step);

watch(step, (newStep) => {
  validateForm({ changeStep: false });
});

const emits = defineEmits(['continue']);

const [{ formRef }, { validateForm }] = useContinueWithValidation('trigger');

const conditionLength = computed(() => EditorData.workflow.tasks[0].config.conditions.length);

function removeItem(groupIdx, conditionIdx) {
  formRef.value.restoreValidation();
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
