<template>
  <n-spin :show="loading">
    <div class="page_header center">
      <Logo :color="'black'" />
    </div>

    <div class="welcome" v-if="!loading">
      <h1 class="title">Welcome to Subrelay</h1>
      <div class="text">
        <span style="margin-right: 5px">Please connect your</span>
        <n-avatar round :size="24" src="https://polkadot.js.org/logo.svg" />
        <span style="margin-left: 5px">
          Polkadot{.js} wallet to start using SubRelay.</span
        >
      </div>
      <n-button
        type="primary"
        round
        size="large"
        @click="showModal = true"
      >
        Connect Wallet
      </n-button>
    </div>
  </n-spin>

  <AccountModal v-model="showModal" />
</template>

<script setup>
import Logo from '@/components/Common/Logo';
import AccountModal from '@/components/Misc/AccountModal';
import { ref, computed, watch } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';

const router = useRouter();

const store = useStore();
const showModal = ref(false);
const loading = computed(() => store.state.account.loading);
const selectedAccount = computed(() => store.state.account.selected);

watch(
  selectedAccount,
  () => {
    router.push({ name: 'home' });
  },
  { immediate: true }
);

</script>

<style lang="scss" scoped>
.page_header {
  padding: 16px 32px;
}
.welcome {
  margin-top: 15vh;
  display: flex;
  flex-direction: column;
  align-items: center;

  .text {
    display: flex;
    align-items: center;
    margin-bottom: 2rem;
  }

  .title {
    font-family: 'Unbounded';
    font-size: 2.4rem;
    margin-bottom: 1rem;
  }

  .connect_button {
    width: 50vw;
    max-width: 500px;
    padding: 1.5rem;
    font-size: 1.5rem;
    margin-top: 5rem;
  }
}
</style>
