<template>
  <JsonViewer
    :value="sampleData"
    :expand-depth="props.expandDepth"
    copyable
    boxed
    sort
  />
</template>

<script setup>
import { JsonViewer } from 'vue3-json-viewer';
import { computed, ref } from 'vue';
import { useStore } from 'vuex';

const store = useStore();

const props = defineProps({ expandDepth: { type: Number, default: 0 } });
// const sampleData = computed(() => store.state.chain.event.sample || {});
const sampleData = ref({
  id: 123,
  name: 'balances.deposit',
  description: 'This Event Does This',
  data: { who: '', amount: 123 },
  status: 'success',
  extrinsic: { name: 'balances.deposit' },
  block: { hash: '', number: 123, timestamp: '' },
});
</script>

<style lang="scss">
.jv-container {
  padding: 0px;

  &.jv-light {
    background: rgb(250, 250, 252);
  }

  .jv-code {
    padding: 20px;
  }
}
</style>
