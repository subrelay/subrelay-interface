<template>
  <n-form class="step_container" ref="formRef" :model="EditorData.workflow" :show-label="false">
    <n-form-item
      path="chainUuid"
      class="w-100"
      :rule="{ required: true, trigger: 'input', message: 'Required', key: 'selectChain' }"
    >
      <ChainDropdown
        v-model="EditorData.workflow.chainUuid"
        :onSelectChain="handleSelectChain"
        :placeholder="'Select Chain'"
      />
    </n-form-item>

    <n-button class="action_button" type="primary" @click="validateForm"> Continue </n-button>
  </n-form>
</template>

<script setup>
import EditorData from '@/store/localStore/EditorData';
import ChainDropdown from '@/components/ChainDropdown';
import { useContinueWithValidation } from '@/composables';
import { useStore } from 'vuex';

const [{ formRef }, { validateForm }] = useContinueWithValidation('trigger', '2');

const store = useStore();

function handleSelectChain(chainUuid) {
  EditorData.setTrigger({ eventId: null, conditions: [] });

  if (chainUuid) {
    store.dispatch('chain/getEvents', chainUuid);
  } else {
    store.commit('chain/getEvents', []);
  }
}
</script>
