<template>
  <!-- EMAIl LIST -->
  <n-space vertical>
    <div class="text-semi-bold">Recipients:</div>
    <n-form-item :path="`tasks[${actionIdx}].config.addresses`" :show-label="false" :rule="rule">
      <n-dynamic-tags
        v-model:value="addressTags"
        @create="handleCreate"
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
        title="CUSTOMIZATION"
        header-style="font-size: 0.85rem; font-weight: bold; padding:10px"
        content-style="padding:0"
      >
        <n-space vertical class="custom-message-card-content" :wrap-item="false">
          <!-- SUBJECT -->
          <n-space vertical style="margin-bottom: 1em">
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
            <n-divider style="margin: 0"></n-divider>
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
        <n-space vertical class="custom-message-card-content" style="height: 60vh; overflow: auto">
          <!-- SUBJECT -->
          <div v-html="previewSubject" class="preview-subject" />
          <div v-html="previewContent" class="preview-content" />
        </n-space>
      </n-card>
    </n-gi>
  </n-grid>
</template>

<script setup>
import EditorData from '@/store/localStore/EditorData';
import Compiler from '@/views/CustomMsg/Compiler';
import { h, ref, watch, computed, inject, nextTick } from 'vue';
import { template, set, flow, isEmpty } from 'lodash';
import { useIsCorrectEmailFormat, useCustomMessage } from '@/composables';
import { Icon } from '@iconify/vue';
import { useStore } from 'vuex';
import { NTag } from 'naive-ui';

const store = useStore();
const eventBus = inject('eventBus');
const emits = defineEmits(['validate']);

const addressTags = ref([]);
const content = ref('');
const previewContent = ref('');
const subject = ref('');
const previewSubject = ref('');
const inputRef = ref(null);
const inputValue = ref(null);
const uuid = computed(() => store.state.chain.event.uuid);
const darkMode = computed(() => store.state.global.isDarkMode);
const actionIdx = computed(() => EditorData.actionIdx);
const customMsgKeys = computed(() => store.state.task.customMsgKeys);
const rawSubject = ref('');
const defaultSubject = ref('');
const defaultContent = ref('');
const getFormattedText = useCustomMessage();

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
  // todo: disable 2nd tag with error message
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

function getKeyHTML(key) {
  return `<span data-type="KeySuggestion" class="mention" data-id="${key}">$\{${key}}\</span>`;
}

watch(
  customMsgKeys,
  (newKeys) => {
    if (!isEmpty(newKeys)) {
      const greetings = [
        `<p>Event ${getKeyHTML('event.name')} happened at ${getKeyHTML(
          'event.time',
        )}, block ${getKeyHTML('event.block.hash')} with following data:</p>`,
        '<p></p>',
        `<p>Success: ${getKeyHTML('event.success')}</p>`,
      ];

      const dataContent = newKeys
        .filter((e) => e.data !== undefined && e.name.includes('data.'))
        .map((e, i, arr) => {
          return `<p>${e.name}: ${getKeyHTML(e.name)}</p>`;
        });

      defaultContent.value = [...greetings, ...dataContent].join('');
      content.value = defaultContent.value;

      defaultSubject.value = `<p>Your tracked event ${getKeyHTML(
        'event.name',
      )} on chain ${getKeyHTML('chain.name')} has been triggered!</p>`;
      subject.value = defaultSubject.value;
    }
  },
  { immediate: true },
);

watch(
  content,
  (newContent) => {
    previewContent.value = getFormattedText(newContent);
    EditorData.workflow.tasks[actionIdx.value].config.bodyTemplate = newContent;
    store.commit('editor/setEmailConfig', { bodyTemplate: previewContent.value });
  },
  { immediate: true },
);

watch(
  subject,
  (newSubject) => {
    previewSubject.value = getFormattedText(newSubject);
    store.commit('editor/setEmailConfig', { subjectTemplate: previewContent.value });
  },
  { immediate: true },
);

function getRawText({ field, text }) {
  if (field === 'subjectTemplate') {
    EditorData.workflow.tasks[actionIdx.value].config[field] = text;
    store.commit('editor/setEmailConfig', { subjectTemplate: getFormattedText(text) });
  }
}

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
    store.commit('editor/setEmailConfig', { addresses });
    eventBus.emit('validate', {
      changeStep: false,
      taskName: 'action',
      keys: ['setupAction_addresses'],
    });
  },

  { immediate: true },
);

function removeAddress(index) {
  addressTags.value.splice(index, 1);
  EditorData.workflow.tasks[actionIdx.value].config.addresses.splice(index, 1);

  store.commit('editor/setEmailConfig', { addresses: [...addressTags.value] });
  eventBus.emit('validate', {
    changeStep: false,
    taskName: 'action',
    keys: ['setupAction_addresses'],
  });
}

function handleCreate(email) {
  const isCorrectFormat = useIsCorrectEmailFormat(email);
  return { label: email, status: isCorrectFormat ? 'success' : 'warning' };
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
  height: 60vh;
  overflow: auto;
}
</style>
