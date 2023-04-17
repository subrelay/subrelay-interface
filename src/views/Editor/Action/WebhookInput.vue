<template>
  <n-space vertical :size="10">
    <div class="input-item">
      <div class="title">URL:</div>
      <n-text code class="text-ellipsis" style="font-size: 0.85em">{{ config.url }}</n-text>
    </div>

    <div class="input-item" v-if="config.secret">
      <div class="title">Secret:</div>
      <n-text code class="text-ellipsis" style="font-size: 0.85em">
        {{ config.secret.replace(/./g, '*') }}
      </n-text>
    </div>
  </n-space>
</template>

<script setup>
import { computed } from 'vue';
const props = defineProps({ config: Object });
</script>
