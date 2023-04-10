<template>
  <n-space vertical :size="30">
    <n-card :segmented="{ content: 'soft' }" header-style="padding-bottom: 0.5rem">
      <template #header>
        <div class="title">Input</div>
      </template>

      <div style="margin-bottom: 1.5em">
        To test email, we need to send a new email to the recipients. This is what will be sent to
        the defined {{ `${emailConfig.addresses.length > 1 ? 'addresses' : 'address'}` }}.
      </div>

      <n-skeleton v-if="runningTest" text :repeat="5" />
      <EmailInput :config="emailConfig" v-else />
    </n-card>

    <n-card header-style="padding-bottom: 0.5rem" v-if="isTested" :segmented="{ content: 'soft' }">
      <template #header>
        <div class="title">Output</div>
      </template>

      <n-skeleton v-if="runningTest && isTested" text :repeat="2" />
      <n-space vertical :size="10" v-else>
        <div class="input-item" style="align-items: center">
          <div class="title">Status:</div>
          <StatusIcon :isSuccess="testResult.success" />

          <span class="text-capitalize" style="margin-left: 4px">
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

        <div>A test email was sent to all recipient(s).</div>
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
import EmailInput from '@/views/Editor/Action/EmailInput';
import EditorData from '@/store/localStore/EditorData';
import { computed, ref } from 'vue';
import { useStore } from 'vuex';

const store = useStore();
const showContent = ref(false);
const emailConfig = computed(() => store.state.editor.emailConfig);
const type = computed(() => EditorData.workflow.tasks[EditorData.actionIdx].type);
const config = computed(() => EditorData.workflow.tasks[EditorData.actionIdx].config);
const eventId = computed(() => EditorData.workflow.tasks[EditorData.triggerIdx].config.eventId);

const runningTest = computed(() => store.state.task.runningTest[type.value]);
const workflowLoading = computed(() => store.state.workflow.loading.workflow);
const isTested = computed(() => store.state.task.tested[type.value]);
const testResult = computed(() => store.state.task.testResult[type.value]);

function resetTest({ isDisabled }) {
  if (isDisabled) {
    store.commit('task/setTested', false);
  }
}

async function onTest() {
  await store.dispatch('task/runTask', {
    type: type.value,
    config: config.value,
    data: { eventId: +eventId.value },
  });
}
</script>

<style lang="scss"></style>
