<template>
  <n-space vertical :size="30" class="step_container">
    <n-card
      :segmented="{ content: 'soft' }"
      header-style="padding-bottom: 0.5rem"
    >
      <template #header>
        <div class="title">Input</div>
      </template>

      <n-skeleton v-if="loading" text :repeat="5" />
      <n-space vertical :size="10" v-else>
        <div class="input-item">
          <div class="title">URL:</div>
          <n-text code>{{ notiConfig.url }}</n-text>
        </div>

        <div class="input-item">
          <div class="title">Header:</div>
          <n-text code>{{ notiConfig.headers }}</n-text>
        </div>

        <n-space vertical>
          <div class="title">Body:</div>
          <JsonEventSample />
        </n-space>
      </n-space>
    </n-card>

    <n-card
      header-style="padding-bottom: 0.5rem"
      v-if="isTested"
      :segmented="{ content: 'soft' }"
    >
      <template #header>
        <div class="title">Output</div>
      </template>

      <n-skeleton v-if="loading && isTested" text :repeat="2" />
      <n-space vertical :size="10" v-else>
        <div class="input-item">
          <div class="title">Status:</div>

          <Icon
            :icon="isSuccess ? 'ep:success-filled' : 'ic:round-cancel'"
            :color="isSuccess ? '#18A058FF' : '#D03050FF'"
            :width="'1.2rem'"
            style="margin-right: 10px"
          />
          <span class="text-capitalize">{{ taskResponse.status }}</span>
        </div>

        <div class="input-item" v-if="!isSuccess">
          <div class="title">Error:</div>
          <p>{{ taskResponse.error.message }}</p>
        </div>

        <div class="input-item" v-if="taskResponse.result">
          <div class="title">Result:</div>
          <p>{{ taskResponse.result }}</p>
        </div>
      </n-space>
    </n-card>

    <n-space justify="end">
      <n-button class="action_button" type="primary" @click="onTest">
        {{ isTested ? 'Retest' : 'Test' }}
      </n-button>

      <n-button
        class="action_button"
        type="primary"
        @click="eventBus.emit('finish')"
        v-if="isTested"
      >
        Finish
      </n-button>
    </n-space>
  </n-space>
</template>

<script setup>
import JsonEventSample from '@/components/Common/JsonEventSample';
import { computed, ref, inject } from 'vue';
import { useStore } from 'vuex';
const store = useStore();

const loading = ref(null);
const isTested = ref(false);
const eventBus = inject('eventBus');

const notiConfig = computed(() => {
  const notiTask = store.state.workflow.workflow.tasks.find(
    (task) => task.type === 'notification'
  );
  return notiTask.config.config;
});

const taskResponse = ref({
  status: 'failed',
  error: { message: 'There was an error.' },
  result: null,
});

const isSuccess = computed(() => taskResponse.value.status === 'success');

function onTest() {
  loading.value = true;

  setTimeout(() => {
    loading.value = false;
    isTested.value = true;
  }, 1000);
}

function parsePascalCaseStr(string) {
  if (!string) return;
  return string.replace(/([a-z])([A-Z])/g, '$1 $2').toLowerCase();
}
</script>

<style lang="scss">
.input-item {
  display: flex;
  align-items: center;
  .title {
    width: 10%;
  }
}
</style>
