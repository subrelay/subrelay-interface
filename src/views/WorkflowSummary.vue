<template>
  <n-space
    align="center"
    justify="center"
    style="height: 80vh; width: 100%"
    v-if="loading"
  >
    <n-spin description="Loading data... Please wait" size="small" />
  </n-space>

  <n-card style="margin-bottom: 16px">
    <n-tabs
      default-value="overview"
      justify-content="space-evenly"
      type="card"
      pane-style="background: yellow"
    >
      <n-tab-pane name="overview" tab="Overview"> THI TEST </n-tab-pane>
    </n-tabs>
  </n-card>
  <!-- <pre>{{ workflow }}</pre> -->
</template>

<script setup>
import { onBeforeMount, ref } from 'vue';
import API from '@/api';
import axios from 'axios';

const props = defineProps({ id: [String, Number] });
const workflow = ref({});
const loading = ref(null);

onBeforeMount(async () => {
  return new Promise((resolve) => {
    loading.value = true;
    setTimeout(async () => {
      const { data } = await axios({
        url: 'mockData/workflow/workflow.json',
        baseURL: 'http://127.0.0.1:5173',
      });

      workflow.value = data;
      loading.value = false;
      resolve();
    }, 0);
  });
});
</script>
