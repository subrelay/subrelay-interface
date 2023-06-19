<template>
  <n-layout style="height: 100vh">
    <n-layout-header class="header" bordered>
      <Logo @click="goToHomePage" />

      <n-space align="center" :size="32">
        <DarkmodeSwitch />
        <AccountDropdown />
      </n-space>
    </n-layout-header>

    <n-layout-content>
      <n-layout has-sider>
        <n-layout-sider
          bordered
          show-trigger="bar"
          collapse-mode="width"
          :width="300"
          :collapsed-width="64"
          :collapsed="collapsed"
          @update:collapsed="(value) => store.commit('global/toggleSider', value)"
          trigger-style="top:20%"
          collapsed-trigger-style="top:20%"
        >
          <n-menu
            style="padding-top: 32px"
            v-model:value="activeKey"
            @update:value="onUpdateActive"
            :default-value="'workflows'"
            :collapsed="collapsed"
            :collapsed-width="64"
            :collapsed-icon-size="32"
            :options="siderOptions"
            :icon-size="24"
            :indent="20"
          />
        </n-layout-sider>

        <n-layout-content content-style="padding: 2rem 4rem 0">
          <RouterView />
        </n-layout-content>
      </n-layout>
    </n-layout-content>
  </n-layout>
</template>

<script setup>
import DarkmodeSwitch from '@/components/DarkmodeSwitch';
import AccountDropdown from '@/components/AccountDropdown';
import Logo from '@/components/Logo';
import { computed, h, ref, watch, onMounted } from 'vue';
import { useStore } from 'vuex';
import { Icon } from '@iconify/vue';
import { RouterLink, useRouter, useRoute } from 'vue-router';
import { NButton, useMessage } from 'naive-ui';
import isEmpty from 'lodash/isEmpty';

const route = useRoute();
const router = useRouter();
const store = useStore();
const activeKey = ref(null);
const collapsed = computed(() => store.state.global.isSiderCollapsed);
const selectedAccount = computed(() => store.state.account.selected);

watch(selectedAccount, (acc) => {
  if (isEmpty(acc)) router.push('/welcome');
});

onMounted(() => {
  window.$message = useMessage();
});

const goToEditor = () => router.push({ name: 'trigger' });
const goToHomePage = () => router.push({ name: 'workflows' });

function onUpdateActive(value) {
  if (value === 'editor') goToEditor('new-flow');
}

function renderIcon(icon, isButton = false) {
  if (isButton) {
    return () => (collapsed.value ? h(NButton, { type: 'primary' }, { default: () => h(Icon, { icon, inline: true }) }) : '');
  }
  return () => h(Icon, { icon, inline: true });
}

const siderOptions = ref([
  {
    label: () => (collapsed.value
      ? h(
        'div',
        { style: 'font-weight: bold', 'data-test': 'new-workflow-btn' },
        { default: () => 'Create workflow' },
      )
      : h(
        NButton,
        {
          block: true,
          type: 'primary',
          round: true,
          style: 'font-family: Unbounded; font-size: 16px; font-weight: bold; padding: 24px; margin-bottom: 32px;',
        },
        {
          default: () => [
            h('div', { style: 'margin-left: 0.6rem', 'data-test': 'new-workflow-btn' }, 'Create workflow'),
          ],
        },
      )),
    key: 'editor',
    icon: renderIcon('fluent:add-12-filled', true),
  },
  {
    label: () => h(RouterLink, { to: { name: 'workflows' } }, { default: () => 'Workflows' }),
    key: 'workflows',
    icon: renderIcon('ic:round-dashboard'),
  },
  {
    label: () => h(RouterLink, { to: { name: 'logs' }, 'data-test': 'side-bar-logs-router' }, { default: () => 'Logs' }),
    key: 'logs',
    icon: renderIcon('system-uicons:files-history'),
  },
]);

watch(
  () => route.name,
  (newRouteName) => {
    activeKey.value = newRouteName;
  },
  { immediate: true },
);
</script>

<style lang="scss">
.header {
  height: 80px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0px 32px;
}

.profile_menu {
  .icon {
    transition: 0.3s transform ease;
    transform-origin: 50%;
  }
}

.n-menu {
  .n-menu-item {
    margin: 10px 0px;
    font-size: 16px;
    font-weight: bold;
    font-family: Unbounded;
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
