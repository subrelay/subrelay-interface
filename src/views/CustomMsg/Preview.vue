<template>
  <div>
    <div id="preview" class="border border-dark" v-html="markedContent"></div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { marked } from 'marked';

const props = defineProps({
  content: { type: String, required: true },
});

const markedContent = computed(() => marked.parse(props.content));
</script>
