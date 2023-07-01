import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import {
  generateGetToken,
  generateToken,
  getSavedAuthToken,
  saveAuthToken,
} from './index';
import { afterEach, expect, vi } from 'vitest';

const mock = new MockAdapter(axios);
const account = { address: 'test-address' };
const signer = { signRaw: vi.fn() };

mock.onGet('*/test-endpoint').reply(200);

afterEach(() => {
  mock.reset();
  localStorage.removeItem('test-address');
});

describe('API Requests', () => {
  test('getSavedAuthToken should return saved token if not expired', () => {
    const address = 'test-address';
    const token = 'test-token';
    const generatedAt = Date.now() - 1000; // Less than EXPIRED_TIME

    const json = JSON.stringify({ token, generatedAt });
    localStorage.setItem(address, json);

    const savedToken = getSavedAuthToken(address);

    expect(savedToken).toBe(token);
  });

  test('getSavedAuthToken should return null if token expired', () => {
    const address = 'test-address';
    const token = 'test-token';
    const generatedAt = Date.now() - 82800000; // EXPIRED_TIME

    const json = JSON.stringify({ token, generatedAt });
    localStorage.setItem(address, json);

    const savedToken = getSavedAuthToken(address);

    expect(savedToken).toBeNull();
  });

  test('getSavedAuthToken should return null if token does not exist', () => {
    const address = 'test-address';

    const savedToken = getSavedAuthToken(address);

    expect(savedToken).toBeNull();
  });

  test('saveAuthToken should save the token to localStorage', () => {
    const address = 'test-address';
    const token = 'test-token';
    const generatedAt = Date.now();

    saveAuthToken(address, token, generatedAt);

    const json = localStorage.getItem(address);
    const savedData = JSON.parse(json);

    expect(savedData.token).toBe(token);
    expect(savedData.generatedAt).toBe(generatedAt);
  });

  test('generateGetToken should return saved token if not expired', async () => {
    const address = 'test-address';
    const savedToken = 'saved-token';
    const signerResponse = { signature: 'test-signature' };
    const generatedAt = Date.now();

    saveAuthToken(address, savedToken, generatedAt);
    signer.signRaw.mockResolvedValueOnce(signerResponse);

    const token = await generateGetToken({ account, signer });

    expect(token).toBe(savedToken);
    expect(signer.signRaw).not.toHaveBeenCalled();
  });

  test('generateGetToken should generate and save a new token if expired', async () => {
    const signerResponse = { signature: 'test-signature' };

    signer.signRaw.mockResolvedValueOnce(signerResponse);

    const token = await generateGetToken({ account, signer });

    const { address, signature } = JSON.parse(window.atob(token));

    expect(address).toBe('test-address');
    expect(signature).toBe(signerResponse.signature);

    expect(token).not.toBeNull();
    expect(signer.signRaw).toHaveBeenCalled();
  });

  test('generateToken should generate the token', async () => {
    const signerResponse = { signature: 'test-signature' };
    const endpoint = '/test-endpoint';
    const method = 'post';
    const body = { key: 'value' };

    signer.signRaw.mockResolvedValueOnce(signerResponse);

    const token = await generateToken({ account, signer, endpoint, method, body });

    expect(signer.signRaw).toHaveBeenCalledWith({
      address: account.address,
      data: expect.any(String),
      type: 'bytes',
    });
    expect(token).toEqual(expect.any(String));
  });
});