import { flow, template, set, isEmpty } from 'lodash';
import { watch, ref, computed } from 'vue';
import { useStore } from 'vuex';
import EditorData from '@/store/localStore/EditorData';

export default function useCustomMessage({ channel, isCustomizing = true } = {}) {
  const store = useStore();
  const keyLookup = ref(null);
  const darkMode = computed(() => store.state.global.isDarkMode);
  const content = ref('');
  const previewContent = ref('');
  const defaultContent = ref('');

  const subject = ref('');
  const previewSubject = ref('');
  const defaultSubject = ref('');

  const customMsgKeys = computed(() => store.state.task.customMsgKeys);
  const actionIdx = computed(() => EditorData.actionIdx);

  function getKeyHTML(key) {
    return `<span data-type="KeySuggestion" class="mention" data-id="${key}">$\{${key}}\</span>`;
  }

  function getRawText({ field, text }) {
    if (field === 'subjectTemplate' || field === 'messageTemplate') {
      EditorData.workflow.tasks[actionIdx.value].config[field] = text;
    }
    store.commit('editor/setCustomMsgConfig', { [field]: getFormattedText(text) });
  }

  watch(
    customMsgKeys,
    (newKeys) => {
      if (!isEmpty(newKeys)) {
        // Get key lookup
        const keysHaveExample = newKeys.filter((e) => e.data !== undefined);
        keyLookup.value = keysHaveExample.reduce((obj, e) => {
          const { name, data } = e;
          set(obj, name, data);
          return { ...obj };
        }, {});

        if (!isCustomizing) return;
        // Get default content
        const greetings = [
          `<p>Event ${getKeyHTML('event.name')} happened at ${getKeyHTML(
            'event.time',
          )}, block ${getKeyHTML('event.block.hash')} with following data:</p>`,
          '<br/>',
          `<p>Success: ${getKeyHTML('event.success')}</p>`,
        ];

        const dataContent = newKeys
          .filter((e) => e.data !== undefined && e.name.includes('data.'))
          .map((e, i, arr) => {
            return `<p>${e.name}: ${getKeyHTML(e.name)}</p>`;
          });

        defaultContent.value = [...greetings, ...dataContent].join('');
        content.value = defaultContent.value;

        // Get default subject
        defaultSubject.value = `<p>Your tracked event ${getKeyHTML(
          'event.name',
        )} on chain ${getKeyHTML('chain.name')} has been triggered!</p>`;
        subject.value = defaultSubject.value;
      }
    },
    { immediate: true },
    { deep: true },
  );

  watch(
    content,
    (newContent) => {
      previewContent.value = getFormattedText(newContent);
      let template = '';

      if (channel === 'email') {
        template = 'bodyTemplate';
      } else if (channel === 'telegram' || channel === 'discord') {
        // template = 'messageTemplateWithHTML';
        template = 'messageTemplate';
      }
      if (!isCustomizing) return;
      EditorData.workflow.tasks[actionIdx.value].config[template] = newContent;
      store.commit('editor/setCustomMsgConfig', { [template]: previewContent.value });
    },
    { immediate: true },
  );

  watch(
    subject,
    (newSubject) => {
      if (channel === 'email') {
        previewSubject.value = getFormattedText(newSubject);
        store.commit('editor/setCustomMsgConfig', { subjectTemplate: previewSubject.value });
      }
    },
    { immediate: true },
  );

  function replaceEmptyParagraphsWithNbsp(text) {
    const regex = /<p><\/p>/g; // g flag to replace all occurrences
    const replacement = '<p>&nbsp;</p>';
    const result = text.replace(regex, replacement);
    return result;
  }

  function getFormattedText(text) {
    const formatText = flow(replaceEmptyParagraphsWithNbsp, template);
    const formattedText = formatText(text)({ ...keyLookup.value });
    return formattedText;
  }

  return [
    { content, previewContent, defaultContent, subject, previewSubject, defaultSubject, darkMode },
    { getKeyHTML, getRawText, getFormattedText },
  ];
}
