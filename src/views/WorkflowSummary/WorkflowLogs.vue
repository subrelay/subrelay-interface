<template>
  <div>Workflow logs</div>
</template>

<script setup>
import { onMounted, computed, onBeforeUnmount } from 'vue';
import { useStore } from 'vuex';
import API from '@/api';

const store = useStore();
const account = computed(() => store.state.account.selected);
const signer = computed(() => store.state.account.signer);

onMounted(async () => {
  console.log('log mount');
  const res = await API.getLogs({
    account: account.value,
    signer: signer.value,
    params: { workflowId: 3 },
  });
  // console.log('res', res);
});

onBeforeUnmount(() => console.log('log unmount'));
</script>
