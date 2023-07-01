import { mount, config } from '@vue/test-utils';
import { vi } from 'vitest';
import EditableText from '../EditableText.vue';
import { globalComponents } from '../../test/setup';

config.global.components = globalComponents;

describe('EditableText', () => {
  it('renders the show area when not in edit mode', () => {
    const wrapper = mount(EditableText, {
      props: {
        value: 'Example Value',
      },
    });

    expect(wrapper.find('.show-area').exists()).toBe(true);
    expect(wrapper.find('.n-input').exists()).toBe(false);
  });

  it('renders the edit input when in edit mode', async () => {
    const wrapper = mount(EditableText, {
      props: {
        value: 'Example Value',
      },
    });

    await wrapper.trigger('click');
    await wrapper.vm.$nextTick();

    expect(wrapper.find('.show-area').exists()).toBe(false);
    expect(wrapper.find('.n-input').exists()).toBe(true);
  });

  it('emits the updated value when the input changes and blur event occurs', async () => {
    const onUpdateValue = vi.fn();
    const wrapper = mount(EditableText, {
      props: {
        value: 'Example Value',
        onUpdateValue,
      },
    });

    await wrapper.trigger('click');
    await wrapper.vm.$nextTick();

    const input = wrapper.find('input');
    await input.setValue('New Value');
    await input.trigger('blur');

    expect(onUpdateValue).toHaveBeenCalledWith('New Value');
    expect(wrapper.find('.show-area').exists()).toBe(true);
  });

  it('emits the updated value when the Enter key is pressed', async () => {
    const onUpdateValue = vi.fn();
    const wrapper = mount(EditableText, {
      props: {
        value: 'Example Value',
        onUpdateValue,
      },
    });

    await wrapper.trigger('click');
    await wrapper.vm.$nextTick();

    const input = wrapper.find('input');
    await input.setValue('New Value');
    await input.trigger('keyup.Enter');

    expect(onUpdateValue).toHaveBeenCalledWith('New Value');
    expect(wrapper.find('.show-area').exists()).toBe(true);
  });
});