<template>
  <div :class="`custom-error ${darkMode ? 'dark' : ''}`">
    <Transition name="slide-fade">
      <p v-if="show">{{ text }}</p>
    </Transition>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useStore } from 'vuex';

defineProps({ show: Boolean, text: { String, default: 'Required!' } });

const store = useStore();
const darkMode = computed(() => store.state.global.isDarkMode);
</script>

<style lang="scss">
.custom-error {
  min-height: 24px;
  color: #d03050;

  &.dark {
    color: #e88080;
  }
}
</style>
