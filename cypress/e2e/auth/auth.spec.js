describe('Authentication', () => {
  it('Should redirect to the auth page when a user not login yet', () => {
    cy.visit('/');
    cy.url().should('include', '/welcome');
  });

  it('Show correct account after auth', () => {
    cy.authenticate();
    cy.getBySel('account-dropdown').should('be.visible');
    cy.getBySel('account-name').should('contain', 'foo');
    cy.getBySel('account-address').should('contain', '5CFk5');
  });
});
