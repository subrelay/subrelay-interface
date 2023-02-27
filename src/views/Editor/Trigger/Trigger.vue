<template>
  <div>
    <n-card class="page_container accordion" content-style="padding: 16px 10px;">
      <n-collapse
        accordion
        display-directive="show"
        :expanded-names="expandedNames"
        @update:expanded-names="updateExpanded"
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
  </div>
</template>

<script setup>
import { shallowRef, inject, ref } from 'vue';
import SelectChain from '@/views/Editor/Trigger/SelectChain.vue';
import SelectEvent from '@/views/Editor/Trigger/SelectEvent.vue';
import Filters from '@/views/Editor/Trigger/Filters.vue';
import TestFilter from '@/views/Editor/Trigger/TestFilter.vue';
import Accordion from '@/components/Accordion.vue';
const expandedNames = ref('1');

function nextStep() {
  expandedNames.value = (parseInt(expandedNames.value) + 1).toString();
}

function backStep() {
  expandedNames.value = (parseInt(expandedNames.value) - 1).toString();
}

function updateExpanded(val) {
  expandedNames.value = val[0];
}

const steps = shallowRef([
  { title: 'Select Chain', name: '1', component: SelectChain },
  { title: 'Select Event', name: '2', component: SelectEvent },
  { title: 'Filter Setup', name: '3', component: Filters },
  // { title: 'Test Filter', name: '4', component: TestFilter, isDisabled: true }, // TODO: Test filter in phase 3
]);

/* TODO: phase 3
const eventBus = inject('eventBus');
eventBus.on('toggleTestFilter', ({ isDisabled }) => {
  steps.value = [...steps.value.slice(0, 3), { ...steps.value[3], isDisabled }];
  // shallowRef can only update data in this way, check vue 3 docs
  // https://vuejs.org/guide/best-practices/performance.html#reduce-reactivity-overhead-for-large-immutable-structures
});
*/
</script>

<style lang="scss"></style>
