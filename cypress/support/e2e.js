import './commands';

Cypress.on('uncaught:exception', (err) => !err.message.includes('ResizeObserver loop limit exceeded'));
