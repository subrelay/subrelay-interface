import './commands';

Cypress.on('uncaught:exception', (err) => {
  const expectedErrors = ['ResizeObserver loop limit exceeded', 'Form validation failed'];
  return expectedErrors.some((expectedError) => err.message.includes(expectedError));
});
