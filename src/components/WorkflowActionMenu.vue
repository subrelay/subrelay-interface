<template>
  <n-dropdown trigger="hover" :options="options" @select="handleSelect" placement="bottom-end">
    <n-button text>
      <Icon icon="ph:dots-six-vertical-bold" />
    </n-button>
  </n-dropdown>
</template>
<script setup>
import { ref } from 'vue';
import { useRenderIcon as renderIcon } from '@/composables';

const emits = defineEmits(['rename', 'viewDetails', 'viewLog', 'delete']);

const options = ref([
  {
    label: 'Rename',
    key: 'rename',
    icon: renderIcon('bi:pencil'),
  },
  {
    label: 'View details',
    key: 'viewDetails',
    icon: renderIcon('bi:eye-fill'),
  },
  {
    label: 'View log',
    key: 'viewLog',
    icon: renderIcon('icon-park-outline:log'),
  },
  {
    label: 'Delete',
    key: 'delete',
    icon: renderIcon('bi:trash'),
  },
]);

function handleSelect(key) {
  emits(key);
}
</script>
