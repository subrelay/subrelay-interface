import axios from 'axios';

export default {
  namespaced: true,

  state: () => ({
    operators: {},
    loading: null,
  }),

  mutations: {
    getOperators: (state, operators) => (state.operators = operators),
    setLoading: (state, isLoading) => (state.loading = isLoading),
  },

  actions: {
    async getOperators({ commit }) {
      commit('setLoading', true);
      try {
        // const operators = await API.Chain.getOperators();
        const { data: operators } = await axios({
          url: 'mockData/operators.json',
          baseURL: 'http://127.0.0.1:5173',
        });
        commit('getOperators', operators);
      } catch (error) {
        commit('getOperators', null);
        console.log('error', error);
      } finally {
        setTimeout(() => {
          commit('setLoading', false);
        }, 1000);
      }
    },
  },
};
