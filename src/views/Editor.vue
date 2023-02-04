<template>
  <n-layout v-if="EditorData.workflow">
    <n-layout-header style="padding: 5px 3rem" bordered>
      <!-- HEADER -->
      <n-space align="center" justify="space-between">
        <!-- Buttons -->
        <n-space>
          <n-button
            type="primary"
            class="action-button"
            icon-placement="left"
            @click="quitEditor"
          >
            <template #icon>
              <Icon icon="line-md:home-md" :inline="true" class="icon" />
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
              <Icon icon="line-md:chevron-small-double-right" class="icon" />
            </template>
          </n-button>

          <div v-else>
            <n-space>
              <n-button
                type="primary"
                class="action-button"
                icon-placement="right"
                @click="quitEditor"
              >
                Finish
                <template #icon>
                  <Icon icon="line-md:confirm" class="icon" />
                </template>
              </n-button>

              <n-button
                type="primary"
                class="action-button"
                icon-placement="right"
                @click="onChangeStep(1)"
              >
                Back
                <template #icon>
                  <Icon icon="line-md:chevron-small-double-left" class="icon" />
                </template>
              </n-button>
            </n-space>
          </div>
        </n-space>

        <!-- Logo -->
        <Logo @click="quitEditor" />

        <!-- Name -->
        <ShowOrEdit
          :onUpdateValue="onUpdateName"
          :value="EditorData.workflow.name"
        />
      </n-space>
    </n-layout-header>

    <n-layout-content content-style="padding-top: 50px;" class="full-page">
      <n-space :size="50" vertical>
        <!-- STEPPER -->
        <div class="page_container">
          <n-steps
            :current="currentStep"
            @update:current="onChangeStep"
            class="stepper"
          >
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

  <n-space vertical :size="50"> </n-space>

  <div>changesAppliedToTrigger {{ changesAppliedToTrigger }}</div>
  <div>changesAppliedToAction {{ changesAppliedToAction }}</div>

  <pre>{{ EditorData }}</pre>
</template>

<script setup>
import EditorData from '@/store/localStore/EditorData';
import Logo from '@/components/Common/Logo';
import ShowOrEdit from '@/components/Common/ShowOrEdit';
import Trigger from '@/components/Trigger/Trigger';
import Action from '@/components/Action/Action';
import { ThunderboltOutlined, BellOutlined } from '@vicons/antd';
import {
  h,
  ref,
  inject,
  computed,
  onBeforeMount,
  onBeforeUnmount,
  onMounted,
} from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useDialog, useMessage } from 'naive-ui';
import { useStore } from 'vuex';
import Api from '@/api';

const props = defineProps({ id: [String, Number] });
const defaultQuery = computed(() => store.state.global.defaultQuery);
const router = useRouter();
const route = useRoute();
const store = useStore();
const dialog = useDialog();
const message = useMessage();
const currentStep = ref(null);

onMounted(() => (window.$message = useMessage()));

function handleNextStep() {
  onChangeStep(2);
}

// TODO: Replace event bus by local state
const eventBus = inject('eventBus');
eventBus.on('nextStep', handleNextStep);
eventBus.on('finish', createWorkflow);

function onChangeStep(step) {
  currentStep.value = step;

  setStepStatus(step);

  router.push({
    name: step == 1 ? 'trigger' : 'action',
    params: { id: +props.id || 'new-flow' },
  });
}

onBeforeUnmount(() => {
  eventBus.off('finish', createWorkflow);
  eventBus.off('nextStep', handleNextStep);
});

// BUILD WORKFLOW DATA
const triggerStatus = ref(null);
const actionStatus = ref(null);

const triggerIdx = computed(() => EditorData.triggerIdx);
const actionIdx = computed(() => EditorData.actionIdx);

const isErrorWithTrigger = computed(
  () => EditorData.workflow.tasks[triggerIdx.value].isError
);

const isErrorWithAction = computed(
  () => EditorData.workflow.tasks[actionIdx.value].isError
);

const isTriggerCompleted = computed(
  () => EditorData.workflow.tasks[triggerIdx.value].isCompleted
);

const isActionCompleted = computed(
  () => EditorData.workflow.tasks[actionIdx.value].isCompleted
);

const changesAppliedToTrigger = computed(() => {
  const task = EditorData.workflow.tasks[triggerIdx.value];
  return (
    typeof task.isError === 'boolean' ||
    typeof task.isCompleted === 'boolean' ||
    !!task.config.eventId ||
    !!task.chainUuid
  );
});

const changesAppliedToAction = computed(() => {
  const task = EditorData.workflow.tasks[actionIdx.value];
  return (
    typeof task.isError === 'boolean' || typeof task.isCompleted === 'boolean'
  );
});

function setStepStatus(step) {
  // Switch from trigger to action
  if (step === 2) {
    actionStatus.value = 'process';
    triggerStatus.value = 'wait';

    if (changesAppliedToTrigger.value) {
      if (isErrorWithTrigger.value) return (triggerStatus.value = 'error');
      if (isTriggerCompleted.value) return (triggerStatus.value = 'finish');
    }
  }

  // Switch from action to trigger
  if (step === 1) {
    actionStatus.value = 'wait';
    triggerStatus.value = 'process';

    if (changesAppliedToAction.value) {
      if (isErrorWithAction.value) return (actionStatus.value = 'error');
      if (isActionCompleted.value) return (actionStatus.value = 'finish');
    }
  }
}

function onUpdateName(value) {
  EditorData.setName(value);
}

function showExitWarning() {
  const d = dialog.warning({
    title: 'Confirm quit',
    content: () =>
      h('div', { style: { fontSize: '0.85rem' } }, [
        h(
          'div',
          'Changes you made will be discarded because the workflow is not yet completed.'
        ),
        h(
          'div',
          { style: { marginTop: '1rem' } },
          'You can’t undo this action.'
        ),
      ]),

    positiveText: 'Leave',
    negativeText: 'Stay',

    onPositiveClick: () => {
      d.loading = true;
      EditorData.loadWorkflow();
      router.push({ name: 'workflows' });
    },

    onNegativeClick: () => {},
  });
}

async function quitEditor() {
  // Quit without any changes
  if (!changesAppliedToTrigger.value && !changesAppliedToAction.value) {
    router.push({ name: 'workflows' });
    return;
  }

  if (
    (changesAppliedToTrigger.value || changesAppliedToAction.value) &&
    EditorData.workflow.tasks.some((task) => task.isError || !task.isCompleted)
  ) {
    // Has changes but not yet completed, or has error.
    showExitWarning();
  } else {
    // TODO: validate this case
    createWorkflow();
  }
}

async function createWorkflow() {
  EditorData.cleanUpWorkflow();
  await store.dispatch('workflow/postWorkflow', EditorData.workflow);
  router.push({ name: 'workflows' });
  message.success('Workflow created!');
}

const loading = ref(false);

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

  const uuid = EditorData.workflow.chainUuid;
  const eventId = EditorData.workflow.tasks[0].config.eventId;

  if (uuid) {
    store.dispatch('chain/getEvents', uuid);
    if (eventId) {
      store.dispatch('chain/getEvent', { uuid, eventId });
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
</style>
