<template>
  <n-space vertical :size="30">
    <n-card :segmented="{ content: 'soft' }" header-style="padding-bottom: 0.5rem">
      <template #header>
        <div class="title">Input</div>
      </template>

      <div style="margin-bottom: 1.5em">
        To test Telegram notification, we need to send a new message with below configuration:
      </div>

      <n-skeleton v-if="runningTest" text :repeat="5" />

      <n-space vertical :size="10" v-else>
        <div class="input-item">
          <div class="title">Chat id:</div>
          <n-text code class="text-ellipsis" style="font-size: 0.85em">{{ config.chatId }}</n-text>
        </div>

        <n-collapse arrow-placement="right" default-expanded-names="">
          <n-collapse-item title="Content" name="content">
            <template #header>
              <div style="margin-left: -32px; font-weight: normal">Content:</div>
            </template>

            <n-blockquote style="white-space: pre-wrap">
              <div v-html="getFormattedText(config.messageTemplate)" style="font-size: 0.85em" />
            </n-blockquote>
          </n-collapse-item>
        </n-collapse>
      </n-space>
    </n-card>

    <n-card header-style="padding-bottom: 0.5rem" v-if="isTested" :segmented="{ content: 'soft' }">
      <template #header>
        <div class="title">Output</div>
      </template>

      <n-skeleton v-if="runningTest && isTested" text :repeat="2" />
      <n-space vertical :size="10" v-else>
        <div class="input-item" style="align-items: center">
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

        <div v-else>
          A test message was sent to the defined chat with id
          <n-text code>{{ config.chatId }}</n-text>
          .
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
import EditorData from '@/store/localStore/EditorData';
import { useCustomMessage } from '@/composables';
import { computed, ref } from 'vue';
import { useStore } from 'vuex';

const store = useStore();
const config = computed(() => EditorData.workflow.tasks[EditorData.actionIdx].config);
const type = computed(() => EditorData.workflow.tasks[EditorData.actionIdx].type);
const eventId = computed(() => EditorData.workflow.tasks[EditorData.triggerIdx].config.eventId);

const runningTest = computed(() => store.state.editor.runningTest[type.value]);
const workflowLoading = computed(() => store.state.workflow.loading.workflow);
const isTested = computed(() => store.state.editor.tested[type.value]);
const testResult = computed(() => store.state.editor.testResult[type.value]);
const [{}, { getFormattedText }] = useCustomMessage({ isCustomizing: false });

async function onTest() {
  const { chatId, messageTemplate } = config.value;

  await store.dispatch('editor/runTask', {
    type: type.value,
    data: { eventId: eventId.value },
    config: {
      chatId,
      messageTemplate: `====(TESTING MESSAGE)==== \n\n${messageTemplate}`,
    },
  });
}
</script>

<style lang="scss"></style>
