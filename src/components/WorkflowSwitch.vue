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
import { useStore } from 'vuex';
import { ref, computed } from 'vue';
import { useMessage } from 'naive-ui';
import { useShowError } from '@/composables';
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
    await Api.editWorkflow({
      account: account.value,
      signer: signer.value,
      id: props.id,
      body: { status: newStt },
    });

    if (props.fetchOne) {
      await store.dispatch('workflow/getWorkflow', { showLoading: false, id: props.id });
    } else {
      await store.dispatch('workflow/getWorkflows', { showLoading: false });
    }

    message.success(`Workflow ${newStt === 'pausing' ? 'paused' : 'resumed'} successfully`);
  } catch (e) {
    const errMsg = e.message;
    if (errMsg === 'Cancelled') {
      return;
    }
    useShowError(e);
  } finally {
    loading.value = false;
  }
}
</script>
