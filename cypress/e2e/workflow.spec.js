describe('Workflow details', () => {
  const logId = '01H2JNG11CK9JYPNRPB6T31NXQ';
  const workflowId = '01H2JXD6EPS7WJR8ZXJ7WPDHG0';
  const workflowName = 'KSM tele';

  beforeEach(() => {
    cy.interceptWorkflow();
    cy.authenticate();
    cy.get('.n-layout-toggle-bar').click();
  });

  describe('Workflow details - Overview', () => {
    beforeEach(() => {
      cy.visit(`/workflows/${workflowId}/overview`);
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
          cy.wrap(el).children().eq(1).should('contain', 'Jun 10th 2023');
        });

        cy.getBySel('workflow-overview_updatedAt').within((el) => {
          cy.contains('Updated at').should('be.visible');
          cy.wrap(el).children().eq(1).should('contain', 'Jun 10th 2023');
        });
      });

      cy.getBySel('workflow-overview_trigger').within((el) => {
        cy.getBySel('workflow-overview_chain').within(() => {
          cy.contains('Chain').should('be.visible');
          cy.wrap(el).children().eq(1).should('contain', 'Kusama');
        });

        cy.getBySel('workflow-overview_event').within((elmt) => {
          cy.contains('Event').should('be.visible');
          cy.wrap(elmt).children().eq(1).should('contain', 'balances.Transfer');
        });

        cy.getBySel('workflow-overview_filters').within(() => {
          cy.contains('Filters').should('be.visible');
          cy.get('.filter-condition').should('have.length', 2);
        });
      });

      cy.getBySel('workflow-overview_action').within((el) => {
        cy.wrap(el).scrollIntoView();

        cy.getBySel('workflow-overview_channel').within((elmt) => {
          cy.contains('Channel').should('be.visible');
          cy.wrap(elmt).children().eq(1).should('contain', 'telegram');
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

  describe('Workflow details - Logs', () => {
    beforeEach(() => {
      cy.interceptAWorkflowLogs();
      cy.visit(`/workflows/${workflowId}/logs`);
    });

    it('Show log list of a workflow', () => {
      cy.getBySel('a-workflow-log-status-filter').should('be.visible');
      cy.get('.workflow-log-item').should('have.length', 10);
      cy.get('.workflow-log-item').eq(0).should('contain', 'success').and('contain', 'Jun 10th 2023');
      cy.get('.workflow-log-item').eq(2).should('contain', 'failed').and('contain', 'Jun 10th 2023');
    });

    it('Can navigate to log details page', () => {
      cy.interceptLog();
      cy.get('.workflow-log-item').eq(0).click();
      cy.url().should('include', `/logs/${logId}`);
    });

    it('Can filter by status and update url', () => {
      cy.interceptAWorkflowFailedLogs();
      cy.wait('@getAWorkflowLogs');
      cy.getBySel('a-workflow-log-status-filter').click();
      cy.getBySel('workflow-log-status-filter-menu').contains('Failed').click();
      cy.url().should('contain', 'status=failed');
      cy.wait('@getAWorkflowFailedLogs');
    });
  });
});
