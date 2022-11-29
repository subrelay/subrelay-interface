import axios from 'axios';

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

axios.interceptors.request.use(async (config) => {
  const token =
    'eyJhZGRyZXNzIjoiMUVKNk51V2pRSk5pd0hUZlJ5VVA4aXZ4OXMyOW4xUzFjcmJ6V2tQRzRwOFFGY0giLCJ0aW1lc3RhbXAiOjE2Njk3MDIyNjU0MzgsInNpZ25hdHVyZSI6IjEyMyJ9';
  config.headers = {
    ...config.headers,
    Authorization: `${token}`,
  };
  return config;
});

const getResponseBody = (res) => res.data;

const requester = {
  get: (url, params, config = {}) =>
    axios.get(url, { params, ...config }).then(getResponseBody),

  getFull: (url, params, config = {}) =>
    axios.get(url, { params, ...config }).then((res) => res),

  post: (url, data, config = {}) =>
    axios.post(url, data, config).then(getResponseBody),

  patch: (url, data) => axios.patch(url, data).then(getResponseBody),

  put: (url, data) => axios.put(url, data).then(getResponseBody),

  delete: (url) => axios.delete(url).then(getResponseBody),
};

export default requester;
