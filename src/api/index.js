import axios from 'axios';
import { stringToHex } from '@polkadot/util';

const instance = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
});

const EXPIRED_TIME = 82800000; // 23 hours in ms

export const getSavedAuthToken = (address) => {
  const json = localStorage.getItem(address);

  if (json) {
    const { token, generatedAt } = JSON.parse(json);
    const now = Date.now();

    if (now < generatedAt + EXPIRED_TIME) {
      return token;
    }

    localStorage.removeItem(address);
  }

  return null;
};

const saveAuthToken = (address, token, generatedAt) => {
  const json = JSON.stringify({ token, generatedAt });

  localStorage.setItem(address, json);
};

export const generateGetToken = async ({ account, signer }) => {
  const savedToken = getSavedAuthToken(account.address);

  if (savedToken) {
    return savedToken;
  }

  const timestamp = Date.now();
  const data = {
    endpoint: '/*',
    method: 'GET',
    body: {},
    timestamp,
  };

  const message = JSON.stringify(data);

  const { signature } = await signer.signRaw({
    address: account.address,
    data: stringToHex(message),
    type: 'bytes',
  });

  const token = window.btoa(
    JSON.stringify({ address: account.address, timestamp, signature })
  );

  saveAuthToken(account.address, token, timestamp);

  return token;
};

const generateToken = async ({ account, signer, endpoint, method, body }) => {
  const timestamp = Date.now();
  const data = {
    endpoint,
    method: method.toUpperCase(),
    body: body || {},
    timestamp,
  };

  const message = JSON.stringify(data);

  const { signature } = await signer.signRaw({
    address: account.address,
    data: stringToHex(message),
    type: 'bytes',
  });

  return window.btoa(
    JSON.stringify({ address: account.address, timestamp, signature })
  );
};

const request = async ({ account, signer, endpoint, method, body }) => {
  if (method === 'get') {
    const getToken = await generateGetToken({ account, signer });

    return instance[method](endpoint, {
      headers: {
        Authorization: getToken,
      },
    });
  }

  // User need to sign for write actions such as delete, post, put, patch ..
  const token = await generateToken({
    account,
    signer,
    endpoint,
    method,
    body,
  });

  if (method === 'delete') {
    return instance[method](endpoint, {
      headers: { Authorization: token },
    });
  }

  return instance[method](endpoint, body, {
    headers: { Authorization: token },
  });
};

const buildQueryStr = (params) => {
  return '?' + new URLSearchParams(params).toString();
};

export default {
  async getChains() {
    const response = await instance.get('/chains');

    return response.data;
  },

  async getEvents(chainId) {
    const response = await instance.get(`/chains/${chainId}/events`);

    return response.data;
  },

  async getEvent(chainId, eventId) {
    const response = await instance.get(`/chains/${chainId}/events/${eventId}`);

    return response.data;
  },

  async getOperators() {
    const response = await instance.get(`/tasks/operators`);

    return response.data;
  },

  async runTask({ account, signer, body }) {
    return request({
      account,
      signer,
      method: 'post',
      endpoint: '/tasks/run',
      body,
    });
  },

  async getWorkflows({ account, signer, params }) {
    return request({
      account,
      signer,
      method: 'get',
      endpoint: '/workflows' + buildQueryStr(params),
    });
  },

  async getWorkflow({ account, signer, id }) {
    return request({
      account,
      signer,
      method: 'get',
      endpoint: `/workflows/${id}`,
    });
  },

  async createWorkflow({ account, signer, body }) {
    return request({
      account,
      signer,
      method: 'post',
      endpoint: '/workflows',
      body,
    });
  },

  async editWorkflow({ account, signer, id, body }) {
    return request({
      account,
      signer,
      method: 'patch',
      endpoint: `/workflows/${id}`,
      body,
    });
  },

  async deleteWorkflow({ account, signer, id }) {
    return request({
      account,
      signer,
      method: 'delete',
      endpoint: `/workflows/${id}`,
    });
  },

  async getLogs({ account, signer }) {
    return request({
      account,
      signer,
      method: 'get',
      endpoint: '/workflow-logs',
    });
  },
};
