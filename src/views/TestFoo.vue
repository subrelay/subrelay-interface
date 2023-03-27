<template>
  <Tiptap v-model="content" />
  <div class="content">
    <h3>Content</h3>

    <code> {{ content }}</code>
  </div>

  <div v-html="content"></div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from 'vue';
import Tiptap from '@/views/CustomMsg/Tiptap';

const content = ref('<p>A Vue.js wrapper component for tiptap to use <code>v-model</code>.</p>');
</script>

<style lang="scss">
/* Basic editor styles */
.ProseMirror {
  > * + * {
    margin-top: 0.75em;
  }

  code {
    background-color: rgba(#616161, 0.1);
    color: #616161;
  }
}

.content {
  padding: 1rem 0 0;

  h3 {
    margin: 1rem 0 0.5rem;
  }

  pre {
    border-radius: 5px;
    color: #333;
  }

  code {
    display: block;
    white-space: pre-wrap;
    font-size: 0.8rem;
    padding: 0.75rem 1rem;
    background-color: #e9ecef;
    color: #495057;
  }
}
</style>
