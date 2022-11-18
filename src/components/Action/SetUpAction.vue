<template>
  <n-form
    class="step_container"
    ref="formRef"
    label-placement="left"
    @keyup.enter="onContinue"
    :model="formData"
    :rules="rules"
    :validate-messages="{ required: 'Required!' }"
    label-width="auto"
  >
    <n-form-item path="url" label="URL">
      <n-input clearable v-model:value="formData.url" />
    </n-form-item>

    <n-form-item path="headerKey" label="Header key">
      <n-input clearable v-model:value="formData.headerKey" />
    </n-form-item>

    <n-form-item path="headerValue" label="Header value">
      <n-input clearable v-model:value="formData.headerValue" />
    </n-form-item>

    <n-button class="action_button" type="primary" @click="onContinue">
      Continue
    </n-button>
  </n-form>
</template>

<script setup>
import { ref, inject } from 'vue';
import ChainDropdown from '@/components/Common/ChainDropdown';

const emits = defineEmits(['continue']);
const formData = ref({
  url: 'https://app.clickup.com/31600137/v/dc/y4bg9-125/y4bg9-105',
  headerKey: 'foo',
  headerValue: 'bar',
});

const formRef = ref(null);
const rules = ref({
  url: [
    {
      required: true,
      trigger: ['input'],
      validator(_rule, value) {
        eventBus.emit('toggleTestAction', { isDisabled: true });
        if (!value) {
          return new Error('Required!');
        } else if (
          !/^(http(s)?:\/\/.)[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)$/.test(
            value
          )
        ) {
          return new Error('Invalid URL');
        }
        return true;
      },
    },
  ],
  headerKey: [
    {
      required: true,
      trigger: ['input'],
      validator(_rule, value) {
        eventBus.emit('toggleTestAction', { isDisabled: true });
        if (!value) {
          return new Error('Required!');
        } else if (/(-_)+|(_-)+|(-+)|(_+)|[^a-zA-Z0-9_-]/g.test(value)) {
          return new Error('Invalid value');
        }
        return true;
      },
    },
  ],
  headerValue: [
    {
      required: true,
      trigger: ['input'],
      validator(_rule, value) {
        eventBus.emit('toggleTestAction', { isDisabled: true });
        if (!value) {
          return new Error('Required!');
        } else if (/(\W{2,})|[^a-zA-Z0-9\W-_] /.test(value)) {
          return new Error('Invalid value');
        }
        return true;
      },
    },
  ],
});

const eventBus = inject('eventBus');
function onContinue(e) {
  e.preventDefault();
  formRef.value.validate(async (errors) => {
    if (errors) return;
    eventBus.emit('toggleTestAction', { isDisabled: false });
    emits('continue');
  });
}
</script>
