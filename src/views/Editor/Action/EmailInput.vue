<template>
  <n-space vertical :size="10">
    <div class="input-item">
      <div class="title">To:</div>

      <n-text
        v-for="(add, idx) in config.addresses"
        :key="idx"
        code
        style="font-size: 0.85em"
        class="text-ellipsis"
      >
        <span>{{ add }}</span>
        <span v-if="idx !== config.addresses.length - 1">,</span>
      </n-text>
    </div>

    <div class="input-item">
      <div class="title">Subject:</div>
      <n-text code style="font-size: 0.85em">{{ config.subjectTemplate }}</n-text>
    </div>

    <n-collapse arrow-placement="right" default-expanded-names="">
      <n-collapse-item title="Content" name="content">
        <template #header>
          <div style="margin-left: -32px">Content:</div>
        </template>

        <n-blockquote>
          <div v-html="config.bodyTemplate" style="font-size: 0.85em" />
        </n-blockquote>
      </n-collapse-item>
    </n-collapse>
  </n-space>
</template>

<script setup>
const props = defineProps({ config: Object });
</script>
