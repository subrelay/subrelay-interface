<template>
  <n-form
    ref="formRef"
    label-placement="top"
    label-width="auto"
    @keyup.enter="onContinue"
    :model="EditorData.workflow.tasks[actionIdx].config.config"
  >
    <n-form-item path="url" label="URL" :rule="urlRule">
      <n-input clearable v-model:value="EditorData.workflow.tasks[1].config.config.url" />
    </n-form-item>

    <n-form-item path="headers[0].key" label="Header key" :rule="keyRule">
      <n-input
        clearable
        v-model:value="EditorData.workflow.tasks[actionIdx].config.config.headers[0].key"
      />
    </n-form-item>

    <n-form-item path="headers[0].value" label="Header value" :rule="valueRule">
      <n-input
        clearable
        v-model:value="EditorData.workflow.tasks[actionIdx].config.config.headers[0].value"
      />
    </n-form-item>
    <n-button class="action_button" type="primary" @click="onContinue"> Continue </n-button>
  </n-form>
</template>

<script setup>
import ChainDropdown from '@/components/ChainDropdown';
import EditorData from '@/store/localStore/EditorData';
import { useFormValidation } from '@/composables';
import { ref, computed, inject } from 'vue';

const emits = inject('emits');
const eventBus = inject('eventBus');

const [{ formRef }, { validateForm }] = useFormValidation('action', emits);

const actionIdx = computed(() => EditorData.actionIdx);

const headerKey = computed(
  () => EditorData.workflow.tasks[actionIdx.value].config.config.headers[0].key,
);
const headerValue = computed(
  () => EditorData.workflow.tasks[actionIdx.value].config.config.headers[0].value,
);

const keyRule = ref({
  trigger: ['input'],
  validator(_rule, value) {
    eventBus.emit('toggleTestAction', { isDisabled: true });

    if (headerValue.value && !value) {
      return new Error('Required!');
    }

    if (/(-_)+|(_-)+|(-{2,})|(_{2,})|[^a-zA-Z0-9_-]/g.test(value)) {
      return new Error('Invalid value');
    }

    return true;
  },
});

const valueRule = ref({
  trigger: ['input'],
  type: ['string', 'number'],
  validator(_rule, value) {
    eventBus.emit('toggleTestAction', { isDisabled: true });

    if (headerKey.value && !value) {
      return new Error('Required!');
    }

    if (/(\W{2,})|[^a-zA-Z0-9\W-_] /.test(value)) {
      return new Error('Invalid value');
    }

    return true;
  },
});

const urlRule = ref({
  required: true,
  trigger: ['input'],
  validator(_rule, value) {
    eventBus.emit('toggleTestAction', { isDisabled: true });
    if (!value) {
      return new Error('Required!');
    } else if (
      !/^(http(s)?:\/\/.)[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)$/.test(
        value,
      )
    ) {
      return new Error('Invalid URL');
    }
    return true;
  },
});

function onContinue(e) {
  e.preventDefault();

  validateForm({}, () => {
    eventBus.emit('toggleTestAction', { isDisabled: false });
    EditorData.setComplete('action', true);
  });
}
</script>
