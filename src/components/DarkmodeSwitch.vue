<template>
  <n-switch
    size="large"
    :rail-style="railStyle"
    :value="darkMode"
    @update:value="store.commit('global/setDarkMode', $event)"
  >
    <template #icon>
      <SubIcon
        icon="line-md:sunny-filled-loop-to-moon-alt-filled-loop-transition"
        color="black"
        v-if="darkMode"
      />

      <SubIcon
        color="rgb(255, 172, 51)"
        icon="line-md:moon-filled-to-sunny-filled-loop-transition"
        v-else
      />
    </template>

    <template #checked>
      <SubIcon
        icon="icon-park-outline:sun"
        color="#EAEAEA"
        :style="{ 'margin-right': '12px', 'margin-left': '-12px' }"
      />
    </template>

    <template #unchecked>
      <SubIcon
        icon="heroicons-outline:moon"
        color="#797676"
        :style="{ 'margin-right': '-12px', 'margin-left': '12px' }"
      />
    </template>
  </n-switch>
</template>

<script setup>
import { computed } from 'vue';
import { useStore } from 'vuex';

const store = useStore();
const darkMode = computed(() => store.state.global.isDarkMode);

function railStyle({ focused, checked } = {}) {
  const style = {};

  style.background = checked ? 'rgba(255, 255, 255, 0.2)' : '#e0e0e0';

  if (focused) style.boxShadow = '0 0 0 2px #e0e0e0';

  return style;
}
</script>
