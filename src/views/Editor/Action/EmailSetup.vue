<template>
  <!-- EMAIl LIST -->
  <n-space vertical>
    <div class="text-semi-bold">Recipients:</div>
    <n-form-item
      :path="`tasks[${actionIdx}].config.config.addresses`"
      :show-label="false"
      :rule="rule"
    >
      <n-dynamic-tags v-model:value="addressTags" @create="handleCreate" :render-tag="renderTag">
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
    <n-gi>
      <n-card
        title="CUSTOMIZATION"
        :segmented="{ content: true }"
        header-style="font-size: 0.85rem; font-weight: bold; padding:10px"
        content-style="padding: 10px"
      >
        <div class="custom-message-content">
          <div class="email-subject-wrapper">
            <!-- SUBJECT -->
            <span>Subject</span>

            <Compiler
              v-model="subject"
              padding="5px"
              class="email-subject compiler"
              useRawText
              :multiline="false"
              :class="{ dark: darkMode }"
              @getRawText="getRawText"
            />
          </div>

          <!-- CONTENT -->
          <Compiler v-model="content" class="email-content compiler" :class="{ dark: darkMode }" />
        </div>
      </n-card>
    </n-gi>
    <n-gi>
      <n-card
        title="PREVIEW"
        header-style="font-size: 0.85rem; font-weight: bold; padding:10px"
        content-style="padding:10px"
        :segmented="{ content: true }"
      >
        <div class="custom-message-content">
          <div v-html="previewSubject" class="preview-subject" />
          <div v-html="previewContent" class="preview-content" />
        </div>
      </n-card>
    </n-gi>
  </n-grid>
</template>

<script setup>
import EditorData from '@/store/localStore/EditorData';
import Compiler from '@/views/CustomMsg/Compiler';
import { h, ref, watch, computed, inject, nextTick } from 'vue';
import { template, set, flow, isEmpty } from 'lodash';
import { useIsCorrectEmailFormat } from '@/composables';
import { Icon } from '@iconify/vue';
import { useStore } from 'vuex';
import { NTag } from 'naive-ui';

const store = useStore();
const eventBus = inject('eventBus');
const emits = defineEmits(['validate']);

const keyLookup = ref(null);
const addressTags = ref([{ label: 'anhthichieu@gmail.com', status: 'success' }]);
const content = ref('');
const previewContent = ref('');
const subject = ref('');
const previewSubject = ref('');
const inputRef = ref(null);
const inputValue = ref(null);
const event = computed(() => store.state.chain.event);
const fields = computed(() => store.state.chain.event.fields);
const chainUuid = computed(() => store.state.chain.event.chainUuid);
const darkMode = computed(() => store.state.global.isDarkMode);
const actionIdx = computed(() => EditorData.actionIdx);
const rawSubject = ref('');

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

watch(
  event,
  (newEvent) => {
    if (!isEmpty(newEvent)) {
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

      const keysHaveExample = newEvent.fields.filter((e) => e.example !== undefined);

      const keys = keysHaveExample.map((e) => {
        return `<p><span data-type="KeySuggestion" class="mention" data-id="${e.name}">$\{${e.name}\}</span></p><p></p>`;
      });

      const defaultContent = [...greetings, ...keys].join('');
      content.value = defaultContent;

      const defaultSubject = `Your tracked event ${newEvent.pallet}.${newEvent.name} on chain ${newEvent.chainUuid} has been triggered!`;
      subject.value = defaultSubject;

      keyLookup.value = keysHaveExample.reduce((obj, e) => {
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
    EditorData.workflow.tasks[actionIdx.value].config.config.bodyTemplate = newContent;
  },
  { immediate: true },
);

watch(
  subject,
  (newSubject) => {
    const formatSubject = flow(replaceEmptyParagraphsWithNbsp, template);
    const formattedSubject = formatSubject(newSubject)({ ...keyLookup.value });
    previewSubject.value = formattedSubject;
  },
  { immediate: true },
);

function getRawText(data) {
  rawSubject.value = data;
  EditorData.workflow.tasks[actionIdx.value].config.config.subjectTemplate = data;
}

function replaceEmptyParagraphsWithNbsp(htmlString) {
  const regex = /<p><\/p>/g; // g flag to replace all occurrences
  const replacement = '<p>&nbsp;</p>';
  const result = htmlString.replace(regex, replacement);
  return result;
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
    EditorData.workflow.tasks[actionIdx.value].config.config.addresses = [...addresses];
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
  EditorData.workflow.tasks[actionIdx.value].config.config.addresses.splice(index, 1);
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
.email-subject-wrapper {
  display: flex;
  align-items: center;
  margin-bottom: 1em;
  max-width: 100%;

  span {
    width: 20%;
    min-width: 60px;
  }
}

.email-subject {
  width: 80%;
  max-height: 2.1255rem;
}

.compiler {
  border: 1px solid rgb(239, 239, 245);
  border-radius: 3px;

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

  .ProseMirror {
    height: 50vh;
    max-height: 600px;
    padding-right: 5px;
    overflow: auto;
  }
}

.preview-subject {
  margin-bottom: 14px;
  min-height: 34px;
  font-weight: bold;
  display: flex;
  align-items: center;
}

.preview-content {
  padding: 10px 0;
  height: 50vh;
  max-height: 600px;
  padding-right: 10px;
  overflow: auto;
}
.custom-message-content {
  display: flex;
  flex-direction: column;
}
</style>
