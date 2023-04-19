<template>
  <n-form-item
    class="form_item_wrapper"
    label="Select channel you want to receive notifications form triggered event."
    :path="`tasks[${actionIdx}].type`"
    :rule="{
      required: true,
      message: 'Please select a channel!',
      trigger: ['input'],
      key: 'selectChannel',
    }"
  >
    <n-radio-group
      v-model:value="EditorData.workflow.tasks[actionIdx].type"
      @update:value="handleSelectChannel"
      class="channel_select"
    >
      <n-grid cols="2" y-gap="20" x-gap="30">
        <n-gi span="1" v-for="channel in useChannels" :key="channel.value">
          <n-radio-button :value="channel.value" :bordered="false" class="channel_item">
            <Icon :icon="channel.icon" class="icon" />
            <span class="text">{{ channel.label }}</span>
          </n-radio-button>
        </n-gi>
      </n-grid>
    </n-radio-group>
  </n-form-item>
</template>

<script setup>
import EditorData from '@/store/localStore/EditorData';
import { useChannels } from '@/composables';
import { computed, ref } from 'vue';
import { useStore } from 'vuex';

const store = useStore();

const defaultConfig = {
  webhook: { url: null, secret: null },
  email: { addresses: [], subjectTemplate: null, bodyTemplate: null },
  telegram: { chatId: null, messageTemplate: null },
  discord: { channelId: null, userId: null, messageTemplate: null },
};

const actionIdx = computed(() => EditorData.actionIdx);

function handleSelectChannel(newChannel) {
  EditorData.workflow.tasks[actionIdx.value].config = { ...defaultConfig[newChannel] };
  store.commit('editor/resetCustomConfig');
}
</script>

<style lang="scss">
.form_item_wrapper {
  .channel_select,
  .n-form-item-feedback-wrapper {
    width: 70%;
    margin: 1rem auto 0 auto;
  }

  .n-radio-button {
    &:not(.n-radio-button--checked) {
      border: none;
    }
  }

  .channel_item {
    width: 150px;
    padding: 10px;
    font-size: 1rem;
    font-weight: bold;

    .n-radio__label {
      display: flex;
      align-items: center;

      .icon {
        font-size: 1.5rem;
      }

      .text {
        margin-left: 10px;
      }
    }
  }
}
</style>
