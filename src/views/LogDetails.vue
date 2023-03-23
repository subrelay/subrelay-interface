<template>
  <n-space align="center" justify="center" style="height: 80vh; width: 100%" v-if="loading">
    <Icon icon="eos-icons:three-dots-loading" width="50" color="rgba(230, 0, 122, 1)" />
  </n-space>

  <div v-else class="log-details">
    <n-space align="center" justify="space-between">
      <n-breadcrumb separator=">">
        <n-breadcrumb-item>
          <template #default>
            <router-link :to="{ name: 'history' }" class="text-bold font-size-2rem">
              HISTORY
            </router-link>
          </template>
        </n-breadcrumb-item>

        <n-breadcrumb-item class="font-size-2rem text-bold">
          {{ log.name || '' }}
        </n-breadcrumb-item>
      </n-breadcrumb>

      <n-dropdown trigger="hover" :options="options" @select="handleSelect" placement="bottom-end">
        <n-button text>
          <Icon icon="ph:dots-six-vertical-bold" width="30" />
        </n-button>
      </n-dropdown>
    </n-space>

    <n-space vertical style="margin: 2rem 0">
      <n-space>
        <div class="info-title">Finished at:</div>
        <div>{{ moment(log.finishedAt).local().format('MMM Do YYYY, HH:mm:ss') }}</div>
      </n-space>

      <n-space>
        <div class="info-title">Status:</div>

        <n-space align="vertical">
          <StatusIcon :status="log.status" />
          <div class="text-capitalize">{{ log.status }}</div>
        </n-space>
      </n-space>
    </n-space>
  </div>
</template>

<script setup>
import StatusIcon from '@/components/StatusIcon';
import { computed, watch, ref } from 'vue';
import { useStore } from 'vuex';
import { isEmpty } from 'lodash';
import { useShowError, useRenderIcon as renderIcon } from '@/composables';
import moment from 'moment';
import Api from '@/api';

const props = defineProps(['id']);
const store = useStore();
const account = computed(() => store.state.account.selected);
const signer = computed(() => store.state.account.signer);
const loading = ref(true);

const log = ref({});
watch(
  signer,
  async () => {
    if (signer.value) {
      try {
        const { data } = await Api.getLogDetails({
          account: account.value,
          signer: signer.value,
          id: props.id,
        });
        log.value = data;
        console.log(data);
      } catch (e) {
        useShowError(e);
      } finally {
        loading.value = false;
      }
    }
  },
  { immediate: true },
);

const options = ref([
  {
    label: 'View workflow details',
    key: 'details',
    icon: renderIcon('bi:eye-fill'),
  },
  {
    label: 'View full workflow logs',
    key: 'log',
    icon: renderIcon('icon-park-outline:log'),
  },
]);

function handleSelect(key) {
  console.log('key', key);
}
</script>

<style lang="scss" scoped>
.log-details {
  .info-title {
    width: 100px;
  }
}
</style>
