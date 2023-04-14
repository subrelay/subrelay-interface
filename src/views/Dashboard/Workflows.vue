<template>
  <n-space vertical :size="32">
    <PageHeader title="workflows" :statusOptions="useWorkflowStatuses" :loading="loading" />

    <n-space :wrapItem="false">
      <n-data-table
        row-class-name="pointer-cursor"
        :columns="columns"
        :data="workflows"
        :row-key="({ id }) => id"
        :row-props="rowProps"
        :loading="loading"
        @update:sorter="handleSort"
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
import EditableCellValue from '@/components/EditableCellValue';
import WorkflowActionMenu from '@/components/WorkflowActionMenu';
import ButtonWithPopConfirm from '@/components/ButtonWithPopConfirm';
import ButtonWithTooltip from '@/components/ButtonWithTooltip';
import WorkflowSwitch from '@/components/WorkflowSwitch';
import PageHeader from '@/components/PageHeader';
import { NAvatar, useMessage, useDialog } from 'naive-ui';
import { Icon } from '@iconify/vue';
import { ref, h, provide, computed } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import moment from 'moment';
import Api from '@/api';
import {
  useQuery,
  useRenderSortIcon,
  useGetChainImg,
  useWorkflowStatuses,
  useShowError,
} from '@/composables';

const message = useMessage();
const store = useStore();
const router = useRouter();
const dialog = useDialog();
const workflows = computed(() => store.state.workflow.workflows);
const chains = computed(() => store.state.chain.chains);
const account = computed(() => store.state.account.selected);
const signer = computed(() => store.state.account.signer);

const rowProps = ({ id }) => ({
  onClick: () => router.push({ name: 'overview', params: { id } }),
});

// HANDLE RENAME
const editingId = ref(null);
const loadingId = ref(null);
const editingValue = ref('');

function onRename({ id, name }) {
  if (loadingId.value !== null) return;
  editingId.value = id;
}

async function renameWorkflow() {
  loadingId.value = editingId.value;
  try {
    await Api.editWorkflow({
      account: account.value,
      signer: signer.value,
      id: editingId.value,
      body: { name: editingValue.value },
    });
    await store.dispatch('workflow/getWorkflows', { showLoading: false });
    message.success('Workflow renamed successfully!');
  } catch (e) {
    message.error(e.message);
  } finally {
    loadingId.value = null;
    editingId.value = null;
  }
}

// HANLDE DELETE
async function deleteWorkflow({ id, name }) {
  try {
    await Api.deleteWorkflow({
      account: account.value,
      signer: signer.value,
      id,
    });
    await store.dispatch('workflow/getWorkflows', { showLoading: false });
    message.success(`Workflow ${name} deleted successfully`);
  } catch (e) {
    const errMsg = e.message;
    if (errMsg === 'Cancelled') {
    } else {
      useShowError(e);
    }
  }
}

function showDeleteConfirm({ id, name }) {
  const d = dialog.warning({
    content: () => h('div', { style: { fontSize: '0.85rem' } }, 'You can’t undo this action.'),
    title: 'Delete worklow?',
    positiveText: 'Delete',
    negativeText: 'Cancel',

    onPositiveClick: async () => {
      d.loading = true;
      d.maskClosable = false;
      d.negativeButtonProps = { disabled: true };
      await deleteWorkflow({ id, name });
      d.loading = false;
      d.maskClosable = true;
      d.negativeButtonProps = { disabled: false };
    },

    onNegativeClick: () => {},
  });
}

const columns = ref([
  {
    title: 'Name',
    key: 'name',
    className: 'text-bold',
    width: '30%',
    ellipsis: { tooltip: true },
    sorter: true,
    sortOrder: false,
    renderSorterIcon: useRenderSortIcon,
    render(row) {
      return h(EditableCellValue, {
        value: row.name,
        isEditing: editingId.value === row.id,
        loading: loadingId.value === row.id,
        submit: renameWorkflow,
        onInput: (v) => (editingValue.value = v),
      });
    },
  },
  {
    title: 'Chain',
    key: 'chain',
    width: '20%',
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
    title: 'Created at',
    key: 'createdAt',
    width: '20%',
    ellipsis: { tooltip: true },
    sorter: true,
    sortOrder: false,
    renderSorterIcon: useRenderSortIcon,
    render: ({ createdAt }) => moment(createdAt).local().format('MMM Do YYYY, HH:mm:ss'),
  },
  {
    title: 'Updated at',
    key: 'updatedAt',
    width: '20%',
    ellipsis: { tooltip: true },
    sorter: true,
    sortOrder: false,
    renderSorterIcon: useRenderSortIcon,
    render: ({ updatedAt }) => moment(updatedAt).local().format('MMM Do YYYY, HH:mm:ss'),
  },
  {
    title: 'Status',
    key: 'status',
    width: '10%',
    ellipsis: { tooltip: true },
    render: ({ id, status }) =>
      h(
        'div',
        { onClick: (e) => e.stopPropagation() },
        h(WorkflowSwitch, { status, id, fetchOne: false }),
      ),
  },
  {
    key: 'action',
    align: 'right',
    width: '10%',
    render({ id, name }) {
      const saveNode = h(
        ButtonWithTooltip,
        {
          tooltipText: 'Save',
          disabled: loadingId.value === id,
          onClick: renameWorkflow,
        },
        {
          'trigger-content': () => h(Icon, { icon: 'grommet-icons:checkmark' }),
        },
      );

      const cancelNode = h(
        ButtonWithTooltip,
        {
          tooltipText: 'Cancel',
          disabled: loadingId.value === id,
          onClick: () => (editingId.value = null),
        },
        {
          'trigger-content': () =>
            h(Icon, {
              icon: 'grommet-icons:close',
              style: { 'margin-left': '1rem', 'margin-right': '0' },
            }),
        },
      );

      const menuNode = h(WorkflowActionMenu, {
        onRename: () => onRename({ id, name }),
        onViewDetails: () => router.push({ name: 'overview', params: { id } }),
        onViewLog: () => router.push({ name: 'workflowLogs', params: { id } }),
        onDelete: () => showDeleteConfirm({ id, name }),
      });

      return h(
        'div',
        { onClick: (e) => e.stopPropagation() },
        editingId.value === id ? [saveNode, cancelNode] : menuNode,
      );
    },
  },
]);

function fetchData() {
  store.dispatch('workflow/getWorkflows');
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
] = useQuery('workflow', 'workflows', columns, fetchData);

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
