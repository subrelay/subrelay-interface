<template>
  <n-form-item
    data-test="editor-form-item-select-channel"
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
        <n-gi span="1" v-for="channel in channels" :key="channel.value">
          <n-radio-button :value="channel.value" :bordered="false" class="channel_item" data-test="channel-option">
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
import channels from '@/config/channels';
import { computed } from 'vue';
import { useStore } from 'vuex';

const store = useStore();

const defaultConfig = {
  webhook: { url: null, secret: null },
  email: { addresses: [], subjectTemplate: null, bodyTemplate: null },
  telegram: { messageTemplate: null },
  discord: { messageTemplate: null },
};

const actionIdx = computed(() => EditorData.actionIdx);

function handleSelectChannel(newChannel) {
  EditorData.workflow.tasks[actionIdx.value].config = { ...defaultConfig[newChannel] };
  store.commit('editor/disableTestAction', true);
  store.commit('editor/resetAction');
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
    font-size: 13px;
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
