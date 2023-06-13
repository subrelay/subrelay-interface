describe('Workflow details', () => {
  const workflowId = '01H2JXD6EPS7WJR8ZXJ7WPDHG0';
  const workflowName = 'KSM tele';

  beforeEach(() => {
    cy.interceptWorkflows();
    cy.interceptWorkflow();
    cy.authenticate();
    cy.visit(`/workflows/${workflowId}/overview`);
    cy.get('.n-layout-toggle-bar').click();
  });

  it('Display correct workflow details data', () => {
    cy.getBySel('workflow-details-name').should('contain', workflowName);
    cy.getBySel('workflow-details-tabs').should('be.visible');

    cy.getBySel('workflow-overview_details').within(() => {
      cy.getBySel('workflow-overview_status').within(() => {
        cy.contains('Status').should('be.visible');
        cy.get('.n-switch').should('have.attr', 'aria-checked', 'false');
      });

      cy.getBySel('workflow-overview_createdAt').within((el) => {
        cy.contains('Created at').should('be.visible');
        cy.wrap(el).children().eq(1).should('contain', 'Jun 10th 2023, 15:04:44');
      });

      cy.getBySel('workflow-overview_updatedAt').within((el) => {
        cy.contains('Updated at').should('be.visible');
        cy.wrap(el).children().eq(1).should('contain', 'Jun 10th 2023, 22:07:59');
      });
    });

    cy.getBySel('workflow-overview_trigger').within((el) => {
      cy.getBySel('workflow-overview_chain').within(() => {
        cy.contains('Chain').should('be.visible');
        cy.wrap(el).children().eq(1).should('contain', 'Kusama');
      });

      cy.getBySel('workflow-overview_event').within((el) => {
        cy.contains('Event').should('be.visible');
        cy.wrap(el).children().eq(1).should('contain', 'balances.Transfer');
      });

      cy.getBySel('workflow-overview_filters').within(() => {
        cy.contains('Filters').should('be.visible');
        cy.get('.filter-condition').should('have.length', 2);
      });
    });

    cy.getBySel('workflow-overview_action').within((el) => {
      cy.wrap(el).scrollIntoView();

      cy.getBySel('workflow-overview_channel').within((el) => {
        cy.contains('Channel').should('be.visible');
        cy.wrap(el).children().eq(1).should('contain', 'telegram');
      });
    });
  });

  it('Can change workflow status from this page', () => {
    cy.interceptEditWorkflow();
    cy.getBySel('workflow-overview_details').find('.n-switch').click();
    cy.wait('@editWorkflow').its('request.body').should('deep.equal', { status: 'running' });
    cy.get('.n-message').should('exist').and('contain', 'Workflow resumed successfully');
  });
});
