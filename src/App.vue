<template>
  <AppProvider>
    <RouterView />
  </AppProvider>
</template>

<script setup>
import AppProvider from '@/components/AppProvider.vue';
import { RouterLink, RouterView } from 'vue-router';
import { useStore } from 'vuex';
import { onBeforeMount } from 'vue';

const store = useStore();

onBeforeMount(() => {
  store.dispatch('chain/getChains');
  store.dispatch('task/getOperators');
  store.dispatch('account/loadConnectedAccount');
  store.dispatch('global/loadSiderState');
});
</script>

<style lang="scss" scoped></style>
