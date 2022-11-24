<template>
  <n-form
    class="step_container"
    ref="formRef"
    @keyup.enter="validateForm"
    :model="EditorData.workflow.tasks[0].config"
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
        :value="EditorData.workflow.tasks[0].config.eventId"
        :options="options"
        :value-field="'id'"
        :render-label="useRenderDropdownLabel"
        :render-tag="renderSelectTagWithDescription"
        :filter="useDropdownFilter"
      >
        <template #empty>
          <n-empty description="No event found">
            <template #extra>
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
import { ref, computed } from 'vue';
import { useStore } from 'vuex';
import {
  useDropdownFilter,
  useRenderDropdownLabel,
  renderSelectTagWithDescription,
  useFormValidation,
} from '@/composables';

const emits = defineEmits(['continue', 'back']);
const [{ formRef }, { validateForm }] = useFormValidation('trigger', emits);

const store = useStore();
const isShown = ref(false);
const options = computed(() => store.state.chain.events);

function onBack() {
  isShown.value = false;
  emits('back');
}

const uuid = computed(() => EditorData.workflow.tasks[0].config.uuid);

function handleSelectEvent(eventId) {
  EditorData.setTrigger({ eventId });
  validateForm({ changeStep: false });

  if (eventId) {
    store.dispatch('chain/getEvent', { uuid: uuid.value, eventId });
  } else {
    EditorData.setTrigger({ conditions: [] });
    store.commit('chain/getEvent', {});
  }
}
</script>
