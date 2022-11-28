<template>
  <Accordion :steps="steps" />
</template>

<script setup>
import { shallowRef, inject } from 'vue';
import SelectChain from '@/components/Trigger/SelectChain.vue';
import SelectEvent from '@/components/Trigger/SelectEvent.vue';
import Filters from '@/components/Trigger/Filters.vue';
import TestFilter from '@/components/Trigger/TestFilter.vue';
import Accordion from '@/components/Misc/Accordion.vue';

const steps = shallowRef([
  { title: 'Select Chain', name: '1', component: SelectChain },
  { title: 'Select Event', name: '2', component: SelectEvent },
  { title: 'Filter Setup', name: '3', component: Filters },
  { title: 'Test Filter', name: '4', component: TestFilter, isDisabled: true },
]);

const eventBus = inject('eventBus');
eventBus.on('toggleTestFilter', ({ isDisabled }) => {
  // shallowRef can only update data in this way
  // check vue 3 docs
  // https://vuejs.org/guide/best-practices/performance.html#reduce-reactivity-overhead-for-large-immutable-structures
  steps.value = [...steps.value.slice(0, 3), { ...steps.value[3], isDisabled }];
});
</script>

<style lang="scss"></style>
