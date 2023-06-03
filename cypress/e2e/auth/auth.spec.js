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

describe('Authentication', () => {
  beforeEach(() => {
    Cypress.on('window:before:load', win => {
      win.injectedWeb3 = mockedInjectedWeb3;
    });
    cy.intercept('GET', '/user/info', {
      fixture: 'userInfo',
      delay: 200,
    }).as('getUserInfo');
  });

  it('Should redirect to the auth page when a user not login yet', () => {
    cy.visit('/');
    cy.url().should('include', '/welcome');
  });

  it.only('Show modal for wallet selection', () => {
    cy.visit('/');
    cy.getBySel('connect-wallet').click();
    cy.get('.account-item')
      .first()
      .click();
    cy.getBySel('confirm-account').click();
    cy.wait(200);
    cy.wait('@getUserInfo').then(() => {
      console.log('Whats next???');
    });
  });
});
