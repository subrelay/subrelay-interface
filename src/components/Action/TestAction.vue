<template>
  <n-space vertical :size="30" class="step_container">
    <n-card
      :segmented="{ content: 'soft' }"
      header-style="padding-bottom: 0.5rem"
    >
      <template #header>
        <div class="title">Input</div>
      </template>

      <n-skeleton v-if="runningTest" text :repeat="5" />
      <WebhookInput v-else :config="config" />
    </n-card>

    <n-card
      header-style="padding-bottom: 0.5rem"
      v-if="isTested"
      :segmented="{ content: 'soft' }"
    >
      <template #header>
        <div class="title">Output</div>
      </template>

      <n-skeleton v-if="runningTest && isTested" text :repeat="2" />
      <n-space vertical :size="10" v-else>
        <div class="input-item">
          <div class="title">Status:</div>

          <Icon
            :inline="true"
            :icon="testResult.success ? 'ep:success-filled' : 'ic:round-cancel'"
            :color="testResult.success ? '#18A058FF' : '#D03050FF'"
            :width="'1.2rem'"
            style="margin-right: 5px"
          />
          <span class="text-capitalize">
            {{ testResult.success ? 'Success' : 'Failed' }}
          </span>
        </div>

        <div class="input-item" v-if="!testResult.success">
          <div class="title">Message:</div>
          <p>{{ testResult.error.message }}</p>
        </div>

        <div class="input-item" v-if="testResult.result">
          <div class="title">Result:</div>
          <p>{{ testResult.result }}</p>
        </div>
      </n-space>
    </n-card>

    <n-space justify="end">
      <n-button
        class="action_button"
        type="primary"
        @click="onTest"
        :loading="runningTest"
        :disabled="runningTest || postWorkflowLoading"
      >
        {{ isTested ? 'Retest' : 'Test' }}
      </n-button>
      <n-button
        class="action_button"
        type="primary"
        v-if="isTested"
        @click="eventBus.emit('finish')"
        :loading="postWorkflowLoading"
        :disabled="runningTest || postWorkflowLoading"
      >
        Finish
      </n-button>
    </n-space>
  </n-space>
</template>

<script setup>
import WebhookInput from '@/components/Action/WebhookInput';
import EditorData from '@/store/localStore/EditorData';
import { computed, inject, onBeforeUnmount } from 'vue';
import { useStore } from 'vuex';

const store = useStore();
const postWorkflowLoading = computed(() => store.state.workflow.loading);
const runningTest = computed(() => store.state.task.runningTest);
const isTested = computed(() => store.state.task.tested);
const testResult = computed(() => store.state.task.testResult);

const eventBus = inject('eventBus');
eventBus.on('toggleTestAction', resetTest);
onBeforeUnmount(() => eventBus.off('toggleTestAction', resetTest));

function resetTest({ isDisabled }) {
  if (isDisabled) {
    store.commit('setTested', false);
  }
}

const config = computed(() => {
  return EditorData.workflow.tasks[1].config.config;
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
  const { type, config } = EditorData.workflow.tasks[EditorData.actionIdx];
  store.dispatch('task/runTask', { type, data: sample, config });
}
</script>

<style lang="scss"></style>
