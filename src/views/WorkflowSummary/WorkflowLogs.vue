<template>
  <n-space style="margin: 1rem 0 2rem 0" :wrap-item="false">
    <n-select
      style="max-width: 180px; width: 20vw"
      filterable
      clearable
      placeholder="All statuses"
      :disabled="loading"
      :render-label="useRenderDropdownLabel"
      :options="useLogStatuses"
      :value="selectedStatus"
      @update:value="handleSelectStatus"
    />

    <n-tooltip trigger="hover">
      <template #trigger>
        <n-button :disabled="loading" @click="fetchData">
          <Icon icon="ep:refresh" width="1.2rem" />
        </n-button>
      </template>
      Refresh
    </n-tooltip>
  </n-space>

  <n-space align="center" justify="center" style="width: 100%" v-if="loading">
    <Icon icon="eos-icons:three-dots-loading" width="50" color="rgba(230, 0, 122, 1)" />
  </n-space>

  <div v-else>
    <div v-if="logs.length">
      <n-space vertical :size="16" :wrap-item="false">
        <WorkflowLogItem :log="log" v-for="(log, idx) in logs" :key="idx" />

        <n-pagination
          style="margin-top: 1rem"
          class="table-pagination"
          @update:page="handlePageChange"
          :page="tablePagination.page"
          :item-count="tablePagination.itemCount"
          :page-size="tablePagination.pageSize"
          :disabled="loading"
          size="small"
        />
      </n-space>
    </div>

    <div v-else>No data.</div>
  </div>
</template>

<script setup>
import ButtonWithTooltip from '@/components/ButtonWithTooltip';
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
