import { pickBy, isEmpty } from 'lodash';
import { useShowError } from '@/composables';
import Api from '@/api';

export default {
  namespaced: true,

  state: () => ({
    workflow: {},
    workflows: [],
    itemCount: {},
    query: {},
    loading: {},
  }),

  mutations: {
    getWorkflows: (state, workflows) => {
      state.workflows = workflows;
    },

    getWorkflow: (state, workflow) => {
      state.workflow = workflow;
    },

    saveQuery: (state, data) => (state.query = { ...state.query, ...data }),

    getItemCount: (state, data) => (state.itemCount = { ...state.itemCount, ...data }),

    setLoading: (state, data) => {
      state.loading = { ...state.loading, ...data };
    },

    reset: (state) => {
      state.workflow = {};
      state.workflows = [];
      state.itemCount = {};
      state.query = {};
    },
  },

  actions: {
    async getWorkflows({ commit, state, rootState }, { showLoading = true } = {}) {
      if (!isEmpty(rootState.account.selected)) {
        if (showLoading) commit('setLoading', { workflows: true });

        try {
          const {
            data: { workflows, total },
          } = await Api.getWorkflows({
            account: rootState.account.selected,
            signer: rootState.account.signer,
            params: pickBy(state.query),
          });
          commit('getWorkflows', workflows);
          commit('getItemCount', { workflows: total });
        } catch (error) {
          commit('getWorkflows', []);
          console.error(error);
        } finally {
          commit('setLoading', { workflows: false });
        }
      }
    },

    async getWorkflow({ commit, rootState }, { showLoading = true, id } = {}) {
      if (rootState) {
        if (showLoading) commit('setLoading', { workflow: true });
        try {
          const { data: workflow } = await Api.getWorkflow({
            account: rootState.account.selected,
            signer: rootState.account.signer,
            id,
          });
          commit('getWorkflow', workflow);
        } catch (e) {
          const displayMsg = e.response?.data.message || e.message;
          useShowError(e);
          commit('getWorkflow', displayMsg);
        } finally {
          commit('setLoading', { workflow: false });
        }
      }
    },
  },
};
