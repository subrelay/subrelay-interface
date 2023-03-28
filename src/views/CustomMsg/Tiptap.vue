<template>
  <div class="email-wrapper">
    <EditorContent :editor="editor" />
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch, computed } from 'vue';
import { useStore } from 'vuex';
import { Extension } from '@tiptap/core';
import { useEditor, Editor, EditorContent } from '@tiptap/vue-3';
import { VueRenderer } from '@tiptap/vue-3';
import CommandsList from '@/views/CustomMsg/CommandsList.vue';
import tippy from 'tippy.js';
import Suggestion from '@tiptap/suggestion';
import StarterKit from '@tiptap/starter-kit';

const props = defineProps({ modelValue: { type: String, default: '' } });
const emits = defineEmits(['update:modelValue']);

const store = useStore();
const fields = computed(() => store.state.chain.event.fields);

const suggestion = {
  char: '/',
  command: ({ editor, range, props }) => props.command({ editor, range }),

  items: ({ query }) => {
    const replaceText = ({ editor, range }, text) =>
      editor
        .chain()
        .deleteRange(range)
        .insertContent('${' + text + '}')
        .run();

    const items = fields.value.map((e) => ({
      title: e.name,
      command: ({ editor, range }) => replaceText({ editor, range }, e.name),
    }));

    return items.filter((item) => item.title.toLowerCase().includes(query.toLowerCase()));
  },

  render: () => {
    let component;
    let popup;

    return {
      onStart: (props) => {
        component = new VueRenderer(CommandsList, { props, editor: props.editor });

        if (!props.clientRect) {
          return;
        }

        popup = tippy('body', {
          getReferenceClientRect: props.clientRect,
          appendTo: () => document.body,
          content: component.element,
          showOnCreate: true,
          interactive: true,
          trigger: 'manual',
          placement: 'bottom-start',
        });
      },

      onUpdate(props) {
        component.updateProps(props);

        if (!props.clientRect) {
          return;
        }

        popup[0].setProps({
          getReferenceClientRect: props.clientRect,
        });
      },

      onKeyDown(props) {
        if (props.event.key === 'Escape') {
          popup[0].hide();

          return true;
        }

        return component.ref?.onKeyDown(props);
      },

      onExit() {
        popup[0].destroy();
        component.destroy();
      },
    };
  },
};

const KeyList = Extension.create({
  name: 'KeyList',

  addOptions() {
    return { suggestion };
  },

  addProseMirrorPlugins() {
    return [
      Suggestion({
        editor: this.editor,
        ...this.options.suggestion,
      }),
    ];
  },
});

const editor = useEditor({
  content: '',
  content: props.modelValue,
  extensions: [StarterKit, KeyList.configure({ suggestion })],
  onUpdate: () => emits('update:modelValue', editor.value.getHTML()),
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

.mention {
  border: 1px solid #000;
  border-radius: 0.4rem;
  padding: 0.1rem 0.3rem;
  box-decoration-break: clone;
}
</style>
