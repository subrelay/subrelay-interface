<template>
  <n-space :wrap-item="false" vertical :size="24">
    <div>
      <b>Subrelay Bot</b> will send notifications to your
      <span class="text-capitalize">{{ channel }}</span> account
      <n-text code class="text-bold">{{ userInfo.integration[channel] }} </n-text>.
    </div>

    <n-space align="center" v-if="formState === 'setupKey'">
      <div class="text-bold">Key:</div>
      <n-text code>{{ userInfo.key }}</n-text>

      <div>
        <div class="code__icon completed" v-if="isCopied">
          <Icon icon="akar-icons:check" width="13" />
        </div>

        <div class="code__icon copy" @click="onCopy" v-else>
          <Icon icon="fluent:document-copy-48-filled" width="13" />
        </div>
      </div>

      <n-tooltip trigger="hover" placement="top-start">
        <template #trigger>
          <n-button text>
            <Icon icon="material-symbols:info-outline-rounded" />
          </n-button>
        </template>
        Add this key to Subrelay Bot in your {{ channel }} chat box.
      </n-tooltip>
    </n-space>

    <n-space vertical v-if="formState === 'customMsg'">
      <div>You can customize the notification message content below.</div>

      <n-grid cols="2" x-gap="30" style="margin: 1rem 0">
        <!-- COMPILER -->
        <n-gi>
          <n-card
            :segmented="{ content: true }"
            title="CUSTOM MESSAGE"
            header-style="font-size: 0.85rem; font-weight: bold; padding:10px"
            content-style="padding:0"
          >
            <n-space vertical class="custom-message-card-content" :wrap-item="false">
              <Compiler
                v-model="content"
                class="email-content compiler"
                field="messageTemplate"
                @getRawText="getRawText"
                :class="{ dark: darkMode }"
                :defaultContent="defaultContent"
              />

              <CustomError :show="requiredMessage" />
            </n-space>
          </n-card>
        </n-gi>

        <!-- PREVIEW -->
        <n-gi>
          <n-card
            title="PREVIEW"
            header-style="font-size: 0.85rem; font-weight: bold; padding:10px"
            content-style="padding:0"
            :segmented="{ content: true }"
          >
            <n-space
              vertical
              class="custom-message-card-content"
              style="height: 50vh; overflow: auto"
            >
              <div v-html="previewContent" class="preview-content" />
            </n-space>
          </n-card>
        </n-gi>
      </n-grid>

      <!-- <n-button
      class="action_button"
      type="primary"
      v-if="EditorData.workflow.tasks[EditorData.actionIdx].type"
      @click="validateSetupAction"
    >
      Continue
    </n-button> -->
    </n-space>

    <n-space align="center" justify="end">
      <n-button type="primary">Reconfigure key</n-button>
      <n-button type="primary" @click="onContinue"> Continue </n-button>
    </n-space>
  </n-space>
</template>

<script setup>
import CustomError from '@/components/CustomError';
import EditorData from '@/store/localStore/EditorData';
import Compiler from '@/views/CustomMsg/Compiler';
import { useCustomMessage } from '@/composables';
import { computed, ref, inject } from 'vue';
import { useMessage } from 'naive-ui';
import { useStore } from 'vuex';

const props = defineProps(['channel']);
const [{ content, previewContent, defaultContent, darkMode }, { getRawText }] = useCustomMessage({
  channel: props.channel,
});

const store = useStore();
const message = useMessage();
const isCopied = ref(false);
const formState = ref(null);
const userInfo = computed(() => store.state.account.userInfo);
const actionConfig = computed(() => EditorData.workflow.tasks[EditorData.actionIdx].config);
const requiredMessage = computed(() => store.state.editor.error.messageTemplate);

function onCopy() {
  navigator.clipboard.writeText(userInfo.value.key);
  isCopied.value = true;
  message.success('Copied!');
  setTimeout(() => (isCopied.value = false), 1500);
}

const eventBus = inject('eventBus');

function validateSetupAction() {
  if (
    !actionConfig.value.messageTemplate ||
    actionConfig.value.messageTemplate === '<br>' ||
    actionConfig.value.messageTemplate === '<p></p>'
  ) {
    store.commit('editor/setError', { messageTemplate: true });
    EditorData.setError('action', true);
  } else {
    store.commit('editor/disableTestAction', false);
    EditorData.setComplete('action', true);
    EditorData.setError('action', false);

    eventBus.emit('validate', { taskName: 'action', keys: ['setupAction'], nextExpand: '3' });
  }
}

function onContinue() {
  if (formState.value !== 'customMsg') {
    formState.value = 'customMsg';
    return;
  }

  validateSetupAction();
}
</script>

<style lang="scss"></style>
