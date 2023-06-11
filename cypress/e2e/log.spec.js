describe('Log details', () => {
  beforeEach(() => {
    cy.interceptWorkflows();
    cy.interceptLog();
    cy.authenticate();
    cy.visit(`/logs/${Cypress.env.logId}`);
  });

  it('Display correct data list of workflow', () => {
    cy.url().should('include', `/logs/${Cypress.env.logId}`);
  });
});
