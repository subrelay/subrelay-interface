<template>
  <n-spin v-if="userInfoLoading" :stroke-width="15" size="small"></n-spin>

  <n-space :wrap-item="false" vertical :size="16" v-else>
    <n-space vertical v-if="formState === 'authenticate'" :wrap-item="false">
      <n-spin v-if="!isWidgetLoaded" :stroke-width="16" size="small">
        <template #description> Loading... </template>
      </n-spin>

      <div v-if="isWidgetLoaded">
        Please grant permission for <b>Subrelay Bot</b> to send messages to your
        <span class="text-capitalize">{{ channel }}</span> account.
      </div>

      <n-space align="center" justify="center">
        <telegram-login-temp
          mode="callback"
          requestAccess="write"
          size="medium"
          :telegram-login="teleBot"
          @loaded="teleWidgetLoaded"
          @callback="onAuthorizeSuccess"
        />
      </n-space>
    </n-space>

    <n-space v-if="formState === 'preCustom' || formState === 'customMsg'" vertical>
      <div style="display: inline">
        You have already authorized <b>Subrelay Bot</b> to send notifications to your
        <span class="text-capitalize">{{ channel }}</span> account.

        <n-space align="center" :wrap-item="false" :size="4">
          <n-avatar round size="small" :src="userInfo.integration[channel].avatar" />
          <span class="text-bold">@{{ userInfo.integration[channel].username }} </span>
        </n-space>
      </div>
    </n-space>

    <n-collapse-transition :show="formState === 'customMsg'">
      <n-space vertical>
        <div>
          We have prepared a default notification content as below. You can still customize the message as you please.
        </div>

        <n-grid cols="2" x-gap="30" style="margin: 1rem 0">
          <!-- COMPILER -->
          <n-gi>
            <n-card
              :segmented="{ content: true }"
              title="CUSTOM MESSAGE"
              header-style="font-size: 0.85rem; font-weight: bold; padding:10px"
              content-style="padding:0"
            >
              <n-space vertical class="custom-message-card-content" :wrap-item="false">
                <Compiler
                  v-model="content"
                  class="email-content compiler"
                  field="messageTemplate"
                  @getRawText="getRawText"
                  :class="{ dark: darkMode }"
                  :defaultContent="defaultContent"
                />

                <CustomError :show="requiredMessage" />
              </n-space>
            </n-card>
          </n-gi>

          <!-- PREVIEW -->
          <n-gi>
            <n-card
              title="PREVIEW"
              header-style="font-size: 0.85rem; font-weight: bold; padding:10px"
              content-style="padding:0"
              :segmented="{ content: true }"
            >
              <n-space vertical class="custom-message-card-content" style="height: 50vh; overflow: auto">
                <div v-html="previewContent" class="preview-content" />
              </n-space>
            </n-card>
          </n-gi>
        </n-grid>
      </n-space>
    </n-collapse-transition>

    <n-button type="primary" @click="onContinue" v-if="formState !== 'authenticate'" class="action_button">
      Continue
    </n-button>
  </n-space>
</template>

<script setup>
import CustomError from '@/components/CustomError';
import EditorData from '@/store/localStore/EditorData';
import { telegramLoginTemp } from 'vue3-telegram-login';
import Compiler from '@/views/CustomMsg/Compiler';
import { useCustomMessage } from '@/composables';
import { computed, ref, inject, watch, h, onBeforeMount } from 'vue';
import { useMessage, useDialog } from 'naive-ui';
import { useStore } from 'vuex';
import { divide } from 'lodash';

const props = defineProps(['channel']);
const [{ content, previewContent, defaultContent, darkMode }, { getRawText }] = useCustomMessage({
  channel: props.channel,
});

const store = useStore();
const dialog = useDialog();
const message = useMessage();
const isCopied = ref(false);
const formState = ref('preCustom');
const eventBus = inject('eventBus');
const account = computed(() => store.state.account.selected);
const userInfo = computed(() => store.state.account.userInfo);
const userInfoLoading = computed(() => store.state.account.loading.loadUserInfo);
const actionConfig = computed(() => EditorData.workflow.tasks[EditorData.actionIdx].config);
const requiredMessage = computed(() => store.state.editor.error.messageTemplate);
const teleBot = ref(null);

function setFormState() {
  if (userInfo.value.integration[props.channel]) {
    formState.value = 'preCustom';
  } else {
    formState.value = 'authenticate';
  }
}
onBeforeMount(() => {
  setFormState();

  // Get bot for different env.
  const hostname = window.location.hostname;
  if (hostname === 'a053-171-251-18-95.ngrok-free.app') {
    teleBot.value = 'subrelay_local_bot';
  } else if (hostname === 'develop.app.subrelay.xyz') {
    teleBot.value = 'sr_develop_bot';
  } else if (hostname === 'app.subrelay.xyz') {
    teleBot.value = 'subrelay_bot';
  }
});

watch(userInfo, () => setFormState());

function validateSetupAction() {
  if (
    !actionConfig.value.messageTemplate ||
    actionConfig.value.messageTemplate === '<br>' ||
    actionConfig.value.messageTemplate === '<p></p>'
  ) {
    store.commit('editor/setError', { messageTemplate: true });
    EditorData.setError('action', true);
  } else {
    store.commit('editor/disableTestAction', false);
    EditorData.setComplete('action', true);
    EditorData.setError('action', false);

    eventBus.emit('validate', { taskName: 'action', keys: ['setupAction'], nextExpand: '3' });
  }
}

function onContinue() {
  if (formState.value === 'preCustom') {
    formState.value = 'customMsg';
    return;
  }

  validateSetupAction();
}

// Set up telegram
const isWidgetLoaded = ref(false);

function teleWidgetLoaded() {
  isWidgetLoaded.value = true;
}

function onAuthorizeSuccess(user) {
  const { id, username } = user;
  store.dispatch('account/updateTelegramInfo', { params: { id, username } });
}
</script>

<style lang="scss"></style>
