<template>
  <AppProvider>
    <RouterView />
  </AppProvider>
</template>

<script setup>
import AppProvider from '@/components/AppProvider.vue';
import { RouterLink, RouterView } from 'vue-router';
import { useStore } from 'vuex';
import { onMounted } from 'vue';

const store = useStore();

onMounted(() => {
  store.dispatch('chain/getChains');
});
</script>

<style lang="scss" scoped></style>
