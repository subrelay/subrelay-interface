import axios from 'axios';

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

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
