<template>
  <n-form-item
    path="chainUuid"
    class="w-100"
    label="Select chain"
    :rule="{ required: true, trigger: 'input', message: 'Required', key: 'selectChain' }"
  >
    <ChainDropdown
      v-model="EditorData.workflow.chainUuid"
      placeholder="Please select"
      :onSelectChain="handleSelectChain"
    />
  </n-form-item>
</template>

<script setup>
import EditorData from '@/store/localStore/EditorData';
import ChainDropdown from '@/components/ChainDropdown';
import { useStore } from 'vuex';

const store = useStore();

function handleSelectChain(chainUuid) {
  EditorData.setError('trigger', !chainUuid);
  EditorData.resetTrigger();
  EditorData.resetFilter();

  if (chainUuid) {
    store.dispatch('chain/getEvents', chainUuid);
  } else {
    store.commit('chain/getEvents', []);
  }
}
</script>
