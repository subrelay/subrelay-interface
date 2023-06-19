import './commands';

Cypress.on('uncaught:exception', (err, runnable, promise) => {
  if (promise) {
    return false;
  }

  return !err.message.includes('ResizeObserver loop limit exceeded');
});
