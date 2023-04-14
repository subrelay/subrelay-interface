<template>
  <Icon width="1.2rem" :icon="icon" :color="color" />
</template>

<script setup>
import { useStore } from 'vuex';
import { computed } from 'vue';

const store = useStore();
const props = defineProps({ status: String });
const darkMode = computed(() => store.state.global.isDarkMode);
const isSuccess = computed(() => props.status === 'success');

const sucessColor = computed(() => (darkMode.value ? '#63e2b7' : '#18a058ff'));
const failedColor = computed(() => (darkMode.value ? '#e88080' : '#d03050ff'));
const color = computed(() => (isSuccess.value ? sucessColor.value : failedColor.value));
const icon = computed(() => (isSuccess.value ? 'ep:success-filled' : 'ic:round-cancel'));
</script>
