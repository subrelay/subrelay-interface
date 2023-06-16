import './commands';

Cypress.on('uncaught:exception', (err, runnable, promise) => {
  const expectedErrors = ['ResizeObserver loop limit exceeded', 'Form validation failed'];
  // return expectedErrors.some((expectedError) => err.message.includes(expectedError));

  // return !err.message.includes('ResizeObserver loop limit exceeded') || !err.message.includes('Form validation failed');
  // return err.message.includes('Form validation failed');

  if (promise) {
    return false;
  }

  return !err.message.includes('ResizeObserver loop limit exceeded');
});
