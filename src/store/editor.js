export default {
  namespaced: true,

  state: () => ({
    step: null,
    expand: { trigger: '1', action: '1' },
    isTestActionDisabled: true,
    emailConfig: {}, // for preview in test
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

    reset: (state) => {
      state.step = null;
      state.expand = { trigger: '1', action: '1' };
      state.isTestActionDisabled = true;
    },

    setEmailConfig: (state, config) => {
      state.emailConfig = { ...state.emailConfig, ...config };
    },
  },

  actions: {},
};
