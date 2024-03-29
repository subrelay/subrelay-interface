<template>
  <EditorContent :editor="editor" />
</template>

<script setup>
import KeysMenu from '@/views/CustomMsg/KeysMenu';
import { watch, computed, onBeforeUnmount } from 'vue';
import { useStore } from 'vuex';
import { useEditor, EditorContent, VueRenderer } from '@tiptap/vue-3';
import { mergeAttributes, Node, Extension } from '@tiptap/core';
import { PluginKey } from '@tiptap/pm/state';
import Suggestion from '@tiptap/suggestion';
import StarterKit from '@tiptap/starter-kit';
import tippy from 'tippy.js';

const MentionPluginKey = new PluginKey('mention');

const prop = defineProps({
  modelValue: { type: String, default: '' },
  padding: { type: String, default: '10px' },
  multiline: { type: Boolean, default: true },
  field: { type: String, default: 'content' },
  defaultContent: String,
});

const emits = defineEmits(['update:modelValue', 'getRawText']);

const store = useStore();
const customMsgKeys = computed(() => store.state.editor.customMsgKeys);

const suggestion = {
  items: ({ query }) => {
    const result = customMsgKeys.value.filter((item) => item.name.toLowerCase().includes(query.toLowerCase()));

    return result;
  },

  render: () => {
    let component;
    let popup;

    return {
      onStart: (props) => {
        component = new VueRenderer(KeysMenu, { props, editor: props.editor });

        if (!props.clientRect) return;

        popup = tippy('body', {
          getReferenceClientRect: props.clientRect,
          content: component.element,
          showOnCreate: true,
          interactive: true,
          trigger: 'manual',
          placement: 'bottom-start',
          appendTo: () => document.body,
        });
      },

      onUpdate(props) {
        component.updateProps(props);

        if (!props.clientRect) return;

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

const KeySuggestion = Node.create({
  name: 'KeySuggestion',

  addOptions() {
    return {
      renderLabel: ({ node }) => `$\{${node.attrs.id.display || node.attrs.id}}`,
      suggestion: {
        char: '/',

        pluginKey: MentionPluginKey,

        command: ({ editor, range, props: editorProps }) => {
          const { nodeAfter } = editor.view.state.selection.$to;
          const overrideSpace = nodeAfter?.text?.startsWith(' ');

          if (overrideSpace) range.to += 1;

          editor
            .chain()
            .focus()
            .insertContentAt(range, [
              { type: this.name, attrs: editorProps },
              { type: 'text', text: ' ' },
            ])
            .run();

          window.getSelection()?.collapseToEnd();
        },

        allow: ({ state, range }) => {
          const $from = state.doc.resolve(range.from);
          const type = state.schema.nodes[this.name];
          const allow = !!$from.parent.type.contentMatch.matchType(type);
          return allow;
        },
      },
    };
  },

  group: 'inline',

  inline: true,

  selectable: false,

  atom: true,

  addAttributes() {
    return {
      id: {
        default: null,
        parseHTML: (element) => element.getAttribute('data-id'),

        renderHTML: (attributes) => {
          if (!attributes.id) return {};

          return { 'data-id': attributes.id.name };
        },
      },
      label: {
        default: null,
        parseHTML: (element) => element.getAttribute('data-label'),

        renderHTML: (attributes) => {
          if (!attributes.label) return {};

          return { 'data-label': attributes.label };
        },
      },
    };
  },

  parseHTML() {
    return [{ tag: `span[data-type="${this.name}"]` }];
  },

  renderHTML({ node, HTMLAttributes }) {
    return [
      'span',
      mergeAttributes({ 'data-type': this.name }, this.options.HTMLAttributes, HTMLAttributes),
      this.options.renderLabel({ options: this.options, node }),
    ];
  },

  renderText({ node }) {
    return this.options.renderLabel({ options: this.options, node });
  },

  addKeyboardShortcuts() {
    return {
      Backspace: () => this.editor.commands.command(({ tr, state }) => {
        let isVariable = false;
        const { selection } = state;
        const { empty, anchor } = selection;

        if (!empty) return false;

        state.doc.nodesBetween(anchor - 1, anchor, (node, pos) => {
          if (node.type.name === this.name) {
            isVariable = true;
            tr.insertText(this.options.suggestion.char || '', pos, pos + node.nodeSize);
            return false;
          }
          return true;
        });

        return isVariable;
      }),
    };
  },

  addProseMirrorPlugins() {
    return [Suggestion({ editor: this.editor, ...this.options.suggestion })];
  },
});

const PreventEnter = Extension.create({
  addKeyboardShortcuts() {
    return { Enter: () => true };
  },
});

const editor = useEditor({
  content: prop.defaultContent,

  enablePasteRules: false,
  textSerializers: (content) => content?.toString() ?? '',

  editorProps: {
    attributes: {
      style: `padding: ${prop.padding}`,
      class: `${prop.multiline ? '' : 'no-multiline'}`,
    },

    keypress(view, event) {
      if (event.key === 'Enter') event.preventDefault();
    },
  },

  extensions: [
    StarterKit,
    prop.multiline ? null : PreventEnter,
    KeySuggestion.configure({ HTMLAttributes: { class: 'mention' }, suggestion }),
  ],

  onUpdate: () => emits('update:modelValue', editor.value.getHTML()),
});

function setEditorContent(newValue) {
  const isSame = editor.value.getHTML() === newValue;
  if (!isSame) editor.value.commands.setContent(newValue);

  emits('getRawText', {
    field: prop.field,
    text: editor.value.getText({
      blockSeparator: '\n',
      textSerializers: {
        hardBreak: () => '\n',
      },
    }),
  });
}
watch(
  () => prop.modelValue,
  (newValue) => {
    if (editor.value) {
      setEditorContent(newValue);
    } else {
      // Wait for 100 milliseconds before running the function
      setTimeout(() => setEditorContent(newValue), 200);
    }
  },
  { immediate: true },
);

onBeforeUnmount(() => editor.value.destroy());
</script>

<style lang="scss">
.ProseMirror {
  border: 1px solid transparent;
  border-radius: 3px;
  transition: border-color 0.3s var(--n-bezier), box-shadow 0.3s var(--n-bezier), background 0.3s var(--n-bezier);

  &.no-multiline {
    [contenteditable='false'] {
      white-space: nowrap;
    }
  }

  &.dark {
    background: rgba(255, 255, 255, 0.1);

    &:focus {
      background: transparent;
    }
  }

  &:hover {
    border-color: rgba(230, 0, 122, 0.7);
  }

  &:focus {
    outline: none;
    border: 1px solid rgba(230, 0, 122, 0.7);
    box-shadow: 0 0 0 2px rgba(230, 0, 122, 0.2);
  }
}

.mention {
  padding: 0.1rem 0;
  box-decoration-break: clone;
  font-size: 1em;
  font-weight: bold;
  color: rgba(230, 0, 122, 1);
}
</style>
