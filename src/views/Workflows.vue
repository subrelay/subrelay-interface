<template>
  <n-space vertical :size="32">
    <PageHeader :module="'workflows'" :statusOptions="useWorkflowStatuses" />

    <n-space :wrapItem="false">
      <n-data-table
        :columns="columns"
        :data="workflows"
        :row-key="({ id }) => id"
        :render-cell="useRenderCell"
        :loading="loading"
        @update:sorter="handleSort"
      />

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
import ButtonWithPopConfirm from '@/components/Common/ButtonWithPopConfirm';
import RunningOrPausing from '@/components/Common/RunningOrPausing';
import PageHeader from '@/components/Common/PageHeader';
import { NAvatar, useMessage } from 'naive-ui';
import { Icon } from '@iconify/vue';
import { ref, h, provide, computed } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import moment from 'moment';
import API from '@/api';
import axios from 'axios';
import {
  useQuery,
  useRenderSortIcon,
  useRenderCell,
  useGetChainImg,
  useWorkflowStatuses,
} from '@/composables';

const message = useMessage();
const store = useStore();
const router = useRouter();
const workflows = computed(() => store.state.workflow.workflows);

function deleteWorkflow({ id, name }) {
  // await API.Workflow.deleteWorkflow(id)
  // await store.dispatch('workflow/getWorkflows');
  // message.success(`Workflow ${name} has been deleted`);

  return new Promise((resolve) => {
    setTimeout(async () => {
      const { data: newWorkflows } = await axios({
        url: 'mockData/workflow/deleteWorkflow.json',
        baseURL: 'http://127.0.0.1:5173',
      });

      store.commit('workflow/getWorkflows', newWorkflows);
      message.success(`Workflow ${name} has been deleted`);

      resolve();
    }, 1000);
  });
}

function fetchData() {
  store.dispatch('workflow/getWorkflows');
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
          onClick: () => router.push({ name: 'overview', params: { id } }),
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
    render: ({ id, status }) => {
      return h(RunningOrPausing, { status, id, fetchOne: false });
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
            onPositiveClick: async () => await deleteWorkflow(row),
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
] = useQuery('workflow', columns, fetchData);

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
