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

    <n-form :model="model" :rules="rules">
      <n-form-item path="tags" :show-label="false">
        <n-dynamic-tags v-model:value="model.tags" :render-tag="renderTag" />
      </n-form-item>
    </n-form>
  </n-layout>
</template>

<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

const onBackToHome = () => {
  router.push('/');
};

import { ref, h } from 'vue';

import { NTag } from 'naive-ui';

const model = ref({
  tags: ['teacher', 'programmer'],
});

const rules = ref({
  tags: {
    trigger: ['change'],
    validator(rule, value) {
      console.log(value);
      if (value.length >= 3) return new Error('Up to 4 tags');
      return true;
    },
  },
});

const renderTag = (tag, index) => {
  return h(
    NTag,
    {
      type: index < 3 ? 'success' : 'error',
      disabled: index > 3,
      closable: true,
      onClose: () => {
        model.value.tags.splice(index, 1);
      },
    },
    { default: () => tag },
  );
};
</script>

<style lang="scss" scoped>
.page-container {
  height: 100vh;
}

.content-center {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
