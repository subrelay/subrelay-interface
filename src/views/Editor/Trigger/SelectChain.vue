<template>
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
</template>

<script setup>
import EditorData from '@/store/localStore/EditorData';
import ChainDropdown from '@/components/ChainDropdown';
import { useStore } from 'vuex';

const store = useStore();

function handleSelectChain(chainUuid) {
  EditorData.setError('trigger', !chainUuid);
  EditorData.setTrigger({ eventId: null, conditions: [] });

  if (chainUuid) {
    store.dispatch('chain/getEvents', chainUuid);
  } else {
    store.commit('chain/getEvents', []);
  }
}
</script>
