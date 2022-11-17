<template>
  <Accordion :steps="steps" />
</template>

<script setup>
import { shallowRef, inject } from 'vue';
import SelectChain from '@/components/Trigger/SelectChain.vue';
import SelectEvent from '@/components/Trigger/SelectEvent.vue';
import Filters from '@/components/Trigger/Filters.vue';
import TestFilter from '@/components/Trigger/TestFilter.vue';
import Accordion from '@/components/Accordion.vue';

const steps = shallowRef([
  { title: 'Select chain', name: '1', component: SelectChain },
  { title: 'Select Event', name: '2', component: SelectEvent },
  { title: 'Filter setup', name: '3', component: Filters },
  { title: 'Test filter', name: '4', component: TestFilter, isDisabled: true },
]);

const emitter = inject('emitter');
emitter.on('toggleTestFilter', ({ isDisabled }) => {
  // shallowRef can only update data in this way
  // check vue 3 docs
  // https://vuejs.org/guide/best-practices/performance.html#reduce-reactivity-overhead-for-large-immutable-structures
  steps.value = [...steps.value.slice(0, 3), { ...steps.value[3], isDisabled }];
});
</script>

<style lang="scss"></style>
