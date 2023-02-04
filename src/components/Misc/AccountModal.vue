<template>
  <n-modal
    class="account_modal"
    :show="props.modelValue"
    @update:show="emits('update:modelValue', $event)"
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

      <n-space vertical>
        <n-card
          small
          hoverable
          class="cursor-pointer"
          v-for="(account, index) in accounts"
          @click="onSelectAccount(account)"
          :key="index"
          :bordered="currentAcc.address === account.address"
          :embedded="currentAcc.address === account.address"
        >
          <n-space
            align="center"
            justify="space-between"
            :wrap="false"
            :wrap-item="false"
            style="max-width: 100%%"
          >
            <n-space align="center" :wrap-item="false" style="max-width: 95%">
              <PolkadotAccountIcon @click="onCopy(account)" />

              <div style="max-width: 90%" class="text-ellipsis">
                <div class="account_name text-ellipsis">{{ account.name }}</div>
                <n-text depth="3" class="account_address">
                  {{ account.address }}
                </n-text>
              </div>
            </n-space>

            <Icon
              width="16"
              icon="line-md:confirm"
              v-if="currentAcc.address === account.address"
            />
          </n-space>
        </n-card>
      </n-space>

      <template #action>
        <div style="text-align: right">
          <n-button
            type="primary"
            @click="onConfirm"
            :disabled="!currentAcc.address"
          >
            Confirm
          </n-button>
        </div>
      </template>
    </n-card>
  </n-modal>
</template>

<script setup>
import PolkadotAccountIcon from '@/components/Misc/PolkadotAccountIcon';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import { useMessage } from 'naive-ui';
import { computed, ref, watch } from 'vue';

const props = defineProps({
  modelValue: { type: Boolean },
  isSigningIn: { type: Boolean, default: true },
});
const emits = defineEmits(['update:modelValue']);

const store = useStore();
const router = useRouter();
const message = useMessage();

const currentAcc = ref({});
const storedAccount = computed(() => store.state.account.selected);
const accounts = computed(() => store.state.account.accounts);

function onSelectAccount(account) {
  currentAcc.value = account;
}

function onConfirm() {
  store.commit('account/setSelected', currentAcc.value.address);
  emits('update:modelValue', false);

  if (props.isSigningIn) {
    router.push({ name: 'workflows' });
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
  }
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
