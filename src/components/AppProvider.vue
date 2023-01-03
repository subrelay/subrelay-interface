<template>
  <n-config-provider
    :theme="darkMode ? darkTheme : null"
    :theme-overrides="darkMode ? darkThemeOverrides : lightThemeOverrides"
  >
    <n-loading-bar-provider>
      <n-message-provider>
        <n-dialog-provider>
          <slot></slot>
        </n-dialog-provider>
      </n-message-provider>
    </n-loading-bar-provider>
  </n-config-provider>
</template>

<script setup>
import { computed, onMounted } from 'vue';
import { darkTheme } from 'naive-ui';
import { useStore } from 'vuex';

const store = useStore();
const darkMode = computed(() => store.state.global.isDarkMode);

import {
  NMessageProvider,
  NLoadingBarProvider,
  NDialogProvider,
} from 'naive-ui';

const lightThemeOverrides = {
  primaryColor: 'rgba(230, 0, 122, 1)',
  primaryColorHover: 'rgba(230, 0, 122, 0.7)',
  primaryColorPressed: 'rgba(230, 0, 122, 0.7)',
  primaryColorSuppl: 'rgba(230, 0, 122, 1)',
};

const darkThemeOverrides = {
  common: {
    baseColor: 'rgba(255, 255, 255)',
    primaryColor: 'rgba(230, 0, 122, 1)',
    primaryColorHover: 'rgba(230, 0, 122, 0.7)',
    primaryColorPressed: 'rgba(230, 0, 122, 0.7)',
    primaryColorSuppl: 'rgba(230, 0, 122, 1)',
    // infoColor: string;
    // infoColorHover: string;
    // infoColorPressed: string;
    // infoColorSuppl: string;
    successColor: 'green',
    // successColorHover: string;
    // successColorPressed: string;
    // successColorSuppl: string;
    warningColor: 'rgb(255, 206, 0)',
    // warningColorHover: string;
    // warningColorPressed: string;
    // warningColorSuppl: string;
    errorColor: 'rgb(210, 84, 93)',
    // errorColorHover: string;
    // errorColorPressed: string;
    // errorColorSuppl: string;
    // textColorBase: string;
    // textColor1: string;
    // textColor2: string;
    // textColor3: string;
  },
};

onMounted(() => {
  // Detect dark mode
  if (
    window.matchMedia &&
    window.matchMedia('(prefers-color-scheme: dark)').matches
  ) {
    store.commit('global/setDarkMode', true);
  }

  // Watch for theme changes
  window
    .matchMedia('(prefers-color-scheme: dark)')
    .addEventListener('change', (e) => {
      store.commit('global/setDarkMode', e.matches);
    });
});
</script>
