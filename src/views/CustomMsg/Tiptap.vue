<template>
  <EditorContent :editor="editor" />
</template>

<script setup>
import { useEditor, Editor, EditorContent } from '@tiptap/vue-3';
import Commands from '@/views/CustomMsg/commands';
import suggestion from '@/views/CustomMsg/suggestion';
import StarterKit from '@tiptap/starter-kit';

import { ref, onMounted, onBeforeUnmount, watch } from 'vue';

const props = defineProps({ modelValue: { type: String, default: '' } });
const emits = defineEmits(['update:modelValue']);

const editor = useEditor({
  content: '<p>I’m running Tiptap with Vue.js. 🎉</p>',
  extensions: [StarterKit, Commands.configure({ suggestion })],
  content: props.modelValue,
  onUpdate: () => {
    emits('update:modelValue', editor.value.getHTML());
  },
});

watch(
  () => props.modelValue,
  (newValue) => {
    const isSame = editor.value.getHTML() === newValue;
    if (isSame) {
      return;
    }
    editor.value.commands.setContent(newValue, false);
  },
);
</script>
