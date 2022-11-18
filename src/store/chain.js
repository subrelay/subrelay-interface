export default {
  namespaced: true,

  state: () => ({
    chains: [
      {
        uuid: '123',
        name: 'Acala',
        img_url: 'https://avatars.githubusercontent.com/u/54881907?s=280&v=4',
        version: 'v1.2.0',
      },
      {
        uuid: '456',
        name: 'Polkadot',
        img_url: 'https://cryptologos.cc/logos/polkadot-new-dot-logo.png',
        version: 'v1.2.0',
      },
      {
        uuid: '789',
        name: 'Kusama',
        img_url:
          'https://www.liblogo.com/img-logo/ku2766k057-kusama-logo-kusama-ksm-bitprime.png',
        version: 'v1.2.0',
      },
    ],

    events: [
      {
        id: '1',
        name: 'balances.deposit',
        description: 'this event does this',
      },
      { id: '2', name: 'token.endowed', description: 'this event does that' },
    ],

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
