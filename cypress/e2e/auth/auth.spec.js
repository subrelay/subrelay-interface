describe('Authentication', () => {
  beforeEach(() => {
    cy.intercept('GET', '*/user/info', {
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
    cy.get('.account-item').first().click();
    cy.getBySel('confirm-account').click();
    cy.wait(2000);
    cy.wait('@getUserInfo');
  });

});
