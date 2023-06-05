<template>
  <n-layout style="height: 100vh">
    <n-layout-header bordered>
      <div class="header__content">
        <Logo/>
      </div>

    </n-layout-header>

    <n-layout-content>
      <div class="container">
        <h1 class="title">Subrelay</h1>
        <h2 class="subtitle">Build your own Web3 automation workflows on any Substrate based chain</h2>
        <n-button
          type="primary"
          size="large"
          round
          style="font-weight: bold; font-size: 16px; padding: 32px; font-family: 'Unbounded';"
          @click="onConnectWallet"
          data-test="connect-wallet"
          :loading="loading"
        >
          Continue with my wallet
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
.header__content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  height: 80px;
  margin: auto;
}
.container {
  height: 100%;
  max-width: 1200px;
  margin: auto;
  padding-top: 48px;

  .title {
    font-family: 'Unbounded';
    font-size: 48px;
    margin-top: 48px;
  }
  
  .subtitle {
    font-family: 'Unbounded';
    font-size: 16px;
    font-weight: 500;
    font-size: 28px;
    color: #808695;
    max-width: 480px;
    margin-top: 8px;
    margin-bottom: 24px;
  }
}
</style>
