<template>
  <n-space vertical :size="10">
    <div class="input-item">
      <div class="title">URL:</div>
      <n-text code>{{ config.url }}</n-text>
    </div>

    <div class="input-item">
      <div class="title">Header:</div>
      <n-text code v-if="config.headers[0].key">
        {{ headerObj }}
      </n-text>
    </div>

    <!-- <n-space vertical>
      <div class="title">Body:</div>
      <JsonEventSample />
    </n-space> -->
  </n-space>
</template>

<script setup>
// import JsonEventSample from '@/components/JsonEventSample';
import { computed } from 'vue';

const props = defineProps({ config: Object });

const headerObj = computed(() => {
  if (props.config.headers) {
    const keyValueArr = Object.values(props.config.headers[0]);
    return Object.fromEntries([keyValueArr]);
  }

  return {};
});
</script>
