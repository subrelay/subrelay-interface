import EditorData from '@/store/localStore/EditorData';
import { flow, template, set, isEmpty } from 'lodash';
import isNumber from 'lodash/isNumber';
import { watch, ref, computed } from 'vue';
import { useStore } from 'vuex';
import { useFormatNumber } from '@/composables';
import moment from 'moment';

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
    return `<span data-type="KeySuggestion" class="mention" data-id="${display}" >$\{${display}}\</span>`;
  }

  function getRawText({ field, text }) {
    if (field === 'subjectTemplate' || field === 'messageTemplate') {
      EditorData.workflow.tasks[actionIdx.value].config[field] = getKeyedString(text);
    }
  }

  function replaceEmptyParagraphsWithNbsp(text) {
    const regex = /<p><\/p>/g; // g flag to replace all occurrences
    const replacement = '<p>&nbsp;</p>';
    const result = text.replace(regex, replacement);
    return result;
  }

  function getKeyedString(displayString) {
    if (!displayString) return;
    const output = displayString.replace(/\${[^}]+}/g, function (match) {
      return displayLookup.value[match] || match;
    });
    return output;
  }

  function getFormattedString(text) {
    if (!text) return '';
    const formatText = flow(replaceEmptyParagraphsWithNbsp, template);
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
            formattedData = useFormatNumber(data);
          } else if (name === 'event.time') {
            formattedData = moment(data).local().format('MMM Do YYYY, HH:mm:ss');
          }
          set(keyLookup.value, name, formattedData);
          set(displayLookup.value, `$\{${display}}`, `$\{${name}}`);
        });

        if (!isCustomizing) return;

        // Get default content
        const greetings = [
          `<div>Event ${getKeyHTML('Event Name')} happened at ${getKeyHTML(
            'Time',
          )}, block ${getKeyHTML('Block Hash')} with following data:${
            channel === 'email' ? '' : '<br>'
          }</div>`,
          channel === 'email' ? '<p></p>' : '',
          `<div>Success: ${getKeyHTML('Status')}</div>`,
        ];

        const dataContent = newKeys
          .filter((e) => e.data !== undefined && e.name.includes('data.'))
          .map((e) => `<div>${e.display}: ${getKeyHTML(e.display)}</div>`);

        defaultContent.value = [...greetings, ...dataContent].join('');
        content.value = defaultContent.value;

        // Get default subject
        defaultSubject.value = `<div>Your tracked event ${getKeyHTML(
          'Event Name',
        )} on chain ${getKeyHTML('Chain Name')} has been triggered!</div>`;
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

      let template = '';

      if (channel === 'email') {
        template = 'bodyTemplate';
      } else if (channel === 'telegram' || channel === 'discord') {
        template = 'messageTemplate';
      }

      if (!isCustomizing) return;

      if (!newContent || newContent === '<p></p>' || newContent === '<br>') {
        store.commit('editor/setError', { [template]: true });
      } else {
        store.commit('editor/setError', { [template]: false });
      }

      EditorData.workflow.tasks[actionIdx.value].config[template] = keyedContent.value.replace(
        /<p><\/p>/g,
        '<br/>',
      );
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
