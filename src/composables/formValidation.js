import { ref, computed } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import EditorData from '@/store/localStore/EditorData';

export default function useFormValidation() {
  const store = useStore();
  const formRef = ref(null);
  const router = useRouter();
  const actionConfig = computed(() => EditorData.workflow.tasks[EditorData.actionIdx].config);

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
          (rule) =>
            keys.includes(rule.key) ||
            (rule.key.includes('filterCond') && keys.includes('filterCond')) ||
            (rule.key.includes('setupAction') && keys.includes('setupAction')),
        );
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
