<template>
  <n-form
    class="step_container"
    @keyup.enter="onContinue"
    ref="formRef"
    :model="formData"
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
      <n-radio-group v-model:value="formData.channel" class="channel_select">
        <n-grid cols="2" y-gap="20" x-gap="30">
          <n-gi span="1" v-for="channel in channels" :key="channel.value">
            <n-radio-button
              :disabled="channel.value !== 'webhook'"
              :value="channel.value"
              class="channel_item"
            >
              <Icon :icon="channel.icon" class="icon" />
              <span class="text">{{ channel.label }}</span>
            </n-radio-button>
          </n-gi>
        </n-grid>
      </n-radio-group>
    </n-form-item>

    <n-button class="action_button" type="primary" @click="onContinue">
      Continue
    </n-button>
  </n-form>
</template>

<script setup>
import { ref } from 'vue';

const formRef = ref(null);
const formData = ref({});
const emits = defineEmits(['continue']);

const channels = ref([
  { value: 'webhook', label: 'Webhook', icon: 'logos:webhooks' },
  { value: 'email', label: 'Email', icon: 'fluent-emoji-flat:e-mail' },
  { value: 'telegram', label: 'Telegram', icon: 'logos:telegram' },
  { value: 'discord', label: 'Discord', icon: 'logos:discord-icon' },
]);

function onContinue(e) {
  e.preventDefault();
  formRef.value.validate(async (errors) => {
    if (errors) return;
    emits('continue');
  });
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
    border: none;

    &:last-child {
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
