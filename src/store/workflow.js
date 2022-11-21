export default {
  namespaced: true,

  state: () => ({
    queryParams: null,

    workflows: [],

    workflow: {},
  }),

  mutations: {
    saveQueryParams(state, queryParams) {
      state.queryParams = queryParams;
    },

    getWorkflows: (state, workflows) => (state.workflows = workflows),
  },

  actions: {},
};
