const MAX_RETRY = 10;

const getInjectedExtension = () => {
  let counter = 0;
  return new Promise((resolve, reject) => {
    // Retry until the injected extensions loaded or reach timeout.
    const interval = setInterval(() => {
      if (window.injectedWeb3) {
        clearInterval(interval);
        if (window.injectedWeb3['polkadot-js']) {
          resolve(window.injectedWeb3['polkadot-js']);
        } else {
          reject('Unsupported extension.')
        }
      }
  
      if (++counter === MAX_RETRY) {
        clearInterval(retryInterval);
        reject('Timeout.');
      }
    }, 500);
  });
};

export default {
  namespaced: true,

  state: () => ({
    accounts: [],
    signer: null,
    selected: null,
    loading: false,
  }),

  mutations: {
    setAccounts: (state, accounts) => {
      state.accounts = accounts;
      state.selected = accounts[0];
    },
    setSigner: (state, signer) => { state.signer = signer },
    setSelected: (state, address) => {
      const selected = state.accounts.find(account => account.address === address);
      if (selected) {
        state.selected = selected;
      }
    }
  },

  actions: {
    async loadAccounts({ commit }) {
      const extension = await getInjectedExtension();
      const result = await extension.enable();
      const accounts = await result.accounts.get();

      commit('setAccounts', accounts);
      commit('setSigner', result.signer);
    },
  },
};
