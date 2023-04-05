<template>
  <n-form-item :path="`tasks[${actionIdx}].config.config.url`" label="URL" :rule="urlRule">
    <n-input clearable v-model:value="EditorData.workflow.tasks[actionIdx].config.config.url" />
  </n-form-item>

  <n-form-item
    label="Header key"
    :path="`tasks[${actionIdx}].config.config.headers[0].key`"
    :rule="keyRule"
  >
    <n-input
      clearable
      v-model:value="EditorData.workflow.tasks[actionIdx].config.config.headers[0].key"
    />
  </n-form-item>

  <n-form-item
    label="Header value"
    :path="`tasks[${actionIdx}].config.config.headers[0].value`"
    :rule="valueRule"
  >
    <n-input
      clearable
      v-model:value="EditorData.workflow.tasks[actionIdx].config.config.headers[0].value"
    />
  </n-form-item>
</template>

<script setup>
import ChainDropdown from '@/components/ChainDropdown';
import EditorData from '@/store/localStore/EditorData';
import { ref, computed, inject } from 'vue';
import { useStore } from 'vuex';

const store = useStore();
const actionIdx = computed(() => EditorData.actionIdx);

const headerKey = computed(
  () => EditorData.workflow.tasks[actionIdx.value].config.config.headers[0].key,
);
const headerValue = computed(
  () => EditorData.workflow.tasks[actionIdx.value].config.config.headers[0].value,
);

const keyRule = ref({
  key: 'setupAction_key',
  trigger: ['input'],
  validator(_rule, value) {
    store.commit('editor/disableTestAction', true);

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
  key: 'setupAction_value',
  trigger: ['input'],
  type: ['string', 'number'],
  validator(_rule, value) {
    store.commit('editor/disableTestAction', true);

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
  key: 'setupAction_url',
  validator(_rule, value) {
    store.commit('editor/disableTestAction', true);

    if (!value) {
      return new Error('Required!');
    }

    if (
      !/^(http(s)?:\/\/.)[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)$/.test(
        value,
      )
    ) {
      return new Error('Invalid URL');
    }

    return true;
  },
});
</script>
