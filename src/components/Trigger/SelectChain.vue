<template>
  <n-form
    class="step_container"
    ref="formRef"
    @keyup.enter="onContinue"
    :model="formData"
    :show-label="false"
    :validate-messages="{ required: 'Required!' }"
  >
    <n-form-item
      path="chain_uuid"
      class="w-100"
      :rule="{ required: true, trigger: ['input'] }"
    >
      <ChainDropdown
        v-model="formData.chain_uuid"
        :onSelectChain="handleSelectChain"
        :placeholder="'Select Chain'"
      />
    </n-form-item>

    <n-button class="action_button" type="primary" @click="onContinue">
      Continue
    </n-button>
  </n-form>
</template>

<script setup>
import { reactive, ref, inject } from 'vue';
import { useStore } from 'vuex';
import ChainDropdown from '@/components/Common/ChainDropdown';

const emits = defineEmits(['continue']);
const formRef = ref(null);
const formData = reactive({});
const store = useStore();
const eventBus = inject('eventBus');

function onContinue(e) {
  e.preventDefault();
  formRef.value.validate(async (errors) => {
    if (errors) return;
    emits('continue');
  });
}

function handleSelectChain(chain_uuid) {
  let config = {};

  if (chain_uuid) {
    store.dispatch('chain/getEvents', chain_uuid);
    config = { chain_uuid };
  } else {
    store.commit('chain/getEvents', []);
    config = { chain_uuid, event: null, conditions: [] };
  }

  eventBus.emit('updateTask', { name: 'trigger', config });
}
</script>
