<template>
  <n-tooltip trigger="hover">
    <template #trigger>
      <n-switch
        @update:value="onUpdateStatus"
        :value="props.status"
        :loading="loading"
        :disabled="loading"
        :checked-value="'running'"
      />
    </template>
    {{ props.status }}
  </n-tooltip>
</template>

<script setup>
import { pickBy } from 'lodash';
import { useStore } from 'vuex';
import { ref, computed } from 'vue';
import { useMessage } from 'naive-ui';
import axios from 'axios';

const store = useStore();
const message = useMessage();

const props = defineProps({
  id: Number,
  status: [String],
  onUpdateValue: [Function, Array],
});

const loading = ref(null);
const query = computed(() => store.state.workflow.queryParams);

async function onUpdateStatus() {
  const newStatus = props.status === 'running' ? 'pausing' : 'running';
  loading.value = true;

  // --- Mock  data ---
  const params = new URLSearchParams({ ...pickBy(query.value) });
  await axios({
    method: 'put',
    url: 'mockData/workflow.json',
    baseURL: 'http://127.0.0.1:5173',
    data: { status: newStatus },
  });

  const { data: newWorkflows } = await axios({
    url: 'mockData/workflow/changeStatus.json',
    baseURL: 'http://127.0.0.1:5173',
    params,
  });
  store.commit('workflow/getWorkflows', newWorkflows);
  // --- End of mock data ---

  try {
    // await API.Workflow.editWorkflow(props.id, { status: newStatus });
    // await store.dispatch('workflow/getWorkflows', query);
    message.success('Status updated successfully');
  } catch (error) {
    message.error('Error:', error);
  } finally {
    loading.value = false;
  }
}
</script>
