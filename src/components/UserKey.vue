<template>
  <n-space align="baseline" :wrap-item="false" style="margin-bottom: 1.5rem">
    <n-space align="center">
      <div class="text-bold">Key:</div>
      <n-text code>{{ key }}</n-text>
    </n-space>

    <div>
      <div class="code__icon completed" v-if="isCopied">
        <Icon icon="akar-icons:check" width="13" />
      </div>

      <div class="code__icon copy" @click="onCopy" v-else>
        <Icon icon="fluent:document-copy-48-filled" width="13" />
      </div>
    </div>

    <n-tooltip trigger="hover" placement="top-start">
      <template #trigger>
        <n-button text>
          <Icon icon="material-symbols:info-outline-rounded" />
        </n-button>
      </template>
      Add this key to Subrelay Bot in your {{ channel }} chat box.
    </n-tooltip>
  </n-space>
</template>

<script setup>
import { computed, ref } from 'vue';
import { useMessage } from 'naive-ui';
import { useStore } from 'vuex';

defineProps(['channel']);

const store = useStore();
const message = useMessage();
const isCopied = ref(false);
const key = computed(() => store.state.account.userInfo.key);

function onCopy() {
  navigator.clipboard.writeText(key.value);
  isCopied.value = true;
  message.success('Copied!');
  setTimeout(() => (isCopied.value = false), 1500);
}
</script>
