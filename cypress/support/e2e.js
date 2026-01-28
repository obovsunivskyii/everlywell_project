/**
 * Custom Cypress commands
 */
import './commands'

// Hide fetch/XHR requests from command log to reduce noise
const app = window.top;
if (!app.document.head.querySelector('[data-hide-command-log-request]')) {
  const style = app.document.createElement('style');
  style.innerHTML = '.command-name-request, .command-name-xhr { display: none }';
  style.setAttribute('data-hide-command-log-request', '');
  app.document.head.appendChild(style);
}

Cypress.on('uncaught:exception', (err, runnable) => {
  if (err.message.includes('ResizeObserver')) return false;
  if (err.message.includes('Failed to construct \'URL\'')) return false;
  if (err.message.includes('osano')) return false;
  if (err.message.includes('Cannot read property')) return false;
  return false;
});

beforeEach(() => {
  cy.log('Test started');
});

afterEach(() => {
  cy.log('Test completed');
});
