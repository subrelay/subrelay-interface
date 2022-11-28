<template>
  <n-space
    align="center"
    justify="center"
    style="height: 80vh; width: 100%"
    v-if="loading"
  >
    <n-spin description="Loading data... Please wait" size="small" />
  </n-space>

  <n-space v-else vertical :size="30">
    <div class="page_title">{{ workflow.name }}</div>

    <n-tabs
      default-value="overview"
      justify-content="space-evenly"
      type="card"
      pane-class="tab-content"
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
</template>

<script setup>
import Overview from '@/components/WorkflowDetails/Overview.vue';
import API from '@/api';
import axios from 'axios';
import { useRoute, useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { onBeforeMount, ref, computed } from 'vue';

const props = defineProps({ id: [String, Number] });
const route = useRoute();
const router = useRouter();
const store = useStore();

const activeTab = ref(null);
const workflow = computed(() => store.state.workflow.workflow);
const loading = computed(() => store.state.workflow.loading);

function onChangeTab(tab) {
  activeTab.value = tab;
  router.push({ name: tab, params: { id: props.id } });
}

onBeforeMount(async () => {
  activeTab.value = route.name;
  store.dispatch('workflow/getWorkflow', +props.id);
});
</script>

<style lang="scss">
.tab-content {
  border: 1px solid rgb(239, 239, 245);
  border-top: none;
  padding: 1rem !important;
}
</style>
