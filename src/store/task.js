import API from '@/api';
import { useShowError } from '@/composables';

export default {
  namespaced: true,

  state: () => ({
    operators: [],
    properties: [],
    customMsgKeys: [],
    runningTest: {},
    tested: {},
    testResult: {},
    loading: { getOperators: false, getFields: false },
  }),

  mutations: {
    getOperators: (state, operators) => {
      state.operators = operators;
    },

    getFields: (state, { filterFields, custtomMsgFields }) => {
      state.properties = filterFields;
      state.customMsgKeys = custtomMsgFields;
    },

    setLoading: (state, data) => {
      state.loading = { ...state.loading, ...data };
    },

    setRunningTest: (state, data) => {
      state.runningTest = { ...state.runningTest, ...data };
    },

    setTested: (state, data) => {
      state.tested = { ...state.tested, ...data };
    },

    setTestResult: (state, data) => {
      state.testResult = { ...state.tested, ...data };
    },

    reset: (state) => {
      state.runningTest = {};
      state.testResult = {};
      state.tested = {};
    },
  },

  actions: {
    async getOperators({ commit }) {
      commit('setLoading', { getOperators: true });
      try {
        const operators = await API.getOperators();
        commit('getOperators', operators);
      } catch (error) {
        commit('getOperators', []);
        console.error(error);
      } finally {
        commit('setLoading', { getOperators: false });
      }
    },

    async getFields({ commit }, eventId) {
      commit('setLoading', { getFields: true });
      try {
        const [filterFields, custtomMsgFields] = await Promise.all([
          API.getFilterFields(eventId),
          API.getCustomMsgFields(eventId),
        ]);
        commit('getFields', { filterFields, custtomMsgFields });
      } catch (error) {
        commit('getFields', { filterFields: [], custtomMsgFields: [] });
        console.error(error);
      } finally {
        commit('setLoading', { getFields: false });
      }
    },

    async runTask({ commit, rootState }, body) {
      const { type } = body;

      commit('setRunningTest', { [type]: true });

      try {
        const { data } = await API.runTask({
          account: rootState.account.selected,
          signer: rootState.account.signer,
          body,
        });
        commit('setTestResult', { [type]: data });
        commit('setTested', { [type]: true });
      } catch (e) {
        useShowError(e);
      } finally {
        commit('setRunningTest', { [type]: false });
      }
    },
  },
};
