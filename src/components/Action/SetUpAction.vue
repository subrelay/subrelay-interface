<template>
  <div class="step_container">
    <component :is="actionComponent[channel]" v-if="channel" />
    <n-empty description="No set up found" v-else>
      <template #extra>
        <n-button size="small" @click="emits('back')">
          Select a channel first
        </n-button>
      </template>
    </n-empty>
  </div>
</template>

<script setup>
import { computed, shallowRef } from 'vue';
import Webhook from '@/components/Action/Webhook';
import EditorData from '@/store/localStore/EditorData';

const emits = defineEmits(['back']);

const actionIdx = computed(() => EditorData.actionIdx);

const channel = computed(
  () => EditorData.workflow.tasks[actionIdx.value].config.channel
);

const actionComponent = shallowRef({
  webhook: Webhook,
});
</script>
