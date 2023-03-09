<template>
  <n-card class="page_container accordion" content-style="padding: 1.5rem">
    <n-collapse
      accordion
      display-directive="show"
      :expanded-names="expandedNames"
      @update:expanded-names="(val) => setExpand(val[0])"
    >
      <n-collapse-item name="1" title="Select Chain">
        <div class="step_container">
          <SelectChain />
          <n-button
            class="action_button"
            type="primary"
            @click="
              emits('validate', { taskName: 'trigger', keys: ['selectChain'], nextExpand: '2' })
            "
          >
            Continue
          </n-button>
        </div>
      </n-collapse-item>

      <n-collapse-item name="2" title="Select Event">
        <div class="step_container">
          <SelectEvent />

          <n-button
            class="action_button"
            type="primary"
            @click="
              emits('validate', { taskName: 'trigger', keys: ['selectEvent'], nextExpand: '3' })
            "
          >
            Continue
          </n-button>
        </div>
      </n-collapse-item>

      <n-collapse-item name="3" title="Filters">
        <div class="step_container">
          <Filters />

          <n-button
            class="action_button"
            type="primary"
            @click="emits('validate', { taskName: 'trigger', keys: ['filterCond'] })"
          >
            {{ conditionLength ? 'Continue' : 'Skip filter' }}
          </n-button>
        </div>
      </n-collapse-item>
    </n-collapse>
  </n-card>
</template>

<script setup>
import { useAccordion, useFormValidation } from '@/composables';
import { computed, watch } from 'vue';
import EditorData from '@/store/localStore/EditorData';
import SelectChain from '@/views/Editor/Trigger/SelectChain.vue';
import SelectEvent from '@/views/Editor/Trigger/SelectEvent.vue';
import Filters from '@/views/Editor/Trigger/Filters.vue';
import TestFilter from '@/views/Editor/Trigger/TestFilter.vue';

const [{ expandedNames }, { setExpand }] = useAccordion('trigger');
const emits = defineEmits(['validate']);

const conditionLength = computed(() => EditorData.workflow.tasks[0].config.conditions.length);
</script>

<style lang="scss"></style>
