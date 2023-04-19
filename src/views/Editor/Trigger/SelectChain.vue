<template>
  <n-form-item
    path="uuid"
    class="w-100"
    label="Select chain"
    :rule="{ required: true, trigger: 'input', message: 'Required', key: 'selectChain' }"
  >
    <ChainDropdown
      v-model="EditorData.workflow.uuid"
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

function handleSelectChain(uuid) {
  EditorData.setError('trigger', !uuid);
  EditorData.resetTrigger();
  EditorData.resetFilter();
  EditorData.resetAction();
  store.commit('editor/disableTestAction', true);
  store.commit('editor/setExpand', { action: '1' });

  if (uuid) {
    store.dispatch('chain/getEvents', uuid);
  } else {
    store.commit('chain/getEvents', []);
  }
}
</script>
