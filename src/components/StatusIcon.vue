<template>
  <Icon width="1.2rem" :icon="icon" :color="color" />
</template>

<script setup>
import { useStore } from 'vuex';
import { computed } from 'vue';

const store = useStore();
const props = defineProps(['status']);
const darkMode = computed(() => store.state.global.isDarkMode);

const sucessColor = computed(() => (darkMode.value ? '#63e2b7' : '#18a058ff'));
const failedColor = computed(() => (darkMode.value ? '#e88080' : '#d03050ff'));
const color = computed(() => (props.status === 'success' ? sucessColor.value : failedColor.value));
const icon = computed(() => (props.status === 'success' ? 'ep:success-filled' : 'ic:round-cancel'));
</script>
