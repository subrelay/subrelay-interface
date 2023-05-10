<template>
  <!-- EMAIl LIST -->
  <n-space vertical>
    <div class="text-semi-bold">Recipients:</div>
    <n-form-item :path="`tasks[${actionIdx}].config.addresses`" :show-label="false" :rule="rule">
      <n-dynamic-tags
        v-model:value="addressTags"
        @create="addEmail"
        :render-tag="renderTag"
        :max="2"
      >
        <template #input="{ submit, deactivate }">
          <n-input
            ref="inputRef"
            size="small"
            placeholder="Email"
            v-model:value="inputValue"
            @blur="deactivate"
            @keyup.enter="submit(inputValue)"
          />
        </template>

        <template #trigger="{ activate, disabled }">
          <n-button size="small" type="primary" dashed :disabled="disabled" @click="activate()">
            <template #icon><Icon icon="material-symbols:add" /> </template>
            Add email
          </n-button>
        </template>
      </n-dynamic-tags>
    </n-form-item>
  </n-space>

  <n-grid cols="2" x-gap="30" style="margin: 0.5rem 0 1rem 0">
    <!-- COMPILER -->
    <n-gi>
      <n-card
        :segmented="{ content: true }"
        title="CUSTOM EMAIL CONTENT"
        header-style="font-size: 0.85rem; font-weight: bold; padding:10px"
        content-style="padding:0"
      >
        <n-space vertical class="custom-message-card-content" :wrap-item="false">
          <!-- SUBJECT -->
          <n-space vertical>
            <div class="text-italic text-bold">Subject:</div>
            <Compiler
              v-model="subject"
              padding="5px"
              class="email-subject compiler"
              field="subjectTemplate"
              @getRawText="getRawText"
              :multiline="false"
              :class="{ dark: darkMode }"
              :defaultContent="defaultSubject"
            />

            <CustomError :show="requiredSubject" />
          </n-space>

          <!-- CONTENT -->
          <n-space vertical style="flex: 1" :wrap-item="false">
            <div class="text-italic text-bold">Content:</div>
            <Compiler
              v-model="content"
              class="email-content compiler"
              field="bodyTemplate"
              @getRawText="getRawText"
              :class="{ dark: darkMode }"
              :defaultContent="defaultContent"
            />
            <CustomError :show="requiredBody" />
          </n-space>
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
          <!-- SUBJECT -->
          <div v-html="previewSubject" class="preview-subject" />
          <div v-html="previewContent" class="preview-content" />
        </n-space>
      </n-card>
    </n-gi>
  </n-grid>

  <n-button
    class="action_button"
    type="primary"
    v-if="EditorData.workflow.tasks[EditorData.actionIdx].type"
    @click="validateSetupAction"
  >
    Continue
  </n-button>
</template>

<script setup>
import CustomError from '@/components/CustomError';
import EditorData from '@/store/localStore/EditorData';
import Compiler from '@/views/CustomMsg/Compiler';
import { h, ref, watch, computed, inject, nextTick } from 'vue';
import { isEmpty } from 'lodash';
import { useIsCorrectEmailFormat, useCustomMessage } from '@/composables';
import { Icon } from '@iconify/vue';
import { useStore } from 'vuex';
import { NTag } from 'naive-ui';

const store = useStore();
const eventBus = inject('eventBus');
const emits = defineEmits(['validate']);

const addressTags = ref([]);
const inputRef = ref(null);
const inputValue = ref(null);
const requiredSubject = computed(() => store.state.editor.error.subjectTemplate);
const requiredBody = computed(() => store.state.editor.error.bodyTemplate);
const uuid = computed(() => store.state.chain.event.uuid);
const actionIdx = computed(() => EditorData.actionIdx);
const actionConfig = computed(() => EditorData.workflow.tasks[EditorData.actionIdx].config);
const customMsgKeys = computed(() => store.state.editor.customMsgKeys);

const [
  { content, previewContent, defaultContent, subject, previewSubject, defaultSubject, darkMode },
  { getKeyHTML, getRawText, getFormattedText },
] = useCustomMessage({ channel: 'email' });

const rule = ref({
  key: 'setupAction_addresses',
  trigger: ['change'],
  validator(rule, value) {
    if (!value.length) {
      return new Error('Required!');
    }

    const hasIncorrectEmail = value.some((add) => !useIsCorrectEmailFormat(add));
    if (hasIncorrectEmail) {
      return new Error('Invalid email address!');
    }

    if (value.length > 1) {
      return new Error('You free plan only allows 01 email per notification');
    }

    return true;
  },
});

const renderTag = ({ label, status }, index) => {
  return h(
    NTag,
    { type: status, closable: true, onClose: () => removeAddress(index) },
    {
      default: () =>
        h('div', { style: { display: 'flex', 'align-items': 'center' } }, [
          h('div', label),
          status === 'warning'
            ? h(Icon, {
                icon: 'uiw:warning-o',
                style: { 'margin-left': '4px', color: '#d03050ff' },
              })
            : '',
        ]),
    },
  );
};

watch(inputRef, (value) => {
  if (value) {
    inputValue.value = null;
    nextTick(() => value.focus());
  }
});

watch(
  addressTags,
  (newAddressTags) => {
    const addresses = newAddressTags.map((e) => e.label);
    EditorData.workflow.tasks[actionIdx.value].config.addresses = [...addresses];
    eventBus.emit('validate', {
      taskName: 'action',
      keys: ['setupAction_addresses'],
    });
  },

  { immediate: true },
);

function removeAddress(index) {
  addressTags.value.splice(index, 1);
  EditorData.workflow.tasks[actionIdx.value].config.addresses.splice(index, 1);

  eventBus.emit('validate', {
    taskName: 'action',
    keys: ['setupAction_addresses'],
  });
}

function addEmail(email) {
  const isCorrectFormat = useIsCorrectEmailFormat(email);
  return { label: email, status: isCorrectFormat ? 'success' : 'warning' };
}

function validateSetupAction() {
  if (!actionConfig.value.subjectTemplate) {
    store.commit('editor/setError', { subjectTemplate: true });
    EditorData.setError('action', true);
  } else if (
    !actionConfig.value.bodyTemplate ||
    actionConfig.value.bodyTemplate === '<br>' ||
    actionConfig.value.bodyTemplate === '<p></p>'
  ) {
    store.commit('editor/setError', { bodyTemplate: true });
    EditorData.setError('action', true);
  } else {
    store.commit('editor/disableTestAction', false);
    EditorData.setComplete('action', true);
    EditorData.setError('action', false);
    eventBus.emit('validate', { taskName: 'action', keys: ['setupAction'], nextExpand: '3' });
  }
}
</script>

<style lang="scss">
.compiler {
  border: 1px solid rgb(239, 239, 245);
  border-radius: 3px;
  font-size: 0.9em;

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

.email-content {
  transition: border-color 0.3s var(--n-bezier), box-shadow 0.3s var(--n-bezier);
  flex: 1;

  .ProseMirror {
    // height: 50vh;
    // max-height: 600px;
    height: 100%;
    padding-right: 5px;
    overflow: auto;
  }
}

.preview-subject {
  min-height: 34px;
  font-weight: bold;
  display: flex;
  align-items: center;
  font-size: 0.9em;
}

.preview-content {
  padding: 10px 0;
  padding-right: 10px;
  overflow: auto;
  font-size: 0.9em;
}

.custom-message-card-content {
  padding: 10px;
  height: 50vh;
  overflow: auto;
}
</style>
