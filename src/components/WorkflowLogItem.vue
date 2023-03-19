<template>
  <n-space class="wrapper" align="center" justify="space-between">
    <n-space align="center" :wrap-item="false">
      <Icon width="1.2rem" :icon="icon" :color="color" />
      <div class="text-capitalize">{{ log.status }}</div>
    </n-space>

    <div>{{ moment(log.startedAt).format('MMM Do YYYY, HH:mm:ss') }}</div>

    <n-button text>
      <Icon icon="akar-icons:chevron-right" />
    </n-button>
  </n-space>
</template>
<script setup>
import { computed, ref } from 'vue';
import { useStore } from 'vuex';
import moment from 'moment';

const store = useStore();
const props = defineProps(['log']);

const darkMode = computed(() => store.state.global.isDarkMode);

const icon = computed(() =>
  props.log.status === 'success' ? 'ep:success-filled' : 'ic:round-cancel',
);

const sucessColor = computed(() => (darkMode.value ? '#63e2b7' : '18a058ff'));

const failedColor = computed(() => (darkMode.value ? '#e88080' : 'd03050ff'));

const color = computed(() =>
  props.log.status === 'success' ? sucessColor.value : failedColor.value,
);
</script>

<style lang="scss" scoped>
.wrapper {
  cursor: pointer;
  border: 1px solid rgb(239, 239, 245);
  padding: 16px;
  border-radius: 1rem;

  @media (prefers-color-scheme: dark) {
    border-color: rgba(255, 255, 255, 0.09);
  }

  &:hover {
    border-color: rgba(230, 0, 122, 0.7);
    box-shadow: 0 0 8px 0 rgba(230, 0, 122, 0.4);
  }
}
</style>
