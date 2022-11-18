<template>
  <n-form
    class="step_container"
    @keyup.enter="onContinue"
    ref="formRef"
    :model="formData"
    :show-label="false"
    :validate-messages="{ required: 'Required!' }"
  >
    <n-form-item
      path="event"
      class="w-100"
      :rule="{ required: true, trigger: 'input' }"
    >
      <n-select
        clearable
        filterable
        placeholder="Select Event"
        v-model:show="isShown"
        v-model:value="formData.event"
        @update:value="handleSelectEvent"
        :options="options"
        :value-field="'name'"
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
import { ref, reactive, computed, inject } from 'vue';
import { useStore } from 'vuex';
import {
  useDropdownFilter,
  useRenderDropdownLabel,
  renderSelectTagWithDescription,
} from '@/composables';

const emits = defineEmits(['continue', 'back']);
const store = useStore();
const formRef = ref(null);
const formData = reactive({});

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

const eventBus = inject('eventBus');
function handleSelectEvent(event) {
  eventBus.emit('updateTask', { name: 'trigger', config: { event } });
}
</script>
