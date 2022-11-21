<template>
  <n-space vertical size="large">
    <div class="page_header dark">
      <Logo @click="goToHomePage" />

      <n-dropdown
        v-model:show="showMenu"
        :options="profileOptions"
        @select="onSelectProfileOption"
      >
        <n-button
          size="large"
          color="white"
          text-color="black"
          class="profile_menu"
          round
        >
          <n-space align="center">
            <n-avatar
              round
              size="small"
              color="white"
              src="https://cryptologos.cc/logos/polkadot-new-dot-logo.png"
            />

            <n-space vertical :size="5">
              <div
                v-html="walletAccount.name"
                class="text-bold font-size-085"
              />
              <div
                v-html="truncate(walletAccount)"
                class="text-gray font-size-075"
                style="margin-top: 4px"
              />
            </n-space>

            <Icon
              icon="akar-icons:chevron-down"
              class="icon"
              :inline="true"
              :style="{ transform: showMenu ? 'rotate(180deg)' : '' }"
            />
          </n-space>
        </n-button>
      </n-dropdown>
    </div>

    <n-layout has-sider>
      <n-layout-sider
        bordered
        show-trigger="bar"
        collapse-mode="width"
        :width="300"
        :collapsed-width="70"
        :collapsed="collapsed"
        @collapse="collapsed = true"
        @expand="collapsed = false"
      >
        <n-menu
          v-model:value="activeKey"
          @update:value="onUpdateActive"
          :default-value="'workflows'"
          :collapsed="collapsed"
          :collapsed-width="64"
          :collapsed-icon-size="40"
          :options="siderOptions"
          :icon-size="25"
          :indent="20"
        />
      </n-layout-sider>

      <n-layout-content content-style="padding: 0 5rem;">
        <RouterView />
      </n-layout-content>
    </n-layout>
  </n-space>

  <AccountModal v-model="showModal" :isSigningIn="false" />
</template>

<script setup>
import AccountModal from '@/components/AccountModal';
import Logo from '@/components/Common/Logo';
import { computed, h, ref, watch } from 'vue';
import { useStore } from 'vuex';
import { Icon } from '@iconify/vue';
import { RouterLink, useRouter, useRoute } from 'vue-router';
import { NButton, useMessage } from 'naive-ui';

const route = useRoute();
const router = useRouter();
const store = useStore();
const message = useMessage();
const collapsed = ref(null);
const activeKey = ref(null);
const showMenu = ref(false);
const showModal = ref(false);

watch(
  () => route.name,
  (newRouteName) => (activeKey.value = newRouteName),
  { immediate: true }
);

function goToEditor(id) {
  router.push({ name: 'trigger', params: { id } });
}

const defaultQueryParams = computed(
  () => store.state.global.defaultQueryParams
);

function goToHomePage() {
  router.push({ name: 'workflows', query: defaultQueryParams.value });
}

function onUpdateActive(value) {
  if (value === 'editor') {
    goToEditor('new-flow');
  }
}

function renderIcon(icon, isButton = false) {
  if (isButton) {
    return () =>
      collapsed.value
        ? h(
            NButton,
            { type: 'primary' },
            { default: () => h(Icon, { icon, inline: true }) }
          )
        : '';
  }
  return () => h(Icon, { icon, inline: true });
}

const siderOptions = ref([
  {
    label: () =>
      collapsed.value
        ? h('div', {}, { default: () => 'New workflow' })
        : h(
            NButton,
            { block: true, type: 'primary' },
            {
              default: () => [
                h(Icon, { icon: 'fluent:add-12-filled', inline: true }),
                h('div', { style: 'margin-left: 0.5rem' }, 'New workflow'),
              ],
            }
          ),
    key: 'editor',
    icon: renderIcon('fluent:add-12-filled', true),
  },
  {
    label: () =>
      h(
        RouterLink,
        { to: { name: 'workflows', query: defaultQueryParams.value } },
        { default: () => 'Workflows' }
      ),
    key: 'workflows',
    icon: renderIcon('ic:round-dashboard'),
  },
  {
    label: () =>
      h(
        RouterLink,
        { to: { name: 'history', query: defaultQueryParams.value } },
        { default: () => 'History' }
      ),
    key: 'history',
    icon: renderIcon('system-uicons:files-history'),
  },
]);

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

function truncate({ address }) {
  if (!address) return '';
  return `${address.slice(0, 5)} ... ${address.slice(-5)}`;
}

const walletAccount = computed(() => store.state.global.walletAccount);

function onSelectProfileOption(key) {
  if (key === 'copyAddress') {
    navigator.clipboard.writeText(walletAccount.value.address);
    message.success(`Copied!`);
  }

  if (key === 'changeAccount') {
    showModal.value = true;
  }

  if (key === 'signOut') {
    store.commit('global/setWalletAccount', {});
    router.push({ name: 'welcome' });
  }
}
</script>

<style lang="scss">
.profile_menu {
  margin-right: 2rem;

  .icon {
    transition: 0.3s transform ease;
    transform-origin: 50%;
    // font-size: 3rem;
  }
}

.n-menu {
  .n-menu-item {
    margin: 10px 0px;
    &:first-child {
      margin-bottom: 15px;

      &:hover {
        --n-item-color-hover: transparent;
      }

      .n-menu-item-content--selected {
        --n-item-color-active: transparent;
        --n-item-color-active-hover: transparent;
      }
    }
  }
}
</style>
