<template>
  <n-form
    class="step_container"
    ref="formRef"
    @keyup.enter="validateForm"
    :model="EditorData.workflow.tasks[0].config"
    :show-label="false"
  >
    <n-form-item
      path="uuid"
      class="w-100"
      :rule="{ required: true, trigger: ['input'], message: 'Required' }"
    >
      <ChainDropdown
        v-model="EditorData.workflow.tasks[0].config.uuid"
        :onSelectChain="handleSelectChain"
        :placeholder="'Select Chain'"
      />
    </n-form-item>

    <n-button class="action_button" type="primary" @click="validateForm">
      Continue
    </n-button>
  </n-form>
</template>

<script setup>
import EditorData from '@/store/localStore/EditorData';
import ChainDropdown from '@/components/Common/ChainDropdown';
import { useFormValidation } from '@/composables';
import { useStore } from 'vuex';
import { inject } from 'vue';

const emits = defineEmits(['continue']);

const [{ formRef }, { validateForm }] = useFormValidation('trigger', emits);

const store = useStore();
const eventBus = inject('eventBus');

function handleSelectChain(uuid) {
  EditorData.setTrigger({ uuid });
  EditorData.setTrigger({ eventId: null });
  EditorData.setTrigger({ conditions: [] });

  eventBus.emit('toggleTestFilter', { isDisabled: true });

  validateForm({ changeStep: false });

  if (uuid) {
    store.dispatch('chain/getEvents', uuid);
  } else {
    store.commit('chain/getEvents', []);
  }
}
</script>
