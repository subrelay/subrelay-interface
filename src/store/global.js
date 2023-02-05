export default {
  namespaced: true,

  state: () => ({
    isDarkMode: false,
    isSiderCollapsed: false,
    isAuthenticating: null,
  }),

  mutations: {
    setDarkMode(state, isDarkMode) {
      state.isDarkMode = isDarkMode;
      localStorage.setItem('viewMode', isDarkMode ? 'dark' : 'light');
    },

    setAuthenticating(state, isAuthenticating) {
      state.isAuthenticating = isAuthenticating;
    },

    toggleSider: (state, isCollapsed) => (state.isSiderCollapsed = isCollapsed),
  },

  actions: {},
};
