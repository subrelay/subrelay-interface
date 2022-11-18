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
import { computed, ref } from 'vue';
import { useStore } from 'vuex';
import { useRenderDropdownLabel, useDropdownFilter } from '@/composables';

const props = defineProps({
  modelValue: [String],
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
</script>
