import API from '@/api';
import { useShowError } from '@/composables';

export default {
  namespaced: true,

  state: () => ({
    step: null, // trigger - action stepper
    expand: { trigger: '1', action: '2' },
    isTestActionDisabled: true,
    operators: [],
    properties: [
      {
        name: 'event.data.auction_index',
        description: 'Auction index',
        type: 'number',
        data: 98000,
        display: 'Auction index',
      },
      {
        name: 'event.data.lease_period',
        description: 'Lease period',
        type: 'number',
        data: 41000,
        display: 'Lease period',
      },
      {
        name: 'event.data.ending',
        description: 'Ending',
        type: 'number',
        data: 84000,
        display: 'Ending',
      },
      {
        name: 'event.success',
        description: 'The status of the event',
        type: 'boolean',
        data: true,
        display: 'Status',
      },
    ],
    customMsgKeys: [
      {
        name: 'workflow.id',
        description: 'The workflow ID',
        type: 'string',
        data: '01H02FQVFC6EJ61M1N6WS4ZH11',
        display: 'Workflow ID',
      },
      {
        name: 'workflow.name',
        description: 'The workflow name',
        type: 'string',
        data: 'Workflow for event auctions.AuctionStarted',
        display: 'Workflow Name',
      },
      {
        name: 'chain.name',
        description: 'The chain name',
        type: 'string',
        data: 'Polkadot',
        display: 'Chain Name',
      },
      {
        name: 'event.id',
        description: 'The Id of the event',
        type: 'number',
        data: '01GYAC2FSW6YSQVBHJ86Z8VHX5',
        display: 'Event ID',
      },
      {
        name: 'event.name',
        description: 'The name of the event',
        type: 'string',
        data: 'auctions.AuctionStarted',
        display: 'Event Name',
      },
      {
        name: 'event.description',
        description: 'The description of the event',
        type: 'string',
        data: 'An auction started. Provides its index and the block number where it will begin to close and the first lease period of the quadruplet that is auctioned.',
        display: 'Event Description',
      },
      {
        name: 'event.success',
        description: 'The status of the event',
        type: 'boolean',
        data: true,
        display: 'Status',
      },
      {
        name: 'event.block.hash',
        description: 'The hash of the block',
        type: 'string',
        data: '0xa3d1152c7e9ed6539426337021da41a8986530ad6f0ca44d1a207ad276c1538f',
        display: 'Block Hash',
      },
      {
        name: 'event.time',
        description: 'The time that the event happened',
        type: 'string',
        data: '2023-05-10T09:26:39.340Z',
        display: 'Time',
      },
      {
        name: 'event.data.auction_index',
        description: 'Auction index',
        type: 'number',
        data: 88000,
        display: 'Auction index',
      },
      {
        name: 'event.data.lease_period',
        description: 'Lease period',
        type: 'number',
        data: 53000,
        display: 'Lease period',
      },
      {
        name: 'event.data.ending',
        description: 'Ending',
        type: 'number',
        data: 77000,
        display: 'Ending',
      },
    ],
    loading: { getOperators: false, getFields: false },
    runningTest: {},
    tested: {},
    testResult: {},
    error: { subjectTemplate: false, messageTemplate: false, bodyTemplate: false },
  }),

  mutations: {
    setStep(state, step) {
      state.step = step;
    },

    setExpand(state, data) {
      state.expand = { ...state.expand, ...data };
    },

    disableTestAction(state, isDisabled) {
      state.isTestActionDisabled = isDisabled;
    },

    reset: (state) => {
      state.step = null;
      state.expand = { trigger: '1', action: '1' };
      state.isTestActionDisabled = true;
      state.runningTest = {};
      state.testResult = {};
      state.tested = {};
      state.error = { subjectTemplate: false, messageTemplate: false, bodyTemplate: false };
    },

    resetAction: (state) => {
      state.runningTest = {};
      state.testResult = {};
      state.tested = {};
      state.error = { subjectTemplate: false, messageTemplate: false, bodyTemplate: false };
    },

    setLoading: (state, data) => {
      state.loading = { ...state.loading, ...data };
    },

    getOperators: (state, operators) => {
      state.operators = operators;
    },

    getFields: (state, { filterFields, custtomMsgFields }) => {
      state.properties = filterFields;
      state.customMsgKeys = custtomMsgFields;
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

    setError: (state, data) => {
      // To check error for custom message inputs
      state.error = { ...state.error, ...data };
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
        useShowError(error);
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
