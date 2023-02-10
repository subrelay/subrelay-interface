import { pickBy } from 'lodash';
import axios from 'axios';
import Api from '@/api';

export default {
  namespaced: true,

  state: () => ({
    query: null,
    logs: [],
    loading: null,
    itemCount: null,
  }),

  mutations: {
    saveQuery: (state, query) => (state.query = query),
    getLogs: (state, logs) => (state.logs = logs),
    setLoading: (state, isLoading) => (state.loading = isLoading),
    getItemCount: (state, itemCount) => (state.itemCount = itemCount),
  },

  actions: {
    async getLogs({ commit, state, rootState }) {
      if (rootState.account.selected) {
        commit('setLoading', true);
        try {
          const {
            data: { workflowLogs, total },
          } = await Api.getLogs({
            account: rootState.account.selected,
            signer: rootState.account.signer,
            params: pickBy(state.query),
          });

          commit('getLogs', workflowLogs);
          commit('getItemCount', total);
        } catch (error) {
          commit('getLogs', []);
          console.error(error);
        } finally {
          commit('setLoading', false);
        }
      }
    },
  },
};
