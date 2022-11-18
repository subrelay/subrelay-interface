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
              @click="onFinish"
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

    <pre>{{ EditorData }}</pre>

    <!-- STEPPER -->
    <div class="page_container">
      <n-steps
        :current="currentStep"
        @update:current="onChangeStep"
        class="stepper"
      >
        <n-step title="TRIGGER" description="This is what starts the app">
          <template #icon>
            <Icon icon="line-md:telegram" color="white" />
          </template>
        </n-step>

        <n-step
          title="ACTION"
          description="Action will perform when the app has started"
        >
          <template #icon>
            <Icon icon="line-md:play-filled" color="black" />
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
import { h, ref, watch, inject, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useDialog } from 'naive-ui';
import { useStore } from 'vuex';

import Logo from '@/components/Common/Logo';
import ShowOrEdit from '@/components/Common/ShowOrEdit';
import Trigger from '@/components/Trigger/Trigger';
import Action from '@/components/Action/Action';

const props = defineProps({ id: [String, Number] });
const router = useRouter();
const route = useRoute();
const store = useStore();
const dialog = useDialog();
const currentStep = ref(null);
const defaultQueryParams = computed(
  () => store.state.global.defaultQueryParams
);

// Build Workflow Data
import EditorData from '@/store/localStore/EditorData';

function onUpdateName(value) {
  EditorData.setName(value ? value : 'Untitled');
}

const eventBus = inject('eventBus');
eventBus.on('nextStep', () => onChangeStep(2));
eventBus.on('finish', () => onFinish());

function goToHomePage() {
  dialog.warning({
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
      router.push({ name: 'workflows', query: defaultQueryParams.value });
      EditorData.loadWorkflow();
    },

    onNegativeClick: () => {},
  });
}

function onFinish() {
  goToHomePage();
}

watch(
  route,
  (route) => (currentStep.value = route.name === 'trigger' ? 1 : 2),
  { immediate: true }
);

function onChangeStep(step) {
  currentStep.value = step;
  router.push({
    name: step == 1 ? 'trigger' : 'action',
    params: { id: props.id },
  });
}
</script>

<style lang="scss">
.stepper {
  width: 70%;
  margin: auto;
}
</style>
