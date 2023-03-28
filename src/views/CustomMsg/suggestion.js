import { VueRenderer } from '@tiptap/vue-3';
import CommandsList from '@/views/CustomMsg/CommandsList.vue';
import tippy from 'tippy.js';

export default {
  items: ({ query }) => {
    return [
      {
        title: 'From',
        command: (data) => {
          const { editor, range } = data;
          return editor.chain().deleteRange(range).insertContent('From').run();
        },
      },
      {
        title: 'To',
        command: ({ editor, range }) => {
          editor.chain().focus().deleteRange(range).insertContent('Too').run();
        },
      },
      {
        title: 'Foo',
        command: ({ editor, range }) => {
          editor.chain().focus().deleteRange(range).insertContent('Foo').run();
        },
      },
      {
        title: 'Bar',
        command: ({ editor, range }) => {
          editor.chain().focus().deleteRange(range).insertContent('Bar').run();
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
