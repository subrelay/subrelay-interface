<template>
  <guess-age />
  <n-button @click="test">FOO</n-button>
</template>

<script setup>
import GuessAge from './GuessAge.vue';

defineProps({
  title: String,
});

function test() {
  const url = 'https://blog.logrocket.com/guide-vitest-automated-testing-vue-components/';
  const windowName = 'NewWindow';
  const windowFeatures = 'width=500,height=500';
  window.open(url, windowName, windowFeatures);
}
</script>

<script></script>
