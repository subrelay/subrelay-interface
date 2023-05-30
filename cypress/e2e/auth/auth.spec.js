describe('Authentication', () => {
  it('Should redirect to the auth page when a user not login yet', () => {
    cy.visit('/');
    cy.url().should('include', '/welcome');
  });

  it.only('Show modal for wallet selection', () => {
    cy.visit('/');

    cy.window().then((win) => {
      console.log('FOOOOO', win.getInjectedExtension);
      cy.stub(win, 'getInjectedExtension')
        .resolves({
          enable: () =>
            Promise.resolve({
              accounts: {
                get: () =>
                  Promise.resolve([
                    { id: 1, name: 'Account 1' },
                    { id: 2, name: 'Account 2' },
                    { id: 3, name: 'Account 3' },
                  ]),
              },
              signer: 'mockSigner',
            }),
        })
        .as('getInjectedExtensionStub');
    });

    cy.getBySel('connect-wallet').click();

    cy.window().then((win) => {
      cy.stub(win, 'getInjectedExtension')
        .resolves({
          enable: () =>
            Promise.resolve({
              accounts: {
                get: () =>
                  Promise.resolve([
                    { id: 1, name: 'Account 1' },
                    { id: 2, name: 'Account 2' },
                    { id: 3, name: 'Account 3' },
                  ]),
              },
              signer: 'mockSigner',
            }),
        })
        .as('getInjectedExtensionStub');
    });
  });

  // it('User is redirected to the auth page after logout', () => {
  //   cy.getBySel('nav-bar__toggler').click();
  //   cy.contains('Log out').click();
  //   cy.url().should('include', '#/auth');
  // });
});
