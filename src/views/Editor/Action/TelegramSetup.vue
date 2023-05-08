<template>
  <n-space align="baseline" :wrap-item="false">
    <n-space align="center">
      <div class="text-bold">Key:</div>
      <n-text code>{{ key }}</n-text>
    </n-space>

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
      Add this key to Subrelay Bot in your Telegram
    </n-tooltip>
  </n-space>

  <n-grid cols="2" x-gap="30" style="margin: 1.5rem 0 1rem 0">
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
import { h, computed, ref } from 'vue';
import { useCustomMessage } from '@/composables';
import { useStore } from 'vuex';
import { useMessage } from 'naive-ui';

const store = useStore();
const message = useMessage();
const isCopied = ref(false);
const actionIdx = computed(() => EditorData.actionIdx);
const customMsgKeys = computed(() => store.state.editor.customMsgKeys);
const key = computed(() => store.state.account.userInfo.key);

const [
  { content, previewContent, defaultContent, subject, previewSubject, defaultSubject, darkMode },
  { getKeyHTML, getRawText, getFormattedText },
] = useCustomMessage({ channel: 'telegram' });

const account = computed(() => store.state.account.selected);
const signer = computed(() => store.state.account.signer);

function onCopy() {
  navigator.clipboard.writeText(key.value);
  isCopied.value = true;
  message.success('Copied!');
  setTimeout(() => (isCopied.value = false), 1500);
}
</script>

<style lang="scss">
.code {
  &__card {
    position: relative;
  }

  &__icon {
    margin: auto;
    font-size: 1rem;
    cursor: pointer;
    border-radius: 50%;
    width: 1.5rem;
    height: 1.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background 0.3s ease;
    background: transparent;

    &.copy {
      color: rgb(136, 147, 151);

      &:hover {
        background: #eaeaea;
      }
    }

    &.completed {
      color: white;
      background: green;
      @media (prefers-color-scheme: dark) {
        background: #63e2b7;
        color: black;
      }
    }
  }
}
</style>
