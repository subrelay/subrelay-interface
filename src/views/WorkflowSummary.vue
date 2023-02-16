<template>
  <n-space align="center" justify="center" style="height: 80vh; width: 100%" v-if="loading">
    <n-spin description="Loading data... Please wait" size="small" />
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

    <n-space vertical :size="30" v-else style="margin-bottom: 5vh">
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
          <router-view :key="activeTab" />
        </n-tab-pane>

        <!-- <n-tab-pane name="logs" tab="Logs">
          <router-view :key="activeTab" />
        </n-tab-pane> -->
      </n-tabs>
    </n-space>
  </n-space>
</template>

<script setup>
import Overview from '@/components/WorkflowDetails/Overview.vue';
import { useRoute, useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { onBeforeMount, ref, computed, watch } from 'vue';
import { isEmpty } from 'lodash';

const props = defineProps({ id: [String, Number] });
const route = useRoute();
const router = useRouter();
const store = useStore();

const activeTab = ref(null);
const workflow = computed(() => store.state.workflow.workflow);
const loading = computed(() => store.state.workflow.loading);
const selectedAccount = computed(() => store.state.account.selected);
const darkMode = computed(() => store.state.global.isDarkMode);

function onChangeTab(tab) {
  activeTab.value = tab;
  router.push({ name: tab, params: { id: props.id } });
}

watch(
  selectedAccount,
  () => {
    if (selectedAccount) {
      store.dispatch('workflow/getWorkflow', { id: +props.id });
    }
  },
  { immediate: true },
);

onBeforeMount(async () => {
  activeTab.value = route.name;
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
