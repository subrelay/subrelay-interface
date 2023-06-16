describe('Workflows dashboard', () => {
  const searchStr = 'dot';

  beforeEach(() => {
    cy.authenticate();
    cy.wait('@getWorkflows');
    cy.get('.n-layout-toggle-bar').click();
  });

  it('Display correct data list of workflow', () => {
    cy.url().should('include', '/workflows');

    cy.getBySel('workflows-table').within(() => {
      cy.get('tbody').children().should('have.length', 3);

      // 1st row
      cy.get('tbody')
        .find('tr')
        .eq(0)
        .find('td')
        .first()
        .should('contain', 'Dot email')
        .next()
        .should('contain', 'Polkadot')
        .next()
        .should('contain', 'Jun 8th 2023')
        .next()
        .should('contain', 'Jun 8th 2023')
        .next()
        .find('.n-switch')
        .should('have.attr', 'aria-checked', 'true');

      // 2nd row
      cy.get('tbody')
        .find('tr')
        .eq(1)
        .find('td')
        .first()
        .should('contain', 'Westend tele')
        .next()
        .should('contain', 'Westend')
        .next()
        .should('contain', 'Jun 8th 2023')
        .next()
        .should('contain', 'Jun 8th 2023')
        .next()
        .find('.n-switch')
        .should('have.attr', 'aria-checked', 'false');

      // 3rd row
      cy.get('tbody')
        .find('tr')
        .eq(2)
        .find('td')
        .first()
        .should('contain', 'KSM tele')
        .next()
        .should('contain', 'Kusama')
        .next()
        .should('contain', 'Jun 8th 2023')
        .next()
        .should('contain', 'Jun 8th 2023')
        .next()
        .find('.n-switch')
        .should('have.attr', 'aria-checked', 'true');
    });
  });

  it('Can sort and update URL ', () => {
    // Sort by name
    cy.getBySel(' workflows-table').find('thead').find('th').eq(0).click();
    cy.url().should('include', 'order=name&sort=DESC');
    cy.getBySel(' workflows-table').find('thead').find('th').eq(0).click();
    cy.url().should('include', 'order=name&sort=ASC');
    cy.getBySel(' workflows-table').find('thead').find('th').eq(0).click();
    cy.url().should('not.include', 'order=name');

    // Can change sort from this column to another column
    cy.getBySel('workflows-table').find('thead').contains('Created at').click();
    cy.url().should('include', 'order=createdAt&sort=DESC');
    cy.getBySel('workflows-table').find('thead').contains('Updated at').click();
    cy.url().should('include', 'order=updatedAt&sort=DESC');
    cy.getBySel('workflows-table').find('thead').contains('Name').click();
    cy.url().should('include', 'order=name&sort=DESC');
    cy.getBySel('clear-filters').click();
    cy.url().should('not.include', 'order=');
  });

  it('Can search and update URL ', () => {
    cy.getBySel('search-bar').type(searchStr);
    cy.getBySel('workflows-table').get('.n-base-loading').should('be.visible');
    cy.url().should('include', `search=${searchStr}`);
    cy.getBySel('search-bar').find('.n-base-clear').click();
    cy.url().should('not.include', `search=`);
    cy.getBySel('workflows-table').get('.n-base-loading').should('be.visible');
  });

  it('Can filter by chain and update URL ', () => {
    cy.getBySel('chain-dropdown').click();
    cy.getBySel('chain-dropdown-menu').within(() => cy.contains(searchStr).click());
    cy.getBySel('workflows-table').get('.n-base-loading').should('be.visible');
    cy.url().should('include', 'chainUuid=');
    cy.getBySel('chain-dropdown').trigger('mouseover').find('.n-base-clear').click().click();
    cy.url().should('not.include', 'chainUuid=');
    cy.getBySel('workflows-table').get('.n-base-loading').should('be.visible');
  });

  it('Can filter by status and update URL ', () => {
    cy.getBySel('status-filter').click();
    cy.getBySel('status-filter-menu').within(() => cy.contains('Running').click());
    cy.getBySel('workflows-table').get('.n-base-loading').should('be.visible');
    cy.url().should('include', 'status=running');
    cy.getBySel('status-filter').trigger('mouseover').find('.n-base-clear').click().click();
    cy.url().should('not.include', `status=running`);
    cy.getBySel('workflows-table').get('.n-base-loading').should('be.visible');
  });

  it('Can filter by multiple criteria at a time', () => {
    cy.getBySel('search-bar').type(searchStr);
    cy.getBySel('chain-dropdown').click();
    cy.getBySel('chain-dropdown-menu').within(() => cy.contains(searchStr).click());
    cy.url().should('include', `search=${searchStr}`).and('include', 'chainUuid=');
    cy.getBySel('clear-filters').click();
    cy.url().should('not.include', `search=`).and('not.include', 'chainUuid=');
  });

  it('Can change workflow status', () => {
    cy.interceptEditWorkflow();
    cy.getBySel('workflows-table').find('tr').eq(1).find('.n-switch').click();
    cy.wait('@editWorkflow').its('request.body').should('deep.equal', { status: 'pausing' });
    cy.get('.n-message').should('be.visible').and('contain', 'Workflow paused successfully');
    cy.getBySel('workflows-table').find('tr').eq(2).find('.n-switch').click();
    cy.wait('@editWorkflow').its('request.body').should('deep.equal', { status: 'running' });
    cy.get('.n-message').should('be.visible').and('contain', 'Workflow resumed successfully');
  });

  it('Can rename workflow', () => {
    cy.interceptEditWorkflow();
    cy.getBySel('workflows-table')
      .find('tr')
      .eq(1)
      .within(() => {
        cy.getBySel('workflow-action-menu').click().click();
      });
    cy.contains('Rename').click();
    cy.get('[data-test="editable-cell-0"]').within(() => {
      const newName = 'New workflow name';
      cy.get('input').should('have.value', 'Dot email');
      cy.get('.n-base-clear').click();
      cy.get('input').type(newName);
    });
    cy.getBySel('workflow-actions').find('button').first().click();
    cy.wait(Cypress.env('delay'));
    cy.get('.n-message').should('be.visible').and('contain', 'Workflow renamed successfully');
  });

  it('Can delete workflow', () => {
    cy.interceptDeleteWorkflow();
    cy.getBySel('workflows-table')
      .find('tr')
      .eq(1)
      .within(() => {
        cy.getBySel('workflow-action-menu').click().click();
      });
    cy.contains('Delete').click();
    cy.get('.n-dialog').should('be.visible');
    cy.get('.n-dialog__title').should('contain', 'Delete worklow');
    cy.get('.n-dialog__action').contains('Delete').click();
    cy.wait(Cypress.env('delay'));
    cy.get('.n-dialog').should('not.exist');
    cy.get('.n-message').should('be.visible').and('contain', 'Workflow Dot email deleted successfully');
  });
});
