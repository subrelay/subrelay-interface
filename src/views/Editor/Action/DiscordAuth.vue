<template>
  <n-space align="center" justify="center" style="height: 80vh; width: 100%">
    <Icon icon="eos-icons:three-dots-loading" width="50" color="rgba(230, 0, 122, 1)" />
  </n-space>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { computed, onMounted } from 'vue';
import axios from 'axios';
import Api from '@/api';

const router = useRouter();
const store = useStore();
const account = computed(() => store.state.account.selected);
const signer = computed(() => store.state.account.signer);

onMounted(async () => {
  const fragment = new URLSearchParams(window.location.hash.slice(1));
  const [accessToken, tokenType] = [fragment.get('access_token'), fragment.get('token_type')];

  try {
    const { data } = await axios.get('https://discord.com/api/users/@me', {
      headers: { authorization: `${tokenType} ${accessToken}` },
    });

    const { id } = data;
    await Api.updateDiscordInfo({ account: account.value, signer: signer.value, params: { id } });
    router.push({ name: 'Splash' });
  } catch (error) {
    console.error(error);
    router.push({ name: 'Splash', query: { success: 'false' } });
  }
});
</script>
