<template>
  <n-form
    class="step_container"
    ref="formRef"
    @keyup.enter="onContinue"
    :model="EditorData.workflow.tasks[0].config"
    :show-label="false"
    :validate-messages="{ required: 'Required!' }"
  >
    <n-form-item
      path="chain_uuid"
      class="w-100"
      :rule="{ required: true, trigger: ['input'] }"
    >
      <ChainDropdown
        v-model="EditorData.workflow.tasks[0].config.chain_uuid"
        :onSelectChain="handleSelectChain"
        :placeholder="'Select Chain'"
      />
    </n-form-item>

    <n-button class="action_button" type="primary" @click="onContinue">
      Continue
    </n-button>
  </n-form>
</template>

<script setup>
import ChainDropdown from '@/components/Common/ChainDropdown';
import { ref, inject } from 'vue';
import { useStore } from 'vuex';

import EditorData from '@/store/localStore/EditorData';

const emits = defineEmits(['continue']);
const formRef = ref(null);
const store = useStore();
const eventBus = inject('eventBus');

function onContinue(e) {
  e.preventDefault();
  formRef.value.validate(async (errors) => {
    if (errors) return;
    emits('continue');
  });
}

function handleSelectChain(chain_uuid) {
  EditorData.setTrigger({ chain_uuid });
  if (chain_uuid) {
    store.dispatch('chain/getEvents', chain_uuid);
  } else {
    EditorData.setTrigger({ event: null });
    EditorData.setTrigger({ conditions: [] });
    store.commit('chain/getEvents', []);
  }
}
</script>
