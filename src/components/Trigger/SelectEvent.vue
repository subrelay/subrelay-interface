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
    <n-form-item path="event" class="w-100">
      <n-select
        clearable
        filterable
        v-model:value="formData.event"
        placeholder="Select Event"
        :options="options"
        :value-field="'id'"
        :render-label="useRenderDropdownLabel"
        :render-tag="renderSelectTagWithDescription"
        :filter="useDropdownFilter"
      />
    </n-form-item>

    <n-button class="action_button" type="primary" @click="onContinue">
      Continue
    </n-button>
  </n-form>
</template>

<script setup>
import { ref, h } from 'vue';
import { NText } from 'naive-ui';
import ChainDropdown from '@/components/Common/ChainDropdown';
import {
  useDropdownFilter,
  useRenderDropdownLabel,
  renderSelectTagWithDescription,
} from '@/composables';

const emits = defineEmits(['continue']);
const formData = ref({});
const formRef = ref(null);

const rules = ref({ event: [{ required: true, trigger: 'input' }] });

const options = ref([
  { id: '1', name: 'balances.deposit', description: 'this event does this' },
  { id: '2', name: 'token.endowed', description: 'this event does that' },
]);

function onContinue(e) {
  e.preventDefault();
  formRef.value.validate(async (errors) => {
    if (errors) return;
    emits('continue');
  });
}
</script>
