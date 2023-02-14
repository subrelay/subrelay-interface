<template>
  <div class="cover-layout" v-if="loading"></div>

  <n-layout v-if="EditorData.workflow">
    <n-layout-header style="padding: 5px 3rem" bordered>
      <!-- HEADER -->
      <n-space align="center" justify="space-between">
        <!-- Name -->
        <ShowOrEdit :onUpdateValue="onUpdateName" :value="EditorData.workflow.name" />

        <!-- Logo -->
        <Logo @click="quitEditor" />

        <!-- Buttons -->
        <n-space>
          <n-button type="primary" class="action-button" icon-placement="left" @click="quitEditor">
            <template #icon>
              <SubIcon icon="line-md:home-md" :inline="true" class="icon" />
            </template>
            Home
          </n-button>

          <n-button
            type="primary"
            class="action-button"
            icon-placement="right"
            @click="onChangeStep(2)"
            v-if="currentStep == 1"
          >
            Next
            <template #icon>
              <SubIcon icon="line-md:chevron-small-double-right" class="icon" />
            </template>
          </n-button>

          <div v-else>
            <n-space>
              <n-button
                type="primary"
                class="action-button"
                icon-placement="right"
                @click="onChangeStep(1)"
              >
                Back
                <template #icon>
                  <SubIcon icon="line-md:chevron-small-double-left" class="icon" />
                </template>
              </n-button>

              <n-button
                type="primary"
                class="action-button"
                icon-placement="right"
                @click="createWorkflow"
                :disabled="
                  !isTriggerCompleted ||
                  !isActionCompleted ||
                  isErrorWithTrigger ||
                  isErrorWithAction
                "
              >
                Finish
                <template #icon>
                  <SubIcon icon="line-md:confirm" class="icon" />
                </template>
              </n-button>
            </n-space>
          </div>
        </n-space>
      </n-space>
    </n-layout-header>

    <n-layout-content content-style="padding-top: 50px;" class="full-page">
      <n-space :size="50" vertical>
        <!-- STEPPER -->
        <div class="page_container">
          <n-steps :current="currentStep" @update:current="onChangeStep" class="stepper">
            <n-step
              title="TRIGGER"
              description="This is what starts the app"
              :status="triggerStatus"
            >
              <template #icon>
                <n-icon><ThunderboltOutlined /> </n-icon>
              </template>
            </n-step>

            <n-step
              title="ACTION"
              description="Action will perform when the app has started"
              :status="actionStatus"
            >
              <template #icon>
                <n-icon><BellOutlined /> </n-icon>
              </template>
            </n-step>
          </n-steps>
        </div>

        <!-- Use v-show to preserve the data when switching steps -->
        <Trigger v-show="currentStep == 1" />
        <Action v-show="currentStep == 2" />
      </n-space>
    </n-layout-content>
  </n-layout>
</template>

<script setup>
import EditorData from '@/store/localStore/EditorData';
import Logo from '@/components/Common/Logo';
import ShowOrEdit from '@/components/Common/ShowOrEdit';
import Trigger from '@/components/Trigger/Trigger';
import Action from '@/components/Action/Action';
import { ThunderboltOutlined, BellOutlined } from '@vicons/antd';
import { h, ref, inject, computed, onBeforeMount, onBeforeUnmount, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useDialog, useMessage } from 'naive-ui';
import { useShowError } from '@/composables';
import { useStore } from 'vuex';
import Api from '@/api';

const props = defineProps({ id: [String, Number] });
const router = useRouter();
const route = useRoute();
const store = useStore();
const dialog = useDialog();
const message = useMessage();
const currentStep = ref(null);
const account = computed(() => store.state.account.selected);
const signer = computed(() => store.state.account.signer);

onMounted(() => (window.$message = useMessage()));
onBeforeMount(() => {
  window.addEventListener('beforeunload', (e) => handleReload(e));
});

function handleNextStep() {
  onChangeStep(2);
}

// TODO: Replace event bus by local state
const eventBus = inject('eventBus');
eventBus.on('nextStep', handleNextStep);

function onChangeStep(step) {
  currentStep.value = step;

  setStepStatus(step);

  router.push({
    name: step == 1 ? 'trigger' : 'action',
    params: { id: +props.id || 'new-flow' },
  });
}

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
    typeof task.isError === 'boolean' ||
    typeof task.isCompleted === 'boolean' ||
    !!task.config.eventId ||
    !!task.chainUuid
  );
});

const changedToAction = computed(() => {
  const task = EditorData.workflow.tasks[actionIdx.value];
  return typeof task.isError === 'boolean' || typeof task.isCompleted === 'boolean';
});

const hasUpdates = computed(() => changedToTrigger.value || changedToAction.value);

const hasError = computed(() =>
  EditorData.workflow.tasks.some((task) => task.isError || !task.isCompleted),
);

function handleReload(e) {
  if (!hasUpdates.value) return;
  e.preventDefault();
  e.returnValue = '';
}

function setStepStatus(step) {
  // Switch from trigger to action
  if (step === 2) {
    actionStatus.value = 'process';
    triggerStatus.value = 'wait';

    if (changedToTrigger.value) {
      if (isErrorWithTrigger.value) return (triggerStatus.value = 'error');
      if (isTriggerCompleted.value) return (triggerStatus.value = 'finish');
    }
  }

  // Switch from action to trigger
  if (step === 1) {
    actionStatus.value = 'wait';
    triggerStatus.value = 'process';

    if (changedToAction.value) {
      if (isErrorWithAction.value) return (actionStatus.value = 'error');
      if (isActionCompleted.value) return (actionStatus.value = 'finish');
    }
  }
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

const loading = ref(false);

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
    } else {
      useShowError(e);
    }
  } finally {
    loading.value = true;
  }
}

onBeforeUnmount(() => {
  EditorData.loadWorkflow();
  store.commit('task/reset');
  eventBus.off('nextStep', handleNextStep);
});

onBeforeMount(async () => {
  let data;

  // TODO: Refactor
  if (props.id !== 'new-flow') {
    try {
      const { data: workflow } = await Api.getWorkFlow({
        account: store.state.account.selected,
        signer: store.state.account.signer,
        id: +props.id,
      });
      data = workflow;
    } catch (error) {
      message.error('Failed to fetch workflow data', error);
    } finally {
      loading.value = false;
    }
  }

  // Might need to update right here to prevent child components from mounting
  // before data is completely loaded
  EditorData.loadWorkflow(data);

  const chainUuid = EditorData.workflow.chainUuid;
  const eventId = EditorData.workflow.tasks[0].config.eventId;

  if (chainUuid) {
    store.dispatch('chain/getEvents', chainUuid);
    if (eventId) {
      store.dispatch('chain/getEvent', { chainUuid, eventId });
    }
  }

  currentStep.value = route.name === 'trigger' ? 1 : 2;
  setStepStatus(currentStep.value);
});
</script>

<style lang="scss">
.stepper {
  width: 70%;
  margin: auto;
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
</style>
