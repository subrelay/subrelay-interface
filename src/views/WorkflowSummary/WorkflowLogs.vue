<template>
  <n-select
    style="margin: 1rem 0 2rem 0; max-width: 180px; width: 20vw"
    filterable
    clearable
    placeholder="All statuses"
    :render-label="useRenderDropdownLabel"
    :options="useLogStatuses"
    :value="selectedStatus"
    @update:value="handleSelectStatus"
  />

  <n-space vertical :size="16" v-if="logs.length">
    <WorkflowLogItem :log="log" v-for="(log, idx) in logs" :key="idx" />
  </n-space>
  <div v-else>No data.</div>
</template>

<script setup>
import WorkflowLogItem from '@/components/WorkflowLogItem';
import { onMounted, computed, onBeforeUnmount } from 'vue';
import { useQuery, useRenderDropdownLabel, useLogStatuses } from '@/composables';
import { useStore } from 'vuex';
import API from '@/api';

const store = useStore();
const account = computed(() => store.state.account.selected);
const signer = computed(() => store.state.account.signer);
const props = defineProps(['id']);
const logs = computed(() => store.state.history.log);

async function fetchData() {
  store.dispatch('history/getLog', props.id);
}
const [
  { query, searchText, loading, tablePagination, selectedChain, selectedStatus },
  {
    onDebouncedSearch,
    handleSort,
    handlePageChange,
    handleSelectChain,
    handleSelectStatus,
    clearAllFilters,
  },
] = useQuery('history', 'log', null, fetchData);
</script>
