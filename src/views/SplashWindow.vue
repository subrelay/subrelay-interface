<template>
  <n-layout style="height: 100vh">
    <n-layout-header style="padding: 5px 3rem" bordered>
      <n-space align="center" justify="center">
        <Logo @click="goToHomePage" />
      </n-space>
    </n-layout-header>

    <n-layout-content>
      <n-result
        style="margin-top: 25vh"
        :title="isSuccess ? 'Success' : 'Error'"
        :description="
          isSuccess ? 'Connect successfully! You can close this window.' : 'Something went wrong. Please try again!'
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
import { onBeforeMount, ref } from 'vue';
import { useRoute } from 'vue-router';
import isEmpty from 'lodash/isEmpty';

const route = useRoute();
const closeWindow = () => {
  window.close();
};

const isSuccess = ref(false);

onBeforeMount(() => {
  if (isEmpty(route.query) || route.query.success === 'true') {
    isSuccess.value = true;
  }
});
</script>
