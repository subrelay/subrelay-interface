<template>
  <n-space vertical :size="10">
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
          <div
            v-html="config.messageTemplateWithHTML || config.messageTemplate"
            style="font-size: 0.85em"
          />
        </n-blockquote>
      </n-collapse-item>
    </n-collapse>
  </n-space>
</template>

<script setup>
const props = defineProps({ config: Object });
</script>
