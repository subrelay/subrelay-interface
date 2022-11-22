import axios from 'axios';

export default {
  namespaced: true,

  state: () => ({
    queryParams: null,

    workflows: [],

    loading: null,
  }),

  mutations: {
    saveQueryParams: (state, queryParams) => (state.queryParams = queryParams),
    getWorkflows: (state, workflows) => (state.workflows = workflows),
    setLoading: (state, isLoading) => (state.loading = isLoading),
  },

  actions: {
    async getWorkflows({ commit }) {
      commit('setLoading', true);
      try {
        // const workflows = await API.Chain.getWorkflows();

        setTimeout(async () => {
          const { data: workflows } = await axios({
            url: 'mockData/workflows.json',
            baseURL: 'http://127.0.0.1:5173',
          });

          commit('getWorkflows', workflows);
          commit('setLoading', false);
        }, 1000);
      } catch (error) {
        commit('getWorkflows', []);
        console.log('error', error);
      } finally {
        // commit('setLoading', false);
      }
    },

    async postWorkflow({ commit, dispatch }, data) {
      commit('setLoading', true);
      try {
        // const response = await API.Chain.postWorkflow(data);

        await axios({
          method: 'post',
          url: 'mockData/workflow.json',
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
