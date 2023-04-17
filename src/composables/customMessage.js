import { flow, template, set, isEmpty } from 'lodash';
import { watch, ref, computed } from 'vue';
import { useStore } from 'vuex';

export default function useCustomMessage() {
  const store = useStore();
  const keyLookup = ref(null);
  const customMsgKeys = computed(() => store.state.task.customMsgKeys);

  watch(
    customMsgKeys,
    (newKeys) => {
      if (!isEmpty(newKeys)) {
        const keysHaveExample = newKeys.filter((e) => e.data !== undefined);
        keyLookup.value = keysHaveExample.reduce((obj, e) => {
          const { name, data } = e;
          set(obj, name, data);
          return { ...obj };
        }, {});
      }
    },
    { immediate: true },
    { deep: true },
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
