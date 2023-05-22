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
              emits('validate', {
                taskName: 'action',
                keys: ['selectChannel'],
                nextExpand: '2',
              })
            "
          >
            Continue
          </n-button>
        </div>
      </n-collapse-item>

      <n-collapse-item name="2" title="Setup Action">
        <div class="step_container"><SetUpAction /></div>
      </n-collapse-item>

      <n-collapse-item name="3" title="Test" :disabled="isDisabledTest">
        <div class="step_container"><TestAction /></div>
      </n-collapse-item>
    </n-collapse>
  </n-card>
</template>

<script setup>
import { computed } from 'vue';
import { useStore } from 'vuex';
import { useAccordion } from '@/composables';
import SelectChannel from '@/views/Editor/Action/SelectChannel';
import SetUpAction from '@/views/Editor/Action/SetUpAction';
import TestAction from '@/views/Editor/Action/TestAction';

const [{ expandedNames }, { setExpand }] = useAccordion('action');

const store = useStore();
const emits = defineEmits(['validate']);
const isDisabledTest = computed(() => store.state.editor.isTestActionDisabled);

// todo: use this when change stepper step in Editor

// const actionConfig = computed(() => EditorData.workflow.tasks[EditorData.actionIdx].config);

// function validateSetupAction() {
//   // todo: clean this up
//   const callback = () => {
//     if (EditorData.workflow.tasks[EditorData.actionIdx].type !== 'email') {
//       if (!actionConfig.value.subjectTemplate) {
//         store.commit('editor/setError', { subjectTemplate: true });
//         EditorData.setError('action', true);
//       }

//       if (
//         !actionConfig.value.bodyTemplate ||
//         actionConfig.value.bodyTemplate === '<br>' ||
//         actionConfig.value.bodyTemplate === '<p></p>'
//       ) {
//         store.commit('editor/setError', { bodyTemplate: true });
//         EditorData.setError('action', true);
//       }
//     }

//     if (EditorData.workflow.tasks[EditorData.actionIdx].type !== 'email') {
//       if (
//         !actionConfig.value.messageTemplate ||
//         actionConfig.value.messageTemplate === '<br>' ||
//         actionConfig.value.messageTemplate === '<p></p>'
//       ) {
//         store.commit('editor/setError', { messageTemplate: true });
//         EditorData.setError('action', true);
//       }
//     }

//     // todo: nhét ^ vào callback
//     // chạy cục trên trước khi chạy validate email input
//     // vì email pass thì cục trên ko chạy nữa
//     // chỗ này cần copy lại để dùng khi change editor step -> from action to trigger
//     store.commit('editor/disableTestAction', false);
//     EditorData.setComplete('action', true);
//     EditorData.setError('action', false);
//   };

//   emits('validate', { taskName: 'action', keys: ['setupAction'], nextExpand: '3', callback });
// }
</script>
