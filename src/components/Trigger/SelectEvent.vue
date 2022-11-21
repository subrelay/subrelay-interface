<template>
  <n-form
    class="step_container"
    ref="formRef"
    @keyup.enter="onContinue"
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

    <n-button class="action_button" type="primary" @click="onContinue">
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
} from '@/composables';

const emits = defineEmits(['continue', 'back']);
const store = useStore();
const formRef = ref(null);

const isShown = ref(false);
const options = computed(() => store.state.chain.events);

function onContinue(e) {
  e.preventDefault();
  formRef.value.validate(async (errors) => {
    if (errors) return;
    emits('continue');
  });
}

function onBack() {
  isShown.value = false;
  emits('back');
}

const selectedChain = computed(() => EditorData.workflow.tasks[0].config.uuid);

function handleSelectEvent(eventId) {
  EditorData.setTrigger({ eventId });

  if (eventId) {
    store.dispatch('chain/getEvent', { uuid: selectedChain.value, eventId });
  } else {
    EditorData.setTrigger({ conditions: [] });
    store.commit('chain/getEvent', {});
  }
}
</script>
