<template>
  <div class="email-wrapper">
    <EditorContent :editor="editor" />
  </div>
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
  content: '',
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
    if (isSame) return;
    editor.value.commands.setContent(newValue, false);
  },
);
</script>

<style lang="scss">
.ProseMirror:focus {
  outline: none;
}

.email-wrapper {
  padding: 10px;
  flex: 1;
  border: 1px solid rgb(239, 239, 245);

  .dark {
    border-color: rgba(255, 255, 255, 0.09);
  }
}
</style>
