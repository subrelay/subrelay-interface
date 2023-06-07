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

  cy.intercept('GET', '/user/info', {
    fixture: 'userInfo',
    delay: 200,
  }).as('getUserInfo');

  cy.intercept('GET', '/chains', {
    fixture: 'chains',
    delay: 200,
  }).as('getChains');

  cy.intercept('GET', '*/operators', {
    fixture: 'operators',
    delay: 200,
  }).as('getOperators');

  cy.intercept('GET', '/workflows*', {
    fixture: 'noWorkflow',
    delay: 200,
  }).as('getNoWorkflow');

  cy.visit('/');
  cy.wait(2000);
  cy.getBySel('connect-wallet').click();
  cy.get('.account-item').first().click();
  cy.getBySel('confirm-account').click();
  cy.wait('@getUserInfo');
  cy.wait('@getNoWorkflow');
};
