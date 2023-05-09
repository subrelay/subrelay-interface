import { ref } from 'vue';
import { useStore } from 'vuex';
import EditorData from '@/store/localStore/EditorData';

export function useFormValidation() {
  const store = useStore();
  const formRef = ref(null);

  async function validateForm({ keys, nextStep, nextExpand, taskName, callback = () => {} } = {}) {
    try {
      await new Promise((resolve, reject) => {
        formRef.value?.validate(
          (errors) => {
            if (errors) {
              EditorData.setError(taskName, true);
              EditorData.setComplete(taskName, false);
              reject(new Error('Form validation failed'));
            } else {
              // EditorData.setError(taskName, false);
              callback();
              resolve();
            }
          },
          (rule) => {
            return (
              keys.includes(rule.key) ||
              (rule.key.includes('filterCond') && keys.includes('filterCond')) ||
              (rule.key.includes('setupAction') && keys.includes('setupAction'))
            );
          },
        );
      });

      if (nextStep) {
        store.commit('editor/setStep', nextStep);
      }

      if (nextExpand) {
        store.commit('editor/setExpand', { [taskName]: nextExpand });
      }
    } catch (error) {
      // console.error(error);
    }
  }

  function validateCustomMessage() {
    if (!actionConfig.value.subjectTemplate) {
      store.commit('editor/setError', { subjectTemplate: true });
      EditorData.setError('action', true);
    }

    if (
      !actionConfig.value.bodyTemplate ||
      actionConfig.value.bodyTemplate === '<br>' ||
      actionConfig.value.bodyTemplate === '<p></p>'
    ) {
      store.commit('editor/setError', { bodyTemplate: true });
      EditorData.setError('action', true);
    }

    if (
      !actionConfig.value.messageTemplate ||
      actionConfig.value.messageTemplate === '<br>' ||
      actionConfig.value.messageTemplate === '<p></p>'
    ) {
      store.commit('editor/setError', { messageTemplate: true });
      EditorData.setError('action', true);
    }
  }

  return [{ formRef }, { validateForm, validateCustomMessage }];
}

export function useIsCorrectEmailFormat(email) {
  const isCorrectEmailFormat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email);
  return isCorrectEmailFormat;
}
