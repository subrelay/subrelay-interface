import { ref } from 'vue';
import { useStore } from 'vuex';
import EditorData from '@/store/localStore/EditorData';

export function useFormValidation() {
  const store = useStore();
  const formRef = ref(null);

  function validateForm({ changeStep = true, keys, nextExpand, taskName } = {}) {
    formRef.value?.validate(
      async (errors) => {
        if (errors) {
          EditorData.setError(taskName, true);
          return;
        }

        EditorData.setError(taskName, false);

        if (changeStep) {
          if (nextExpand) {
            store.commit('editor/setExpand', { [taskName]: nextExpand });
          } else {
            store.commit('editor/setStep', 2);
          }
        }
      },
      (rule) => {
        return (
          keys.includes(rule.key) ||
          (rule.key.includes('filterCond') && keys.includes('filterCond'))
        );
      },
    );
  }

  return [{ formRef }, { validateForm }];
}
