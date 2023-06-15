describe('Editor', () => {
  beforeEach(() => {
    cy.interceptWorkflows();
    cy.authenticate();
    cy.wait('@getWorkflows');
    cy.getBySel('new-workflow-btn').click();
    cy.wait(1000);
  });

  it('Display correct editor page layout ', () => {
    cy.url().should('include', 'trigger');
    cy.getBySel('editor-editable-name').should('be.visible');
    cy.getBySel('editor-home-btn').should('be.visible');
    cy.getBySel('editor-finish-btn').should('be.visible');
    cy.getBySel('subrelay-logo').should('be.visible');
    cy.getBySel('editor-stepper').within((el) => {
      cy.wrap(el).should('be.visible');
      cy.wrap(el).children().should('have.length', 2);
    });
  });

  it('Can filtering to select chain and event, and can add some filtering conditions', () => {
    cy.getBySel('chain-dropdown').should('be.visible');

    // Display error if chain is not selected yet
    cy.getBySel('chain-continue-btn').should('be.visible').click();
    cy.getBySel('editor-form-item-select-chain').find('.n-form-item-feedback-wrapper').should('contain', 'Required');

    // Clear error after chain is selected
    cy.getBySel('chain-dropdown').then((el) => {
      cy.wrap(el).type('dot').type('{enter}');
      cy.wrap(el).should('contain', 'Polkadot');
    });
    cy.getBySel('editor-form-item-select-chain')
      .find('.n-form-item-feedback-wrapper')
      .should('not.contain', 'Required');

    // Move to event selection
    cy.getBySel('chain-continue-btn').click();

    // Display error if event is not selected yet
    cy.getBySel('event-continue-btn').click();
    cy.getBySel('editor-form-item-select-event').find('.n-form-item-feedback-wrapper').should('contain', 'Required');

    // Clear error after event is selected
    cy.getBySel('event-dropdown').then((el) => {
      cy.wrap(el).type('transfer').type('{enter}');
      cy.wrap(el).should('contain', 'balances.Transfer');
    });

    cy.getBySel('editor-form-item-select-event')
      .find('.n-form-item-feedback-wrapper')
      .should('not.contain', 'Required');

    // Move to filters
    cy.getBySel('event-continue-btn').click();

    // Can skip filters
    cy.getBySel('filter-continue-btn').should('have.text', 'Skip filters').click();
    cy.url().should('include', 'action');

    // Go back to add some filters
    cy.getBySel('editor-trigger-stepper').click();
    cy.getBySel('editor-add-filters-btn').click();

    // Fill conditions to the first filter
    cy.getBySel('filter-group').within((el) => {
      cy.wrap(el).should('be.visible');
      cy.getBySel('filter-condition').should('be.visible');
      cy.getBySel('property-dropdown').type('from').type('{enter}');
      cy.wait(200);
      cy.getBySel('operator-dropdown').type('contains').type('{enter}');
      cy.getBySel('value-string-input').type('1');

      // Add another filter to the first condition group
      cy.getBySel('add-and-btn').click();
    });

    // Now we have a group with 2 conditions
    cy.getBySel('filter-group').should('have.length', 1);
    cy.getBySel('filter-condition').should('have.length', 2);

    // Add another group
    cy.getBySel('add-or-btn').click();

    // Now we have 2 groups, the first group has 2 conditions and the second group has 1 condition.
    cy.getBySel('filter-group').should('have.length', 2);
    cy.getBySel('filter-condition').should('have.length', 3);

    // Fill the rest condition in first group
    cy.getBySel('filter-group')
      .eq(0)
      .within(() => {
        cy.getBySel('filter-condition').should('have.length', 2);
        cy.getBySel('filter-condition')
          .eq(1)
          .within(() => {
            cy.getBySel('property-dropdown').type('amount').type('{enter}');
            cy.wait(200);
            cy.getBySel('operator-dropdown').type('greater than').type('{enter}');
            cy.getBySel('value-number-input').type('0');
          });
      });

    // Fill the rest condition in second group
    cy.getBySel('filter-group')
      .eq(1)
      .within(() => {
        cy.getBySel('filter-condition').should('have.length', 1);
        cy.getBySel('filter-condition').within(() => {
          cy.getBySel('property-dropdown').type('success').type('{enter}');
          cy.wait(200);
          cy.getBySel('operator-dropdown').type('true').type('{enter}');
          cy.getBySel('value-string-input').should('not.exist');
          cy.getBySel('value-number-input').should('not.exist');
        });
      });

    // Can not leave any condition blank
    // Add another condition and click continue
    cy.getBySel('add-or-btn').click();
    cy.getBySel('filter-continue-btn').click();
    cy.getBySel('filter-group')
      .eq(2)
      .within(() => {
        // Required message displayed in all missing fields
        cy.getBySel('editor-form-item-property-dropdown')
          .find('.n-form-item-feedback-wrapper')
          .should('contain', 'Required');

        cy.getBySel('editor-form-item-operator-dropdown')
          .find('.n-form-item-feedback-wrapper')
          .should('contain', 'Required');

        cy.getBySel('editor-form-item-value-input').should('contain', 'Required');
      });
    cy.url().should('include', 'trigger');

    // Can delete condition
    cy.getBySel('filter-condition')
      .eq(3)
      .within(() => cy.getBySel('delete-condition-btn').click());
    cy.getBySel('filter-continue-btn').click();
    cy.url().should('include', 'action');
  });
});
