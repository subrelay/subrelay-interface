<template>
  <n-config-provider :theme="theme" :theme-overrides="darkMode ? darkOverrides : lightOverrides">
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
import { computed, onBeforeMount } from 'vue';
import { useStore } from 'vuex';
import { darkTheme } from 'naive-ui';

const store = useStore();
const darkMode = computed(() => store.state.global.isDarkMode);
const theme = computed(() => (darkMode.value ? darkTheme : null));

const preferredFontSize = '13px';

const lightOverrides = {
  common: {
    fontSize: preferredFontSize,
    primaryColor: 'rgba(230, 0, 122, 1)',
    primaryColorHover: 'rgba(230, 0, 122, 0.7)',
    primaryColorPressed: 'rgba(230, 0, 122, 0.7)',
    primaryColorSuppl: 'rgba(230, 0, 122, 1)',
  },
  Form: {
    labelFontSizeTopMedium: preferredFontSize,
    feedbackFontSizeMedium: preferredFontSize,
  },
  Button: {
    fontSizeSmall: preferredFontSize,
  },
};

const darkOverrides = {
  common: {
    fontSize: preferredFontSize,
    baseColor: 'rgba(255, 255, 255)',
    primaryColor: 'rgba(230, 0, 122, 1)',
    primaryColorHover: 'rgba(230, 0, 122, 0.7)',
    primaryColorPressed: 'rgba(230, 0, 122, 0.7)',
    primaryColorSuppl: 'rgba(230, 0, 122, 1)',
    warningColor: 'rgb(255, 206, 0)',
  },
  Radio: {
    buttonColorActive: '#0000',
    buttonTextColorActive: 'rgba(230, 0, 122, 1)',
  },
  Button: {
    fontSizeSmall: preferredFontSize,
  },
};

onBeforeMount(() => {
  // Watch for system theme changes
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    store.commit('global/setDarkMode', e.matches);
  });

  const viewMode = localStorage.getItem('viewMode');

  if (viewMode) {
    store.commit('global/setDarkMode', viewMode === 'dark');
    return;
  }

  // Detect system dark mode
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    store.commit('global/setDarkMode', true);
  }
});
</script>
