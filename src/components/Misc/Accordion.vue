<template>
  <n-card class="page_container accordion" content-style="padding: 0px 10px;">
    <n-collapse
      accordion
      :expanded-names="expandedNames"
      @update:expanded-names="updateExpanded"
      display-directive="show"
    >
      <n-collapse-item
        v-for="(step, index) in props.steps"
        :key="`${step}${index}`"
        :name="step.name"
        :disabled="step.isDisabled"
      >
        <template #header="{ collapsed }">
          <div :class="{ 'text-bold': !collapsed }" class="collapse_header">
            {{ step.title }}
          </div>
        </template>

        <template #default>
          <component
            :is="step.component"
            @continue="nextStep"
            @back="backStep"
          />
        </template>
      </n-collapse-item>
    </n-collapse>
  </n-card>
</template>

<script setup>
import { ref } from 'vue';
const props = defineProps({ steps: Array });

const expandedNames = ref('3');

function updateExpanded(val) {
  expandedNames.value = val[0];
}

function nextStep() {
  expandedNames.value = (parseInt(expandedNames.value) + 1).toString();
}

function backStep() {
  expandedNames.value = (parseInt(expandedNames.value) - 1).toString();
}
</script>

<style lang="scss">
.accordion {
  margin-bottom: 5rem;
}

.n-collapse-item__header {
  padding: 0 !important;
}

.n-collapse-item {
  margin-top: 0 !important;
}

.collapse_header {
  width: 100%;
  height: 100%;
  height: 3rem;
  padding: 0;
  display: flex;
  align-items: center;
  font-size: 1rem;
}
</style>
