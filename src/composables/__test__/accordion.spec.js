import { useAccordion } from '@/composables';
import { useStore } from 'vuex';

// Mock the useStore function from vuex
vi.mock('vuex', () => ({
  useStore: vi.fn(),
}));

describe('Test useAccordion', () => {
  let store; let task; let expandValue; let computedProps; let
    methods;

  beforeEach(() => {
    task = 'trigger';
    expandValue = '2';

    // Mock the useStore implementation
    useStore.mockReturnValue({
      state: { editor: { expand: { [task]: expandValue } } },
      commit: vi.fn(),
    });
    store = useStore();

    // Call the useAccordion function with the mock store
    [computedProps, methods] = useAccordion(task);
  });

  afterEach(() => vi.clearAllMocks());

  it('returns computed property and setExpand function', () => {
    expect(computedProps.expandedNames.value).toEqual(expandValue);
    expect(methods.setExpand).toBeInstanceOf(Function);
  });

  it('should set the expand value correctly when calling setExpand', () => {
    methods.setExpand(expandValue);

    // Assert that the commit function was called with the correct parameters
    expect(store.commit).toHaveBeenCalledWith('editor/setExpand', {
      [task]: expandValue,
    });
  });
});
