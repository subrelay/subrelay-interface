<template>
  <n-form-item
    label="Select event"
    :path="`tasks[${EditorData.triggerIdx}].config.eventId`"
    :rule="{
      required: true,
      trigger: 'input',
      type: 'any',
      key: 'selectEvent',
      message: 'Required!',
    }"
  >
    <n-select
      clearable
      filterable
      :loading="loading"
      :disabled="loading"
      :options="options"
      :value-field="'id'"
      :render-label="useRenderDropdownLabel"
      :render-tag="renderSelectTagWithDescription"
      :filter="eventFilter"
      v-model:show="isShown"
      v-model:value="EditorData.workflow.tasks[EditorData.triggerIdx].config.eventId"
      @update:value="handleSelectEvent"
    >
      <template #empty>
        <n-empty description="No event found">
          <template #extra v-if="!EditorData.workflow.uuid">
            <n-button size="small" @click="onBack"> Select a chain first </n-button>
          </template>
        </n-empty>
      </template>
    </n-select>
  </n-form-item>
</template>

<script setup>
import EditorData from '@/store/localStore/EditorData';
import { ref, computed } from 'vue';
import { useStore } from 'vuex';
import { useRenderDropdownLabel, renderSelectTagWithDescription } from '@/composables';

const store = useStore();
const isShown = ref(false);

const options = computed(() => store.state.chain.events);
const uuid = computed(() => EditorData.workflow.uuid);
const loading = computed(() => store.state.chain.loading.getEventsLoading);

function onBack() {
  isShown.value = false;
  store.commit('editor/setExpand', { trigger: '1' });
}

function handleSelectEvent(eventId) {
  EditorData.setError('trigger', !eventId);
  EditorData.setComplete('trigger', !!eventId);
  EditorData.resetFilter();

  if (eventId) {
    // store.dispatch('chain/getEvent', { uuid: uuid.value, eventId });
    store.dispatch('task/getFields', eventId);
  } else {
    // store.commit('chain/getEvent', {});
    store.commit('task/getFields', []);
  }
}

function eventFilter(string, option) {
  const { pallet, name } = option;
  const fullOptionText = `${pallet}.${name}`.toLowerCase();
  return fullOptionText.includes(string.toLowerCase());
}
</script>
