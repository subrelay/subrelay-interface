<template>
  <n-select
    filterable
    clearable
    value-field="uuid"
    data-test="chain-dropdown"
    :menu-props="{ 'data-test': 'chain-dropdown-menu' }"
    :placeholder="placeholder"
    :filter="useDropdownFilter"
    :render-label="useRenderDropdownLabel"
    :options="chains"
    :loading="loading"
    :disabled="loading || disabled"
    :value="modelValue"
    @update:value="onUpdateValue"
  />
</template>

<script setup>
import { computed } from 'vue';
import { useStore } from 'vuex';
import { useRenderDropdownLabel, useDropdownFilter } from '@/composables';

const props = defineProps({
  disabled: Boolean,
  modelValue: String,
  placeholder: { type: String, default: 'All Chains' },
  onSelectChain: { type: Function, default: () => {} },
});

const store = useStore();
const emits = defineEmits(['update:modelValue']);

function onUpdateValue(newValue) {
  emits('update:modelValue', newValue);
  props.onSelectChain(newValue);
}

const chains = computed(() => store.state.chain.chains);
const loading = computed(() => store.state.chain.loading.getChainsLoading);
</script>
