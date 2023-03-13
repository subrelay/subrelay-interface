<template>
  <n-card class="page_container accordion" content-style="padding: 16px 10px;">
    <n-collapse
      accordion
      display-directive="show"
      :expanded-names="expandedNames"
      @update:expanded-names="(val) => setExpand(val[0])"
    >
      <n-collapse-item name="1" title="Channel">
        <div class="step_container">
          <SelectChannel />

          <n-button
            class="action_button"
            type="primary"
            @click="
              emits('validate', { taskName: 'action', keys: ['selectChannel'], nextExpand: '2' })
            "
          >
            Continue
          </n-button>
        </div>
      </n-collapse-item>

      <n-collapse-item name="2" title="Setup Action">
        <div class="step_container">
          <SetUpAction />
          <n-button class="action_button" type="primary" @click="validateSetupAction">
            Continue
          </n-button>
        </div>
      </n-collapse-item>

      <n-collapse-item name="3" title="Test" :disabled="isDisabledTest">
        <div class="step_container">
          <TestAction @continue="nextStep" @back="backStep" />
        </div>
      </n-collapse-item>
    </n-collapse>
  </n-card>
</template>

<script setup>
import { shallowRef, inject, ref, computed } from 'vue';
import { useStore } from 'vuex';
import { useAccordion } from '@/composables';
import EditorData from '@/store/localStore/EditorData';
import SelectChannel from '@/views/Editor/Action/SelectChannel.vue';
import SetUpAction from '@/views/Editor/Action/SetUpAction.vue';
import TestAction from '@/views/Editor/Action/TestAction.vue';

const [{ expandedNames }, { nextStep, backStep, setExpand }] = useAccordion('action');

const store = useStore();
const emits = defineEmits(['validate']);
const isDisabledTest = computed(() => store.state.editor.isTestActionDisabled);

function validateSetupAction() {
  const callback = () => {
    store.commit('editor/disableTestAction', false);
    EditorData.setComplete('action', true);
  };

  emits('validate', { taskName: 'action', keys: ['setupAction'], nextExpand: '3', callback });
}
</script>
