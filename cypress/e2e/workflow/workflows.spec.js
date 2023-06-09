describe('Workflows dasboard', () => {
  beforeEach(() => {
    cy.interceptWorkflows();
    cy.authenticate();
    cy.wait('@getWorkflows');
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
        .should('have.text', 'Dot email')
        .next()
        .should('have.text', 'Polkadot')
        .next()
        .should('have.text', 'Jun 8th 2023, 17:16:58')
        .next()
        .should('have.text', 'Jun 8th 2023, 20:55:11')
        .next()
        .find('.n-switch')
        .should('have.attr', 'aria-checked', 'true');

      // 2nd row
      cy.get('tbody')
        .find('tr')
        .eq(1)
        .find('td')
        .first()
        .should('have.text', 'Westend tele')
        .next()
        .should('have.text', 'Westend')
        .next()
        .should('have.text', 'Jun 8th 2023, 17:36:16')
        .next()
        .should('have.text', 'Jun 8th 2023, 17:36:16')
        .next()
        .find('.n-switch')
        .should('have.attr', 'aria-checked', 'false');

      // 2nd row
      cy.get('tbody')
        .find('tr')
        .eq(2)
        .find('td')
        .first()
        .should('have.text', 'Webhook ksm')
        .next()
        .should('have.text', 'Kusama')
        .next()
        .should('have.text', 'Jun 8th 2023, 21:52:18')
        .next()
        .should('have.text', 'Jun 8th 2023, 21:52:18')
        .next()
        .find('.n-switch')
        .should('have.attr', 'aria-checked', 'true');
    });
  });

  it('Can search and update URL ', () => {
    const searchStr = 'Dot';
    cy.getBySel('search-bar').type(searchStr);
    cy.getBySel('workflows-table').get('.n-base-loading').should('be.visible');
    cy.url().should('include', `search=${searchStr}`);
    cy.getBySel('search-bar').find('.n-base-clear').click();
    cy.url().should('not.include', `search`);
    cy.getBySel('workflows-table').get('.n-base-loading').should('be.visible');
  });

  it.only('Can filter by chain and update URL ', () => {
    cy.getBySel('chain-dropdown').click();
    cy.getBySel('chain-dropdown-menu').within(() => {
      cy.contains('dot').click();
    });
    cy.getBySel('workflows-table').get('.n-base-loading').should('be.visible');
    cy.url().should('include', `chainUuid=`);
    cy.getBySel('search-bar').find('.n-base-clear').click();
    cy.url().should('not.include', `search`);
    cy.getBySel('workflows-table').get('.n-base-loading').should('be.visible');
  });
});
