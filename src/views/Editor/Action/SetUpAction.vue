<template>
  <component :is="actionComponent[channel]" v-if="channel" />

  <n-empty description="No set up found" v-else>
    <template #extra>
      <n-button size="small" @click="onBack"> Select a channel first </n-button>
    </template>
  </n-empty>
</template>

<script setup>
import { computed, shallowRef, provide } from 'vue';
import { useStore } from 'vuex';
import WebhookSetup from '@/views/Editor/Action/WebhookSetup';
import EmailSetup from '@/views/Editor/Action/EmailSetup';
import EditorData from '@/store/localStore/EditorData';

const store = useStore();
const actionIdx = computed(() => EditorData.actionIdx);
const channel = computed(() => EditorData.workflow.tasks[actionIdx.value].config.channel);

function onBack() {
  store.commit('editor/setExpand', { action: '1' });
}

const actionComponent = shallowRef({
  webhook: WebhookSetup,
  email: EmailSetup,
});
</script>
