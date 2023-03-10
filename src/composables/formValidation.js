import { ref } from 'vue';
import { useStore } from 'vuex';
import EditorData from '@/store/localStore/EditorData';

export function useFormValidation() {
  const store = useStore();
  const formRef = ref(null);

  function validateForm({
    changeStep = true,
    keys,
    nextExpand,
    taskName,
    callback = () => {},
  } = {}) {
    formRef.value?.validate(
      async (errors) => {
        if (errors) {
          EditorData.setError(taskName, true);
          return;
        }

        EditorData.setError(taskName, false);
        callback();

        if (changeStep) {
          if (nextExpand) {
            store.commit('editor/setExpand', { [taskName]: nextExpand });
          } else {
            store.commit('editor/setStep', 2);
          }
        }
      },
      (rule) => keys.includes(rule.key)
        || (rule.key.includes('filterCond') && keys.includes('filterCond'))
        || (rule.key.includes('setupAction') && keys.includes('setupAction')),
    );
  }

  return [{ formRef }, { validateForm }];
}
