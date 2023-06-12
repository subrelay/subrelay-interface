describe('Log details', () => {
  beforeEach(() => {
    cy.interceptWorkflows();
    cy.interceptLog();
    cy.authenticate();
    cy.visit(`/logs/${Cypress.env('logId')}`);
    cy.get('.n-layout-toggle-bar').click();
  });

  it('Display correct log details data', () => {
    cy.url().should('include', `/logs/${Cypress.env('logId')}`);
    cy.getBySel('log-details-breadcrumb').should('contain', 'LOGS').and('contain', '>').and('contain', 'KSM tele');
    cy.getBySel('log-details-time').should('be.visible');
    cy.getBySel('log-details-status').should('be.visible');
    cy.getBySel('log-details-steps').should('be.visible').children().should('have.length', 3);
    cy.getBySel('log-details-step-0')
      .find('.step')
      .should('have.class', 'no-input')
      .and('contain', 'balances.Transfer');

    cy.getBySel('log-details-step-1')
      .find('.step')
      .within((el) => {
        cy.wrap(el).should('contain', 'Filters');
        cy.wrap(el).click();
      });

    cy.getBySel('log-details-input-output').within((el) => {
      cy.wrap(el).should('be.visible');
      cy.getBySel('log-details-input-output-title').should('contain', 'Filters');
      cy.getBySel('log-details-input').should('be.visible');
      cy.getBySel('log-details-output').should('be.visible');
    });

    cy.getBySel('log-details-step-2').should('contain', 'telegram').click();
    cy.getBySel('log-details-input-output-title').should('contain', 'telegram');
    cy.getBySel('log-details-input').should('be.visible');
    cy.getBySel('log-details-step-2').click();
    cy.getBySel('log-details-input').should('not.exist');
  });

  it('Can navigate to workflow details page', ()=> {
    
  })
});
