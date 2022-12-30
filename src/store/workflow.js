import axios from 'axios';
// import API from '@/api';
import { pickBy } from 'lodash';

export default {
  namespaced: true,

  state: () => ({
    workflows: [],
    workflow: {},
    query: null,
    loading: null,
  }),

  mutations: {
    getWorkflows: (state, workflows) => (state.workflows = workflows),
    getWorkflow: (state, workflow) => (state.workflow = workflow),
    saveQuery: (state, query) => (state.query = query),
    setLoading: (state, isLoading) => (state.loading = isLoading),
  },

  actions: {
    async getWorkflows({ commit, state }) {
      commit('setLoading', true);
      try {
        // const workflows = await API.Workflow.getWorkflows(state.query);
        const { data: workflows } = await axios({
          url: 'mockData/workflow/workflows.json',
          baseURL: 'http://127.0.0.1:5173',
          params: new URLSearchParams({ ...pickBy(state.query) }),
        });
        commit('getWorkflows', workflows);
      } catch (error) {
        commit('getWorkflows', []);
        console.log('error', error);
      } finally {
        commit('setLoading', false);
      }
    },

    async getWorkflow({ commit }, workflowId) {
      commit('setLoading', true);
      try {
        // const workflow = await API.Workflow.getWorkflow(workflowId);

        const { data: workflow } = await axios({
          url: 'mockData/workflow/workflow.json',
          baseURL: 'http://127.0.0.1:5173',
        });

        commit('getWorkflow', workflow);
      } catch (error) {
        commit('getWorkflow', {});
        console.log('error', error);
      } finally {
        commit('setLoading', false);
      }
    },

    async postWorkflow({ commit, dispatch }, data) {
      commit('setLoading', true);
      try {
        // const response = await API.Workflow.postWorkflow(data);
        await axios({
          method: 'post',
          url: 'mockData/workflow/workflow.json',
          baseURL: 'http://127.0.0.1:5173',
          data,
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
