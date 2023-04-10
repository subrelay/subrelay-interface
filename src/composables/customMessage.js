import { flow, template, set, isEmpty } from 'lodash';
import { watch, ref } from 'vue';

export default function useCustomMessage(event) {
  const keyLookup = ref(null);

  watch(
    event,
    (newEvent) => {
      if (!isEmpty(newEvent)) {
        const keysHaveExample = newEvent.fields.filter((e) => e.example !== undefined);
        keyLookup.value = keysHaveExample.reduce((obj, e) => {
          const { name, example } = e;
          set(obj, name, example);
          return { ...obj };
        }, {});
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

  return getFormattedText;
}
