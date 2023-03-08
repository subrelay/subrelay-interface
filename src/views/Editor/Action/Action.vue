<template>
  <n-card class="page_container accordion" content-style="padding: 16px 10px;">
    <n-collapse
      accordion
      display-directive="show"
      :expanded-names="expandedNames"
      @update:expanded-names="(val) => setExpand(val[0])"
    >
      <n-collapse-item
        v-for="(step, index) in steps"
        :key="`${step}${index}`"
        :name="step.name"
        :disabled="step.isDisabled"
        :title="step.title"
      >
        <template #default>
          <component :is="step.component" @continue="nextStep" @back="backStep" />
        </template>
      </n-collapse-item>
    </n-collapse>
  </n-card>
</template>

<script setup>
import { shallowRef, inject } from 'vue';
import { useAccordion } from '@/composables';
import SelectChannel from '@/views/Editor/Action/SelectChannel.vue';
import SetUpAction from '@/views/Editor/Action/SetUpAction.vue';
import TestAction from '@/views/Editor/Action/TestAction.vue';

const [{ expandedNames }, { nextStep, backStep, setExpand }] = useAccordion('action');

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
