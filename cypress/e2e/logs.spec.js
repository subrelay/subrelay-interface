describe('Logs dasboard', () => {
  const searchStr = 'dot';

  beforeEach(() => {
    cy.interceptWorkflows();
    cy.interceptLogs();
    cy.authenticate();
    cy.getBySel('side-bar-logs-router').click();
    cy.get('.n-layout-toggle-bar').click();
  });

  it('Display correct data list of workflow', () => {
    cy.url().should('include', '/logs');
    cy.get('.page_title').should('have.text', 'Logs');

    cy.getBySel('logs-table').within(() => {
      cy.get('tbody').children().should('have.length', 10);

      cy.get('thead')
        .find('tr')
        .eq(0)
        .find('th')
        .first()
        .should('have.text', 'Status')
        .next()
        .should('have.text', 'Workflow name')
        .next()
        .should('have.text', 'Chain')
        .next()
        .should('have.text', 'Started at')
        .next()
        .should('have.text', 'Finished at');
    });
  });

  it('Can sort and update URL ', () => {
    // Sort by workflow name
    cy.getBySel('logs-table').find('thead').contains('Workflow name').click({ force: true });
    cy.url().should('include', 'order=name&sort=DESC');
    cy.getBySel('logs-table').find('thead').contains('Workflow name').click({ force: true });
    cy.url().should('include', 'order=name&sort=ASC');
    cy.getBySel('logs-table').find('thead').contains('Workflow name').click({ force: true });
    cy.url().should('not.include', 'order=name');

    // Can change sort from this column to another column
    cy.getBySel('logs-table').find('thead').contains('Started at').click();
    cy.url().should('include', 'order=startedAt&sort=DESC');
    cy.getBySel('logs-table').find('thead').contains('Finished at').click();
    cy.url().should('include', 'order=finishedAt&sort=DESC');
    cy.getBySel('logs-table').find('thead').contains('Workflow name').click();
    cy.url().should('include', 'order=name&sort=DESC');
    cy.getBySel('clear-filters').click();
    cy.url().should('not.include', 'order=');
  });

  it('Can search and update URL ', () => {
    cy.getBySel('search-bar').type(searchStr);
    cy.getBySel('logs-table').get('.n-base-loading').should('be.visible');
    cy.url().should('include', `search=${searchStr}`);
    cy.getBySel('search-bar').find('.n-base-clear').click();
    cy.url().should('not.include', `search=`);
    cy.getBySel('logs-table').get('.n-base-loading').should('be.visible');
  });

  it('Can filter by chain and update URL ', () => {
    cy.getBySel('chain-dropdown').click();
    cy.getBySel('chain-dropdown-menu').within(() => cy.contains(searchStr).click());
    cy.getBySel('logs-table').get('.n-base-loading').should('be.visible');
    cy.url().should('include', 'chainUuid=');
    cy.getBySel('chain-dropdown').trigger('mouseover').find('.n-base-clear').click().click();
    cy.url().should('not.include', 'chainUuid=');
    cy.getBySel('logs-table').get('.n-base-loading').should('be.visible');
  });

  it('Can filter by status and update URL ', () => {
    cy.getBySel('status-filter').click();
    cy.getBySel('status-filter-menu').within(() => cy.contains('Success').click());
    cy.getBySel('logs-table').get('.n-base-loading').should('be.visible');
    cy.url().should('include', 'status=success');
    cy.getBySel('status-filter').trigger('mouseover').find('.n-base-clear').click().click();
    cy.url().should('not.include', `status=success`);
    cy.getBySel('logs-table').get('.n-base-loading').should('be.visible');
  });

  it('Can filter by multiple criteria at a time', () => {
    cy.getBySel('search-bar').type(searchStr);
    cy.getBySel('chain-dropdown').click();
    cy.getBySel('chain-dropdown-menu').within(() => cy.contains(searchStr).click());
    cy.getBySel('status-filter').click().click().click();
    cy.getBySel('status-filter-menu').within(() => cy.contains('Failed').click());
    cy.url().should('include', `search=${searchStr}`).and('include', 'chainUuid=').and('include', 'status=failed');
    cy.getBySel('clear-filters').click();
    cy.url().should('not.include', `search=`).and('not.include', 'chainUuid=').and('not.include', `status=failed`);
  });

  it('Can navigate to corresponding workflow details', () => {
    cy.interceptEditWorkflow();
    cy.interceptLog();
    cy.getBySel('logs-table').find('tbody').find('tr').first().contains('View').click();
    cy.url().should('include', '/logs/01H2JXJESBT1A5CDX9VM4RZBXN');
  });
});
