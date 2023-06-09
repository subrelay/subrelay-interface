import { login } from './utils/login';

const DELAY = 200;

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
    delay: DELAY,
  }).as('getUserInfo');
});

Cypress.Commands.add('interceptChains', () => {
  cy.intercept('GET', '/chains', {
    fixture: 'chains',
    delay: DELAY,
  }).as('getChains');
});

Cypress.Commands.add('interceptOperators', () => {
  cy.intercept('GET', '*/operators', {
    fixture: 'operators',
    delay: DELAY,
  }).as('getOperators');
});

Cypress.Commands.add('interceptNoWorkflow', () => {
  cy.intercept('GET', '/workflows*', {
    fixture: 'workflow/noWorkflow',
    delay: DELAY,
  }).as('getNoWorkflow');
});

Cypress.Commands.add('interceptWorkflows', (fixture = 'workflow/workflows', alias = 'getWorkflows') => {
  cy.intercept('GET', '/workflows*', { fixture, delay: DELAY }).as(alias);
});

Cypress.Commands.add('interceptDeleteWorkflows', () => {
  cy.intercept('DELETE', '/workflows/*', { statusCode: 204, delay: 2000 }).as('deleteWorklows');
});
