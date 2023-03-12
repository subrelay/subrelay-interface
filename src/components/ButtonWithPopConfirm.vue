<template>
  <n-tooltip
    trigger="hover"
    placement="top-end"
    @clickoutside="onClickOutSide"
    :show="showTooltip"
    :style="{ 'max-width': '400px' }"
  >
    <template #trigger>
      <n-button
        text
        size="small"
        :style="style"
        :id="`action-${props.positiveText}__key-${props.elementKey}`"
        :color="store.state.global.isDarkMode ? '#fff' : '#111'"
        @click="onTrigger"
      >
        <slot name="trigger-content"></slot>
      </n-button>
    </template>

    <template #default>
      <div v-if="showConfirm">
        <div class="confirm_content">
          <SubIcon icon="ep:warning-filled" class="icon" color="#e6c260" />
          {{ props.confirmText }}
        </div>

        <n-space justify="end">
          <n-button
            size="small"
            color="white"
            ghost
            @click="showTooltip = false"
            :disabled="loading"
          >
            {{ negativeText }}
          </n-button>

          <n-button
            size="small"
            type="error"
            @click="handlePositive"
            :loading="loading"
            :disabled="loading"
          >
            {{ positiveText }}
          </n-button>
        </n-space>
      </div>
      <div v-else>{{ tooltipText }}</div>
    </template>
  </n-tooltip>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { useStore } from 'vuex';

const store = useStore();

const props = defineProps({
  negativeText: { type: String, default: 'Cancel' },
  positiveText: { type: String, default: 'Confirm' },
  tooltipText: { type: String, default: 'Delete' },
  confirmText: { type: String, default: ' Are you sure to delete?' },
  onPositiveClick: Function,
  elementKey: [String, Number],
  style: Object,
});

const showConfirm = ref(false);
const showTooltip = ref(false);
const loading = ref(false);

function handleMouseEnter() {
  showConfirm.value = false;
  showTooltip.value = true;
}

function handleMouseLeave() {
  if (!showConfirm.value) showTooltip.value = false;
}

function onTrigger(e) {
  e.stopPropagation();
  showConfirm.value = true;
}

function onClickOutSide() {
  if (showConfirm.value) {
    showTooltip.value = false;
  }
}

async function handlePositive() {
  loading.value = true;
  await props.onPositiveClick();
  loading.value = false;
  showTooltip.value = false;
}

onMounted(() => {
  // Toggle tooltip
  const element = document.querySelector(`#action-${props.positiveText}__key-${props.elementKey}`);
  element.addEventListener('mouseenter', handleMouseEnter);
  element.addEventListener('mouseleave', handleMouseLeave);
});

onBeforeUnmount(() => {
  const element = document.querySelector(`#action-${props.positiveText}__key-${props.elementKey}`);
  element.removeEventListener('mouseenter', handleMouseEnter);
  element.removeEventListener('mouseleave', handleMouseLeave);
});
</script>
<style lang="scss">
.confirm_content {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 0.75rem;

  .icon {
    margin-right: 0.5rem;
    font-size: 1.5rem;
  }
}
</style>
