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
import { ref, onMounted, onBeforeUnmount, watch } from 'vue';
import Compiler from '@/views/CustomMsg/Compiler';
import { template } from 'lodash';

const previewContent = ref('');
const subject = ref('');
// const content = ref(
//   '<p>Hello,</p><p></p><p>Here is the summary of what happened in the event you are subscribing:</p>',
// );

const content = ref('');

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
