<template>
  <n-config-provider
    :theme="colorScheme"
    :theme-overrides="
      colorScheme === null ? lightThemeOverrides : darkThemeOverrides
    "
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
import { onMounted, ref } from 'vue';
import { darkTheme } from 'naive-ui';
import { useStore } from 'vuex';
// import { NConfigProvider, GlobalThemeOverrides } from 'naive-ui';
const store = useStore();

import {
  NMessageProvider,
  NLoadingBarProvider,
  NDialogProvider,
} from 'naive-ui';

const colorScheme = ref(null);

const lightThemeOverrides = {
  // common: {
  //   primaryColor: '#008060',
  //   primaryColorHover: 'rgba(0, 128, 96, 0.8)',
  //   primaryColorPressed: '#008060',
  //   primaryColorSuppl: 'orange',
  //   primaryColor: 'yellow',
  // },
  // Input: {
  //   placeholderColor: '#888',
  //   caretColor: 'black',
  //   // borderFocus: '1px solid #E5BE4C',
  // },
  // Button: {
  //   color: 'black',
  //   colorFocus: 'black',
  //   textColor: '#fff',
  //   textColorFocus: '#fff',
  //   border: 'none',
  //   borderFocus: 'none',
  // },
};

const darkThemeOverrides = {
  // common: {
  //   textColor2: '#fff',
  // },
  // Button: {
  //   textColor: 'black',
  //   textColorFocus: 'black',
  //   color: '#63e2b7',
  //   colorFocus: '#63e2b7',
  // },
};

onMounted(() => {
  // Detect dark mode
  if (
    window.matchMedia &&
    window.matchMedia('(prefers-color-scheme: dark)').matches
  ) {
    colorScheme.value = darkTheme;
    store.commit('global/setDarkMode', true);
  }

  // Watch for theme changes
  window
    .matchMedia('(prefers-color-scheme: dark)')
    .addEventListener('change', (e) => {
      colorScheme.value = e.matches ? darkTheme : null;
      store.commit('global/setDarkMode', e.matches);
    });
});
</script>
