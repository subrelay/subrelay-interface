<template>
  <div class="cover-layout" v-if="loading" />

  <n-layout v-if="EditorData.workflow" style="height: 100vh">
    <n-layout-header style="padding: 5px 3rem" bordered>
      <!-- HEADER -->
      <n-space align="center" justify="space-between">
        <EditableText
          :onUpdateValue="onUpdateName"
          :value="EditorData.workflow.name"
          data-test="editor-editable-name"
        />

        <Logo @click="quitEditor" />

        <n-space>
          <n-button type="primary" class="action-button" @click="quitEditor" data-test="editor-home-btn">
            <template #icon>
              <Icon icon="line-md:home-md" :inline="true" class="icon" />
            </template>
            Home
          </n-button>

          <n-button
            data-test="editor-finish-btn"
            type="primary"
            class="action-button"
            @click="createWorkflow"
            :disabled="!isTriggerCompleted || !isActionCompleted || isErrorWithTrigger || isErrorWithAction"
          >
            Finish
            <template #icon>
              <Icon icon="line-md:confirm" class="icon" />
            </template>
          </n-button>
        </n-space>
      </n-space>
    </n-layout-header>

    <n-layout-content content-style="padding-top: 50px;">
      <!-- STEPPER -->
      <div class="page_container">
        <n-steps :current="step" @update:current="onChangeStep" class="stepper" data-test="editor-stepper">
          <n-step
            data-test="editor-trigger-stepper"
            title="TRIGGER"
            description="This is what starts the workflow"
            :status="triggerStatus"
          >
            <template #icon>
              <n-icon><ThunderboltOutlined /> </n-icon>
            </template>
          </n-step>

          <n-step
            data-test="editor-action-stepper"
            title="ACTION"
            description="Action will perform when the event is triggered"
            :status="actionStatus"
          >
            <template #icon>
              <n-icon><BellOutlined /> </n-icon>
            </template>
          </n-step>
        </n-steps>

        <!-- Use v-show to preserve the data when switching steps -->
        <n-form ref="formRef" :model="EditorData.workflow" style="margin-bottom: 10vh">
          <Trigger v-show="step == 1" @validate="validateForm" />
          <Action v-show="step == 2" @validate="validateForm" />
        </n-form>
      </div>

      <pre>{{ EditorData }}</pre>
    </n-layout-content>
  </n-layout>
</template>

<script setup>
import { useFormValidation, useShowError } from '@/composables';
import EditorData from '@/store/localStore/EditorData';
import Logo from '@/components/Logo';
import EditableText from '@/components/EditableText';
import Trigger from '@/views/Editor/Trigger/Trigger';
import Action from '@/views/Editor/Action/Action';
import { ThunderboltOutlined, BellOutlined } from '@vicons/antd';
import { h, ref, inject, computed, onBeforeMount, onBeforeUnmount, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useDialog, useMessage } from 'naive-ui';
import { useStore } from 'vuex';
import Api from '@/api';

defineProps({ id: [String, Number] });
const router = useRouter();
const route = useRoute();
const store = useStore();
const dialog = useDialog();
const message = useMessage();
const loading = ref(false);
const step = computed(() => store.state.editor.step);
const account = computed(() => store.state.account.selected);
const signer = computed(() => store.state.account.signer);

onMounted(() => {
  window.$message = useMessage();
});

// BUILD WORKFLOW DATA
const triggerStatus = ref(null);
const actionStatus = ref(null);
const triggerIdx = computed(() => EditorData.triggerIdx);
const actionIdx = computed(() => EditorData.actionIdx);

const isErrorWithTrigger = computed(() => EditorData.workflow.tasks[triggerIdx.value].isError);
const isErrorWithAction = computed(() => EditorData.workflow.tasks[actionIdx.value].isError);
const isTriggerCompleted = computed(() => EditorData.workflow.tasks[triggerIdx.value].isCompleted);
const isActionCompleted = computed(() => EditorData.workflow.tasks[actionIdx.value].isCompleted);

const changedToTrigger = computed(() => {
  const task = EditorData.workflow.tasks[triggerIdx.value];
  return (
    typeof task.isError === 'boolean' || typeof task.isCompleted === 'boolean' || !!task.config.eventId || !!task.uuid
  );
});

const changedToAction = computed(() => {
  const task = EditorData.workflow.tasks[actionIdx.value];
  return !!task.type;
});

const hasUpdates = computed(() => changedToTrigger.value || changedToAction.value);

function handleReload(e) {
  // if (!hasUpdates.value) return;
  // e.preventDefault();
  // e.returnValue = '';
}

onBeforeUnmount(() => {
  EditorData.loadWorkflow();
  store.commit('editor/reset');
  window.removeEventListener('beforeunload', (e) => handleReload(e));
});

const [{ formRef }, { validateForm }] = useFormValidation();
const eventBus = inject('eventBus');
eventBus.on('validate', validateForm);

async function setStepStatus(nextStep) {
  // Switch from action to trigger
  if (nextStep === 1) {
    actionStatus.value = 'wait';
    triggerStatus.value = 'process';

    if (changedToAction.value) {
      await validateForm({
        keys: ['selectChannel', 'setupAction'],
        taskName: 'action',
      });

      // TODO: CHECK EMAIL CONTENT HERE (COPY FROM ACTION COMPONENT)

      if (isErrorWithAction.value) {
        actionStatus.value = 'error';
        EditorData.setError('action', true);
        EditorData.setComplete('action', false);
        return;
      }

      if (isActionCompleted.value) {
        actionStatus.value = 'finish';
        EditorData.setError('action', false);
        EditorData.setComplete('action', true);
        return;
      }
    }
  }

  // Switch from trigger to action
  if (nextStep === 2) {
    actionStatus.value = 'process';
    triggerStatus.value = 'wait';

    if (changedToTrigger.value) {
      await validateForm({
        keys: ['filterCond', 'selectChain', 'selectEvent'],
        taskName: 'trigger',
      });
      if (isErrorWithTrigger.value) {
        triggerStatus.value = 'error';
        EditorData.setError('trigger', true);
        EditorData.setComplete('trigger', false);
        return;
      }
      if (isTriggerCompleted.value) {
        triggerStatus.value = 'finish';
        EditorData.setError('trigger', false);
        EditorData.setComplete('trigger', true);
      }
    }
  }
}

function onChangeStep(nextStep) {
  store.commit('editor/setStep', nextStep);
  setStepStatus(nextStep);
  router.push({ name: nextStep === 1 ? 'trigger' : 'action' });
}

function onUpdateName(value) {
  EditorData.setName(value);
}

function showExitWarning() {
  dialog.warning({
    title: 'Confirm quit',
    content: () =>
      h('div', { style: { fontSize: '0.85rem' } }, [
        h('div', 'Changes you made will be discarded because the workflow is not yet completed.'),
        h('div', { style: { marginTop: '1rem' } }, 'You can’t undo this action.'),
      ]),

    positiveText: 'Leave',
    negativeText: 'Stay',

    onPositiveClick: () => {
      EditorData.loadWorkflow();
      router.push({ name: 'workflows' });
    },

    onNegativeClick: () => {},
  });
}

async function quitEditor() {
  if (hasUpdates.value) {
    showExitWarning();
  } else {
    router.push({ name: 'workflows' });
    EditorData.cleanUpWorkflow();
  }
}

async function createWorkflow() {
  loading.value = true;
  try {
    EditorData.cleanUpWorkflow();

    await Api.createWorkflow({
      account: account.value,
      signer: signer.value,
      body: EditorData.postWorkflowData,
    });

    message.success('Workflow created!');
    router.push({ name: 'workflows' });
  } catch (e) {
    const errMsg = e.message;
    if (errMsg === 'Cancelled') {
      return;
    }
    useShowError(e);
  } finally {
    loading.value = false;
  }
}

onBeforeMount(async () => {
  // Might need to update right here to prevent child components from mounting
  // before data is completely loaded
  EditorData.loadWorkflow();
  const { uuid } = EditorData.workflow;

  if (uuid) store.dispatch('chain/getEvents', uuid);
  store.commit('editor/setStep', route.name === 'trigger' ? 1 : 2);
  window.addEventListener('beforeunload', (e) => handleReload(e));
});
</script>

<style lang="scss">
.stepper {
  width: 70%;
  margin: auto;
  padding-bottom: 5vh;
}

.cover-layout {
  opacity: 0;
  width: 100vw;
  height: 100vh;
  z-index: 1000;
  position: absolute;
  top: 0;
  left: 0;
  cursor: wait;
}

.n-step-content__description {
  font-size: 0.8em;
}
</style>
