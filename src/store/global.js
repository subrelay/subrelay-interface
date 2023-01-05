export default {
  namespaced: true,

  state: () => ({
    isDarkMode: false,
    isSiderCollapsed: false,

    isAuthenticating: null,

    // Profile page
    profileInitials: 'TC',
    profileUsername: 'anhthichieu',
    profileEmail: 'foo@gmail.com',
  }),

  mutations: {
    setDarkMode(state, isDarkMode) {
      state.isDarkMode = isDarkMode;
    },

    setAuthenticating(state, isAuthenticating) {
      state.isAuthenticating = isAuthenticating;
    },

    toggleSider: (state, isCollapsed) => (state.isSiderCollapsed = isCollapsed),
  },

  actions: {},
};
