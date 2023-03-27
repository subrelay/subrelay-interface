import { VueRenderer } from '@tiptap/vue-3';
import CommandsList from '@/views/CustomMsg/CommandsList.vue';
import tippy from 'tippy.js';

export default {
  items: (data) => {
    const { query } = data;
    return [
      {
        title: 'H1',
        command: (data) => {
          const { editor, range } = data;
          return editor.chain().deleteRange(range).insertContent('foo!').run();
        },
      },
      {
        title: 'H2',
        command: ({ editor, range }) => {
          editor.chain().focus().deleteRange(range).setNode('heading', { level: 2 }).run();
        },
      },
      {
        title: 'bold',
        command: ({ editor, range }) => {
          editor.chain().focus().deleteRange(range).setMark('bold').run();
        },
      },
      {
        title: 'italic',
        command: ({ editor, range }) => {
          editor.chain().focus().deleteRange(range).setMark('italic').run();
        },
      },
    ]
      .filter((item) => item.title.toLowerCase().startsWith(query.toLowerCase()))
      .slice(0, 10);
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
