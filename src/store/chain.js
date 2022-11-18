export default {
  namespaced: true,

  state: () => ({
    event: {
      id: 123,
      name: 'balances.deposit',
      description: 'string',
      fields: [
        { name: 'data.who', type: 'string', description: 'who sent' },
        { name: 'data.amount', type: 'number', description: '' },
        { name: 'status', type: 'string', description: 'status of this event' },
        {
          name: 'extrinsic.name',
          type: 'string',
          description: 'this event belong to this extrinsic',
        },
      ],
      sample: {
        id: 123,
        name: 'balances.deposit',
        description: 'This Event Does This',
        data: { who: '', amount: 123 },
        status: 'success',
        extrinsic: { name: 'balances.deposit' },
        block: { hash: '', number: 123, timestamp: '' },
      },
    },
  }),

  mutations: {},

  actions: {},
};
