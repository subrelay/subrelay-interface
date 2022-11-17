<template>
  <n-space vertical :size="30">
    <PageHeader :module="'history'" :statusOptions="statuses" />

    <n-data-table
      :columns="columns"
      :data="logs"
      :pagination="tablePagination"
      :render-cell="useRenderCell"
      :loading="loading"
      @update:page="handlePageChange"
      @update:sorter="handleSort"
    />
  </n-space>
</template>

<script setup>
import ButtonWithPopConfirm from '@/components/Common/ButtonWithPopConfirm';
import { Icon } from '@iconify/vue';
import { ref, h, provide, computed } from 'vue';
import { useStore } from 'vuex';
import { NAvatar } from 'naive-ui';
import PageHeader from '@/components/Common/PageHeader';
import moment from 'moment';
import {
  useQueryParams,
  useRenderSortIcon,
  useRenderCell,
} from '@/composables';

const store = useStore();

const statuses = ref([
  {
    label: 'Success',
    value: 'success',
    icon: 'ep:success-filled',
    iconColor: '#18A058FF',
  },
  {
    label: 'Failed',
    value: 'failed',
    icon: 'ic:round-cancel',
    iconColor: '#D03050FF',
  },
]);

function getChainImg(chain) {
  switch (chain.toLowerCase()) {
    case 'acala':
      return 'https://avatars.githubusercontent.com/u/54881907?s=280&v=4';
    case 'polkadot':
      return 'https://cryptologos.cc/logos/polkadot-new-dot-logo.png';
    case 'kusama':
      return 'https://www.liblogo.com/img-logo/ku2766k057-kusama-logo-kusama-ksm-bitprime.png';
  }
}

function fetchData() {
  // console.log('component fetch data');
  loading.value = true;

  setTimeout(() => {
    loading.value = false;
  }, 300);
}

const logs = computed(() => store.state.history.logs);

const columns = ref([
  {
    title: 'Status',
    key: 'updated_at',
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
    render: ({ workflow }) => {
      return workflow.name;
    },
  },
  {
    title: 'Chain',
    key: 'chain',
    width: 180,
    sorter: true,
    sortOrder: false,
    renderSorterIcon: useRenderSortIcon,
    render: ({ workflow }) => {
      return h('div', { style: { display: 'flex', alignItems: 'center' } }, [
        h(NAvatar, {
          src: getChainImg(workflow.chain.name),
          round: true,
          size: 'small',
          color: 'white',
        }),
        h(
          'div',
          { style: { marginLeft: '12px', padding: '4px 0' } },
          workflow.chain.name
        ),
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
    queryParams,
    searchText,
    loading,
    tablePagination,
    selectedChain,
    selectedStatus,
  },
  {
    onDebouncedSearch,
    handleSort,
    handleSearch,
    handlePageChange,
    handleSelectChain,
    handleSelectStatus,
    initQueryParams,
    clearAllFilters,
  },
] = useQueryParams('history', columns, fetchData);

provide('search', {
  selectedChain,
  selectedStatus,
  queryParams,
  searchText,
  onDebouncedSearch,
  handleSelectChain,
  handleSelectStatus,
  clearAllFilters,
});
</script>
