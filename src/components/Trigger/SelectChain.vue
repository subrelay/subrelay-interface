<template>
  <n-form
    class="step_container"
    @keyup.enter="onContinue"
    ref="formRef"
    :model="formData"
    :rules="rules"
    :show-label="false"
    :validate-messages="{ required: 'Required!' }"
  >
    <n-form-item path="chain" class="w-100">
      <ChainDropdown v-model="formData.chain" :placeholder="'Select Chain'" />
    </n-form-item>

    <n-button class="action_button" type="primary" @click="onContinue">
      Continue
    </n-button>
  </n-form>
</template>

<script setup>
import { ref } from 'vue';
import ChainDropdown from '@/components/Common/ChainDropdown';

const emits = defineEmits(['continue']);
const formData = ref({});
const formRef = ref(null);
const rules = ref({ chain: [{ required: true, trigger: ['input'] }] });

function onContinue(e) {
  e.preventDefault();
  formRef.value.validate(async (errors) => {
    if (errors) return;
    emits('continue');
  });
}
</script>
