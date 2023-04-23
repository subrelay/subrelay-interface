import API from '@/api';
import { useShowError } from '@/composables';

export default {
  namespaced: true,

  state: () => ({
    operators: [],
    properties: [
      {
        name: 'event.data.auction_index',
        description: 'auction index',
        type: 'number',
        data: 88000,
      },
      {
        name: 'event.data.lease_period',
        description: 'lease period',
        type: 'number',
        data: 44000,
      },
      {
        name: 'event.data.ending',
        description: 'ending',
        type: 'number',
        data: 99000,
      },
      {
        name: 'event.success',
        description: 'The status of the event',
        type: 'boolean',
        data: true,
      },
    ],
    customMsgKeys: [
      {
        name: 'workflow.id',
        description: ' The workflow ID',
        type: 'string',
        data: '01GYHKSKKXDVC89HEK77S9N5JA',
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
        data: '01GYD0FCSWRJRCX8TFDEZRTBAN',
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
        data: '01GYD0FCTBNDHNY5FBAK3WH08Z',
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
        data: 88000,
      },
      {
        name: 'event.data.lease_period',
        description: 'lease period',
        type: 'number',
        data: 44000,
      },
      {
        name: 'event.data.ending',
        description: 'ending',
        type: 'number',
        data: 99000,
      },
      {
        name: 'event.block.hash',
        description: 'The hash of the block',
        type: 'string',
        data: '0x4bc754ac7a1aa5056c60615386e261906f2f68bb70c9792832bf6facfbb3d8fc',
      },
      {
        name: 'event.time',
        description: 'The time that the event happened',
        type: 'string',
        data: '2023-04-21T09:54:43.965Z',
      },
    ],
    runningTest: {},
    tested: {},
    testResult: {},
    loading: { getFields: false },
  }),

  mutations: {
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
