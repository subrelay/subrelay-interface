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

    <n-space align="baseline" :size="0" :wrap-item="false" :wrap="false">
      <div class="title" style="width: 100px; min-width: 100px">Subject:</div>
      <n-text code style="font-size: 0.85em">{{ config.subjectTemplate }}</n-text>
    </n-space>

    <n-collapse arrow-placement="right" default-expanded-names="">
      <n-collapse-item title="Content" name="content">
        <template #header>
          <div style="margin-left: -32px; font-weight: normal">Content:</div>
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
