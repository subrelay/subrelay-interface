<template>
  <n-card class="page_container accordion" content-style="padding: 16px 10px">
    <n-collapse
      accordion
      display-directive="show"
      :expanded-names="expandedNames"
      @update:expanded-names="(val) => setExpand(val[0])"
    >
      <n-collapse-item name="1" title="Chain">
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

      <n-collapse-item name="2" title="Event">
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

          <n-button class="action_button" type="primary" @click="validateFilter">
            {{ conditionLength ? 'Continue' : 'Skip filter' }}
          </n-button>
        </div>
      </n-collapse-item>
    </n-collapse>
  </n-card>
</template>

<script setup>
import { useAccordion } from '@/composables';
import { computed } from 'vue';
import { useStore } from 'vuex';
import EditorData from '@/store/localStore/EditorData';
import SelectChain from '@/views/Editor/Trigger/SelectChain';
import SelectEvent from '@/views/Editor/Trigger/SelectEvent';
import Filters from '@/views/Editor/Trigger/Filters';
import { useRouter } from 'vue-router';

const [{ expandedNames }, { setExpand }] = useAccordion('trigger');
const emits = defineEmits(['validate']);
const router = useRouter();
const store = useStore();

const filterIdx = computed(() => EditorData.filterIdx);
const conditionLength = computed(
  () => EditorData.workflow.tasks[filterIdx.value].config.conditions.length,
);

function validateFilter() {
  const callback = () => {
    EditorData.setComplete('filter', true);
    EditorData.setError('filter', false);
  };

  emits('validate', {
    taskName: 'filter',
    keys: ['filterCond'],
    nextExpand: 1,
    nextStep: 2,
    callback,
  });
}
</script>

<style lang="scss"></style>
