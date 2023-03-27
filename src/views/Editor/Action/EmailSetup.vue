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

          <Tiptap v-model="content" />
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
        <div v-html="content" class="custom-message-content"></div>
      </n-card>
    </n-gi>
  </n-grid>

  <pre>{{ content }}</pre>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from 'vue';
import Tiptap from '@/views/CustomMsg/Tiptap';

const content = ref('<p>foo</p>');
</script>

<style lang="scss">
.email-subject {
  display: flex;
  align-items: center;
  margin-bottom: 1rem;

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
