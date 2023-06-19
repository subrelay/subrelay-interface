import Api, { getSavedAuthToken } from '@/api';
import getInjectedExtension from '@/utils/getExtension';
import isEmpty from 'lodash/isEmpty';

const CONNECTED_ACCOUNT = 'polkadot-js-connected';

export default {
  namespaced: true,

  state: () => ({
    accounts: [],
    signer: null,
    selected: {},
    loading: { loadAccounts: null, loadUserInfo: null },
    userInfo: { integration: {} },
  }),

  mutations: {
    setLoading: (state, data) => {
      state.loading = { ...state.loading, ...data };
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
      commit('setLoading', { loadAccounts: true });
      try {
        const connectedAccount = localStorage.getItem(CONNECTED_ACCOUNT);

        const extension = await getInjectedExtension();
        const result = await extension.enable();
        const accounts = await result.accounts.get();
        const { signer } = result;

        commit('setAccounts', accounts);
        commit('setSigner', signer);

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
            dispatch('getUserInfo', { account: connected });
          } else {
            commit('setSelected', null);
          }
        }
      } catch (e) {
        console.error('e', e);
      } finally {
        commit('setLoading', { loadAccounts: false });
      }
    },

    async getUserInfo({ state, commit }, { account = state.selected, showLoading = true } = {}) {
      if (isEmpty(account)) return;

      try {
        if (showLoading) commit('setLoading', { loadUserInfo: true });
        const { signer } = state;
        const { data: user } = await Api.getUserInfo({ account, signer });
        if (user) commit('setUserInfo', user);
      } catch (e) {
        console.error(e);
      } finally {
        commit('setLoading', { loadUserInfo: false });
      }
    },

    async updateTelegramInfo({ state, commit, dispatch }, { showLoading = true, params = {} } = {}) {
      try {
        if (showLoading) commit('setLoading', { updateTelegramInfo: true });
        const { selected: account, signer } = state;
        await Api.updateTelegramInfo({ account, signer, params });
        dispatch('getUserInfo', { showLoading: false });
      } catch (e) {
        console.error(e);
      } finally {
        commit('setLoading', { updateTelegramInfo: false });
      }
    },

    async updateDiscordInfo({ state, commit, dispatch }, { showLoading = true, params = {} } = {}) {
      try {
        if (showLoading) commit('setLoading', { updateDiscordInfo: true });
        const { selected: account, signer } = state;
        await Api.updateDiscordInfo({ account, signer, params });
        dispatch('getUserInfo', { showLoading: false });
      } catch (e) {
        console.error(e);
      } finally {
        commit('setLoading', { updateDiscordInfo: false });
      }
    },
  },
};
