<template>
  <n-card class="page_container accordion" content-style="padding: 0px 10px;">
    <n-collapse
      accordion
      display-directive="show"
      :expanded-names="expandedNames"
      @update:expanded-names="updateExpanded"
    >
      <n-collapse-item
        v-for="(step, index) in props.steps"
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
import { ref } from 'vue';
const props = defineProps({ steps: Array });
const expandedNames = ref('1');

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
</style>
