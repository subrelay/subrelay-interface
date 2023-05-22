<template>
  <component :is="actionComponent[channel]" v-if="channel" />

  <n-empty description="No set up found" v-else>
    <template #extra>
      <n-button size="small" @click="onBack"> Select a channel first </n-button>
    </template>
  </n-empty>
</template>

<script setup>
import EditorData from '@/store/localStore/EditorData';
import WebhookSetup from '@/views/Editor/Action/WebhookSetup';
import EmailSetup from '@/views/Editor/Action/EmailSetup';
import TelegramSetup from '@/views/Editor/Action/TelegramSetup';
import DiscordSetup from '@/views/Editor/Action/DiscordSetup';
import { computed, shallowRef } from 'vue';
import { useStore } from 'vuex';

const store = useStore();
const actionIdx = computed(() => EditorData.actionIdx);
const channel = computed(() => EditorData.workflow.tasks[actionIdx.value].type);

function onBack() {
  store.commit('editor/setExpand', { action: '1' });
}

const actionComponent = shallowRef({
  webhook: WebhookSetup,
  email: EmailSetup,
  telegram: TelegramSetup,
  discord: DiscordSetup,
});
</script>
