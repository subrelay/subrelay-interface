<template>
  <n-select
    filterable
    clearable
    :placeholder="placeholder"
    :filter="useDropdownFilter"
    :value-field="'uuid'"
    :render-label="useRenderDropdownLabel"
    :options="chains"
    :value="modelValue"
    @update:value="onUpdateValue"
  />
</template>

<script setup>
import { ref } from 'vue';
import { useRenderDropdownLabel, useDropdownFilter } from '@/composables';

const props = defineProps({
  modelValue: [String],
  placeholder: { type: String, default: 'All Chains' },
  onSelectChain: { type: Function, default: () => {} },
});

const emits = defineEmits(['update:modelValue']);

function onUpdateValue(newValue) {
  emits('update:modelValue', newValue);

  props.onSelectChain(newValue);
}

const chains = ref([
  {
    uuid: '123',
    name: 'Acala',
    img_url: 'https://avatars.githubusercontent.com/u/54881907?s=280&v=4',
    version: 'v1.2.0',
  },
  {
    uuid: '456',
    name: 'Polkadot',
    img_url: 'https://cryptologos.cc/logos/polkadot-new-dot-logo.png',
    version: 'v1.2.0',
  },
  {
    uuid: '789',
    name: 'Kusama',
    img_url:
      'https://www.liblogo.com/img-logo/ku2766k057-kusama-logo-kusama-ksm-bitprime.png',
    version: 'v1.2.0',
  },
]);
</script>
