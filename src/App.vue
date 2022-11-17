<template>
  <AppProvider>
    <RouterView />
  </AppProvider>
</template>

<script setup>
import AppProvider from '@/components/AppProvider.vue';
import { RouterLink, RouterView } from 'vue-router';
</script>

<style lang="scss" scoped></style>
