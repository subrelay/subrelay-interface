<template>
  <n-space vertical :size="30">
    <PageHeader :module="'workflows'" :statusOptions="useWorkflowStatuses" />

    <n-data-table
      :columns="columns"
      :data="workflows"
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
import PageHeader from '@/components/Common/PageHeader';
import { NAvatar, NSwitch, NTooltip, useMessage } from 'naive-ui';
import { Icon } from '@iconify/vue';
import { ref, h, provide, computed } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import moment from 'moment';
import {
  useQueryParams,
  useRenderSortIcon,
  useRenderCell,
  useGetChainImg,
  useWorkflowStatuses,
} from '@/composables';

const message = useMessage();
const store = useStore();
const router = useRouter();

function deleteRow(rowData) {
  message.info(`Workflow ${rowData.name} has been deleted`);
}

function handleUpdateValue(status, loading) {
  loading = true;
}

const columns = ref([
  {
    title: 'Name',
    key: 'name',
    ellipsis: { tooltip: true },
    sorter: true,
    sortOrder: false,
    renderSorterIcon: useRenderSortIcon,
    render: ({ name, id }) => {
      return h(
        'div',
        {
          class: 'text-bold cursor-pointer',
          onClick: () => router.push({ name: 'trigger', params: { id } }),
        },
        name
      );
    },
  },
  {
    title: 'Chain',
    key: 'chain',
    width: 180,
    sorter: true,
    sortOrder: false,
    renderSorterIcon: useRenderSortIcon,
    render: ({ chain }) => {
      return h('div', { style: { display: 'flex', alignItems: 'center' } }, [
        h(NAvatar, {
          src: useGetChainImg(chain.name),
          round: true,
          size: 'small',
          color: 'white',
        }),
        h(
          'div',
          { style: { marginLeft: '12px', padding: '4px 0' } },
          chain.name
        ),
      ]);
    },
  },
  {
    title: 'Created at',
    key: 'created_at',
    ellipsis: { tooltip: true },
    sorter: true,
    sortOrder: false,
    renderSorterIcon: useRenderSortIcon,
    render: ({ created_at }) => {
      return moment(created_at).format('MMM Do YYYY, HH:mm:ss');
    },
  },
  {
    title: 'Updated at',
    key: 'updated_at',
    ellipsis: { tooltip: true },
    sorter: true,
    sortOrder: false,
    renderSorterIcon: useRenderSortIcon,
    render: ({ updated_at }) => {
      return moment(updated_at).format('MMM Do YYYY, HH:mm:ss');
    },
  },
  {
    title: 'Status',
    key: 'status',
    sorter: false,
    width: '10%',
    render: ({ status }) => {
      return h(
        NTooltip,
        { showArrow: false },
        {
          trigger: () =>
            // tach thanh component, refer ShowOrEdit
            // & easier to manage loading state.
            h(NSwitch, {
              // loading: false,
              // value: status,
              onUpdateValue: (newValue) => {
                console.log('newValue', newValue);
              },
            }),
          default: () => status,
        }
      );
    },
  },
  {
    key: 'edit',
    align: 'right',
    width: '5%',
    render(row) {
      return h('div', [
        h(
          ButtonWithPopConfirm,
          {
            style: { 'margin-right': '1rem' },
            onPositiveClick: () => deleteRow(row),
            elementKey: row.id,
            tooltipText: 'Delete workflow',
            confirmText: 'Are you sure to delete this workflow?',
          },
          {
            'trigger-content': () => h(Icon, { icon: 'bi:trash' }),
          }
        ),
      ]);
    },
  },
]);

const workflows = computed(() => store.state.workflow.workflows);

function fetchData() {
  store.dispatch('workflow/getWorkflows');
}

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
] = useQueryParams('workflow', columns, fetchData);

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
