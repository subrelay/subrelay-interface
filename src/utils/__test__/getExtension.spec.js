import getExtension from '@/utils/getExtension';
import { afterEach, vi } from 'vitest';

window.injectedWeb3 = {
  'polkadot-js': 'Mocked Polkadot Extension',
};

describe('Test getExtension', () => {
  afterEach(() => {
    vi.clearAllTimers();
    delete window.injectedWeb3;
  }),

  it('should resolve with the polkadot-js extension when it is available', async () => {
    const extension = await getExtension();
    expect(extension).toBe('Mocked Polkadot Extension');
  });

  it('should reject with an error when an unsupported extension is detected', async () => {
    window.injectedWeb3 = {};
    await expect(getExtension()).rejects.toThrow('Unsupported extension.');
  });

  it('should reject with an error when the timeout is reached', async () => {
    window.injectedWeb3 = null;
    await expect(getExtension()).rejects.toThrow('Timeout.');
  }, 60000);
});
