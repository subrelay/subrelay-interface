<template>
  <n-space vertical :size="30" class="step_container">
    <n-card
      :segmented="{ content: 'soft' }"
      header-style="padding-bottom: 0.5rem"
    >
      <template #header>
        <div class="title">Input</div>
      </template>

      <n-skeleton v-if="loading" text :repeat="5" />
      <n-space vertical :size="10" v-else>
        <div class="input-item">
          <div class="title">URL:</div>
          <n-text code>{{ notiConfig.url }}</n-text>
        </div>

        <div class="input-item">
          <div class="title">Header:</div>
          <n-text code>
            {{ headerObj }}
          </n-text>
        </div>

        <n-space vertical>
          <div class="title">Body:</div>
          <JsonEventSample />
        </n-space>
      </n-space>
    </n-card>

    <n-card
      header-style="padding-bottom: 0.5rem"
      v-if="isTested"
      :segmented="{ content: 'soft' }"
    >
      <template #header>
        <div class="title">Output</div>
      </template>

      <n-skeleton v-if="loading && isTested" text :repeat="2" />
      <n-space vertical :size="10" v-else>
        <div class="input-item">
          <div class="title">Status:</div>

          <Icon
            :inline="true"
            :icon="
              taskResponse.success ? 'ep:success-filled' : 'ic:round-cancel'
            "
            :color="taskResponse.success ? '#18A058FF' : '#D03050FF'"
            :width="'1.2rem'"
            style="margin-right: 5px"
          />
          <span class="text-capitalize">
            {{ taskResponse.success ? 'Success' : 'Failed' }}
          </span>
        </div>

        <div class="input-item" v-if="!taskResponse.success">
          <div class="title">Message:</div>
          <p>{{ taskResponse.error.message }}</p>
        </div>

        <div class="input-item" v-if="taskResponse.result">
          <div class="title">Result:</div>
          <p>{{ taskResponse.result }}</p>
        </div>
      </n-space>
    </n-card>

    <n-space justify="end">
      <n-button
        class="action_button"
        type="primary"
        @click="onTest"
        :loading="loading"
        :disabled="loading || postWorkflowLoading"
      >
        {{ isTested ? 'Retest' : 'Test' }}
      </n-button>

      <n-button
        class="action_button"
        type="primary"
        v-if="isTested"
        @click="eventBus.emit('finish')"
        :loading="postWorkflowLoading"
        :disabled="loading || postWorkflowLoading"
      >
        Finish
      </n-button>
    </n-space>
  </n-space>
</template>

<script setup>
import API from '@/api';
import JsonEventSample from '@/components/Common/JsonEventSample';
import EditorData from '@/store/localStore/EditorData';
import { computed, ref, inject, onBeforeUnmount } from 'vue';
import { useStore } from 'vuex';
const store = useStore();

const loading = ref(null);
const isTested = ref(false);
const postWorkflowLoading = computed(() => store.state.workflow.loading);
const taskResponse = ref({});

const eventBus = inject('eventBus');
eventBus.on('toggleTestAction', resetTest);
onBeforeUnmount(() => eventBus.off('toggleTestAction', resetTest));

function resetTest({ isDisabled }) {
  if (isDisabled) isTested.value = false;
}

const notiConfig = computed(() => {
  return EditorData.workflow.tasks[1].config.config;
});

const headerObj = computed(() => {
  const keyValueArr = Object.values(notiConfig.value.headers[0]);
  return Object.fromEntries([keyValueArr]);
});

const sample = {
  id: 123,
  name: 'balances.deposit',
  description: 'This Event Does This',
  data: { who: '', amount: 123 },
  status: 'success',
  extrinsic: { name: 'balances.deposit' },
  block: { hash: '', number: 123, timestamp: '' },
};

async function onTest() {
  loading.value = true;
  const { type, config } = EditorData.workflow.tasks[EditorData.actionIdx];
  const res = await API.Task.runTask({ type, data: sample, config });
  taskResponse.value = res;
  loading.value = false;
  isTested.value = true;
}

function parsePascalCaseStr(string) {
  if (!string) return;
  return string.replace(/([a-z])([A-Z])/g, '$1 $2').toLowerCase();
}
</script>

<style lang="scss">
.input-item {
  display: flex;
  align-items: center;
  .title {
    width: 15%;
  }
}
</style>
