export default {
  namespaced: true,

  state: () => ({
    queryParams: null,

    workflows: [
      {
        id: Math.floor(Math.random() * 10000),
        name: 'John Brown',
        created_at: Date.now(),
        updated_at: Date.now() - 99999999999,
        status: 'running',
        chain: {
          uuid: 'uasdasdsd',
          name: 'Acala',
        },
      },
      {
        id: Math.floor(Math.random() * 10000),
        name: 'Jim Green',
        created_at: Date.now(),
        updated_at: Date.now() - 99999999999,
        status: 'pausing',
        chain: {
          uuid: 'uasdasdsd',
          name: 'Kusama',
        },
      },
      {
        id: Math.floor(Math.random() * 10000),
        name: 'Joe Black',
        created_at: Date.now(),
        updated_at: Date.now() - 99999999999,
        status: 'running',
        chain: {
          uuid: 'uasdasdsd',
          name: 'Polkadot',
        },
      },
      {
        id: Math.floor(Math.random() * 10000),
        name: 'Jim Red',
        created_at: Date.now(),
        updated_at: Date.now() - 99999999999,
        status: 'pausing',
        chain: {
          uuid: 'uasdasdsd',
          name: 'Acala',
        },
      },
    ],

    workflow: {
      id: 22,
      created_at: '2022-11-02T03:12:39.018Z',
      updated_at: '2022-11-02T03:12:39.018Z',
      status: 'running',
      name: 'workflow 1',
      chain: { uuid: 'asdasdasd', name: 'Acala' },
      tasks: [
        {
          id: 1,
          name: 'trigger 1',
          type: 'trigger',
          config: {
            event: 'balances.deposit',
            chain_uuid: 'asdasdasd',
            conditions: [
              [{ variable: 'data.amount', operator: 'greaterThan', value: 1 }],
              [{ variable: 'data.amount', operator: 'lessThan', value: 10 }],
              [
                { variable: 'data.amount', operator: 'greaterThan', value: 1 },
                {
                  variable: 'data.from',
                  operator: 'equal',
                  value: 'fooAndBar',
                },
              ],
            ],
          },
          depend_on: null,
        },
        {
          name: 'notify webhook',
          type: 'notification',
          config: {
            channel: 'webhook',
            config: {
              headers: { API_KEY: 'encrypted' },
              url: 'https://webhook.com',
            },
            depend_on: 1,
          },
        },
      ],
    },
  }),

  mutations: {
    saveQueryParams(state, queryParams) {
      state.queryParams = queryParams;
    },
  },

  actions: {},
};
