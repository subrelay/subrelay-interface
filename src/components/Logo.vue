<template>
  <div class="logo" @click="emits('click')" :style="style" data-test="subrelay-logo">
    <n-text depth="1" class="text">↗Subrelay↘</n-text>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  color: { type: String, default: '' },
});

const emits = defineEmits(['click']);

const style = computed(() => ({
  color: props.color,
}));
</script>

<style lang="scss">
.logo {
  font-family: 'Unbounded';
  cursor: pointer;
  user-select: none;
  display: flex;
  align-items: center;
  font-size: 28px;
  font-weight: 700;
}
</style>
