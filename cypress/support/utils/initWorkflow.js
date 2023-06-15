export const initWorkflow = () => {
  // Set name
  cy.getBySel('editor-editable-name').click();
  cy.getBySel('editor-editable-name').type('Test editor');

  // Select chain
  cy.getBySel('chain-dropdown').then((el) => {
    cy.wrap(el).type('dot').type('{enter}');
    cy.wrap(el).should('contain', 'Polkadot');
  });
  cy.getBySel('chain-continue-btn').click();

  // Select event
  cy.getBySel('event-dropdown').then((el) => {
    cy.wrap(el).type('transfer').type('{enter}');
    cy.wrap(el).should('contain', 'balances.Transfer');
  });
  cy.getBySel('event-continue-btn').click();

  // Skip filters
  cy.getBySel('filter-continue-btn').click();
};
