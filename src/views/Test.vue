<template>
  <div class="App container-fluid">
    <div :class="editorWrapClass">
      <Toolbar
        text="Editor"
        :icon="editorScreenMaximized ? iconLookup.minimizedIcon : iconLookup.maximizedIcon"
        @click="handleEditorMaximized"
      />

      <Compiler :value="editorText" @input="handleText"></Compiler>
    </div>

    <div :class="previewWrapClass">
      <Toolbar
        text="Previewer"
        :icon="previewScreenMaximized ? iconLookup.minimizedIcon : iconLookup.maximizedIcon"
        @click="handlePreviewMaximized"
      />

      <Preview :content="editorText"></Preview>
    </div>
  </div>
</template>

<script setup>
import Toolbar from '@/views/CustomMsg/Toolbar';
import Preview from '@/views/CustomMsg/Preview';
import Compiler from '@/views/CustomMsg/Compiler';
import { ref, computed, reactive } from 'vue';
import { marked } from 'marked';
import ToolbarVue from './CustomMsg/Toolbar.vue';

// const markdown = ref('hello');
// const markdownToHtml = computed(() => {
//   return marked.parse(markdown.value);
// });

const placeholder = `# Welcome to my React Markdown Previewer!

## This is a sub-heading...
### And here's some other cool stuff:

Heres some code, \`<div></div>\`, between 2 backticks.

\`\`\`
// this is multi-line code:

function anotherExample(firstLine, lastLine) {
  if (firstLine == '\`\`\`' && lastLine == '\`\`\`') {
    return multiLineCode;
  }
}
\`\`\`

You can also make text **bold**... whoa!
Or _italic_.
Or... wait for it... **_both!_**
And feel free to go crazy ~~crossing stuff out~~.

There's also [links](https://www.freecodecamp.org), and
> Block Quotes!

And if you want to get really crazy, even tables:

Wild Header | Crazy Header | Another Header?
------------ | ------------- | -------------
Your content can | be here, and it | can be here....
And here. | Okay. | I think we get it.

- And of course there are lists.
  - Some are bulleted.
     - With different indentation levels.
        - That look like this.


1. And there are numbered lists too.
1. Use just 1s if you want!
1. And last but not least, let's not forget embedded images:

![freeCodeCamp Logo](https://cdn.freecodecamp.org/testable-projects-fcc/images/fcc_secondary.svg)
`;

const editorText = ref(placeholder);
const editorScreenMaximized = ref(false);
const previewScreenMaximized = ref(false);

const handleEditorMaximized = () => {
  editorScreenMaximized.value = !editorScreenMaximized.value;
};

const handlePreviewMaximized = () => {
  previewScreenMaximized.value = !previewScreenMaximized.value;
};

const handleText = (event) => {
  editorText.value = event.target.value;
};

const iconLookup = ref({
  maximizedIcon: 'ic:round-check',
  minimizedIcon: 'iconoir:cancel',
});

const editorWrapClass = computed(() => {
  return editorScreenMaximized.value
    ? 'editor-wrap maximized'
    : previewScreenMaximized.value
    ? 'editor-wrap hidden'
    : 'editor-wrap';
});

const previewWrapClass = computed(() => {
  return previewScreenMaximized.value
    ? 'preview-wrap maximized'
    : editorScreenMaximized.value
    ? 'preview-wrap hidden'
    : 'preview-wrap';
});
</script>

<style lang="scss">
html {
  --background: #87b5b5;
  --pastel-green: #c0d8d8;
  --dark-green: #4aa3a3;
  --lighten-green: #2cda9d;
  --headline: #224b4b;
}

@mixin shadow {
  box-shadow: 1px 1px 10px 2px #3a5f5f;
}

#wrapper {
  background: var(--background);
}

* {
  box-sizing: border-box;
}

.toolbar {
  @include shadow;
  padding: 0.5rem;
  font-family: 'Russo One', sans-serif;
  font-size: 2rem;
  background: var(--dark-green);
  display: flex;
  justify-content: space-between;
  align-items: center;
  .fa-free-code-camp {
    margin-right: 5px;
  }
  .fa-arrows-alt:hover {
    color: var(--lighten-green);
    cursor: pointer;
  }
}

.editor-wrap {
  width: 80vw;
  margin: 1.5rem auto;
  background: blue;
  #editor {
    @include shadow;
    background: var(--pastel-green);
    width: 100%;
    overflow-y: auto;
    min-height: 200px;
    margin-bottom: -5px;
    padding: 5px;
    font-family: monospace;
    font-size: 1.75rem;
  }
}

.preview-wrap {
  width: 90vw;
  margin: 1.5rem auto;
  overflow-wrap: break-word;
  #preview {
    @include shadow;
    background: var(--pastel-green);
    min-height: 200px;
    padding: 0 3rem;
    blockquote {
      border-left: 3px solid #224b4b;
      color: #224b4b;
      padding-left: 5px;
      margin-left: 25px;
    }

    h1 {
      border-bottom: 2px solid var(--headline);
    }

    h2 {
      border-bottom: 1px solid var(--headline);
    }

    td,
    th {
      border: 2px solid var(--headline);
      padding: 5px 5px;
    }

    img {
      display: block;
      max-width: 90%;
      margin: 5rem auto;
    }
  }
}

.maximized {
  min-height: 100vh;
  #editor,
  #preview {
    min-height: 100vh;
  }
}
</style>
