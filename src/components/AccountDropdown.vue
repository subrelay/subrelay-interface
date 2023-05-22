<template>
  <n-dropdown v-model:show="showMenu" :options="profileOptions" @select="onSelectProfileOption">
    <n-button size="large" class="profile_menu" round>
      <n-space align="center">
        <n-avatar
          round
          size="small"
          color="transparent"
          src="https://cryptologos.cc/logos/polkadot-new-dot-logo.png"
        />

        <n-space vertical :size="5" class="test" :wrap-item="false">
          <div v-html="walletAccount.name" class="text-bold font-size-085 text-ellipsis" />

          <n-text depth="3" class="font-size-075">
            {{ truncate(walletAccount) }}
          </n-text>
        </n-space>

        <Icon
          icon="akar-icons:chevron-down"
          class="icon"
          :style="{ transform: showMenu ? 'rotate(180deg)' : '' }"
        />
      </n-space>
    </n-button>
  </n-dropdown>

  <AccountModal v-model="showModal" />
</template>

<script setup>
import AccountModal from '@/components/AccountModal';
import { useRenderIcon as renderIcon, useTruncate as truncate } from '@/composables';
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { useMessage } from 'naive-ui';
import { Icon } from '@iconify/vue';

const store = useStore();
const router = useRouter();
const message = useMessage();
const showModal = ref(false);
const showMenu = ref(false);
const profileOptions = ref([
  {
    label: 'Copy Address',
    key: 'copyAddress',
    icon: renderIcon('fluent:copy-add-24-regular'),
  },
  {
    label: 'Change Account',
    key: 'changeAccount',
    icon: renderIcon('carbon:user-avatar-filled-alt'),
  },
  {
    label: 'Sign Out',
    key: 'signOut',
    icon: renderIcon('octicon:sign-out-16'),
  },
]);

const walletAccount = computed(() => store.state.account.selected || {});

function onSelectProfileOption(key) {
  if (key === 'copyAddress') {
    navigator.clipboard.writeText(walletAccount.value.address);
    message.success('Copied!');
  }

  if (key === 'changeAccount') {
    showModal.value = true;
  }

  if (key === 'signOut') {
    localStorage.removeItem(walletAccount.value.address);
    store.commit('account/setSelected', null);
    router.push({ name: 'welcome' });
  }
}
</script>

<style lang="scss" scoped>
.test {
  width: 10vw;
  max-width: 100px;
}
</style>
