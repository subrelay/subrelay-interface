<template>
  <n-spin v-if="userInfoLoading" :stroke-width="15" size="small"></n-spin>

  <n-space :wrap-item="false" vertical :size="24" v-else>
    <div>formState {{ formState }}</div>
    <div v-if="formState === 'preCustom' || formState === 'customMsg'">
      <b>Subrelay Bot</b> will send notifications to your
      <span class="text-capitalize">{{ channel }}</span> account
      <n-text code class="text-bold">{{ userInfo.integration[channel] }} </n-text>.
    </div>

    <n-space vertical v-if="formState === 'setupKey'" :wrap-item="false">
      <div>
        To grant permission for <b>Subrelay Bot</b> to send messages to your
        <span class="text-capitalize">{{ channel }}</span> account, please use this key and follow
        the instructions provided when you have successfully started the Bot.
      </div>

      <n-space>
        <n-text code>{{ userInfo.key }}</n-text>

        <n-tooltip trigger="hover">
          <template #trigger>
            <div class="code__icon completed" v-if="isCopied">
              <Icon icon="akar-icons:check" width="13" />
            </div>

            <div class="code__icon copy" @click="onCopy" v-else>
              <Icon icon="fluent:document-copy-48-filled" width="13" />
            </div>
          </template>
          Copy
        </n-tooltip>
      </n-space>

      <div>After you already added the key to SubRelay Bot, click <b>Verfiy.</b></div>

      <n-button style="margin-left: auto" type="primary" @click="onVerify" :loading="verifying">
        Verify
      </n-button>
    </n-space>

    <n-collapse-transition :show="formState === 'customMsg'">
      <n-space vertical>
        <div>You can customize the notification message content below.</div>

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
              <n-space
                vertical
                class="custom-message-card-content"
                style="height: 50vh; overflow: auto"
              >
                <div v-html="previewContent" class="preview-content" />
              </n-space>
            </n-card>
          </n-gi>
        </n-grid>
      </n-space>
    </n-collapse-transition>

    <n-space align="center" justify="end" v-if="formState !== 'setupKey'">
      <n-button type="primary" v-if="userInfo.integration[channel]" @click="reconfigureKey">
        Reconfigure key
      </n-button>

      <n-button type="primary" @click="onContinue"> Continue </n-button>
    </n-space>
  </n-space>

  <n-modal
    v-model:show="showModal"
    class="custom-card"
    preset="card"
    style="width: 600px"
    title="Modal"
    size="huge"
    header-style="font-size: 1rem"
    :bordered="false"
    :segmented="{ content: true }"
  >
    Content
    <template #footer> Footer </template>
  </n-modal>
</template>

<script setup>
import CustomError from '@/components/CustomError';
import EditorData from '@/store/localStore/EditorData';
import Compiler from '@/views/CustomMsg/Compiler';
import { useCustomMessage } from '@/composables';
import { computed, ref, inject, watch, h, onMounted } from 'vue';
import { useMessage, useDialog } from 'naive-ui';
import { useStore } from 'vuex';

const props = defineProps(['channel']);
const [{ content, previewContent, defaultContent, darkMode }, { getRawText }] = useCustomMessage({
  channel: props.channel,
});

const store = useStore();
const dialog = useDialog();
const message = useMessage();
const isCopied = ref(false);
const showModal = ref(false);
const verifying = ref(false);
const formState = ref('preCustom');
const eventBus = inject('eventBus');
const account = computed(() => store.state.account.selected);
const userInfo = computed(() => store.state.account.userInfo);
const userInfoLoading = computed(() => store.state.account.loading.loadUserInfo);
const actionConfig = computed(() => EditorData.workflow.tasks[EditorData.actionIdx].config);
const requiredMessage = computed(() => store.state.editor.error.messageTemplate);

function setFormState() {
  if (userInfo.value.integration[props.channel]) {
    formState.value = 'preCustom';
  } else {
    formState.value = 'setupKey';
  }
}
onMounted(() => setFormState());
watch(userInfo, () => setFormState());

function onCopy() {
  navigator.clipboard.writeText(userInfo.value.key);
  isCopied.value = true;
  message.success('Copied!');
  setTimeout(() => (isCopied.value = false), 1500);
}

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

function reconfigureKey() {
  const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
  const message = '/key foobarlorem';
  if (props.channel === 'telegram') {
    const protocol = isMac ? 'tg://' : 'https://';
    const link = `${protocol}t.me/subrelay_bot`;

    try {
      // Try to open the Telegram app with a deep link
      window.navigator.sendBeacon('tg://resolve?domain=subrelay_bot');

      // If the deep link was successful, the Telegram app is installed
      window.location.href = link;
    } catch (error) {
      // If the deep link failed, the Telegram app is not installed
      window.open(link);
    }
  }

  // const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
  // const isWin = navigator.platform.toUpperCase().indexOf('WIN') >= 0;
  // const telegramUrl = 'https://web.telegram.org/k/#@subrelay_bot';
  // const message = '/key foobarlorem';

  // if (isMac) {
  //   window.location.href = `tg://msg?text=${encodeURIComponent(message)}`;
  // } else if (isWin) {
  //   window.location.href = `tg://msg_url?url=${encodeURIComponent(
  //     telegramUrl,
  //   )}&text=${encodeURIComponent(message)}`;
  // } else {
  //   window.open(telegramUrl);
  // }
}

async function onVerify() {
  verifying.value = true;
  await store.dispatch('account/getUserInfo', { account: account.value, showLoading: false });
  verifying.value = false;
  if (userInfo.value.integration[props.channel]) {
    dialog.success({
      title: 'Success!',
      content:
        "Cool! You have successfully set up a key for Subrelay Bot. Let's move on to next steps.",
      positiveText: 'Continue',
      onPositiveClick: () => (formState.value = 'preCustom'),
    });
  } else {
    dialog.error({
      title: 'No integration found',
      content: `Sorry, we were still unable to find a ${props.channel} integration in your account. Did you add the key properly follow the instruction?`,

      content: () => h('div', { style: { fontSize: '0.85rem' } }, [
        h('div', [
          'Sorry, we were still unable to find a ',
          h('span', { class: 'text-capitalize' }, `${props.channel}`),
          ' integration in your account.',
        ]),
        h(
          'div',
          { style: { marginTop: '1rem' } },
          'Did you add the key properly following the instruction?',
        ),
      ]),
      positiveText: 'Retry',
    });
  }
}
</script>

<style lang="scss"></style>
