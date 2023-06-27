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
  store.dispatch('chain/getChains');
  store.dispatch('editor/getOperators');
  store.dispatch('global/loadSiderState');
  store.dispatch('account/loadAccounts');
});
</script>

<style lang="scss" scoped></style>
