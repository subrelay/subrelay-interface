<template>
  <n-form
    class="step_container"
    ref="formRef"
    @keyup.enter="onContinue"
    :model="formData"
    :show-label="false"
    :validate-messages="{ required: 'Required!' }"
  >
    <n-form-item
      path="chain_uuid"
      class="w-100"
      :rule="{ required: true, trigger: ['input'] }"
    >
      <ChainDropdown
        v-model="formData.chain_uuid"
        :placeholder="'Select Chain'"
      />
    </n-form-item>

    <n-button class="action_button" type="primary" @click="onContinue">
      Continue
    </n-button>
  </n-form>
</template>

<script setup>
import { reactive, ref, inject, watch } from 'vue';

import ChainDropdown from '@/components/Common/ChainDropdown';

const emits = defineEmits(['continue']);
const formRef = ref(null);
const formData = reactive({});

function onContinue(e) {
  e.preventDefault();
  formRef.value.validate(async (errors) => {
    if (errors) return;
    emits('continue');
  });
}

const eventBus = inject('eventBus');

watch(
  () => formData,
  ({ chain_uuid }) => {
    eventBus.emit('updateTask', { name: 'trigger', config: { chain_uuid } });
  },
  { deep: true }
);
</script>
