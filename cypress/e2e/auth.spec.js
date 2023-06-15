describe('Authentication', () => {
  beforeEach(() => Cypress.config('intercepts', {}));

  it('Should redirect to the welcome page when a user not login yet', () => {
    cy.visit('/');
    cy.url().should('include', '/welcome');
  });

  it('Show correct account after auth', () => {
    cy.authenticate();
    cy.getBySel('account-dropdown').should('be.visible');
    cy.getBySel('account-name').should('contain', 'foo');
    cy.getBySel('account-address').should('contain', '5CFk5');
  });

  it('Can change to account', () => {
    cy.authenticate();
    cy.getBySel('account-dropdown').click();
    cy.contains('Change Account').click();
    cy.getBySel('account-modal').click();
    cy.get('.account-item').eq(1).click();
    cy.getBySel('confirm-account').click();
    cy.getBySel('account-name').should('contain', 'bar');
    cy.getBySel('account-address').should('contain', '5DHub');
  });

  it('Should redirect to the welcome page after loggin', () => {
    cy.authenticate();
    cy.getBySel('account-dropdown').click();
    cy.contains('Sign Out').click();
    cy.url().should('include', '/welcome');
  });
});
