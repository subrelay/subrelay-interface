<template>
  <Accordion :steps="steps" />
</template>

<script setup>
import { shallowRef, inject } from 'vue';
import SelectChannel from '@/components/Action/SelectChannel.vue';
import SetUpAction from '@/components/Action/SetUpAction.vue';
import TestAction from '@/components/Action/TestAction.vue';
import Accordion from '@/components/Misc/Accordion.vue';

const steps = shallowRef([
  { title: 'Select Application', name: '1', component: SelectChannel },
  { title: 'Set Up Action', name: '2', component: SetUpAction },
  { title: 'Test Action', name: '3', component: TestAction, isDisabled: true },
]);

const eventBus = inject('eventBus');
eventBus.on('toggleTestAction', ({ isDisabled }) => {
  steps.value = [...steps.value.slice(0, 2), { ...steps.value[2], isDisabled }];
});
</script>

<style lang="scss"></style>
