<template>
  <n-layout style="height: 100vh">
    <n-layout-header style="padding: 5px 3rem" bordered>
      <n-space align="center" justify="center">
        <Logo @click="goToHomePage" />
      </n-space>
    </n-layout-header>

    <n-layout-content>
      <n-space align="center" justify="center" style="height: 80vh; width: 100%" v-if="loading">
        <Icon icon="eos-icons:three-dots-loading" width="50" color="rgba(230, 0, 122, 1)" />
      </n-space>

      <n-result
        v-else
        style="margin-top: 25vh"
        :title="isSuccess ? 'Success' : 'Error'"
        :description="
          isSuccess
            ? 'Connect successfully! You can close this window.'
            : 'Something went wrong. Please try again!'
        "
        :status="isSuccess ? 'success' : 'error'"
      >
        <template #footer>
          <n-button @click="closeWindow">Close this window</n-button>
        </template>
      </n-result>
    </n-layout-content>
  </n-layout>
</template>

<script setup>
import Logo from '@/components/Logo';
import { onBeforeMount, onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const closeWindow = () => {
  window.close();
};

const isSuccess = ref(false);
const loading = ref(true);

onBeforeMount(() => {
  if (!route.query || route.query.success === 'true') {
    isSuccess.value = true;
  }
});

onMounted(() => {
  setTimeout(() => {
    loading.value = false;
  }, 2000);
});
</script>
