<template>
  <n-space vertical :size="10">
    <div class="input-item" data-test="webhook-url">
      <div class="title">URL:</div>
      <n-text code class="text-ellipsis" style="font-size: 0.85em">{{ config.url }}</n-text>
    </div>

    <div class="input-item" v-if="config.secret" data-test="webhook-secret">
      <div class="title">Secret:</div>
      <n-text code class="text-ellipsis" style="font-size: 0.85em">
        {{ config.secret.replace(/./g, '*') }}
      </n-text>
    </div>
  </n-space>
</template>

<script setup>
defineProps({ config: Object });
</script>
