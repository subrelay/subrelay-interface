import { login } from './utils/login';

Cypress.Commands.add('authenticate', login);

Cypress.Commands.add('getBySel', (selector, ...args) => {
  return cy.get(`[data-test=${selector}]`, ...args);
});

Cypress.Commands.add('getBySelLike', (selector, ...args) => {
  return cy.get(`[data-test*=${selector}]`, ...args);
});

Cypress.Commands.add('interceptUserInfo', () => {
  cy.intercept('GET', '/user/info', {
    fixture: 'userInfo',
    delay: Cypress.env('delay'),
  }).as('getUserInfo');
});

Cypress.Commands.add('interceptChains', () => {
  cy.intercept('GET', '/chains', {
    fixture: 'chains',
    delay: Cypress.env('delay'),
  }).as('getChains');
});

Cypress.Commands.add('interceptOperators', () => {
  cy.intercept('GET', '*/operators', {
    fixture: 'operators',
    delay: Cypress.env('delay'),
  }).as('getOperators');
});

Cypress.Commands.add('interceptNoWorkflow', () => {
  cy.intercept('GET', '/workflows*', {
    fixture: 'workflow/noWorkflow',
    delay: Cypress.env('delay'),
  }).as('getNoWorkflow');
});

Cypress.Commands.add('interceptWorkflows', (fixture = 'workflow/workflows', alias = 'getWorkflows') => {
  cy.intercept('GET', '/workflows*', { fixture, delay: Cypress.env('delay') }).as(alias);
});

Cypress.Commands.add('interceptDeleteWorkflow', () => {
  cy.intercept('DELETE', '/workflows/*', { statusCode: 204, delay: Cypress.env('delay') }).as('deleteWorklows');
});

Cypress.Commands.add('interceptEditWorkflow', () => {
  cy.intercept('PATCH', '/workflows/*', { statusCode: 204, delay: Cypress.env('delay') }).as('editWorkflow');
});
