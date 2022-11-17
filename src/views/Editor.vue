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
          @click="onUpdateStep(2)"
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
              @click="onUpdateStep(1)"
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

      <ShowOrEdit :onUpdateValue="onUpdateName" :value="workflowName" />
    </div>

    <!-- STEPPER -->
    <div class="page_container">
      <n-steps
        :current="currentStep"
        @update:current="onUpdateStep"
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
import { ref, watch, inject, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import useStore from 'vuex';
import Logo from '@/components/Common/Logo';
import ShowOrEdit from '@/components/Common/ShowOrEdit';
import Trigger from '@/components/Trigger/Trigger';
import Action from '@/components/Action/Action';

const router = useRouter();
const route = useRoute();
const store = useStore();
const currentStep = ref(null);
const workflowName = ref('');

const props = defineProps({ id: [String, Number] });

function onUpdateName(value) {
  workflowName.value = value;
}

function onUpdateStep(step) {
  currentStep.value = step;
  router.push({
    name: step == 1 ? 'trigger' : 'action',
    params: { id: props.id },
  });
}

const emitter = inject('emitter');
emitter.on('nextStep', () => onUpdateStep(2));
emitter.on('finish', () => onFinish());

const defaultQueryParams = computed(
  () => store.state.global.defaultQueryParams
);
function goToHomePage() {
  router.push({ name: 'workflows', query: defaultQueryParams.value });
  // Throw a popup to confirm quit
}

function onFinish() {
  goToHomePage();
}

watch(
  route,
  (route) => (currentStep.value = route.name === 'trigger' ? 1 : 2),
  { immediate: true }
);
</script>

<style lang="scss">
.action-button {
  font-weight: 700;
  width: 100px;
}

.stepper {
  width: 70%;
  margin: auto;
}
</style>
