import { login } from './utils/login';
import { initWorkflow } from './utils/initWorkflow';

Cypress.Commands.add('authenticate', login);

Cypress.Commands.add('initWorkflow', initWorkflow);

Cypress.Commands.add('getBySel', (selector, ...args) => {
  return cy.get(`[data-test=${selector}]`, ...args);
});

Cypress.Commands.add('getBySelLike', (selector, ...args) => {
  return cy.get(`[data-test*=${selector}]`, ...args);
});

Cypress.Commands.add('interceptUserInfo', () => {
  cy.intercept('GET', '/user/info', {
    fixture: 'general/userInfo',
    delay: Cypress.env('delay'),
  }).as('getUserInfo');
});

Cypress.Commands.add('interceptChains', () => {
  cy.intercept('GET', '/chains', {
    fixture: 'general/chains',
    delay: Cypress.env('delay'),
  }).as('getChains');
});

Cypress.Commands.add('interceptOperators', () => {
  cy.intercept('GET', '/tasks/filters/operators', {
    fixture: 'general/operators',
    delay: Cypress.env('delay'),
  }).as('getOperators');
});

Cypress.Commands.add('interceptWorkflows', (fixture = 'workflow/workflows', alias = 'getWorkflows') => {
  cy.intercept('GET', '/workflows?*', { fixture, delay: Cypress.env('delay') }).as(alias);
});

Cypress.Commands.add('interceptWorkflow', () => {
  cy.intercept('GET', '/workflows/*', { fixture: 'workflow/workflow', delay: Cypress.env('delay') }).as('getWorkflow');
});

Cypress.Commands.add('interceptDeleteWorkflow', () => {
  cy.intercept('DELETE', '/workflows/*', { statusCode: 204, delay: Cypress.env('delay') }).as('deleteWorklows');
});

Cypress.Commands.add('interceptEditWorkflow', () => {
  cy.intercept('PATCH', '/workflows/*', { statusCode: 204, delay: Cypress.env('delay') }).as('editWorkflow');
});

Cypress.Commands.add('interceptLogs', () => {
  cy.intercept('GET', '/workflow-logs?*', { fixture: 'log/logs', delay: Cypress.env('delay') }).as('getLogs');
});

Cypress.Commands.add('interceptLog', () => {
  cy.intercept('GET', '/workflow-logs/*', { fixture: 'log/log', delay: Cypress.env('delay') }).as('getLog');
});

Cypress.Commands.add('interceptAWorkflowLogs', () => {
  cy.intercept('GET', '/workflow-logs?*', {
    fixture: 'log/workflowLogs',
    delay: Cypress.env('delay'),
  }).as('getAWorkflowLogs');
});

Cypress.Commands.add('interceptAWorkflowFailedLogs', () => {
  cy.intercept('GET', '/workflow-logs?status=failed&*', {
    fixture: 'log/workflowFailedLogs',
    delay: Cypress.env('delay'),
  }).as('getAWorkflowFailedLogs');
});

Cypress.Commands.add('interceptRunTask', () => {
  cy.intercept('POST', '/tasks/run', {
    statusCode: 200,
    body: { status: 'success' },
    delay: Cypress.env('delay'),
  }).as('runTask');
});

Cypress.Commands.add('interceptCreateWorkflow', () => {
  cy.intercept('POST', '/workflows', {
    statusCode: 201,
    delay: Cypress.env('delay'),
  }).as('createWorkflow');
});
