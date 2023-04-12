<template>
  <n-space vertical :size="10">
    <div class="input-item">
      <div class="title">URL:</div>
      <n-text code class="text-ellipsis">{{ config.url }}</n-text>
    </div>

    <div class="input-item">
      <div class="title">Secret:</div>
      <n-text code class="text-ellipsis">{{ config.secret }}</n-text>
    </div>
  </n-space>
</template>

<script setup>
import { computed } from 'vue';
const props = defineProps({ config: Object });
</script>
