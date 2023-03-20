<template>
  <div>Log Details</div>
  <div>Id {{ id }}</div>

  <pre>{{ log }}</pre>
</template>

<script setup>
import { computed, watch, ref } from 'vue';
import { useStore } from 'vuex';
import Api from '@/api';

const props = defineProps(['id']);
const store = useStore();
const account = computed(() => store.state.account.selected);
const signer = computed(() => store.state.account.signer);

const log = ref({});
watch(
  signer,
  async () => {
    if (signer.value) {
      const { data } = await Api.getLogDetails({
        account: account.value,
        signer: signer.value,
        id: props.id,
      });
      log.value = data;
      console.log(data);
    }
  },
  { immediate: true },
);
</script>
