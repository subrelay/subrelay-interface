<template>
  <n-grid cols="2" x-gap="30" style="margin-bottom: 1rem">
    <n-gi>
      <n-card
        title="CUSTOMIZATION"
        :segmented="{ content: true }"
        header-style="font-size: 0.85rem; font-weight: bold; padding:10px"
        content-style="padding: 10px"
      >
        <div class="custom-message-content">
          <div class="email-subject">
            <span>Subject</span>
            <n-input placeholder="" v-model:value="subject"></n-input>
          </div>
          <div class="email-wrapper" :class="{ dark: darkMode }">
            <Compiler v-model="content" />
          </div>
        </div>
      </n-card>
    </n-gi>
    <n-gi>
      <n-card
        title="PREVIEW"
        :segmented="{ content: true }"
        header-style="font-size: 0.85rem; font-weight: bold; padding:10px"
        content-style="padding:10px; min-height: 400px;"
      >
        <div class="custom-message-content">
          <div v-html="previewSubject" class="preview-subject" />
          <div v-html="previewContent" class="preview-wrapper" />
        </div>
      </n-card>
    </n-gi>
  </n-grid>

  <div>Test</div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch, computed } from 'vue';
import Compiler from '@/views/CustomMsg/Compiler';
import { template, set, flow } from 'lodash';
import { useStore } from 'vuex';

const store = useStore();
const defaultContent = ref('');
const content = ref('');
const previewContent = ref('');
const subject = ref('Your tracked event has just happened!');
const previewSubject = ref('Your tracked event has just happened!');
const keyLookup = ref(null);
const darkMode = computed(() => store.state.global.isDarkMode);
const fields = computed(() => store.state.chain.event.fields);
const chainUuid = computed(() => store.state.chain.event.chainUuid);

watch(
  fields,
  (newFields) => {
    if (newFields) {
      const greetings = [
        '<p>Hello,</p>',
        '<p></p>',
        '<p>Here is the summary of what happened in the event you are subscribing:</p>',
        '<p></p>',
        `<p>Chain: ${chainUuid.value}</p>`,
        '<p></p>',
        '<p>Sample Data:</p>',
        '<p></p>',
      ];

      const keysWithExample = newFields.filter((e) => e.example !== undefined);

      const keys = keysWithExample.map((e) => {
        return `<p><span data-type="KeySuggestion" class="mention" data-id="${e.name}">$\{${e.name}\}</span></p><p></p>`;
      });
      const rs = [...greetings, ...keys];
      defaultContent.value = rs.join('');
      content.value = defaultContent.value;

      keyLookup.value = keysWithExample.reduce((obj, e) => {
        const { name, example } = e;
        set(obj, name, example);
        return { ...obj };
      }, {});
    }
  },
  { immediate: true },
);

watch(
  content,
  (newContent) => {
    const formatContent = flow(replaceEmptyParagraphsWithNbsp, template);
    const formattedContent = formatContent(newContent)({ ...keyLookup.value });
    previewContent.value = formattedContent;
  },
  { immediate: true },
);

function replaceEmptyParagraphsWithNbsp(htmlString) {
  const regex = /<p><\/p>/g; // g flag to replace all occurrences
  const replacement = '<p>&nbsp;</p>';
  const result = htmlString.replace(regex, replacement);
  return result;
}
</script>

<style lang="scss">
.email-subject {
  display: flex;
  align-items: center;
  margin-bottom: 1em;

  span {
    width: 20%;
    min-width: 60px;
  }
}

.email-wrapper {
  flex: 1;
  border: 1px solid rgb(239, 239, 245);
  border-radius: 3px;
  transition: border-color 0.3s var(--n-bezier), box-shadow 0.3s var(--n-bezier);

  &.dark {
    border-color: rgba(255, 255, 255, 0.09);

    .ProseMirror {
      background: rgba(255, 255, 255, 0.1);

      &:focus {
        background: transparent;
      }
    }
  }
}

.preview-subject {
  margin-bottom: 14px;
  height: 34px;
  font-weight: bold;
  display: flex;
  align-items: center;
}

.preview-wrapper {
  padding: 10px 0;
  flex: 1;
}
.custom-message-content {
  min-height: 400px;
  display: flex;
  flex-direction: column;
}
</style>
