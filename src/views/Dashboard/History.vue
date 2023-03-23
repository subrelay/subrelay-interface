<template>
  <n-space vertical :size="30">
    <PageHeader title="Logs" :statusOptions="useLogStatuses" />

    <n-space :wrapItem="false">
      <n-data-table
        :columns="columns"
        :data="logs"
        :loading="loading"
        :row-props="rowProps"
        @update:sorter="handleSort"
        row-class-name="pointer-cursor"
      >
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
import PageHeader from '@/components/PageHeader';
import { Icon } from '@iconify/vue';
import { ref, h, provide, computed } from 'vue';
import { useStore } from 'vuex';
import { NAvatar } from 'naive-ui';
import { useQuery, useRenderSortIcon, useLogStatuses, useGetChainImg } from '@/composables';
import moment from 'moment';
import { useRouter } from 'vue-router';

const store = useStore();
const router = useRouter();
const chains = computed(() => store.state.chain.chains);
const darkMode = computed(() => store.state.global.isDarkMode);

function fetchData() {
  store.dispatch('history/getLogs');
}

const logs = computed(() => store.state.history.logs);

const rowProps = ({ id }) => ({
  onClick: () => router.push({ name: 'logDetails', params: { id } }),
});

const columns = ref([
  {
    title: 'Status',
    key: 'updatedAt',
    width: 50,
    ellipsis: { tooltip: true },
    render: ({ status }) => {
      const isSuccess = status === 'success';
      const sucessColor = darkMode.value ? '#63e2b7' : '#18a058ff';
      const failedColor = darkMode.value ? '#e88080' : '#d03050ff';
      return h(Icon, {
        icon: isSuccess ? 'ep:success-filled' : 'ic:round-cancel',
        color: isSuccess ? sucessColor : failedColor,
        width: '1.2rem',
      });
    },
  },
  {
    title: 'Workflow Name',
    key: 'name',
    className: 'text-bold',
    width: '22%',
    ellipsis: { tooltip: true },
    sorter: true,
    sortOrder: false,
    renderSorterIcon: useRenderSortIcon,
  },
  {
    title: 'Chain',
    key: 'chain',
    width: '22%',
    ellipsis: { tooltip: true },
    render: ({ chain }) =>
      h('div', { style: { display: 'flex', alignItems: 'center' } }, [
        h(NAvatar, {
          style: { background: 'transparent' },
          src: useGetChainImg(chain.name, chains.value),
          round: true,
          size: 'small',
          color: 'white',
        }),
        h('div', { style: { marginLeft: '12px', padding: '4px 0' } }, chain.name),
      ]),
  },
  {
    title: 'Started at',
    key: 'startedAt',
    width: '20%',
    ellipsis: { tooltip: true },
    sorter: true,
    sortOrder: false,
    renderSorterIcon: useRenderSortIcon,
    render: ({ startedAt }) => moment(startedAt).local().format('MMM Do YYYY, HH:mm:ss'),
  },
  {
    title: 'Finished at',
    key: 'finishedAt',
    width: '20%',
    ellipsis: { tooltip: true },
    sorter: true,
    sortOrder: false,
    renderSorterIcon: useRenderSortIcon,
    render: ({ finishedAt }) => moment(finishedAt).local().format('MMM Do YYYY, HH:mm:ss'),
  },
  {
    key: 'view',
    width: '10%',
    ellipsis: { tooltip: true },
    render: ({ id }) => {
      return h('div', { style: { display: 'flex', alignItems: 'center' } }, [
        'View',
        h(Icon, { icon: 'akar-icons:chevron-right', style: { 'margin-left': '4px' } }),
      ]);
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
] = useQuery('history', 'logs', columns, fetchData);

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
