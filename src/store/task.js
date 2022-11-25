import API from '@/api';

export default {
  namespaced: true,

  state: () => ({
    operators: [],
    loading: null,
  }),

  mutations: {
    getOperators: (state, operators) => (state.operators = operators),
    setLoading: (state, isLoading) => (state.loading = isLoading),
  },

  actions: {
    async getOperators({ commit }) {
      try {
        const operators = await API.Task.getOperators();
        commit('getOperators', operators);
      } catch (error) {
        commit('getOperators', []);
        console.log('error', error);
      }
    },
  },
};
