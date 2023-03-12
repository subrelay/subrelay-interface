import { pickBy, isEmpty } from 'lodash';
import { useShowError } from '@/composables';
import Api from '@/api';

export default {
  namespaced: true,

  state: () => ({
    workflow: {},
    workflows: [],
    itemCount: null,
    query: null,
    loading: null,
  }),

  mutations: {
    getWorkflows: (state, workflows) => {
      state.workflows = workflows;
    },
    getItemCount: (state, itemCount) => {
      state.itemCount = itemCount;
    },
    getWorkflow: (state, workflow) => {
      state.workflow = workflow;
    },
    saveQuery: (state, query) => {
      state.query = query;
    },
    setLoading: (state, isLoading) => {
      state.loading = isLoading;
    },
    reset: (state) => {
      state.workflow = {};
      state.workflows = [];
      state.itemCount = null;
      state.query = null;
    },
  },

  actions: {
    async getWorkflows({ commit, state, rootState }, { showLoading = true } = {}) {
      if (!isEmpty(rootState.account.selected)) {
        if (showLoading) commit('setLoading', true);

        try {
          const {
            data: { workflows, total },
          } = await Api.getWorkflows({
            account: rootState.account.selected,
            signer: rootState.account.signer,
            params: pickBy(state.query),
          });
          commit('getWorkflows', workflows);
          commit('getItemCount', total);
        } catch (error) {
          commit('getWorkflows', []);
          console.error(error);
        } finally {
          commit('setLoading', false);
        }
      }
    },

    async getWorkflow({ commit, rootState }, { showLoading = true, id } = {}) {
      if (rootState) {
        if (showLoading) commit('setLoading', true);
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
          commit('setLoading', false);
        }
      }
    },
  },
};
