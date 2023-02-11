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

    toggleSider: (state, isCollapsed) => {
      state.isSiderCollapsed = isCollapsed;
      if (isCollapsed) {
        localStorage.setItem('isSiderCollapsed', true);
      } else {
        localStorage.removeItem('isSiderCollapsed');
      }
    },
  },

  actions: {
    loadSiderState({ commit }) {
      const loadSiderState = localStorage.getItem('isSiderCollapsed');
      commit('toggleSider', !!loadSiderState);
    },
  },
};
