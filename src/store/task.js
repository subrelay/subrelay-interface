export default {
  namespaced: true,

  state: () => ({
    operators: {
      number: [
        { name: 'greater than', value: 'greaterThan' },
        { name: 'greater than or equal', value: 'greaterThanEqual' },
        { name: 'less than', value: 'lessThan' },
      ],
      string: [
        { name: 'contains', value: 'contains' },
        { name: 'exactly matches', value: 'exactMatch' },
      ],
    },
  }),

  mutations: {},

  actions: {},
};
