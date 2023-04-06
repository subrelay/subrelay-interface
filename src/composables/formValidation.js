import { ref } from 'vue';
import { useStore } from 'vuex';
import EditorData from '@/store/localStore/EditorData';

export function useFormValidation() {
  const store = useStore();
  const formRef = ref(null);

  async function validateForm({
    changeStep = true,
    keys,
    nextExpand,
    taskName,
    callback = () => {},
  } = {}) {
    try {
      await new Promise((resolve, reject) => {
        formRef.value?.validate(
          (errors) => {
            if (errors) {
              EditorData.setError(taskName, true);
              reject(new Error('Form validation failed'));
            } else {
              EditorData.setError(taskName, false);
              callback();
              resolve();
            }
          },
          (rule) =>
            keys.includes(rule.key) ||
            (rule.key.includes('filterCond') && keys.includes('filterCond')) ||
            (rule.key.includes('setupAction') && keys.includes('setupAction')),
        );
      });

      if (changeStep) {
        if (nextExpand) {
          store.commit('editor/setExpand', { [taskName]: nextExpand });
        } else {
          store.commit('editor/setStep', 2);
        }
      }
    } catch (error) {
      console.error(error);
    }
  }

  return [{ formRef }, { validateForm }];
}

export function useIsCorrectEmailFormat(email) {
  const isCorrectEmailFormat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email);
  return isCorrectEmailFormat;
}
