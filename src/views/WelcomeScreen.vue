<template>
  <div class="page_header center">
    <Logo :color="'black'" />
  </div>

  <div class="welcome">
    <h1 class="title">Hi, welcome back!</h1>
    <div class="text">
      <span style="margin-right: 5px">Please connect your</span>
      <n-avatar round :size="24" src="https://polkadot.js.org/logo.svg" />
      <span style="margin-left: 5px">
        Polkadot{.js} wallet to start using SubRelay.</span
      >
    </div>
    <n-button type="primary" class="connect_button" @click="showModal = true">
      Connect Wallet
    </n-button>
  </div>

  <AccountModal v-model="showModal" />
</template>

<script setup>
import Logo from '@/components/Common/Logo';
import AccountModal from '@/components/AccountModal';
import { ref } from 'vue';

const showModal = ref(false);
</script>

<style lang="scss" scoped>
.page_header {
  padding-top: 2rem;
}

.welcome {
  margin-top: 15vh;
  height: calc(100vh);
  display: flex;
  flex-direction: column;
  align-items: center;

  .text {
    display: flex;
    align-items: center;
  }

  .title {
    font-size: 4rem;
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
