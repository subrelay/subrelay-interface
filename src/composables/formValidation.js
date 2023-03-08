import { ref } from 'vue';
import { useStore } from 'vuex';
import EditorData from '@/store/localStore/EditorData';

export function useFormValidation(taskName, emits) {
  const formRef = ref(null);

  function validateForm({ changeStep = true } = {}, callback = () => {}) {
    formRef.value.validate(async (errors) => {
      if (errors) {
        EditorData.setError(taskName, true);
        return;
      }

      EditorData.setError(taskName, false);
      callback();

      if (changeStep) emits('continue');
    });
  }

  return [{ formRef }, { validateForm }];
}

export function useContinueWithValidation(taskName) {
  const store = useStore();
  const formRef = ref(null);

  function validateForm({ changeStep = true, key, nextExpand } = {}) {
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
            // store.commit('editor/setStep', 2);
          }
        }
      },
      (rule) => rule.key.includes('filterCond') || rule.key === key,
    );
  }

  return [{ formRef }, { validateForm }];
}
