<template>
  <n-tooltip trigger="hover" placement="top-end">
    <template #trigger>
      <n-button
        text
        size="small"
        @click="onClick"
        :disabled="disabled"
        :color="store.state.global.isDarkMode ? '#fff' : '#111'"
      >
        <slot name="trigger-content"></slot>
      </n-button>
    </template>

    {{ props.tooltipText }}
  </n-tooltip>
</template>

<script setup>
import { useStore } from 'vuex';

const store = useStore();

const props = defineProps({
  tooltipText: { type: String, default: '' },
  disabled: { type: Boolean, default: false },
  handleTrigger: { type: Function, default: () => {} },
});

const emits = defineEmits(['click']);

function onClick(e) {
  e.stopPropagation();
  emits('click');
}
</script>
