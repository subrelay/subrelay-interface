export default {
  namespaced: true,

  state: () => ({
    step: null,
    expand: { trigger: '1', action: '1' },
    isTestActionDisabled: true,
  }),

  mutations: {
    setStep(state, step) {
      state.step = step;
    },

    setExpand(state, data) {
      state.expand = { ...state.expand, ...data };
    },

    disableTestAction(state, isDisabled) {
      state.isTestActionDisabled = isDisabled;
    },
  },

  actions: {},
};
