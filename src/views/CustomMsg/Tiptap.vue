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
import { Slice, Fragment, Node } from 'prosemirror-model';
import { ref, onMounted, onBeforeUnmount, watch } from 'vue';
import { template } from 'lodash';

const props = defineProps({ modelValue: { type: String, default: '' } });
const emits = defineEmits(['update:modelValue']);

const editor = useEditor({
  content: '<p>I’m running Tiptap with Vue.js. 🎉</p>',
  extensions: [StarterKit, Commands.configure({ suggestion })],
  content: props.modelValue,
  onUpdate: () => {
    const newValue = editor.value.getHTML();
    const modifiedHtml = replaceEmptyParagraphsWithNbsp(newValue);
    emits('update:modelValue', modifiedHtml);
  },
});

var compiled = template('<p><%= empty %></p>');

function replaceEmptyParagraphsWithNbsp(htmlString) {
  const regex = /<p><\/p>/g; // g flag to replace all occurrences
  const replacement = '<p>&nbsp;</p>';
  const result = htmlString.replace(regex, replacement);
  return result;
}

watch(
  () => props.modelValue,
  (newValue) => {
    // console.log('test', compiled({ empty: '&nbsp;' }));

    const isSame = editor.value.getHTML() === newValue;
    if (isSame) {
      return;
    }
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
