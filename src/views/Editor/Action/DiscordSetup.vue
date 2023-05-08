<template>
  <UserKey channel="Discord" />

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
import UserKey from '@/components/UserKey';
import Compiler from '@/views/CustomMsg/Compiler';
import { useCustomMessage } from '@/composables';

const [{ content, previewContent, defaultContent, darkMode }, { getRawText }] = useCustomMessage({
  channel: 'discord',
});
</script>

<style lang="scss"></style>
