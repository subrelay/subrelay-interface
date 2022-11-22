import { ref } from 'vue';

export function useGetChainImg(chain) {
  switch (chain.toLowerCase()) {
    case 'acala':
      return 'https://avatars.githubusercontent.com/u/54881907?s=280&v=4';
    case 'polkadot':
      return 'https://cryptologos.cc/logos/polkadot-new-dot-logo.png';
    case 'kusama':
      return 'https://www.liblogo.com/img-logo/ku2766k057-kusama-logo-kusama-ksm-bitprime.png';
  }
}

export const useLogStatuses = ref([
  // will be updated later to get status list of all logs
  {
    label: 'Success',
    value: 'success',
    icon: 'ep:success-filled',
    iconColor: '#18A058FF',
  },
  {
    label: 'Failed',
    value: 'failed',
    icon: 'ic:round-cancel',
    iconColor: '#D03050FF',
  },
]);

export const useWorkflowStatuses = ref([
  // will be updated later to get status list of all workflows
  {
    label: 'Running',
    value: 'running',
    icon: 'fa:toggle-on',
    iconColor: '#18a058',
  },
  {
    label: 'Pausing',
    value: 'pausing',
    icon: 'fa:toggle-on',
    iconColor: 'rgba(0, 0, 0, 0.14)',
    iconRotate: 2,
  },
]);

export const useChannels = ref([
  { value: 'webhook', label: 'Webhook', icon: 'logos:webhooks' },
  { value: 'email', label: 'Email', icon: 'fluent-emoji-flat:e-mail' },
  { value: 'telegram', label: 'Telegram', icon: 'logos:telegram' },
  { value: 'discord', label: 'Discord', icon: 'logos:discord-icon' },
]);
