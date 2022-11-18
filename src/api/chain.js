import requester from './requester';

export default {
  getChains: () => requester.get('/chains'),

  getEvents: (chain_uuid) => requester.get(`/chains/${chain_uuid}/events`),

  getEvent: (chain_uuid, event_id) =>
    requester.get(`/chains/${chain_uuid}/events/${event_id}`),
};
