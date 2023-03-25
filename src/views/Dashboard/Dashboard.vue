<template>
  <n-layout style="height: 100vh">
    <n-layout-header style="padding: 5px 3rem" bordered>
      <n-space align="center" justify="space-between">
        <Logo @click="goToHomePage" />

        <n-space align="center" :size="32">
          <DarkmodeSwitch />
          <AccountDropdown />
        </n-space>
      </n-space>
    </n-layout-header>

    <n-layout-content>
      <n-layout has-sider>
        <n-layout-sider
          bordered
          show-trigger="bar"
          collapse-mode="width"
          :width="240"
          :collapsed-width="64"
          :collapsed="collapsed"
          @update:collapsed="(value) => store.commit('global/toggleSider', value)"
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
            :collapsed-icon-size="32"
            :options="siderOptions"
            :icon-size="24"
            :indent="20"
          />
        </n-layout-sider>

        <n-layout-content :content-style="{ padding: '20px 5rem 0' }">
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

const route = useRoute();
const router = useRouter();
const store = useStore();
const activeKey = ref(null);
const collapsed = computed(() => store.state.global.isSiderCollapsed);
const query = computed(() => store.state.global.defaultQuery);
const selectedAccount = computed(() => store.state.account.selected);

watch(selectedAccount, (acc) => {
  if (!acc) router.push('/welcome');
});

onMounted(() => (window.$message = useMessage()));

const siderOptions = ref([
  {
    label: () =>
      collapsed.value
        ? h('div', {}, { default: () => 'New workflow' })
        : h(
            NButton,
            { block: true, type: 'primary', round: true },
            {
              default: () => [
                h(Icon, { icon: 'fluent:add-12-filled', inline: true }),
                h('div', { style: 'margin-left: 0.6rem' }, 'New workflow'),
              ],
            },
          ),
    key: 'editor',
    icon: renderIcon('fluent:add-12-filled', true),
  },
  {
    label: () => h(RouterLink, { to: { name: 'workflows' } }, { default: () => 'Workflows' }),
    key: 'workflows',
    icon: renderIcon('ic:round-dashboard'),
  },
  {
    label: () => h(RouterLink, { to: { name: 'logs' } }, { default: () => 'Logs' }),
    key: 'logs',
    icon: renderIcon('system-uicons:files-history'),
  },
]);

watch(
  () => route.name,
  (newRouteName) => (activeKey.value = newRouteName),
  { immediate: true },
);

const goToEditor = (id) => router.push({ name: 'trigger', params: { id } });
const goToHomePage = () => router.push({ name: 'workflows' });

function onUpdateActive(value) {
  if (value === 'editor') goToEditor('new-flow');
}

function renderIcon(icon, isButton = false) {
  if (isButton) {
    return () =>
      collapsed.value
        ? h(NButton, { type: 'primary' }, { default: () => h(Icon, { icon, inline: true }) })
        : '';
  }
  return () => h(Icon, { icon, inline: true });
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

.n-layout-scroll-container {
  display: flex;
  flex-direction: column;
}
</style>
