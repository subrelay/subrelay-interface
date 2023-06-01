<template>
  <n-layout style="height: 100vh">
    <n-layout-header bordered class="page_header center">
      <Logo />
    </n-layout-header>

    <n-layout-content>
      <div class="welcome">
        <h1 class="title">Welcome to Subrelay</h1>
        <div class="text">
          <span style="margin-right: 5px">Please connect your</span>
          <n-avatar color="transparent" round :size="24" src="https://polkadot.js.org/logo.svg" />
          <span style="margin-left: 5px"> Polkadot{.js} wallet to start using SubRelay.</span>
        </div>

        <n-button
          type="primary"
          round
          size="large"
          @click="onConnectWallet"
          data-test="connect-wallet"
          :loading="loading"
        >
          Connect Wallet
        </n-button>
      </div>
    </n-layout-content>
  </n-layout>

  <AccountModal v-model="showModal" />
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import { useMessage } from 'naive-ui';
import Logo from '@/components/Logo';
import AccountModal from '@/components/AccountModal';

const router = useRouter();
const store = useStore();
const showModal = ref(false);
const loading = computed(() => store.state.account.loading.loadAccounts);
const selectedAccount = computed(() => store.state.account.selected);

onMounted(() => {
  window.$message = useMessage();
});

const onConnectWallet = async () => {
  await store.dispatch('account/loadAccounts');
  showModal.value = true;
};

watch(
  selectedAccount,
  (acc) => {
    if (acc) router.push('/');
  },
  { immediate: true },
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
