<template>
  <AppProvider>
    <RouterView />
  </AppProvider>
</template>

<script setup>
import AppProvider from '@/components/AppProvider';
import { useStore } from 'vuex';
import { onBeforeMount } from 'vue';

const store = useStore();

onBeforeMount(() => {
  console.log('test');
  store.dispatch('chain/getChains');
  store.dispatch('task/getOperators');
  store.dispatch('account/loadAccounts');
  store.dispatch('global/loadSiderState');
});
</script>

<style lang="scss" scoped></style>
