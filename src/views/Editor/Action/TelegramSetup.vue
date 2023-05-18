<template>
  <TeleDiscordSetupWrapper channel="telegram" />

  <span v-if="!isLoaded">Loading...</span>
  <telegram-login-temp
    mode="callback"
    telegram-login="subrelay_local_bot"
    @loaded="telegramLoadedCallbackFunc"
    @callback="yourCallbackFunction"
    requestAccess="write"
  />
</template>

<script setup>
import TeleDiscordSetupWrapper from '@/components/TeleDiscordSetupWrapper';

import { telegramLoginTemp } from 'vue3-telegram-login';
import { ref } from 'vue';

const isLoaded = ref(false);

function telegramLoadedCallbackFunc() {
  console.log('script is loaded');
  isLoaded.value = true;
}

function yourCallbackFunction(user) {
  // gets user as an input
  // id, first_name, last_name, username,
  // photo_url, auth_date and hash
  console.log(user);
}
</script>

<style lang="scss"></style>
