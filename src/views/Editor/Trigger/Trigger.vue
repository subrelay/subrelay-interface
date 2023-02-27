<template>
  <n-card class="page_container accordion" content-style="padding: 16px 10px;">
    <n-collapse
      accordion
      display-directive="show"
      :expanded-names="expandedNames"
      @update:expanded-names="updateExpanded"
    >
      <n-collapse-item name="1" title="Select Chain">
        <SelectChain @continue="nextStep" />
      </n-collapse-item>

      <n-collapse-item name="2" title="Select Event">
        <SelectEvent @continue="nextStep" @back="backStep" />
      </n-collapse-item>

      <n-collapse-item name="3" title="Filters">
        <Filters />
      </n-collapse-item>
    </n-collapse>
  </n-card>
</template>

<script setup>
import { useStepper } from '@/composables';
import SelectChain from '@/views/Editor/Trigger/SelectChain.vue';
import SelectEvent from '@/views/Editor/Trigger/SelectEvent.vue';
import Filters from '@/views/Editor/Trigger/Filters.vue';
import TestFilter from '@/views/Editor/Trigger/TestFilter.vue';

const [{ expandedNames }, { nextStep, backStep, updateExpanded }] = useStepper('trigger');
</script>

<style lang="scss"></style>
