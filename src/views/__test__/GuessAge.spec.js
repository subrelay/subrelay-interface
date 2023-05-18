import { mount } from '@vue/test-utils';
import GuessAge from '@/views/GuessAge.vue';
// import { expect, test } from 'vitest';
const wrapper = mount(GuessAge, {
  props: { title: 'Guess User Age App' },
});

it('testing GuessAge component props', async () => {
  expect(wrapper.text()).toContain('Guess User Age App');
});

it('Test if data is a function', () => {
  expect(typeof GuessAge.data).toBe('function');
});

test('snapshot UI testing', () => {
  const wrapper = mount(GuessAge, {});
  expect(wrapper.text()).toMatchSnapshot();
});
