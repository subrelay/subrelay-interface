const MAX_RETRY = 10;
const CONNECTED_ACCOUNT = 'polkadot-js-connected';

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
          reject('Unsupported extension.');
        }
      }

      if (++counter === MAX_RETRY) {
        clearInterval(interval);
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
    loading: null,
  }),

  mutations: {
    setLoading: (state, isLoading) => (state.loading = isLoading),

    setSigner: (state, signer) => (state.signer = signer),

    setAccounts: (state, accounts) => (state.accounts = accounts),

    setSelected: (state, selected) => {
      state.selected = selected;

      if (selected) {
        localStorage.setItem(CONNECTED_ACCOUNT, JSON.stringify(selected));
      } else {
        localStorage.removeItem(CONNECTED_ACCOUNT);
      }
    },
  },

  actions: {
    async loadAccounts({ commit }) {
      commit('setLoading', true);
      try {
        const extension = await getInjectedExtension();
        const result = await extension.enable();
        const accounts = await result.accounts.get();

        commit('setAccounts', accounts);
        commit('setSigner', result.signer);

        const connectedAccount = localStorage.getItem(CONNECTED_ACCOUNT);

        if (connectedAccount) {
          const savedAccExisted = accounts.find(
            (account) =>
              account.address === JSON.parse(connectedAccount).address
          );

          if (savedAccExisted) {
            commit('setSelected', JSON.parse(connectedAccount));
          } else {
            commit('setSelected', null);
          }
        }
      } catch (e) {
        console.error('e', e);
      } finally {
        commit('setLoading', false);
      }
    },
  },
};
