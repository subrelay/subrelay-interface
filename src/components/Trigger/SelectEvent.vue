<template>
  <n-form
    class="step_container"
    ref="formRef"
    @keyup.enter="validateForm"
    :model="EditorData.workflow.tasks[EditorData.triggerIdx].config"
    :show-label="false"
  >
    <n-form-item
      path="eventId"
      class="w-100"
      :rule="{
        required: true,
        trigger: 'input',
        type: 'number',
        message: 'Required!',
      }"
    >
      <n-select
        clearable
        filterable
        placeholder="Select Event"
        v-model:show="isShown"
        @update:value="handleSelectEvent"
        :value="EditorData.workflow.tasks[EditorData.triggerIdx].config.eventId"
        :options="options"
        :value-field="'id'"
        :render-label="useRenderDropdownLabel"
        :render-tag="renderSelectTagWithDescription"
        :filter="eventFilter"
      >
        <template #empty>
          <n-empty description="No event found">
            <template
              #extra
              v-if="!EditorData.workflow.tasks[EditorData.triggerIdx].chainUuid"
            >
              <n-button size="small" @click="onBack">
                Select a chain first
              </n-button>
            </template>
          </n-empty>
        </template>
      </n-select>
    </n-form-item>

    <n-button class="action_button" type="primary" @click="validateForm">
      Continue
    </n-button>
  </n-form>
</template>

<script setup>
import EditorData from '@/store/localStore/EditorData';
import { ref, computed, inject } from 'vue';
import { useStore } from 'vuex';
import {
  useRenderDropdownLabel,
  renderSelectTagWithDescription,
  useFormValidation,
} from '@/composables';

const emits = defineEmits(['continue', 'back']);
const [{ formRef }, { validateForm }] = useFormValidation('trigger', emits);

const store = useStore();
const isShown = ref(false);
const eventBus = inject('eventBus');
const options = computed(() => store.state.chain.events);
const uuid = computed(() => EditorData.workflow.tasks[0].chainUuid);

function onBack() {
  isShown.value = false;
  emits('back');
}

function handleSelectEvent(eventId) {
  EditorData.setTrigger({ eventId });
  EditorData.setTrigger({ conditions: [] });
  eventBus.emit('toggleTestFilter', { isDisabled: true });
  validateForm({ changeStep: false });

  if (eventId) {
    store.dispatch('chain/getEvent', { uuid: uuid.value, eventId });
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
