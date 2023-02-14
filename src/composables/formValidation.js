import { ref } from 'vue';
import EditorData from '@/store/localStore/EditorData';

export const useFormValidation = (taskName, emits) => {
  const formRef = ref(null);

  function validateForm({ changeStep = true } = {}, callback) {
    formRef.value.validate(async (errors) => {
      if (errors) {
        EditorData.setError(taskName, true);
        // EditorData.setComplete(taskName, false);
        return;
      }

      EditorData.setError(taskName, false);

      if (callback) {
        callback();
        return;
      }

      if (changeStep) emits('continue');
    });
  }

  return [{ formRef }, { validateForm }];
};
