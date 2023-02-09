<template>
  <n-space vertical :size="32">
    <PageHeader :module="'workflows'" :statusOptions="useWorkflowStatuses" />

    <n-space :wrapItem="false">
      <n-data-table
        row-class-name="pointer-cursor"
        :columns="columns"
        :data="workflows"
        :row-key="({ id }) => id"
        :row-props="rowProps"
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
import ButtonWithPopConfirm from '@/components/Common/ButtonWithPopConfirm';
import RunningOrPausing from '@/components/Common/RunningOrPausing';
import PageHeader from '@/components/Common/PageHeader';
import { NAvatar, useMessage } from 'naive-ui';
import { Icon } from '@iconify/vue';
import { ref, h, provide, computed, watch } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import moment from 'moment';
import Api from '@/api';
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
const chains = computed(() => store.state.chain.chains);

const account = computed(() => store.state.account.selected);
const signer = computed(() => store.state.account.signer);

async function deleteWorkflow({ id, name }) {
  await Api.deleteWorkflow({
    account: account.value,
    signer: signer.value,
    id,
  });
  await store.dispatch('workflow/getWorkflows', { showLoading: false });
  message.success(`Workflow ${name} has been deleted`);
}

function fetchData() {
  store.dispatch('workflow/getWorkflows');
}

const rowProps = ({ id }) => {
  return {
    onClick: () => router.push({ name: 'overview', params: { id } }),
  };
};

const columns = ref([
  {
    title: 'Name',
    key: 'name',
    className: 'text-bold',
    width: '20%',
    ellipsis: { tooltip: true },
    sorter: true,
    sortOrder: false,
    renderSorterIcon: useRenderSortIcon,
  },
  {
    title: 'Chain',
    key: 'chain',
    width: '20%',
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
    key: 'createdAt',
    width: '20%',
    ellipsis: { tooltip: true },
    sorter: true,
    sortOrder: false,
    renderSorterIcon: useRenderSortIcon,
    render: ({ createdAt }) => {
      return moment(createdAt).format('MMM Do YYYY, HH:mm:ss');
    },
  },
  {
    title: 'Updated at',
    key: 'updatedAt',
    width: '20%',
    ellipsis: { tooltip: true },
    sorter: true,
    sortOrder: false,
    renderSorterIcon: useRenderSortIcon,
    render: ({ updatedAt }) => {
      return moment(updatedAt).format('MMM Do YYYY, HH:mm:ss');
    },
  },
  {
    title: 'Status',
    key: 'status',
    width: '20%',
    ellipsis: { tooltip: true },
    render: ({ id, status }) =>
      h(
        'div',
        { onClick: (e) => e.stopPropagation() },
        h(RunningOrPausing, { status, id, fetchOne: false })
      ),
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
            'trigger-content': () =>
              h(Icon, { icon: 'bi:trash', style: { 'margin-right': '1rem' } }),
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
