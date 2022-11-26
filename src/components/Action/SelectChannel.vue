<template>
  <n-form
    class="step_container"
    @keyup.enter="validateForm"
    ref="formRef"
    :model="EditorData.workflow.tasks[1].config"
  >
    <n-form-item
      class="form_item_wrapper"
      label="Select channel you want to receive notifications form triggered event."
      path="channel"
      :rule="{
        required: true,
        message: 'Please select a channel!',
        trigger: ['input'],
      }"
    >
      <n-radio-group
        v-model:value="EditorData.workflow.tasks[1].config.channel"
        @update:value="handleSelectChannel"
        class="channel_select"
      >
        <n-grid cols="2" y-gap="20" x-gap="30">
          <n-gi span="1" v-for="channel in useChannels" :key="channel.value">
            <!-- :disabled="channel.value !== 'webhook'" -->
            <n-radio-button
              :value="channel.value"
              :bordered="false"
              class="channel_item"
            >
              <Icon :icon="channel.icon" class="icon" />
              <span class="text">{{ channel.label }}</span>
            </n-radio-button>
          </n-gi>
        </n-grid>
      </n-radio-group>
    </n-form-item>

    <n-button class="action_button" type="primary" @click="validateForm">
      Continue
    </n-button>
  </n-form>
</template>

<script setup>
import EditorData from '@/store/localStore/EditorData';
import { useFormValidation, useChannels } from '@/composables';

const emits = defineEmits(['continue']);
const [{ formRef }, { validateForm }] = useFormValidation('action', emits);

function handleSelectChannel() {
  validateForm({ changeStep: false });

  // Used for milestone 2 to clear 'Set Up Action' when user switches to other channel
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
