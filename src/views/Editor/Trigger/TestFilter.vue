<template>
  <n-space vertical :size="30" class="step_container">
    <n-card :segmented="{ content: 'soft' }" header-style="padding-bottom: 0.5rem">
      <template #header>
        <div class="title">Input</div>
      </template>

      <n-space vertical :size="30">
        <div>
          <div class="title">Data sample:</div>

          <n-skeleton v-if="runningTest" text :repeat="3" />
          <JsonEventSample v-else />
        </div>

        <div>
          <div class="title">Filters:</div>

          <n-skeleton v-if="runningTest" text :repeat="3" />

          <n-space vertical v-else>
            <div v-for="(conditionGroup, index) in conditions" :key="index">
              <b v-if="index !== 0">OR <br /> </b>

              <span v-for="(condition, subIndex) in conditionGroup" :key="subIndex">
                <b v-if="subIndex !== 0" style="margin-left: 4px"> AND </b>
                <i> {{ condition.variable }} </i>
                <span>
                  {{
                    ['greaterThan', 'greaterThanEqual', 'lessThan'].includes(condition.operator)
                      ? ' is '
                      : ' '
                  }}
                </span>
                <span> {{ useParsePascalCaseStr(condition.operator) }}</span>
                <i> {{ condition.value !== null ? ` ${condition.value}` : '' }}</i>
              </span>
            </div>
          </n-space>
        </div>
      </n-space>
    </n-card>

    <n-card header-style="padding-bottom: 0.5rem" v-if="isTested" :segmented="{ content: 'soft' }">
      <template #header>
        <div class="title">Result</div>
      </template>

      <n-space v-if="runningTest && isTested" align="center" :wrap-item="false">
        <n-skeleton circle height="2rem" />
        <div style="flex: 1">
          <n-skeleton text :repeat="2" />
        </div>
      </n-space>

      <n-space align="center" v-else :wrap="false">
        <Icon
          :icon="isMatched ? 'ep:success-filled' : 'ic:round-cancel'"
          :color="isMatched ? '#18A058FF' : '#D03050FF'"
          :width="'2rem'"
        />

        <div>
          <div v-if="isMatched">Matched!</div>
          <div v-else>Not matched!</div>
          <n-text depth="3" class="font-size-075">
            If this was unexpected, go back to edit your filters and retest.
          </n-text>
        </div>
      </n-space>
    </n-card>

    <n-space justify="end">
      <n-button
        class="action_button"
        type="primary"
        @click="onTest"
        :loading="runningTest"
        :disabled="runningTest"
      >
        {{ isTested ? 'Retest' : 'Test' }}
      </n-button>

      <n-button
        class="action_button"
        type="primary"
        @click="eventBus.emit('nextStep')"
        v-if="isTested"
        :disabled="runningTest"
      >
        Next
      </n-button>
    </n-space>
  </n-space>
</template>

<script setup>
import API from '@/api';
import JsonEventSample from '@/components/JsonEventSample';
import EditorData from '@/store/localStore/EditorData';
import { computed, ref, inject, onBeforeUnmount } from 'vue';
import { useStore } from 'vuex';
import { useParsePascalCaseStr } from '@/composables';

const eventBus = inject('eventBus');
const store = useStore();
const isMatched = ref(null);

const type = computed(() => EditorData.workflow.tasks[EditorData.triggerIdx].type);

const config = computed(() => EditorData.workflow.tasks[EditorData.triggerIdx].config);

const runningTest = computed(() => store.state.task.runningTest[type.value]);
const isTested = computed(() => store.state.task.tested[type.value]);
const testResult = computed(() => store.state.task.testResult[type.value]);

const conditions = computed(() => EditorData.workflow.tasks[0].config.conditions);

function resetTest({ isDisabled }) {
  if (isDisabled) isTested.value = false;
}

eventBus.on('toggleTestFilter', resetTest);
onBeforeUnmount(() => eventBus.off('toggleTestFilter', resetTest));

const sample = {
  // todo: update actual event sample data
  id: 123,
  name: 'balances.deposit',
  description: 'This Event Does This',
  data: { who: '', amount: 123 },
  status: 'success',
  extrinsic: { name: 'balances.deposit' },
  block: { hash: '', number: 123, timestamp: '' },
};

async function onTest() {
  await store.dispatch('task/runTask', {
    type: type.value,
    config: config.value,
    data: sample,
  });
  isMatched.value = testResult.value.output.match;
}
</script>

<style lang="scss"></style>
