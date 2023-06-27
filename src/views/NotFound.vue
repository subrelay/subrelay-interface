<template>
  <n-layout class="page-container">
    <div class="content-center">
      <n-result
        status="404"
        title="Page Not Found"
        description="Seems like you have your way. Let's back to the home page."
      >
        <template #footer>
          <n-button @click="onBackToHome">Go to home page</n-button>
        </template>
      </n-result>
    </div>
  </n-layout>
</template>

<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

const onBackToHome = () => {
  router.push('/');
};
</script>

<style lang="scss" scoped></style>
