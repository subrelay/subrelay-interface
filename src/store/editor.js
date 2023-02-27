export default {
  namespaced: true,

  state: () => ({
    step: null,
  }),

  mutations: {
    setStep(state, step) {
      state.step = step;
    },
  },

  actions: {},
};
