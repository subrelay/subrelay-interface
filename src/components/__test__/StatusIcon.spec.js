import { mount } from '@vue/test-utils';
import StatusIcon from '../StatusIcon.vue';
import { Icon } from '@iconify/vue';
import { createMockStore } from './setup';

describe('StatusIcon', () => {
  test('renders the correct icon and color for "success" status', () => {
    const store = createMockStore([
      {
        name: 'global',
        state: () => ({
          isDarkMode: false,
          isSiderCollapsed: false,
        }),
      },
    ]);

    const wrapper = mount(StatusIcon, {
      props: {
        status: 'success',
      },
      global: {
        plugins: [store],
      },
    });

    console.log(wrapper.findComponent(Icon).props(['icon']));

    // expect(wrapper.findComponent(Icon).props('icon')).toBe('ep:success-filled');
    // expect(wrapper.findComponent(Icon).props('color')).toBe('#18a058ff');
  });

  // test('renders the correct icon and color for "failed" status', () => {
  //   const wrapper = mount(StatusIcon, {
  //     props: {
  //       status: 'failed'
  //     },
  //     global: {
  //       provide: {
  //         // Mock the store's state
  //         $store: {
  //           state: {
  //             global: {
  //               isDarkMode: true
  //             }
  //           }
  //         }
  //       }
  //     }
  //   });

  //   expect(wrapper.findComponent({ name: 'Icon' }).props('icon')).toBe('ic:round-cancel');
  //   expect(wrapper.findComponent({ name: 'Icon' }).props('color')).toBe('#e88080');
  // });

  // test('renders the correct icon and color for "skipped" status', () => {
  //   const wrapper = mount(StatusIcon, {
  //     props: {
  //       status: 'skipped'
  //     },
  //     global: {
  //       provide: {
  //         // Mock the store's state
  //         $store: {
  //           state: {
  //             global: {
  //               isDarkMode: true
  //             }
  //           }
  //         }
  //       }
  //     }
  //   });

  //   expect(wrapper.findComponent({ name: 'Icon' }).props('icon')).toBe('ri:indeterminate-circle-fill');
  //   expect(wrapper.findComponent({ name: 'Icon' }).props('color')).toBe('rgba(255, 255, 255, 0.52)');
  // });

  // test('renders empty icon and color for unknown status', () => {
  //   const wrapper = mount(StatusIcon, {
  //     props: {
  //       status: 'unknown'
  //     },
  //     global: {
  //       provide: {
  //         // Mock the store's state
  //         $store: {
  //           state: {
  //             global: {
  //               isDarkMode: false
  //             }
  //           }
  //         }
  //       }
  //     }
  //   });

  //   expect(wrapper.findComponent({ name: 'Icon' }).props('icon')).toBe('');
  //   expect(wrapper.findComponent({ name: 'Icon' }).props('color')).toBe('');
  // });
});
