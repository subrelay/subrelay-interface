import API from '@/api';

export default {
  namespaced: true,

  state: () => ({
    chains: [],
    events: [],
    event: {},
    loading: { getChainsLoading: null, getEventsLoading: null, getEventLoading: null },
  }),

  mutations: {
    getChains: (state, chains) => {
      state.chains = chains;
    },
    getEvents: (state, events) => {
      state.events = events;
    },

    setLoading: (state, data) => {
      state.loading = { ...state.loading, ...data };
    },
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

    async getEvents({ commit }, uuid) {
      commit('setLoading', { getEventsLoading: true });
      try {
        const events = await API.getEvents(uuid);

        commit('getEvents', events);
      } catch (error) {
        commit('getChains', []);
        console.error('error', error);
      } finally {
        commit('setLoading', { getEventsLoading: false });
      }
    },
  },
};
