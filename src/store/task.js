import API from '@/api';
import { useShowError } from '@/composables';

export default {
  namespaced: true,

  state: () => ({
    operators: [],
    properties: [
      [
        {
          name: 'event.data.auction_index',
          description: 'auction index',
          type: 'number',
          data: 65000,
        },
        {
          name: 'event.data.lease_period',
          description: 'lease period',
          type: 'number',
          data: 81000,
        },
        {
          name: 'event.data.ending',
          description: 'ending',
          type: 'number',
          data: 6000,
        },
        {
          name: 'event.success',
          description: 'The status of the event',
          type: 'boolean',
          data: true,
        },
      ],
    ],
    customMsgKeys: [
      {
        name: 'workflow.id',
        description: ' The workflow ID',
        type: 'string',
        data: '01GY78YF34524NQ1PMNGP3MP5X',
      },
      {
        name: 'workflow.name',
        description: ' The workflow name',
        type: 'string',
        data: 'Workflow for event auctions.AuctionStarted',
      },
      {
        name: 'chain.uuid',
        description: ' The chain UUID',
        type: 'string',
        data: '01GY6NSJ4PYF5NFGRPB2HFH6KK',
      },
      {
        name: 'chain.name',
        description: ' The chain name',
        type: 'string',
        data: 'Kusama',
      },
      {
        name: 'event.id',
        description: 'The Id of the event',
        type: 'number',
        data: '01GY6NSJ5FMZCZGSYEMR5R0FRG',
      },
      {
        name: 'event.name',
        description: 'The name of the event',
        type: 'string',
        data: 'auctions.AuctionStarted',
      },
      {
        name: 'event.description',
        description: 'The description of the event',
        type: 'string',
        data: 'An auction started. Provides its index and the block number where it will begin to close and the first lease period of the quadruplet that is auctioned.',
      },
      {
        name: 'event.success',
        description: 'The status of the event',
        type: 'boolean',
        data: true,
      },
      {
        name: 'event.data.auction_index',
        description: 'auction index',
        type: 'number',
        data: 65000,
      },
      {
        name: 'event.data.lease_period',
        description: 'lease period',
        type: 'number',
        data: 81000,
      },
      {
        name: 'event.data.ending',
        description: 'ending',
        type: 'number',
        data: 6000,
      },
      {
        name: 'event.block.hash',
        description: 'The hash of the block',
        type: 'string',
        data: '0x2788b5b2cd89f2c8b9d3b1d563bc993684e7f5e92b21d844dd9e3168675bc8f6',
      },
      {
        name: 'event.time',
        description: 'The time that the event happened',
        type: 'string',
        data: '2023-04-17T09:32:44.516Z',
      },
    ],

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
