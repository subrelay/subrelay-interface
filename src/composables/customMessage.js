import EditorData from '@/store/localStore/EditorData';
import { watch, ref, computed } from 'vue';
import { useStore } from 'vuex';
import formatNumber from '@/utils/formatNumber';
import moment from 'moment';
import isNumber from 'lodash/isNumber';
import flow from 'lodash/flow';
import template from 'lodash/template';
import set from 'lodash/set';
import isEmpty from 'lodash/isEmpty';

export default function useCustomMessage({ channel, isCustomizing = true } = {}) {
  const store = useStore();
  const keyLookup = ref({});
  const displayLookup = ref({});
  const darkMode = computed(() => store.state.global.isDarkMode);
  const content = ref('');
  const previewContent = ref('');
  const defaultContent = ref('');
  const keyedContent = ref('');
  const keyedSubject = ref('');
  const subject = ref('');
  const previewSubject = ref('');
  const defaultSubject = ref('');

  const customMsgKeys = computed(() => store.state.editor.customMsgKeys);
  const actionIdx = computed(() => EditorData.actionIdx);

  function getKeyHTML(display) {
    return `<span data-type="KeySuggestion" class="mention" data-id="${display}" >$\{${display}}</span>`;
  }

  function getKeyedString(displayString) {
    if (!displayString) return '';
    const output = displayString.replace(/\${[^}]+}/g, (match) => displayLookup.value[match] || match);
    return output || '';
  }

  function getRawText({ field, text }) {
    if (field === 'subjectTemplate' || field === 'messageTemplate') {
      EditorData.workflow.tasks[actionIdx.value].config[field] = getKeyedString(text);
    }
  }

  function replaceEmptyParagraphsWithNbsp(text) {
    const regex = /<p><\/p>/g; // g flag to replace all occurrences
    const replacement = '<p>&nbsp;</p>';
    // const replacement = '<p></p>';
    const result = text.replace(regex, replacement);
    return result;
  }

  function replaceLineBreak(text) {
    const regex = /<br\/>/g; // g flag to replace all occurrences
    const replacement = '<br\/><br class="ProseMirror-trailingBreak"/>';
    const result = text.replace(regex, replacement);
    return result;
  }

  function getFormattedString(text) {
    if (!text) return '';
    const formatText = flow(replaceEmptyParagraphsWithNbsp, replaceLineBreak, template);
    const formattedText = formatText(text)({ ...keyLookup.value });
    return formattedText;
  }

  watch(
    customMsgKeys,
    (newKeys) => {
      if (!isEmpty(newKeys)) {
        let formattedData;
        newKeys.forEach((e) => {
          const { name, data, display } = e;
          formattedData = data;
          if (isNumber(data)) {
            formattedData = formatNumber(data);
          } else if (name === 'event.time') {
            formattedData = moment(data).local().format('MMM Do YYYY, HH:mm:ss');
          }
          set(keyLookup.value, name, formattedData);
          set(displayLookup.value, `$\{${display}}`, `$\{${name}}`);
        });

        if (!isCustomizing) return;

        // Get default content
        const greetings = [
          `<p>Event ${getKeyHTML('Event Name')} on chain ${getKeyHTML(
            'Chain Name',
          )} has just happened with following data:${channel === 'email' ? '' : '<br/>'}</p>`,
          channel === 'email' ? '<p></p>' : '',
          `<p>Block: ${getKeyHTML('Block Hash')}</p>`,
          `<p>Success: ${getKeyHTML('Status')}</p>`,
        ];

        const dataContent = newKeys
          .filter((e) => e.data !== undefined && e.name.includes('data.'))
          .map((e) => `<p>${e.display}: ${getKeyHTML(e.display)}</p>`);

        defaultContent.value = [...greetings, ...dataContent].join('');
        content.value = defaultContent.value;

        // Get default subject
        defaultSubject.value = `<div>Your tracked event ${getKeyHTML('Event Name')} on chain ${getKeyHTML(
          'Chain Name',
        )} has been triggered!</div>`;
        subject.value = defaultSubject.value;
      }
    },
    { immediate: true },
    { deep: true },
  );

  watch(
    content,
    (newContent) => {
      keyedContent.value = getKeyedString(newContent);
      previewContent.value = getFormattedString(keyedContent.value);

      let templateKey = '';

      if (channel === 'email') {
        templateKey = 'bodyTemplate';
      } else if (channel === 'telegram' || channel === 'discord') {
        templateKey = 'messageTemplate';
      }

      if (!isCustomizing) return;

      if (!newContent || newContent === '<p></p>' || newContent === '<br>') {
        store.commit('editor/setError', { [templateKey]: true });
      } else {
        store.commit('editor/setError', { [templateKey]: false });
      }

      EditorData.workflow.tasks[actionIdx.value].config[templateKey] = keyedContent.value.replace(/<p><\/p>/g, '<br/>');
    },
    { immediate: true },
  );

  watch(
    subject,
    (newSubject) => {
      keyedSubject.value = getKeyedString(newSubject);
      previewSubject.value = getFormattedString(keyedSubject.value);
      if (!isCustomizing) return;
      if (!newSubject || newSubject === '<p></p>' || newSubject === '<br>') {
        store.commit('editor/setError', { subjectTemplate: true });
      } else {
        store.commit('editor/setError', { subjectTemplate: false });
      }
    },
    { immediate: true },
  );

  return [
    { content, previewContent, defaultContent, subject, previewSubject, defaultSubject, darkMode },
    { getKeyHTML, getRawText, getFormattedString },
  ];
}
