import axios from 'axios';
import Api from '@/api';
import { pickBy } from 'lodash';

export default {
  namespaced: true,

  state: () => ({
    workflows: [],
    itemCount: null,
    workflow: {},
    query: null,
    loading: null,
  }),

  mutations: {
    getWorkflows: (state, workflows) => (state.workflows = workflows),
    getItemCount: (state, itemCount) => (state.itemCount = itemCount),
    getWorkflow: (state, workflow) => (state.workflow = workflow),
    saveQuery: (state, query) => (state.query = query),
    setLoading: (state, isLoading) => (state.loading = isLoading),
  },

  actions: {
    async getWorkflows({ commit, state, rootState }) {
      if (rootState.account.selected) {
        commit('setLoading', true);
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
          console.log('error', error);
        } finally {
          commit('setLoading', false);
        }
      }
    },

    async getWorkflow({ commit, rootState }, workflowId) {
      if (rootState) {
        commit('setLoading', true);
        try {
          const { data: { workflow } } = await Api.getWorkflow({
            account: rootState.account.selected,
            signer: rootState.account.signer,
            id: workflowId,
          });
  
          commit('getWorkflow', workflow);
        } catch (error) {
          commit('getWorkflow', {});
          console.log('error', error);
        } finally {
          commit('setLoading', false);
        }
      }
    },

    async postWorkflow({ commit, rootState, dispatch }, data) {
      commit('setLoading', true);
      try {
        await Api.createWorkflow({
          account: rootState.account.selected,
          signer: rootState.account.signer,
          body: data,
        });

        dispatch('getWorkflows');
      } catch (e) {
        console.log(e);
      } finally {
        commit('setLoading', false);
      }
    },
  },
};
