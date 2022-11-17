<template>
  <n-form
    class="step_container"
    ref="formRef"
    :model="form"
    :show-label="false"
  >
    <div v-for="(group, index) in form.conditions" :key="index">
      <n-divider title-placement="left" v-if="index !== 0"> OR </n-divider>

      <div v-for="(condition, conditionIdx) in group" :key="conditionIdx">
        <FilterInputGroup
          :index="index"
          :conditionIdx="conditionIdx"
          :condition="condition"
          @remove="removeItem(index, conditionIdx)"
          @input="updateForm($event, index, conditionIdx)"
        />
      </div>

      <n-space>
        <n-button attr-type="button" @click="addAnd(index)" type="info">
          <Icon icon="fluent:add-16-filled" style="margin-right: 4px" />
          <span>And</span>
        </n-button>

        <n-button
          attr-type="button"
          @click="addOr"
          type="info"
          v-if="index === form.conditions.length - 1"
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
      v-if="!form.conditions.length"
    >
      <Icon icon="fluent:add-16-filled" style="margin-right: 4px" />
      <span>Add filter condition</span>
    </n-button>

    <n-button class="action_button" type="primary" @click="onContinue">
      {{ form.conditions.length ? 'Continue' : 'Skip filter' }}
    </n-button>
  </n-form>
</template>

<script setup>
import FilterInputGroup from '@/components/Trigger/FilterInputGroup';
import { ref, inject, computed } from 'vue';
import { useStore } from 'vuex';

const store = useStore();
const emitter = inject('emitter');
const emits = defineEmits(['continue']);
const formRef = ref(null);

const form = ref({
  conditions: [],
});

const conditionFormat = { variable: null, operator: null, value: null };

function removeItem(index, conditionIdx) {
  emitter.emit('toggleTestFilter', { isDisabled: true });
  formRef.value.restoreValidation();
  const condition = form.value.conditions[index];
  if (condition.length === 1) {
    form.value.conditions.splice(index, 1);
  } else {
    form.value.conditions[index].splice(conditionIdx, 1);
  }
}

function addAnd(index) {
  form.value.conditions[index].push({ ...conditionFormat });
}

function addOr() {
  form.value.conditions.push([{ ...conditionFormat }]);
}

function onContinue(e) {
  e.preventDefault();
  formRef.value.validate(async (errors) => {
    if (errors) return;
    if (form.value.conditions.length) {
      emitter.emit('toggleTestFilter', { isDisabled: false });
      emits('continue');
    } else {
      emitter.emit('nextStep');
    }
  });
}

function updateForm(payload, index, conditionIdx) {
  const { value, prop } = payload;
  form.value.conditions[index][conditionIdx][prop] = value;
}
</script>

<style lang="scss">
.grid_area {
  width: 100%;
  flex: 1;
}
</style>
