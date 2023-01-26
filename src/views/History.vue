<template>
  <n-space vertical :size="30">
    <PageHeader :module="'history'" :statusOptions="useLogStatuses" />

    <n-space :wrapItem="false">
      <n-data-table
        :columns="columns"
        :data="logs"
        :render-cell="useRenderCell"
        :loading="loading"
        @update:sorter="handleSort"
      >
        <template #empty>
          <n-empty
            description="No data available"
            :show-icon="false"
            :size="'small'"
          >
          </n-empty>
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
import {
  useQuery,
  useRenderSortIcon,
  useRenderCell,
  useGetChainImg,
  useLogStatuses,
} from '@/composables';

const store = useStore();

function fetchData() {
  store.dispatch('history/getLogs');
}

const logs = computed(() => store.state.history.logs);

const columns = ref([
  {
    title: 'Status',
    key: 'updatedAt',
    sorter: false,
    width: '10%',
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
    sorter: true,
    sortOrder: false,
    renderSorterIcon: useRenderSortIcon,
  },
  {
    title: 'Chain',
    key: 'chain',
    width: 180,
    sorter: true,
    sortOrder: false,
    renderSorterIcon: useRenderSortIcon,
    render: (workflow) => {
      return h('div', { style: { display: 'flex', alignItems: 'center' } }, [
        h(NAvatar, {
          src: 'https://polkadot.js.org/apps/static/westend_colour.eb7969da..svg',
          round: true,
          size: 'small',
          color: 'white',
        }),
        h('div', { style: { marginLeft: '12px', padding: '4px 0' } }, 'Westen'),
      ]);
    },
  },
  {
    title: 'Started at',
    key: 'started_at',
    ellipsis: { tooltip: true },
    sorter: true,
    sortOrder: false,
    renderSorterIcon: useRenderSortIcon,
    render: ({ started_at }) => {
      return moment(started_at).format('MMM Do YYYY, HH:mm:ss');
    },
  },
  {
    title: 'Finished at',
    key: 'finished_at',
    ellipsis: { tooltip: true },
    sorter: true,
    sortOrder: false,
    renderSorterIcon: useRenderSortIcon,
    render: ({ finished_at }) => {
      return moment(finished_at).format('MMM Do YYYY, HH:mm:ss');
    },
  },
]);

const [
  {
    query,
    searchText,
    loading,
    tablePagination,
    selectedChain,
    selectedStatus,
  },
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
