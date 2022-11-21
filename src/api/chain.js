import requester from './requester';

export default {
  getChains: () => requester.get('/chains'),

  getEvents: (uuid) => requester.get(`/chains/${uuid}/events`),

  getEvent: (uuid, eventId) =>
    requester.get(`/chains/${uuid}/events/${eventId}`),
};
