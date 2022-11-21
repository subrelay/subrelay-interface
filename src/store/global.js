export default {
  namespaced: true,

  state: () => ({
    walletAccount: {
      name: 'Foo',
      address: '22EUKZfNUV6JPZ1baLscJShX7djtDDZnkiFZwqF7Fk8X5oUp',
    },
    isDarkMode: false,
    queryParams: null,

    defaultQueryParams: {
      search: undefined,
      order: undefined,
      sort: undefined,
      chain_uuid: undefined,
      status: undefined,
      offset: 1,
      limit: 5,
    },

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

    setWalletAccount(state, account) {
      state.walletAccount = account;
    },

    setAuthenticating(state, isAuthenticating) {
      state.isAuthenticating = isAuthenticating;
    },
  },

  actions: {},
};
