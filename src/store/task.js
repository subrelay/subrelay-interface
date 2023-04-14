import API from '@/api';
import { useShowError } from '@/composables';

export default {
  namespaced: true,

  state: () => ({
    operators: [],
    properties: [],
    filterFields: [],
    runningTest: {},
    tested: {},
    testResult: {},
    loading: { getOperators: false, getFields: false },
  }),

  mutations: {
    getOperators: (state, operators) => {
      state.operators = operators;
    },

    getEventFields: (state, fields) => {
      state.properties = fields;
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

    async getEventFields({ commit }, eventId) {
      commit('setLoading', { getFields: true });
      try {
        const fields = await API.getFields(eventId);
        commit('getEventFields', fields);
      } catch (error) {
        commit('getEventFields', []);
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
