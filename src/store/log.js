import { pickBy, isEmpty } from 'lodash';
import Api from '@/api';

export default {
  namespaced: true,

  state: () => ({
    log: {},
    logs: [],
    loading: {},
    itemCount: {},
    query: {},
  }),

  mutations: {
    getLogs: (state, logs) => {
      state.logs = logs;
    },

    getLog: (state, log) => {
      state.log = log;
    },

    setLoading: (state, data) => {
      state.loading = { ...state.loading, ...data };
    },

    saveQuery: (state, data) => {
      state.query = { ...state.query, ...data };
    },

    getItemCount: (state, data) => {
      state.itemCount = { ...state.itemCount, ...data };
    },

    reset: (state) => {
      state.logs = [];
      state.log = [];
      state.query = {};
      state.itemCount = {};
    },
  },

  actions: {
    async getLogs({ commit, state, rootState }) {
      if (!isEmpty(rootState.account.selected)) {
        commit('setLoading', { logs: true });
        try {
          const {
            data: { workflowLogs, total },
          } = await Api.getLogs({
            account: rootState.account.selected,
            signer: rootState.account.signer,
            params: pickBy(state.query.logs),
          });

          commit('getLogs', workflowLogs);
          commit('getItemCount', { logs: total });
        } catch (error) {
          commit('getLogs', []);
          console.error(error);
        } finally {
          commit('setLoading', { logs: false });
        }
      }
    },

    async getLog({ commit, state, rootState }, workflowId) {
      if (!isEmpty(rootState.account.selected)) {
        commit('setLoading', { log: true });
        try {
          const {
            data: { workflowLogs, total },
          } = await Api.getLogs({
            account: rootState.account.selected,
            signer: rootState.account.signer,
            params: { ...pickBy(state.query.log), workflowId },
          });

          commit('getLog', workflowLogs);
          commit('getItemCount', { log: total });
        } catch (error) {
          commit('getLogs', []);
          console.error(error);
        } finally {
          commit('setLoading', { log: false });
        }
      }
    },
  },
};
