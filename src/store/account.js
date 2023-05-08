import { useShowError } from '@/composables';
import Api, { getSavedAuthToken } from '@/api';

const MAX_RETRY = 10;
const CONNECTED_ACCOUNT = 'polkadot-js-connected';

const getInjectedExtension = () => {
  let counter = 0;
  return new Promise((resolve, reject) => {
    // Retry until the injected extensions loaded or reach timeout.
    const interval = setInterval(() => {
      if (window.injectedWeb3) {
        clearInterval(interval);
        if (window.injectedWeb3['polkadot-js']) {
          resolve(window.injectedWeb3['polkadot-js']);
        } else {
          reject(new Error('Unsupported extension.'));
        }
      }

      counter += 1;
      if (counter === MAX_RETRY) {
        clearInterval(interval);
        useShowError('Error loading wallet. Please try again.');
        reject(new Error('Timeout.'));
      }
    }, 500);
  });
};

export default {
  namespaced: true,

  state: () => ({
    accounts: [],
    signer: null,
    selected: {},
    loading: null,
    userInfo: null,
  }),

  mutations: {
    setLoading: (state, isLoading) => {
      state.loading = isLoading;
    },

    setSigner: (state, signer) => {
      state.signer = signer;
    },

    setAccounts: (state, accounts) => {
      state.accounts = accounts;
    },

    setUserInfo: (state, info) => {
      state.userInfo = info;
    },

    setSelected: (state, selected) => {
      state.selected = selected;

      if (selected) {
        localStorage.setItem(CONNECTED_ACCOUNT, JSON.stringify(selected));
      } else {
        localStorage.removeItem(CONNECTED_ACCOUNT);
      }
    },
  },

  actions: {
    async loadAccounts({ commit, dispatch }) {
      commit('setLoading', true);
      try {
        const connectedAccount = localStorage.getItem(CONNECTED_ACCOUNT);

        const extension = await getInjectedExtension();
        const result = await extension.enable();
        const accounts = await result.accounts.get();

        commit('setAccounts', accounts);
        commit('setSigner', result.signer);

        if (connectedAccount) {
          const connected = JSON.parse(connectedAccount);
          const savedToken = getSavedAuthToken(connected.address);

          // Case: time expired 24hrs
          if (!savedToken) {
            commit('setSelected', null);
            return;
          }

          // Case: acc deleted from polkadot wallet
          const isAccountExisted = !!accounts.find(({ address }) => {
            const cond = address === connected.address;
            return cond;
          });

          if (isAccountExisted) {
            commit('setSelected', connected);
            dispatch('getUserInfo', connected);
          } else {
            commit('setSelected', null);
          }
        }
      } catch (e) {
        console.error('e', e);
      } finally {
        commit('setLoading', false);
      }
    },

    async getUserInfo({ state, commit }, account) {
      try {
        const { signer } = state;
        const { data: user } = await Api.getUserInfo({ account, signer });
        if (user) commit('setUserInfo', user);
      } catch (e) {
        console.error(e);
      }
    },
  },
};
