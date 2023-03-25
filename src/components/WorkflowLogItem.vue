<template>
  <n-space
    align="center"
    justify="space-between"
    :class="`wrapper ${darkMode ? 'dark' : ''}`"
    @click="router.push({ name: 'logDetails', params: { id: log.id } })"
  >
    <n-space align="center" :wrap-item="false">
      <StatusIcon :status="log.status" />
      <div class="text-capitalize">{{ log.status }}</div>
    </n-space>

    <div>{{ moment(log.startedAt).local().format('MMM Do YYYY, HH:mm:ss') }}</div>

    <n-button text>
      <Icon icon="akar-icons:chevron-right" />
    </n-button>
  </n-space>
</template>
<script setup>
import StatusIcon from '@/components/StatusIcon';
import { computed } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import moment from 'moment';

const store = useStore();
const router = useRouter();
const props = defineProps(['log']);
const darkMode = computed(() => store.state.global.isDarkMode);
</script>

<style lang="scss" scoped>
.wrapper {
  cursor: pointer;
  border: 1px solid rgb(239, 239, 245);
  padding: 16px;
  border-radius: 1rem;

  &.dark {
    border-color: rgba(255, 255, 255, 0.09);
  }

  &:hover {
    border-color: rgba(230, 0, 122, 0.7);
    box-shadow: 0 0 8px 0 rgba(230, 0, 122, 0.4);
  }
}
</style>
