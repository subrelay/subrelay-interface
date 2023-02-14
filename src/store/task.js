import Api from '@/api';
import { useShowMessage } from '@/composables';

export default {
  namespaced: true,

  state: () => ({
    operators: [],
    loading: null,
    runningTest: {},
    tested: {},
    testResult: {},
  }),

  mutations: {
    getOperators: (state, operators) => (state.operators = operators),
    setLoading: (state, isLoading) => (state.loading = isLoading),

    setRunningTest: (state, data) => (state.runningTest = { ...state.runningTest, ...data }),
    setTested: (state, data) => (state.tested = { ...state.tested, ...data }),
    setTestResult: (state, data) => (state.testResult = { ...state.tested, ...data }),
    reset: (state) => {
      state.runningTest = {};
      state.testResult = {};
      state.tested = {};
    },
  },

  actions: {
    async getOperators({ commit }) {
      commit('setLoading', true);
      try {
        const operators = await Api.getOperators();
        commit('getOperators', operators);
      } catch (error) {
        commit('getOperators', []);
        console.error(error);
      } finally {
        commit('setLoading', false);
      }
    },

    async runTask({ commit, rootState }, body) {
      const { type } = body;

      commit('setRunningTest', { [type]: true });

      try {
        const { data } = await Api.runTask({
          account: rootState.account.selected,
          signer: rootState.account.signer,
          body,
        });
        commit('setTestResult', { [type]: data });
        commit('setTested', { [type]: true });
      } catch (e) {
        console.error(e);
        useShowMessage('error', e.message);
      } finally {
        commit('setRunningTest', { [type]: false });
      }
    },
  },
};
