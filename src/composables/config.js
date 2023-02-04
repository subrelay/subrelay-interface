import { ref } from 'vue';

export function useGetChainImg(chainsData = [], chainName) {
  const chain = chainsData.find((el) => (el.name = chainName));
  return chain.imageUrl;
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
    iconColorDark: 'rgb(42, 148, 125)',
    iconColorLight: '#18a058',
  },
  {
    label: 'Pausing',
    value: 'pausing',
    icon: 'fa:toggle-on',
    iconColorDark: 'rgba(255, 255, 255, 0.2)',
    iconColorLight: 'rgba(0, 0, 0, 0.14)',
    iconRotate: 2,
  },
]);

export const useChannels = ref([
  { value: 'webhook', label: 'Webhook', icon: 'logos:webhooks' },
  { value: 'email', label: 'Email', icon: 'fluent-emoji-flat:e-mail' },
  { value: 'telegram', label: 'Telegram', icon: 'logos:telegram' },
  { value: 'discord', label: 'Discord', icon: 'logos:discord-icon' },
]);

export const defaultQuery = {
  search: undefined,
  order: undefined,
  sort: undefined,
  uuid: undefined,
  status: undefined,
  offset: 0,
  limit: 5,
};
