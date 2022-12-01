<template>
  <div class="logo" @click="emits('click')" :class="classes" :style="style">
    <n-text>
      <Icon icon="eos-icons:action-chains-outlined" :inline="true" />
    </n-text>

    <n-text depth="1" class="text"> SUBRELAY </n-text>
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

const classes = computed(() => {
  return {};
});

const style = computed(() => {
  return {
    color: props.color,
  };
});
</script>

<style lang="scss">
.logo {
  font-family: 'Montserrat';
  cursor: pointer;
  user-select: none;
  display: flex;
  align-items: center;
  font-size: 2.25rem;

  .text {
    margin-left: 0.8rem;
  }
}
</style>
