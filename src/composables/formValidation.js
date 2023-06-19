import { ref } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import EditorData from '@/store/localStore/EditorData';

export default function useFormValidation() {
  const store = useStore();
  const formRef = ref(null);
  const router = useRouter();

  async function validateForm({ keys, nextStep, nextExpand, taskName, callback = () => {} } = {}) {
    function shouldValidateRule(rule) {
      return (
        keys.includes(rule.key)
        || (rule.key.includes('filterCond') && keys.includes('filterCond'))
        || (rule.key.includes('setupAction') && keys.includes('setupAction'))
      );
    }

    try {
      await new Promise((resolve, reject) => {
        formRef.value?.validate((errors) => {
          if (errors) {
            EditorData.setError(taskName, true);
            EditorData.setComplete(taskName, false);
            reject(new Error('Form validation failed'));
          } else {
            callback();
            resolve();
          }
        }, shouldValidateRule);
      });

      if (nextStep) {
        store.commit('editor/setStep', nextStep);
        router.push({ name: nextStep === 1 ? 'trigger' : 'action' });
      }

      if (nextExpand) {
        store.commit('editor/setExpand', { [taskName]: nextExpand });
      }
    } catch (error) {
      console.error(error);
    }
  }

  return [{ formRef }, { validateForm }];
}
