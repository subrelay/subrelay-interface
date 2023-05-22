import { mount } from '@vue/test-utils';
import GuessAge from '@/views/GuessAge.vue';
import { setupServer } from 'msw/node';
import { rest } from 'msw';

export const restHandlers = [
  rest.get('https://api.agify.io/', (req, res, ctx) => res(ctx.status(200), ctx.json([{ age: 55, name: 'tope' }]))),
];
const server = setupServer(...restHandlers);
// Start server before all tests
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
//  Close server after all tests
afterAll(() => server.close());
// Reset handlers after each test `important for test isolation`
afterEach(() => server.resetHandlers());

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

test('has a button', () => {
  expect(wrapper.find('button').exists()).toBe(true);
});

test('Button clicked', async () => {
  const ac = await wrapper.get('button').trigger('click');
  expect(wrapper.vm.search).toEqual('');
});
