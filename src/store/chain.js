import axios from 'axios';

export default {
  namespaced: true,

  state: () => ({
    chains: [],
    events: [],
    event: {
      fields: [
        { name: 'data.who', type: 'string', description: 'who sent' },
        { name: 'data.amount', type: 'number', description: '' },
        {
          name: 'status',
          type: 'string',
          description: 'status of this event',
        },
        {
          name: 'extrinsic.name',
          type: 'string',
          description: 'this event belong to this extrinsic',
        },
      ],
    },
    loading: {
      getChainsLoading: null,
      getEventsLoading: null,
    },
  }),

  mutations: {
    getChains(state, chains) {
      state.chains = chains;
    },

    getEvents(state, events) {
      state.events = events;
    },

    getEvent(state, event) {
      state.event = event;
    },

    setLoading(state, data) {
      state.loading = { ...state.loading, ...data };
    },
  },

  actions: {
    async getChains({ commit }) {
      commit('setLoading', { getChainsLoading: true });
      try {
        // const chains = await API.Chain.getChains();
        const { data: chains } = await axios.get('/mockData/chains.json');
        commit('getChains', chains);
      } catch (error) {
        commit('getAllDatasets', []);
        console.log('error', error);
      } finally {
        setTimeout(() => {
          commit('setLoading', { getChainsLoading: false });
        }, 1000);
      }
    },

    async getEvents({ commit }, chain_uuid) {
      commit('setLoading', { getEventsLoading: true });
      try {
        // const events = await API.Chain.getEvents(chain_uuid);
        const { data: events } = await axios.get('/mockData/events.json');
        commit('getEvents', events);
      } catch (error) {
        commit('getAllDatasets', []);
        console.log('error', error);
      } finally {
        setTimeout(() => {
          commit('setLoading', { getEventsLoading: false });
        }, 1000);
      }
    },
  },
};
