<template>
  <Icon width="1.2rem" :icon="icon" :color="color" />
</template>

<script setup>
import { Icon } from '@iconify/vue';
import { useStore } from 'vuex';
import { computed } from 'vue';

const store = useStore();
const props = defineProps({ status: String });
const darkMode = computed(() => store.state.global.isDarkMode);

const successColor = computed(() => {
  const color = darkMode.value ? '#63e2b7' : '#18a058ff';
  return color;
});
const failedColor = computed(() => {
  const color = darkMode.value ? '#e88080' : '#d03050ff';
  return color;
});
const skippedColor = computed(() => {
  const color = darkMode.value ? 'rgba(255, 255, 255, 0.52)' : 'rgb(51, 54, 57)';
  return color;
});

const color = computed(() => {
  switch (props.status) {
    case 'success':
      return successColor.value;
    case 'failed':
      return failedColor.value;
    case 'skipped':
      return skippedColor.value;
    default:
      return '';
  }
});

const icon = computed(() => {
  console.log('Status', props.status);
  switch (props.status) {
    case 'success':
      return 'ep:success-filled';
    case 'failed':
      return 'ic:round-cancel';
    case 'skipped':
      return 'ri:indeterminate-circle-fill';
    default:
      return '';
  }
});
</script>
