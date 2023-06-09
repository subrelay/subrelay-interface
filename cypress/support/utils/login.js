import mockedAccounts from '../../fixtures/accounts.json';

const mockedEnabledExtension = {
  signer: {
    async signRaw() {
      return { signature: 'mocked-signature' };
    },
  },
  accounts: {
    async get() {
      return mockedAccounts;
    },
  },
};

const mockedExtension = {
  version: '0.44.1',
  async enable() {
    return mockedEnabledExtension;
  },
};

const mockedInjectedWeb3 = {
  'polkadot-js': mockedExtension,
};

export const login = () => {
  Cypress.on('window:before:load', (win) => {
    win.injectedWeb3 = mockedInjectedWeb3;
  });

  cy.interceptUserInfo();
  cy.interceptChains();
  cy.interceptOperators();

  cy.visit('/');
  cy.wait(1000);
  cy.getBySel('connect-wallet').click();
  cy.get('.account-item').first().click();
  cy.getBySel('confirm-account').click();
  cy.wait('@getUserInfo');
};
