<template>
  <n-space>
    <n-radio
      name="channel"
      value="channelId"
      @change="handleChange"
      :checked="checkedValue === 'channelId'"
    >
      Channel Id
    </n-radio>

    <n-radio
      name="channel"
      value="userId"
      @change="handleChange"
      :checked="checkedValue === 'userId'"
    >
      User Id
    </n-radio>
  </n-space>

  <n-form-item
    :path="`tasks[${actionIdx}].config.chatId`"
    :rule="{
      required: true,
      message: 'Required!',
      trigger: ['input'],
      key: 'setupAction_id',
    }"
  >
    <n-space align="center" :wrap-item="false">
      <n-input
        style="width: 20vw; max-width: 250px"
        clearable
        v-model:value="EditorData.workflow.tasks[actionIdx].config.chatId"
        @update:value="onUpdateChatId"
      />

      <n-button @click="showGuidance" text>
        <Icon icon="material-symbols:info-outline-rounded" width="1.1rem" />
      </n-button>
    </n-space>
  </n-form-item>

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
import { h, ref, watch, computed, inject, nextTick } from 'vue';
import { useCustomMessage } from '@/composables';
import { Icon } from '@iconify/vue';
import { useStore } from 'vuex';

const store = useStore();
const actionIdx = computed(() => EditorData.actionIdx);
const checkedValue = ref('channelId');

function handleChange(e) {
  const { chatId } = EditorData.workflow.tasks[actionIdx.value].config;
  checkedValue.value = e.target.value;

  if (chatId) {
    const idToRemove = checkedValue.value === 'channelId' ? 'userId' : 'channelId';
    store.commit('editor/setCustomMsgConfig', { [checkedValue.value]: chatId });
    store.commit('editor/setCustomMsgConfig', { [idToRemove]: null });

    EditorData.workflow.tasks[actionIdx.value].config[checkedValue.value] = chatId;
    EditorData.workflow.tasks[actionIdx.value].config[idToRemove] = null;
  }
}

function showGuidance() {
  console.log('show guidance');
}

function onUpdateChatId(chatId) {
  EditorData.workflow.tasks[actionIdx.value].config[checkedValue.value] = chatId;
  store.commit('editor/setCustomMsgConfig', { [checkedValue.value]: chatId });
}

const [
  { content, previewContent, defaultContent, subject, previewSubject, defaultSubject, darkMode },
  { getKeyHTML, getRawText, getFormattedText },
] = useCustomMessage({ channel: 'discord' });
</script>

<style lang="scss"></style>
