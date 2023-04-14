<template>
  <component :is="actionTestComponent[channel]" v-if="channel" />
</template>

<script setup>
import WebhookTest from '@/views/Editor/Action/WebhookTest';
import EmailTest from '@/views/Editor/Action/EmailTest';
import TelegramTest from '@/views/Editor/Action/TelegramTest';
import DiscordTest from '@/views/Editor/Action/DiscordTest';
import EditorData from '@/store/localStore/EditorData';
import { computed, shallowRef, provide } from 'vue';
import { useStore } from 'vuex';

const store = useStore();
const actionIdx = computed(() => EditorData.actionIdx);
const channel = computed(() => EditorData.workflow.tasks[actionIdx.value].type);

function onBack() {
  store.commit('editor/setExpand', { action: '1' });
}

const actionTestComponent = shallowRef({
  webhook: WebhookTest,
  email: EmailTest,
  telegram: TelegramTest,
  discord: DiscordTest,
});
</script>
