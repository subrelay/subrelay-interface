<template>
  <n-space style="margin: 1rem 0 2rem 0" :wrap-item="false">
    <n-select
      style="max-width: 180px; width: 20vw"
      filterable
      clearable
      placeholder="All statuses"
      data-test="a-workflow-log-status-filter"
      :menu-props="{ 'data-test': 'workflow-log-status-filter-menu' }"
      :disabled="loading"
      :render-label="useRenderDropdownLabel"
      :options="logStatuses"
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
          :page="pagination.page"
          :item-count="pagination.itemCount"
          :page-size="pagination.pageSize"
          :disabled="loading"
          size="small"
        />
      </n-space>
    </div>

    <div v-else>No data.</div>
  </div>
</template>

<script setup>
import WorkflowLogItem from '@/components/WorkflowLogItem';
import { useQuery, useRenderDropdownLabel } from '@/composables';
import logStatuses from '@/config/logStatuses';
import { computed } from 'vue';
import { useStore } from 'vuex';

const props = defineProps(['id']);
const store = useStore();
const logs = computed(() => store.state.log.log);

async function fetchData() {
  store.dispatch('log/getLog', props.id);
}

const [{ loading, pagination, selectedStatus }, { handlePageChange, handleSelectStatus }] = useQuery({
  module: 'log',
  path: 'log',
  columns: null,
  fetchPath: 'log/getLog',
  fetchParams: { workflowId: props.id },
});
</script>
