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
  var url = 'https://blog.logrocket.com/guide-vitest-automated-testing-vue-components/';
  var windowName = 'NewWindow';
  var windowFeatures = 'width=500,height=500';
  window.open(url, windowName, windowFeatures);
}
</script>

<script></script>
