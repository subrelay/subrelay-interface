<template>
  <UserKey channel="Telegram" />

  <n-grid cols="2" x-gap="30" style="margin: 0 0 1rem 0">
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
import UserKey from '@/components/UserKey';
import Compiler from '@/views/CustomMsg/Compiler';
import { useCustomMessage } from '@/composables';

const [{ content, previewContent, defaultContent, darkMode }, { getRawText }] = useCustomMessage({
  channel: 'telegram',
});
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
