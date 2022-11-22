<template>
  <n-space vertical :size="50">
    <!-- HEADER -->
    <div class="page_header dark">
      <n-space>
        <n-button
          type="primary"
          class="action-button"
          icon-placement="left"
          @click="goToHomePage"
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
              @click="goToHomePage"
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
      <Logo />

      <ShowOrEdit
        :onUpdateValue="onUpdateName"
        :value="EditorData.workflow.name"
      />
    </div>

    <!-- <pre>{{ EditorData }}</pre> -->

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
</template>

<script setup>
import Logo from '@/components/Common/Logo';
import ShowOrEdit from '@/components/Common/ShowOrEdit';
import Trigger from '@/components/Trigger/Trigger';
import Action from '@/components/Action/Action';
import { ThunderboltOutlined, BellOutlined } from '@vicons/antd';
import { h, ref, inject, computed, onBeforeMount, onBeforeUnmount } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useDialog } from 'naive-ui';
import { useStore } from 'vuex';

const props = defineProps({ id: [String, Number] });
const router = useRouter();
const route = useRoute();
const store = useStore();
const dialog = useDialog();
const currentStep = ref(null);
const defaultQuery = computed(() => store.state.global.defaultQueryParams);

function handleNextStep() {
  onChangeStep(2);
}

const eventBus = inject('eventBus');
eventBus.on('nextStep', handleNextStep);
eventBus.on('finish', goToHomePage);

onBeforeUnmount(() => {
  eventBus.off('finish', goToHomePage);
  eventBus.off('nextStep', handleNextStep);
});

function goToHomePage() {
  validateFormCompletion();
  showExitWarning();
}

// BUILD WORKFLOW DATA
import EditorData from '@/store/localStore/EditorData';

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
  return (
    typeof EditorData.workflow.tasks[triggerIdx.value].isError === 'boolean' ||
    typeof EditorData.workflow.tasks[triggerIdx.value].isCompleted === 'boolean'
  );
});

const changesAppliedToAction = computed(() => {
  return (
    typeof EditorData.workflow.tasks[actionIdx.value].isError === 'boolean' ||
    typeof EditorData.workflow.tasks[actionIdx.value].isCompleted === 'boolean'
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

function validateFormCompletion() {
  if (!EditorData.workflow.name) {
    EditorData.setName();
  }

  if (
    EditorData.workflow.tasks.some((task) => task.isError || !task.isCompleted)
  ) {
    // console.log('not finished');
  }

  // console.log('finished');
}

function showExitWarning() {
  const sleep = () => new Promise((resolve) => setTimeout(resolve, 500));

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

      return new Promise((resolve) => {
        sleep()
          .then(() => {
            router.push({ name: 'workflows', query: defaultQuery.value });
          })
          .then(resolve);
      });
    },

    onNegativeClick: () => {},
  });
}

function onChangeStep(step) {
  currentStep.value = step;

  setStepStatus(step);

  router.push({
    name: step == 1 ? 'trigger' : 'action',
    params: { id: props.id },
  });
}

onBeforeMount(() => {
  EditorData.loadWorkflow();
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
