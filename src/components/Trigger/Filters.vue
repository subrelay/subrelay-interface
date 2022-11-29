<template>
  <n-form
    class="step_container"
    ref="formRef"
    :model="EditorData.workflow.tasks[0].config"
    :show-label="false"
  >
    <div
      v-for="(group, index) in EditorData.workflow.tasks[0].config.conditions"
      :key="index"
    >
      <n-divider title-placement="left" v-if="index !== 0"> OR </n-divider>

      <FilterInputGroup
        v-for="(condition, conditionIdx) in group"
        :key="condition.key"
        :index="index"
        :conditionIdx="conditionIdx"
        :condition="condition"
        @remove="removeItem(index, conditionIdx)"
        @input="updateForm($event, index, conditionIdx)"
      />

      <n-space>
        <n-button attr-type="button" @click="addAnd(index)" type="info">
          <Icon icon="fluent:add-16-filled" style="margin-right: 4px" />
          <span>And</span>
        </n-button>

        <n-button
          attr-type="button"
          type="info"
          @click="addOr"
          v-if="index === conditionLength - 1"
        >
          <Icon icon="fluent:add-16-filled" style="margin-right: 4px" />
          <span>Or</span>
        </n-button>
      </n-space>
    </div>

    <n-button
      attr-type="button"
      @click="addOr"
      type="info"
      v-if="!EditorData.workflow.tasks[0].config.conditions.length"
    >
      <Icon icon="fluent:add-16-filled" style="margin-right: 4px" />
      <span>Add filter condition</span>
    </n-button>

    <n-button class="action_button" type="primary" @click="onContinue">
      {{ conditionLength ? 'Continue' : 'Skip filter' }}
    </n-button>
  </n-form>
</template>

<script setup>
import FilterInputGroup from '@/components/Trigger/FilterInputGroup';
import EditorData from '@/store/localStore/EditorData';
import { useFormValidation } from '@/composables';
import { inject, computed } from 'vue';

const eventBus = inject('eventBus');
const emits = defineEmits(['continue']);
const [{ formRef }, { validateForm }] = useFormValidation('trigger', emits);

const conditionLength = computed(() => {
  return EditorData.workflow.tasks[0].config.conditions.length;
});

function removeItem(groupIdx, conditionIdx) {
  eventBus.emit('toggleTestFilter', { isDisabled: true });
  // formRef.value.restoreValidation();
  EditorData.removeCondition(groupIdx, conditionIdx);
  if (conditionLength.value === 0) {
    EditorData.setError('trigger', false);
  }
}

function addAnd(groupIdx) {
  EditorData.addAnd(groupIdx);
}

function addOr() {
  EditorData.addOr();
}

function onContinue(e) {
  e.preventDefault();

  validateForm({}, () => {
    if (conditionLength.value) {
      eventBus.emit('toggleTestFilter', { isDisabled: false });
      emits('continue');
    } else {
      eventBus.emit('nextStep');
    }
  });
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
