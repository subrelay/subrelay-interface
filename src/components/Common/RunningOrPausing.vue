<template>
  <n-tooltip trigger="hover">
    <template #trigger>
      <n-switch
        @update:value="onUpdateStatus"
        :value="props.status"
        :loading="loading"
        :disabled="loading"
        :checked-value="'running'"
        :unchecked-value="'pausing'"
      />
    </template>
    <span class="text-capitalize"> {{ props.status }} </span>
  </n-tooltip>
</template>

<script setup>
import { pickBy } from 'lodash';
import { useStore } from 'vuex';
import { ref, computed } from 'vue';
import { useMessage } from 'naive-ui';
import axios from 'axios';
import Api from '@/api';

const store = useStore();
const message = useMessage();

const props = defineProps({
  id: [Number, String],
  status: [String],
  fetchOne: { type: Boolean, default: true },
});

const loading = ref(null);
const account = computed(() => store.state.account.selected);
const signer = computed(() => store.state.account.signer);

async function onUpdateStatus(newStt) {
  loading.value = true;

  try {
    const res = await Api.editWorkflow({
      account: account.value,
      signer: signer.value,
      id: props.id,
      body: { status: newStt },
    });
    console.log('res', res);

    if (props.fetchOne) {
      const { data: newWorkflow } = await axios({
        url: 'mockData/workflow/changeStatusFetchOne.json',
        baseURL: 'http://127.0.0.1:5173',
      });
      store.commit('workflow/getWorkflow', newWorkflow);
    } else {
      await store.dispatch('workflow/getWorkflows', { showLoading: false });
    }

    message.success('Status updated successfully');
  } catch (error) {
    console.error(error);
    message.error('Error:', error.message);
  } finally {
    loading.value = false;
  }
}
</script>
