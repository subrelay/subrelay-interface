<template>
  <div class="logo" @click="emits('click')" :class="classes" :style="style">
    <n-text depth="1" class="text"> Subrelay </n-text>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const props = defineProps({
  color: { type: String, default: '' },
});

const emits = defineEmits(['click']);

const classes = computed(() => ({}));

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
  font-size: 1.4rem;
  font-weight: 700;

  .text {
    margin-left: 0.8rem;
  }
}
</style>
