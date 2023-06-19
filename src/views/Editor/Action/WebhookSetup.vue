<template>
  <n-form-item
    data-test="editor-form-item-webhook-setup"
    label-placement="left"
    label="URL"
    label-width="70"
    :path="`tasks[${actionIdx}].config.url`"
    :rule="urlRule"
  >
    <n-input clearable v-model:value="EditorData.workflow.tasks[actionIdx].config.url" data-test="webhook-url-input" />
  </n-form-item>

  <n-form-item label="Secret" label-width="70" label-placement="left" :path="`tasks[${actionIdx}].config.secret`">
    <n-input
      type="password"
      clearable
      v-model:value="EditorData.workflow.tasks[actionIdx].config.secret"
      data-test="webhook-secret-input"
    />
  </n-form-item>

  <n-button
    data-test="webhook-setup-continue-btn"
    class="action_button"
    type="primary"
    v-if="EditorData.workflow.tasks[EditorData.actionIdx].type"
    @click="validateSetupAction"
  >
    Continue
  </n-button>
</template>

<script setup>
import EditorData from '@/store/localStore/EditorData';
import { ref, computed, inject } from 'vue';
import { useStore } from 'vuex';

const eventBus = inject('eventBus');
const store = useStore();
const actionIdx = computed(() => EditorData.actionIdx);

const urlRule = ref({
  required: true,
  trigger: ['input'],
  key: 'setupAction_url',
  validator(_rule, value) {
    store.commit('editor/disableTestAction', true);

    if (!value) {
      return new Error('Required!');
    }

    const emailReg = /^(http(s)?:\/\/.)[-a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&//=]*)$/;

    if (!emailReg.test(value)) {
      return new Error('Invalid URL');
    }

    return true;
  },
});

function validateSetupAction() {
  const callback = () => {
    store.commit('editor/disableTestAction', false);
    store.commit('editor/resetAction');
    EditorData.setComplete('action', true);
    EditorData.setError('action', false);
  };

  eventBus.emit('validate', {
    taskName: 'action',
    keys: ['setupAction'],
    nextExpand: '3',
    callback,
  });
}
</script>
