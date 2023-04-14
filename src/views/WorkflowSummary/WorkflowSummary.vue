<template>
  <n-space align="center" justify="center" style="height: 80vh; width: 100%" v-if="loading">
    <Icon icon="eos-icons:three-dots-loading" width="50" color="rgba(230, 0, 122, 1)" />
  </n-space>

  <n-space v-else vertical>
    <n-result
      style="margin-top: 20vh"
      v-if="workflow === 'Workflow not found'"
      status="error"
      title="Workflow Not Found"
      description="The workflow you are looking for is not existed. Let's back to the home page."
    >
      <template #footer>
        <n-button @click="router.push('/')">Go to home page</n-button>
      </template>
    </n-result>

    <n-space v-else vertical :size="20" style="margin-bottom: 5vh">
      <div class="page_title">{{ workflow.name }}</div>
      <n-tabs
        v-if="workflow.tasks"
        default-value="overview"
        justify-content="space-evenly"
        type="card"
        :pane-class="`tab-content ${darkMode ? 'dark' : ''}`"
        :value="activeTab"
        @update:value="onChangeTab"
      >
        <n-tab-pane name="overview" tab="Overview">
          <Overview :id="id" />
        </n-tab-pane>

        <n-tab-pane name="workflowLogs" tab="Logs">
          <WorkflowLogs :id="id" />
        </n-tab-pane>
      </n-tabs>
    </n-space>
  </n-space>
</template>

<script setup>
import WorkflowLogs from '@/views/WorkflowSummary/WorkflowLogs';
import Overview from '@/views/WorkflowSummary/Overview';
import { useRoute, useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { onBeforeMount, onBeforeUnmount, ref, computed, watch } from 'vue';
import { isEmpty } from 'lodash';

const props = defineProps({ id: [String, Number] });
const route = useRoute();
const router = useRouter();
const store = useStore();
const activeTab = ref(null);
const workflow = computed(() => store.state.workflow.workflow);
const loading = computed(() => store.state.workflow.loading.workflow);
const selectedAccount = computed(() => store.state.account.selected);
const darkMode = computed(() => store.state.global.isDarkMode);

const triggerTask = ref(null);

watch(workflow, (newWorkflow) => {
  if (newWorkflow.tasks) {
    triggerTask.value = newWorkflow.tasks.find((task) => task.type === 'trigger');
    const { eventId } = triggerTask.value.config;
    const {
      chain: { uuid },
    } = newWorkflow;
    if (eventId) {
      store.dispatch('chain/getEvent', { uuid, eventId });
    }
  }
});

function onChangeTab(tab) {
  activeTab.value = tab;
  router.push({ name: tab, params: { id: props.id } });
}

watch(
  selectedAccount,
  () => {
    if (!isEmpty(selectedAccount.value)) {
      store.dispatch('workflow/getWorkflow', { id: props.id });
    }
  },
  { immediate: true },
);

onBeforeMount(async () => (activeTab.value = route.name));

onBeforeUnmount(() => {
  store.commit('log/getLog', []);
  store.commit('log/getItemCount', { log: null });
});
</script>

<style lang="scss">
.tab-content {
  border: 1px solid rgb(239, 239, 245);
  border-top: none;
  padding: 1rem !important;

  &.dark {
    border-color: rgba(255, 255, 255, 0.09);
  }
}
</style>
