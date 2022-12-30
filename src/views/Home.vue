<template>
  <div style="height: 100vh; position: relative">
    <n-layout position="absolute">
      <n-layout-header style="padding: 5px 3rem" bordered>
        <n-space align="center" justify="space-between">
          <Logo @click="goToHomePage" />

          <n-space align="center" :size="30">
            <n-switch
              :rail-style="railStyle"
              size="large"
              :value="darkMode"
              @update:value="store.commit('global/setDarkMode', $event)"
            >
              <template #icon>
                <Icon
                  icon="line-md:sunny-filled-loop-to-moon-alt-filled-loop-transition"
                  color="black"
                  v-if="darkMode"
                />

                <Icon
                  color="rgb(255, 172, 51)"
                  icon="line-md:moon-filled-to-sunny-filled-loop-transition"
                  v-else
                />
              </template>

              <template #checked>
                <Icon
                  icon="icon-park-outline:sun"
                  color="#EAEAEA"
                  :style="{ 'margin-right': '10px', 'margin-left': '-10px' }"
                />
              </template>

              <template #unchecked>
                <Icon
                  icon="heroicons-outline:moon"
                  color="#797676"
                  :style="{ 'margin-right': '-10px', 'margin-left': '10px' }"
                />
              </template>
            </n-switch>

            <n-dropdown
              v-model:show="showMenu"
              :options="profileOptions"
              @select="onSelectProfileOption"
            >
              <n-button size="large" class="profile_menu" round>
                <n-space align="center">
                  <n-avatar
                    round
                    size="small"
                    color="transparent"
                    src="https://polkadot.network/assets/img/staking/polkadot.svg?v=eabc0486b6"
                  />

                  <n-space vertical :size="5">
                    <div
                      v-html="walletAccount.name"
                      class="text-bold font-size-085"
                    />

                    <n-text depth="3" class="font-size-075">
                      {{ truncate(walletAccount) }}
                    </n-text>
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
          </n-space>
        </n-space>
      </n-layout-header>

      <n-layout has-sider class="home_layout">
        <n-layout-sider
          bordered
          show-trigger="bar"
          collapse-mode="width"
          :width="300"
          :collapsed-width="70"
          :collapsed="collapsed"
          @update:collapsed="
            (value) => store.commit('global/toggleSider', value)
          "
          trigger-style="top:20%"
          collapsed-trigger-style="top:20%"
        >
          <n-menu
            style="padding-top: 20px"
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

        <n-layout-content :content-style="{ padding: '20px 5rem 0' }">
          <RouterView />
        </n-layout-content>
      </n-layout>
    </n-layout>
  </div>

  <AccountModal v-model="showModal" :isSigningIn="false" />
</template>

<script setup>
import AccountModal from '@/components/Misc/AccountModal';
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
const activeKey = ref(null);
const showMenu = ref(false);
const showModal = ref(false);
const collapsed = computed(() => store.state.global.isSiderCollapsed);
const walletAccount = computed(() => store.state.global.walletAccount);
const query = computed(() => store.state.global.defaultQuery);
const darkMode = computed(() => store.state.global.isDarkMode);

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
        { to: { name: 'workflows', query: query.value } },
        { default: () => 'Workflows' }
      ),
    key: 'workflows',
    icon: renderIcon('ic:round-dashboard'),
  },
  {
    label: () =>
      h(
        RouterLink,
        { to: { name: 'history', query: query.value } },
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

watch(
  () => route.name,
  (newRouteName) => (activeKey.value = newRouteName),
  { immediate: true }
);

function goToEditor(id) {
  router.push({ name: 'trigger', params: { id } });
}

function goToHomePage() {
  router.push({ name: 'workflows', query: query.value });
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

function truncate({ address }) {
  if (!address) return '';
  return `${address.slice(0, 5)} ... ${address.slice(-5)}`;
}

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

function railStyle({ focused, checked } = {}) {
  const style = {};

  if (checked) {
    style.background = 'rgba(255, 255, 255, 0.2)';
  } else {
    style.background = '#e0e0e0';
  }

  if (focused) {
    style.boxShadow = '0 0 0 2px #e0e0e0';
  }

  return style;
}
</script>

<style lang="scss">
.profile_menu {
  .icon {
    transition: 0.3s transform ease;
    transform-origin: 50%;
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

.home_layout {
  height: calc(100vh - 78px);
}
</style>
