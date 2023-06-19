import { shallowMount, config } from '@vue/test-utils';
import AccountModal from '../AccountModal.vue';
import { createMockStore } from './setup';
import { globalComponents } from './setup';

const accounts = [
  { name: 'Account 1', address: '0x1234567890' },
  { name: 'Account 2', address: '0x9876543210' },
];

const store = createMockStore([
  {
    name: 'account',
    state: () => ({
      selected: {},
      accounts,
    }),
  },
]);
config.global.components = globalComponents;
config.global.plugins = [store];

describe('AccountModal', () => {
  test('emits "update:modelValue" event when the modal is closed', async () => {
    const wrapper = shallowMount(AccountModal);
    await wrapper.find('.account_modal').vm.$emit('update:show', false);
    expect(wrapper.emitted('update:modelValue')).toBeTruthy();
    expect(wrapper.emitted('update:modelValue')[0][0]).toBe(false);
  });

  // test('displays the correct title for the modal', () => {
  //   const wrapper = mount(AccountModal);
  //   expect(wrapper.find('.account_modal').props('title')).toBe('Dialog');
  // });

  // test('renders account items correctly', async () => {

  //   const store = createMockStore([
  //     {
  //       name: 'account',
  //       state: () => ({
  //         selected: {},
  //         accounts,
  //       }),
  //     },
  //   ]);

  //   const wrapper = mount(AccountModal, {
  //     global: {
  //       plugins: [store],
  //     },
  //   });

  //   // Simulate selecting an account
  //   await wrapper.find('.account-item').trigger('click');

  //   // Simulate clicking the Confirm button
  //   await wrapper.find('[data-test="confirm-account"]').trigger('click');

  //   // Check if emitted events and store changes occurred
  //   expect(wrapper.emitted('update:modelValue')).toBeTruthy();
  //   expect(wrapper.emitted('update:modelValue')[0][0]).toBe(false);
  //   expect(wrapper.vm.loading).toBe(false);
  //   expect(wrapper.vm.currentAcc).toEqual(accounts[0]);
  //   // Additional store checks can be added

  //   // Check if the copied account address is correct
  //   await wrapper
  //     .find('.account-item')
  //     .findComponent({ name: 'PolkadotAccountIcon' })
  //     .trigger('click');
  //   expect(navigator.clipboard.writeText).toHaveBeenCalledWith(accounts[0].address);
  //   expect(wrapper.vm.message.success).toHaveBeenCalledWith('Copied!');
  // });
});
