<template>
  <n-space vertical :size="30">
    <n-card :segmented="{ content: 'soft' }" header-style="padding-bottom: 0.5rem" data-test="email-test-input">
      <template #header>
        <div class="title">Input</div>
      </template>

      <div style="margin-bottom: 1.5em">
        To test email, we need to send a new email to the recipients. This is what will be sent to the defined
        {{ `${config.addresses.length > 1 ? 'addresses' : 'address'}` }}.
      </div>

      <n-skeleton v-if="runningTest" text :repeat="5" />

      <n-space vertical :size="10" v-else>
        <div class="input-item" data-test="email-address">
          <div class="title">To:</div>

          <n-text
            v-for="(add, idx) in config.addresses"
            :key="idx"
            code
            style="font-size: 0.85em"
            class="text-ellipsis"
          >
            <span>{{ add }}</span>
            <span v-if="idx !== config.addresses.length - 1">,</span>
          </n-text>
        </div>

        <n-space align="baseline" :size="0" :wrap-item="false" :wrap="false" data-test="email-subject">
          <div class="title" style="width: 100px; min-width: 100px">Subject:</div>
          <n-text code style="font-size: 0.85em">
            {{ getFormattedString(config.subjectTemplate) }}
          </n-text>
        </n-space>

        <n-collapse arrow-placement="right" default-expanded-names="content" data-test="email-content">
          <n-collapse-item title="Content" name="content">
            <template #header>
              <div style="margin-left: -32px; font-weight: normal">Content:</div>
            </template>

            <n-blockquote style="white-space: pre-wrap">
              <div v-html="getFormattedString(config.bodyTemplate)" style="font-size: 0.85em" />
            </n-blockquote>
          </n-collapse-item>
        </n-collapse>
      </n-space>
    </n-card>

    <n-card
      data-test="email-test-output"
      header-style="padding-bottom: 0.5rem"
      v-if="isTested"
      :segmented="{ content: 'soft' }"
    >
      <template #header>
        <div class="title">Output</div>
      </template>

      <n-skeleton v-if="runningTest && isTested" text :repeat="2" />
      <n-space vertical :size="10" v-else>
        <n-space align="center" v-if="testResult.status === 'success'">
          <div>Status:</div>
          <n-space :size="4" align="center" :wrap-item="false">
            <StatusIcon :status="testResult.status" />
            <span class="text-capitalize"> {{ testResult.status }} </span>
          </n-space>
        </n-space>

        <n-space align="center" v-if="testResult.status === 'failed'">
          <div>Message:</div>
          <p>{{ testResult.error?.message || testResult.error?.code }}</p>
        </n-space>

        <div v-else>A test email was sent to all recipient(s).</div>
      </n-space>
    </n-card>

    <n-space justify="end">
      <n-button
        data-test="email-test-run-test-btn"
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
import { useCustomMessage } from '@/composables';
import StatusIcon from '@/components/StatusIcon';
import EditorData from '@/store/localStore/EditorData';
import { computed } from 'vue';
import { useStore } from 'vuex';

const store = useStore();
const config = computed(() => EditorData.workflow.tasks[EditorData.actionIdx].config);
const type = computed(() => EditorData.workflow.tasks[EditorData.actionIdx].type);
const eventId = computed(() => EditorData.workflow.tasks[EditorData.triggerIdx].config.eventId);
const runningTest = computed(() => store.state.editor.runningTest[type.value]);
const workflowLoading = computed(() => store.state.workflow.loading.workflow);
const isTested = computed(() => store.state.editor.tested[type.value]);
const testResult = computed(() => store.state.editor.testResult[type.value]);
// eslint-disable-next-line no-empty-pattern
const [{}, { getFormattedString }] = useCustomMessage({ isCustomizing: false });

async function onTest() {
  await store.dispatch('editor/runTask', {
    type: type.value,
    config: {
      ...config.value,
      subjectTemplate: `====(TESTING EMAIL)==== ${config.value.subjectTemplate}`,
    },
    data: { eventId: eventId.value },
  });
}
</script>

<style lang="scss"></style>
