<template>
  <n-space align="baseline" :wrap-item="false">
    <n-form-item
      class="flex-1"
      label-placement="left"
      label="Chat ID"
      label-align="left"
      :path="`tasks[${actionIdx}].config.chatId`"
      :rule="{
        required: true,
        message: 'Required!',
        trigger: ['input'],
        key: 'setupAction_chatId',
      }"
    >
      <n-input
        clearable
        v-model:value="EditorData.workflow.tasks[actionIdx].config.chatId"
        @update:value="onUpdateChatId"
      />
    </n-form-item>

    <n-button @click="showGuidance" text>
      <Icon icon="material-symbols:info-outline-rounded" />
    </n-button>
  </n-space>

  <n-grid cols="2" x-gap="30" style="margin: 0.5rem 0 1rem 0">
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
        <n-space vertical class="custom-message-card-content" style="height: 50vh; overflow: auto">
          <div v-html="previewContent" class="preview-content" />
        </n-space>
      </n-card>
    </n-gi>
  </n-grid>
</template>

<script setup>
import Compiler from '@/views/CustomMsg/Compiler';
import EditorData from '@/store/localStore/EditorData';
import { h, computed } from 'vue';
import { useCustomMessage } from '@/composables';
import { useStore } from 'vuex';

const store = useStore();
const actionIdx = computed(() => EditorData.actionIdx);
const customMsgKeys = computed(() => store.state.editor.customMsgKeys);

const [
  { content, previewContent, defaultContent, subject, previewSubject, defaultSubject, darkMode },
  { getKeyHTML, getRawText, getFormattedText },
] = useCustomMessage({ channel: 'telegram' });

function showGuidance() {
  console.log('showTeleGuidance');
}

function onUpdateChatId(chatId) {
  store.commit('editor/setCustomMsgConfig', { chatId });
}
</script>

<style lang="scss"></style>
