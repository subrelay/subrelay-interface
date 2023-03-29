<template>
  <div class="email-wrapper">
    <EditorContent :editor="editor" />
  </div>
</template>

<script setup>
import KeysMenu from '@/views/CustomMsg/KeysMenu.vue';
import { ref, onMounted, onBeforeUnmount, watch, computed } from 'vue';
import { useStore } from 'vuex';
import { useEditor, EditorContent, VueRenderer } from '@tiptap/vue-3';
import { mergeAttributes, Node } from '@tiptap/core';
import { Node as ProseMirrorNode } from '@tiptap/pm/model';
import { PluginKey } from '@tiptap/pm/state';
import Suggestion from '@tiptap/suggestion';
import StarterKit from '@tiptap/starter-kit';
import tippy from 'tippy.js';

const MentionPluginKey = new PluginKey('mention');
const props = defineProps({ modelValue: { type: String, default: '' } });
const emits = defineEmits(['update:modelValue']);

const store = useStore();
const fields = computed(() => store.state.chain.event.fields);

const suggestion = {
  items: ({ query }) => {
    const items = fields.value.map((e) => e.name);
    return items.filter((item) => item.toLowerCase().includes(query.toLowerCase())).slice(0, 5);
  },

  render: () => {
    let component;
    let popup;

    return {
      onStart: (props) => {
        component = new VueRenderer(MentionList, {
          props,
          editor: props.editor,
        });

        if (!props.clientRect) return;

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

const NewMention = Node.create({
  name: 'NewMention',

  addOptions() {
    return {
      HTMLAttributes: {},

      renderLabel: ({ options, node }) => `$\{${node.attrs.id}\}`,

      suggestion: {
        char: '/',

        pluginKey: MentionPluginKey,

        command: ({ editor, range, props }) => {
          const nodeAfter = editor.view.state.selection.$to.nodeAfter;
          const overrideSpace = nodeAfter?.text?.startsWith(' ');

          if (overrideSpace) range.to += 1;

          editor
            .chain()
            .focus()
            .insertContentAt(range, [
              { type: this.name, attrs: props },
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

          return { 'data-id': attributes.id };
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
      this.options.renderLabel({
        options: this.options,
        node,
      }),
    ];
  },

  renderText({ node }) {
    return this.options.renderLabel({
      options: this.options,
      node,
    });
  },

  addKeyboardShortcuts() {
    return {
      Backspace: () =>
        this.editor.commands.command(({ tr, state }) => {
          let isMention = false;
          const { selection } = state;
          const { empty, anchor } = selection;

          if (!empty) {
            return false;
          }

          state.doc.nodesBetween(anchor - 1, anchor, (node, pos) => {
            if (node.type.name === this.name) {
              isMention = true;
              tr.insertText(this.options.suggestion.char || '', pos, pos + node.nodeSize);
              return false;
            }
          });

          return isMention;
        }),
    };
  },

  addProseMirrorPlugins() {
    return [Suggestion({ editor: this.editor, ...this.options.suggestion })];
  },
});

const editor = useEditor({
  content: '',
  content: props.modelValue,
  extensions: [
    StarterKit,
    NewMention.configure({
      HTMLAttributes: { class: 'mention' },
      suggestion,
    }),
  ],
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
  padding: 0.1rem 0.3rem;
  box-decoration-break: clone;
  font-size: 1em;
  font-weight: bold;
  color: rgba(230, 0, 122, 1);
}
</style>
