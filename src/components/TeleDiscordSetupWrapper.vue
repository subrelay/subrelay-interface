<template>
  <n-space align="baseline" :wrap-item="false" style="margin-bottom: 1.5rem" vertical :size="20">
    <n-space vertical class="w-100" :wrap-item="false">
      <div>
        Subrelay Bot will send notifications to your
        <span class="text-capitalize">{{ channel }}</span> account
        <n-text code>{{ userInfo.integration[channel] }} </n-text>
      </div>

      <n-space align="center" justify="end">
        <n-button
          class="action_button"
          type="primary"
          @click="formState = 'customMsg'"
          v-if="formState !== 'customMsg'"
        >
          Continue
        </n-button>
        <!-- <n-button>Reconfigure key</n-button> -->
      </n-space>
    </n-space>

    <n-space align="center" v-if="formState === 'setupKey'">
      <div class="text-bold">Key:</div>
      <n-text code>{{ userInfo.key }}</n-text>

      <div>
        <div class="code__icon completed" v-if="isCopied">
          <Icon icon="akar-icons:check" width="13" />
        </div>

        <div class="code__icon copy" @click="onCopy" v-else>
          <Icon icon="fluent:document-copy-48-filled" width="13" />
        </div>
      </div>

      <n-tooltip trigger="hover" placement="top-start">
        <template #trigger>
          <n-button text>
            <Icon icon="material-symbols:info-outline-rounded" />
          </n-button>
        </template>
        Add this key to Subrelay Bot in your {{ channel }} chat box.
      </n-tooltip>
    </n-space>
  </n-space>

  <n-grid cols="2" x-gap="30" style="margin: 0 0 1rem 0" v-if="formState === 'customMsg'">
    <!-- COMPILER -->
    <n-gi>
      <n-card
        :segmented="{ content: true }"
        title="CUSTOM MESSAGE"
        header-style="font-size: 0.85rem; font-weight: bold; padding:10px"
        content-style="padding:0"
      >
        <n-space vertical class="custom-message-card-content" :wrap-item="false">
          <Compiler
            v-model="content"
            class="email-content compiler"
            field="messageTemplate"
            @getRawText="getRawText"
            :class="{ dark: darkMode }"
            :defaultContent="defaultContent"
          />
        </n-space>
      </n-card>
    </n-gi>

    <!-- PREVIEW -->
    <n-gi>
      <n-card
        title="PREVIEW"
        header-style="font-size: 0.85rem; font-weight: bold; padding:10px"
        content-style="padding:0"
        :segmented="{ content: true }"
      >
        <n-space vertical class="custom-message-card-content" style="height: 50vh; overflow: auto">
          <div v-html="previewContent" class="preview-content" />
        </n-space>
      </n-card>
    </n-gi>
  </n-grid>
</template>

<script setup>
import Compiler from '@/views/CustomMsg/Compiler';
import { useCustomMessage } from '@/composables';
import { computed, ref, inject } from 'vue';
import { useMessage } from 'naive-ui';
import { useStore } from 'vuex';

const props = defineProps(['channel']);
const [{ content, previewContent, defaultContent, darkMode }, { getRawText }] = useCustomMessage({
  channel: props.channel,
});

const emits = defineEmits('toggleCustomMessage');

const store = useStore();
const message = useMessage();
const isCopied = ref(false);
const formState = ref(null);
const userInfo = computed(() => store.state.account.userInfo);

function onCopy() {
  navigator.clipboard.writeText(userInfo.value.key);
  isCopied.value = true;
  message.success('Copied!');
  setTimeout(() => (isCopied.value = false), 1500);
}

const eventBus = inject('eventBus');

function validateSetupAction() {
  const callback = () => {
    if (EditorData.workflow.tasks[EditorData.actionIdx].type !== 'email') {
      if (!actionConfig.value.subjectTemplate) {
        store.commit('editor/setError', { subjectTemplate: true });
        EditorData.setError('action', true);
      }

      if (
        !actionConfig.value.bodyTemplate ||
        actionConfig.value.bodyTemplate === '<br>' ||
        actionConfig.value.bodyTemplate === '<p></p>'
      ) {
        store.commit('editor/setError', { bodyTemplate: true });
        EditorData.setError('action', true);
      }
    }

    if (EditorData.workflow.tasks[EditorData.actionIdx].type !== 'email') {
      if (
        !actionConfig.value.messageTemplate ||
        actionConfig.value.messageTemplate === '<br>' ||
        actionConfig.value.messageTemplate === '<p></p>'
      ) {
        store.commit('editor/setError', { messageTemplate: true });
        EditorData.setError('action', true);
      }
    }

    // todo: nhét ^ vào callback
    // chạy cục trên trước khi chạy validate email input
    // vì email pass thì cục trên ko chạy nữa
    // chỗ này cần copy lại để dùng khi change editor step -> from action to trigger
    store.commit('editor/disableTestAction', false);
    EditorData.setComplete('action', true);
    EditorData.setError('action', false);
  };

  emits('validate', { taskName: 'action', keys: ['setupAction'], nextExpand: '3', callback });
}
</script>

<style lang="scss"></style>
