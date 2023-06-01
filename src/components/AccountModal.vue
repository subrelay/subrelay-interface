<template>
  <n-modal
    class="account_modal"
    @update:show="emits('update:modelValue', $event)"
    :show="props.modelValue"
    :showIcon="false"
    title="Dialog"
  >
    <n-card
      :bordered="false"
      :segmented="{ content: true }"
      header-style="font-size: 1rem"
      style="width: 600px"
      title="Select Account"
      size="huge"
      role="dialog"
      aria-modal="true"
    >
      <template #header-extra>
        <n-button text @click="emits('update:modelValue', false)">
          <Icon icon="gg:close" :inline="true" width="20" />
        </n-button>
      </template>

      <n-scrollbar style="max-height: 50vh" trigger="none">
        <n-space vertical v-if="accounts.length" :wrap-item="false">
          <n-card
            small
            hoverable
            class="cursor-pointer account-item"
            v-for="(account, index) in accounts"
            @click="onSelectAccount(account)"
            style="max-width: 97%"
            :key="index"
            :bordered="currentAcc.address === account.address"
            :embedded="currentAcc.address === account.address"
          >
            <n-space align="center" justify="space-between" :wrap="false" :wrap-item="false" style="max-width: 100%%">
              <n-space align="center" :wrap-item="false" style="max-width: 95%">
                <PolkadotAccountIcon @click="onCopy(account)" />

                <div style="max-width: 90%" class="text-ellipsis">
                  <div class="account_name text-ellipsis">
                    {{ account.name }}
                  </div>
                  <n-text depth="3" class="account_address">
                    {{ account.address }}
                  </n-text>
                </div>
              </n-space>

              <Icon width="16" icon="line-md:confirm" v-if="currentAcc.address === account.address" />
            </n-space>
          </n-card>
        </n-space>

        <div v-else>No account found. Please check your Polkadot wallet again.</div>
      </n-scrollbar>

      <template #action>
        <div style="text-align: right">
          <n-button
            data-test="confirm-account"
            type="primary"
            @click="onConfirm"
            :loading="loading"
            :disabled="(!!accounts.length && !currentAcc.address) || loading"
          >
            {{ accounts.length ? 'Confirm' : 'OK' }}
          </n-button>
        </div>
      </template>
    </n-card>
  </n-modal>
</template>

<script setup>
import PolkadotAccountIcon from '@/components/PolkadotAccountIcon';
import { useStore } from 'vuex';
import { useMessage } from 'naive-ui';
import { computed, ref, watch } from 'vue';
import { generateGetToken } from '@/api';
import { useShowError } from '@/composables';

const props = defineProps({ modelValue: { type: Boolean } });
const emits = defineEmits(['update:modelValue']);

const store = useStore();
const message = useMessage();
const currentAcc = ref({});
const loading = ref(false);
const storedAccount = computed(() => store.state.account.selected);
const signer = computed(() => store.state.account.signer);
const accounts = computed(() => store.state.account.accounts);

function onSelectAccount(account) {
  currentAcc.value = account;
}

async function onConfirm() {
  if (!accounts.value.length) {
    emits('update:modelValue', false);
    return;
  }

  try {
    loading.value = true;

    if (!window.Cypress) {
      await generateGetToken({ account: currentAcc.value, signer: signer.value });
    }

    const isAccChanged = storedAccount.value?.address !== currentAcc.value?.address;

    if (isAccChanged) {
      store.commit('account/setSelected', currentAcc.value);
      store.dispatch('account/getUserInfo', { account: currentAcc.value });
      store.commit('log/reset');
      store.commit('workflow/reset');
    }
  } catch (e) {
    const errMsg = e.message;
    if (errMsg === 'Cancelled') {
      return;
    }
    useShowError(e);
  } finally {
    emits('update:modelValue', false);
    loading.value = false;
  }
}

function onCopy({ address }) {
  navigator.clipboard.writeText(address);
  message.success('Copied!');
}

watch(
  () => props.modelValue,
  (isOpen) => {
    if (isOpen) {
      currentAcc.value = storedAccount.value || {};
    }
  },
);
</script>

<style lang="scss" scoped>
.account_modal {
  .account_name {
    font-weight: bold;
  }

  .account_address {
    font-size: 0.75rem;
  }
}
</style>
