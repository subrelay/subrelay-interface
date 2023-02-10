import API from '@/api';

export default {
  namespaced: true,

  state: () => ({
    chains: [],
    events: [],
    event: {},
    loading: {
      getChainsLoading: null,
      getEventsLoading: null,
      getEventLoading: null,
    },
  }),

  mutations: {
    getChains: (state, chains) => {
      state.chains = chains;
    },
    getEvents: (state, events) => (state.events = events),
    getEvent: (state, event) => (state.event = event),
    setLoading: (state, data) =>
      (state.loading = { ...state.loading, ...data }),
  },

  actions: {
    async getChains({ commit }) {
      commit('setLoading', { getChainsLoading: true });
      try {
        const chains = await API.getChains();
        commit('getChains', chains);
      } catch (error) {
        commit('getChains', []);
        console.error('error', error);
      } finally {
        commit('setLoading', { getChainsLoading: false });
      }
    },

    async getEvents({ commit }, chainUuid) {
      commit('setLoading', { getEventsLoading: true });
      try {
        const events = await API.getEvents(chainUuid);
        commit('getEvents', events);
      } catch (error) {
        commit('getChains', []);
        console.error('error', error);
      } finally {
        commit('setLoading', { getEventsLoading: false });
      }
    },

    async getEvent({ commit }, { chainUuid, eventId }) {
      commit('setLoading', { getEventLoading: true });
      try {
        const event = await API.getEvent(chainUuid, eventId);

        commit('getEvent', event);
      } catch (error) {
        commit('getEvent', []);
        console.error(error);
      } finally {
        commit('setLoading', { getEventLoading: false });
      }
    },
  },
};
