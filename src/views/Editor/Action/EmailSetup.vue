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
            <n-input placeholder=""></n-input>
          </div>

          <Compiler v-model="content" />
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
        <div v-html="previewContent" class="custom-message-content"></div>
      </n-card>
    </n-gi>
  </n-grid>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch, computed } from 'vue';
import Compiler from '@/views/CustomMsg/Compiler';
import { template } from 'lodash';
import { useStore } from 'vuex';

const previewContent = ref('');
const subject = ref('');
const store = useStore();
const fields = computed(() => store.state.chain.event.fields);
const chainUuid = computed(() => store.state.chain.event.chainUuid);
const defaultContent = ref('');
const content = ref('');

watch(fields, (newFields) => {
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

    const keys = (fields.value || []).map((e) => {
      return `<p><span data-type="KeySuggestion" class="mention" data-id="${e.name}">
          ${e.name}
        </span></p><p></p>`;
      // return `<p>${e.name}</p><p></p>`;
    });
    const rs = [...greetings, ...keys];
    defaultContent.value = rs.join('');
    content.value = defaultContent.value;
  }
});

function replaceEmptyParagraphsWithNbsp(htmlString) {
  const regex = /<p><\/p>/g; // g flag to replace all occurrences
  const replacement = '<p>&nbsp;</p>';
  const result = htmlString.replace(regex, replacement);
  return result;
}

var compiled = template('<p><%= empty %></p>');
watch(
  content,
  (newContent) => {
    previewContent.value = replaceEmptyParagraphsWithNbsp(newContent);
    // console.log('test', compiled({ empty: '&nbsp;' }));
  },
  { immediate: true },
);
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

.custom-message-content {
  min-height: 400px;
  display: flex;
  flex-direction: column;
}
</style>
