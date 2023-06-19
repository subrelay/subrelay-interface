<template>
  <n-spin v-if="userInfoLoading" :stroke-width="15" size="small"></n-spin>

  <n-space :wrap-item="false" vertical :size="16" v-else>
    <n-space vertical v-if="formState === 'authenticate'" :wrap-item="false">
      <!-- Authen with Telegram -->
      <div v-if="channel === 'telegram'">
        <n-spin v-if="!isWidgetLoaded" :stroke-width="16" size="small" style="margin: auto; width: 100%">
          <template #description> Loading... </template>
        </n-spin>

        <div v-if="isWidgetLoaded">
          Please grant permission for <b>Subrelay Bot</b> to send messages to your Telegram account.
        </div>

        <n-space align="center" justify="center" style="padding-top: 1rem">
          <telegram-login-temp
            mode="callback"
            requestAccess="write"
            size="medium"
            @loaded="teleWidgetLoaded"
            @callback="onAuthorizeSuccess"
            :telegram-login="teleBot"
          />
        </n-space>
      </div>

      <!-- Authen with Discord -->
      <n-space v-if="channel === 'discord'" vertical :size="14">
        <div>Please grant permission for <b>Subrelay Bot</b> to send messages to your Discord account.</div>

        <n-space align="center" justify="center">
          <n-button @click="showDiscordAuth">
            <Icon icon="logos:discord-icon" style="margin-right: 5px" /> Login with Discord
          </n-button>
        </n-space>
      </n-space>
    </n-space>

    <n-space v-if="formState === 'preCustom' || formState === 'customMsg'" vertical>
      <div style="display: inline">
        You have already authorized <b>Subrelay Bot</b> to send notifications to your
        <span class="text-capitalize">{{ channel }}</span> account.

        <n-space align="center" :wrap-item="false" :size="4">
          <n-avatar
            color="transparent"
            round
            size="small"
            :src="userInfo.integration[channel].avatar"
            v-if="userInfo.integration[channel].avatar"
          />

          <span class="text-bold">@{{ userInfo.integration[channel].username }} </span>
        </n-space>
      </div>
    </n-space>

    <n-collapse-transition :show="formState === 'customMsg'">
      <n-space vertical :size="16">
        <div>
          We have prepared a default notification content as below. You can still customize the message as you please.
        </div>

        <n-grid cols="2" x-gap="30">
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
import Compiler from '@/views/CustomMsg/Compiler';
import { telegramLoginTemp } from 'vue3-telegram-login';
import { useCustomMessage } from '@/composables';
import { computed, ref, inject, watch, onBeforeMount } from 'vue';
import { useStore } from 'vuex';

const props = defineProps(['channel']);
const [{ content, previewContent, defaultContent, darkMode }, { getRawText }] = useCustomMessage({
  channel: props.channel,
});

const store = useStore();
const formState = ref('preCustom');
const eventBus = inject('eventBus');
const userInfo = computed(() => store.state.account.userInfo);
const userInfoLoading = computed(() => store.state.account.loading.loadUserInfo);
const actionConfig = computed(() => EditorData.workflow.tasks[EditorData.actionIdx].config);
const requiredMessage = computed(() => store.state.editor.error.messageTemplate);
const polling = ref(null);

const teleBot = ref(import.meta.env.VITE_TELE_BOT);
const clientId = ref(import.meta.env.VITE_DISCORD_CLIENT_ID);
const redirectUri = ref(null);

function setFormState() {
  if (userInfo.value.integration[props.channel]) {
    formState.value = 'preCustom';
  } else {
    formState.value = 'authenticate';
  }
}

onBeforeMount(() => {
  setFormState();

  if (props.channel === 'discord') {
    const { origin } = window.location;
    redirectUri.value = `${origin}/user/connections/discord`;

    if (!userInfo.value.integration[props.channel]) {
      polling.value = setInterval(() => {
        store.dispatch('account/getUserInfo', { showLoading: false });
      }, 5000);
    }
  }
});

watch(
  userInfo,
  () => {
    setFormState();

    if (props.channel === 'discord' && polling.value && userInfo.value.integration[props.channel]) {
      clearInterval(polling.value);
    }
  },
  { immediate: true },
);

function validateSetupAction() {
  if (
    !actionConfig.value.messageTemplate
    || actionConfig.value.messageTemplate === '<br>'
    || actionConfig.value.messageTemplate === '<p></p>'
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
  const { id } = user;
  store.dispatch('account/updateTelegramInfo', { params: { id } });
}

// Set up discord
function showDiscordAuth() {
  const url = `https://discord.com/api/oauth2/authorize?client_id=${clientId.value}&redirect_uri=${redirectUri.value}&response_type=token&scope=identify%20bot`;
  const windowName = 'NewWindow';
  const windowFeatures = 'width=800,height=800,left=500,top=50';

  // Open the new window
  window.open(url, windowName, windowFeatures);
}
</script>

<style lang="scss"></style>
