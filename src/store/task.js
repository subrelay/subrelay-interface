import Api from '@/api';

export default {
  namespaced: true,

  state: () => ({
    operators: [],
    loading: null,
    runningTest: false,
    tested: false,
    testResult: {},
  }),

  mutations: {
    getOperators: (state, operators) => (state.operators = operators),
    setLoading: (state, isLoading) => (state.loading = isLoading),
    setRunningTest: (state, isRunningTest) => (state.runningTest = isRunningTest),
    setTested: (state, isTested) => (state.tested = isTested),
    setTestResult: (state, result) => (state.testResult = result),
  },

  actions: {
    async getOperators({ commit }) {
      commit('setLoading', true);
      try {
        const operators = await Api.getOperators();
        commit('getOperators', operators);
      } catch (error) {
        commit('getOperators', []);
        console.log('error', error);
      } finally {
        commit('setLoading', false);
      }
    },

    async runTask({ commit, rootState }, body) {
      commit('setRunningTest', true);
      try {
        const { data } = await Api.runTask({
          account: rootState.account.selected,
          signer: rootState.account.signer,
          body,
        });
        commit('setTestResult', data);
      } catch (e) {
        console.log(e);
      } finally {
        commit('setRunningTest', false);
        commit('setTested', true);
      }
    }
  },
};
