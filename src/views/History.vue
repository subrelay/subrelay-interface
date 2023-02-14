<template>
  <n-space vertical :size="30">
    <PageHeader :module="'history'" :statusOptions="useLogStatuses" />

    <n-space :wrapItem="false">
      <n-data-table :columns="columns" :data="logs" :loading="loading" @update:sorter="handleSort">
        <template #empty>
          <n-empty description="No data available" :show-icon="false" :size="'small'"> </n-empty>
        </template>
      </n-data-table>

      <n-pagination
        class="table-pagination"
        @update:page="handlePageChange"
        :page="tablePagination.page"
        :item-count="tablePagination.itemCount"
        :page-size="tablePagination.pageSize"
        :disabled="loading"
        size="small"
      />
    </n-space>
  </n-space>
</template>

<script setup>
import PageHeader from '@/components/Common/PageHeader';
import { Icon } from '@iconify/vue';
import { ref, h, provide, computed } from 'vue';
import { useStore } from 'vuex';
import { NAvatar } from 'naive-ui';
import moment from 'moment';
import { useQuery, useRenderSortIcon, useLogStatuses, useGetChainImg } from '@/composables';

const store = useStore();
const chains = computed(() => store.state.chain.chains);

function fetchData() {
  store.dispatch('history/getLogs');
}

const logs = computed(() => store.state.history.logs);

const columns = ref([
  {
    title: 'Status',
    key: 'updatedAt',
    width: '10%',
    ellipsis: { tooltip: true },
    render: ({ status }) => {
      const isSuccess = status === 'success';
      return h(Icon, {
        icon: isSuccess ? 'ep:success-filled' : 'ic:round-cancel',
        color: isSuccess ? '#18A058FF' : '#D03050FF',
        width: '1.2rem',
      });
    },
  },
  {
    title: 'Workflow Name',
    key: 'name',
    className: 'text-bold',
    width: '25%',
    ellipsis: { tooltip: true },
    sorter: true,
    sortOrder: false,
    renderSorterIcon: useRenderSortIcon,
  },
  {
    title: 'Chain',
    key: 'chain',
    width: '25%',
    ellipsis: { tooltip: true },
    render: ({ chain }) => {
      return h('div', { style: { display: 'flex', alignItems: 'center' } }, [
        h(NAvatar, {
          style: { background: 'transparent' },
          src: useGetChainImg(chain.name, chains.value),
          round: true,
          size: 'small',
          color: 'white',
        }),
        h('div', { style: { marginLeft: '12px', padding: '4px 0' } }, chain.name),
      ]);
    },
  },
  {
    title: 'Started at',
    key: 'startedAt',
    width: '20%',
    ellipsis: { tooltip: true },
    sorter: true,
    sortOrder: false,
    renderSorterIcon: useRenderSortIcon,
    render: ({ startedAt }) => {
      return moment(startedAt).format('MMM Do YYYY, HH:mm:ss');
    },
  },
  {
    title: 'Finished at',
    key: 'finishedAt',
    width: '20%',
    ellipsis: { tooltip: true },
    sorter: true,
    sortOrder: false,
    renderSorterIcon: useRenderSortIcon,
    render: ({ finishedAt }) => {
      return moment(finishedAt).format('MMM Do YYYY, HH:mm:ss');
    },
  },
]);

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
] = useQuery('history', columns, fetchData);

provide('search', {
  selectedChain,
  selectedStatus,
  query,
  searchText,
  onDebouncedSearch,
  handleSelectChain,
  handleSelectStatus,
  clearAllFilters,
});
</script>
