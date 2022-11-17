export default {
  namespaced: true,

  state: () => ({
    queryParams: null,
  }),

  mutations: {
    saveQueryParams(state, queryParams) {
      state.queryParams = queryParams;
    },
  },

  actions: {},
};
