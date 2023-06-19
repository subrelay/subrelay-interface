import { mount } from '@vue/test-utils';
import Logo from '../Logo.vue';

describe('Logo', () => {
  test('emits "click" event when clicked', async () => {
    const wrapper = mount(Logo);
    await wrapper.find('.logo').trigger('click');
    expect(wrapper.emitted('click')).toBeTruthy();
  });

  test('renders with the correct color style', () => {
    const color = '#ff0000';
    const wrapper = mount(Logo, {
      props: {
        color: color,
      },
    });
    expect(wrapper.find('.logo').element.style.color).toBe(color);
  });

  test('renders the text content correctly', () => {
    const wrapper = mount(Logo);
    expect(wrapper.find('.text').text()).toBe('Subrelay');
  });
});
