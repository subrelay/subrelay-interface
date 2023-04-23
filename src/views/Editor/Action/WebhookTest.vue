<template>
  <n-space vertical :size="30">
    <n-card :segmented="{ content: 'soft' }" header-style="padding-bottom: 0.5rem">
      <template #header>
        <div class="title">Input</div>
      </template>

      <n-skeleton v-if="runningTest" text :repeat="2" />
      <WebhookInput v-else :config="config" />
    </n-card>

    <n-card header-style="padding-bottom: 0.5rem" v-if="isTested" :segmented="{ content: 'soft' }">
      <template #header>
        <div class="title">Output</div>
      </template>

      <n-skeleton v-if="runningTest && isTested" text :repeat="2" />
      <n-space vertical :size="10" v-else>
        <div class="input-item">
          <div class="title">Status:</div>
          <n-space :size="4" align="center" :wrap-item="false">
            <StatusIcon :status="testResult.status" />
            <span class="text-capitalize"> {{ testResult.status }} </span>
          </n-space>
        </div>

        <div class="input-item" v-if="testResult.status === 'failed'">
          <div class="title">Message:</div>
          <p>{{ testResult.error?.message || testResult.error?.code }}</p>
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
        :disabled="runningTest || workflowLoading"
      >
        {{ isTested ? 'Retest' : 'Test' }}
      </n-button>
    </n-space>
  </n-space>
</template>

<script setup>
import StatusIcon from '@/components/StatusIcon';
import WebhookInput from '@/views/Editor/Action/WebhookInput';
import EditorData from '@/store/localStore/EditorData';
import { computed, onBeforeUnmount } from 'vue';
import { useStore } from 'vuex';

const store = useStore();
const type = computed(() => EditorData.workflow.tasks[EditorData.actionIdx].type);
const config = computed(() => EditorData.workflow.tasks[EditorData.actionIdx].config);
const eventId = computed(() => EditorData.workflow.tasks[EditorData.triggerIdx].config.eventId);

const runningTest = computed(() => store.state.editor.runningTest[type.value]);
const workflowLoading = computed(() => store.state.workflow.loading.workflow);
const isTested = computed(() => store.state.editor.tested[type.value]);
const testResult = computed(() => store.state.editor.testResult[type.value]);

async function onTest() {
  await store.dispatch('editor/runTask', {
    type: type.value,
    config: config.value,
    data: { eventId: eventId.value },
  });
}
</script>

<style lang="scss"></style>
