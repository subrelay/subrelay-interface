import { pickBy } from 'lodash';
import Api from '@/api';

export default {
  namespaced: true,

  state: () => ({
    query: null,
    logs: [],
    loading: null,
  }),

  mutations: {
    saveQuery: (state, query) => (state.query = query),
    getLogs: (state, logs) => (state.logs = logs),
    setLoading: (state, isLoading) => (state.loading = isLoading),
  },

  actions: {
    async getLogs({ commit, state, rootState }) {
      if (rootState.account.selected) {
        commit('setLoading', true);
        try {
          const { data: { workflowLogs } } = await Api.getLogs({
            account: rootState.account.selected,
            signer: rootState.account.signer,
            params: pickBy(state.query),
          });
          commit('getLogs', workflowLogs);
        } catch (error) {
          commit('getLogs', []);
          console.log('error', error);
        } finally {
          commit('setLoading', false);
        }
      }
    },
  },
};
