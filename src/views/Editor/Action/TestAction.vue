<template>
  <component :is="actionTestComponent[channel]" v-if="channel" />
</template>

<script setup>
import WebhookTest from '@/views/Editor/Action/WebhookTest';
import EmailTest from '@/views/Editor/Action/EmailTest';
import TelegramTest from '@/views/Editor/Action/TelegramTest';
import DiscordTest from '@/views/Editor/Action/DiscordTest';
import EditorData from '@/store/localStore/EditorData';
import { computed, shallowRef } from 'vue';

const actionIdx = computed(() => EditorData.actionIdx);
const channel = computed(() => EditorData.workflow.tasks[actionIdx.value].type);

const actionTestComponent = shallowRef({
  webhook: WebhookTest,
  email: EmailTest,
  telegram: TelegramTest,
  discord: DiscordTest,
});
</script>
