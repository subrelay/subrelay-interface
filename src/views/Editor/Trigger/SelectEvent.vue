<template>
  <n-form
    class="step_container"
    ref="formRef"
    :model="EditorData.workflow.tasks[EditorData.triggerIdx].config"
    :show-label="false"
  >
    <n-form-item
      path="eventId"
      class="w-100"
      :rule="{ required: true, trigger: 'input', type: 'any', message: 'Required' }"
    >
      <n-select
        clearable
        filterable
        placeholder="Select Event"
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
            <template #extra v-if="!EditorData.workflow.chainUuid">
              <n-button size="small" @click="onBack"> Select a chain first </n-button>
            </template>
          </n-empty>
        </template>
      </n-select>
    </n-form-item>

    <n-button class="action_button" type="primary" @click="validateForm"> Continue </n-button>
  </n-form>
</template>

<script setup>
import EditorData from '@/store/localStore/EditorData';
import { ref, computed } from 'vue';
import { useStore } from 'vuex';
import {
  useRenderDropdownLabel,
  renderSelectTagWithDescription,
  useContinueWithValidation,
} from '@/composables';

const emits = defineEmits(['continue']);
const [{ formRef }, { validateForm }] = useContinueWithValidation('trigger', '3');

const store = useStore();
const isShown = ref(false);

const options = computed(() => store.state.chain.events);
const chainUuid = computed(() => EditorData.workflow.chainUuid);
const loading = computed(() => store.state.chain.loading.getEventsLoading);

function onBack() {
  isShown.value = false;
  store.commit('editor/setExpand', { trigger: '1' });
}

function handleSelectEvent(eventId) {
  EditorData.setTrigger({ conditions: [] });

  if (eventId) {
    store.dispatch('chain/getEvent', { chainUuid: chainUuid.value, eventId });
  } else {
    store.commit('chain/getEvent', {});
  }
}

function eventFilter(string, option) {
  const { pallet, name } = option;
  const fullOptionText = `${pallet}.${name}`.toLowerCase();
  return fullOptionText.includes(string.toLowerCase());
}
</script>
