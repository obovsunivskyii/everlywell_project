/**
 * Custom Cypress Commands for Mock Test Environment
 *
 * NOTE: These commands are adapted for working with local mock site
 * at http://localhost:8080/app.html
 */

/**
 * Add a product to cart
 * @param {string} productId - The product identifier (not used in mock, but kept for compatibility)
 * @param {number} quantity - Number of items to add
 */
Cypress.Commands.add('addProductToCart', (productId, quantity) => {
  // In mock environment we simply enter quantity and click the button
  cy.get('[data-cy="quantity-input"]')
    .should('be.visible')
    .clear()
    .type(quantity.toString());

  cy.get('[data-cy="add-to-cart-button"]')
    .should('be.visible')
    .click();

  cy.wait(200);
});

/**
 * Navigate to checkout page
 */
Cypress.Commands.add('navigateToCheckout', () => {
  // Click on the cart icon
  cy.get('[data-cy="cart-icon"]')
    .should('be.visible')
    .click();

  // Verify we arrived at checkout
  cy.url().should('include', '/checkout');

  // Wait for checkout container to load
  cy.get('[data-cy="checkout-container"]', { timeout: 5000 })
    .should('be.visible');
});

/**
 * Login as admin user
 */
Cypress.Commands.add('loginAsAdmin', () => {
  // IMPORTANT: First load app.html (which exists),
  // then use client-side navigation to navigate to admin login
  cy.visit('/app.html');

  // Use client-side navigation via window.navigate()
  cy.window().then((win) => {
    win.navigate('admin-login');
  });

  // Wait for login page to render
  cy.contains('Admin Login').should('be.visible');

  // Enter credentials
  cy.get('[data-cy="username-input"]')
    .should('be.visible')
    .clear()
    .type('admin@everlywell.com');

  cy.get('[data-cy="password-input"]')
    .should('be.visible')
    .clear()
    .type('admin123');

  // Click login button
  cy.get('[data-cy="login-button"]')
    .should('be.visible')
    .click();

  // Verify successful login
  cy.url().should('include', '/admin/dashboard');
  cy.get('[data-cy="admin-panel"]', { timeout: 5000 })
    .should('be.visible');
});

/**
 * Logout current user
 */
Cypress.Commands.add('logout', () => {
  cy.contains('Logout').click();
  cy.url().should('not.include', '/admin');
});

/**
 * Apply promo code at checkout
 * @param {string} promoCode - The promo code to apply
 */
Cypress.Commands.add('applyPromoCode', (promoCode) => {
  cy.get('[data-cy="promo-code-input"]')
    .should('be.visible')
    .clear()
    .type(promoCode);

  cy.get('[data-cy="apply-promo-button"]')
    .should('be.visible')
    .click();

  cy.wait(300);
});

/**
 * Verify discount is applied correctly
 * @param {string} discountType - Type of discount (volume, promo)
 * @param {number} expectedAmount - Expected discount amount
 */
Cypress.Commands.add('verifyDiscountApplied', (discountType, expectedAmount) => {
  cy.get(`[data-cy="${discountType}-discount"]`)
    .should('be.visible');

  cy.get(`[data-cy="${discountType}-discount-amount"]`)
    .should('contain', expectedAmount.toFixed(2));
});

/**
 * Get current cart total
 * @returns {Cypress.Chainable<number>} The cart total as a number
 */
Cypress.Commands.add('getCartTotal', () => {
  return cy.get('[data-cy="order-total"]')
    .invoke('text')
    .then((text) => {
      return parseFloat(text.replace(/[^0-9.]/g, ''));
    });
});

/**
 * Clear cart completely
 */
Cypress.Commands.add('clearCart', () => {
  // In mock environment simply set quantity to 0
  cy.visit('/checkout');

  cy.get('[data-cy="item-quantity"]')
    .should('be.visible')
    .clear()
    .type('0');

  cy.get('[data-cy="update-cart"]').click();

  cy.wait(200);
});

/**
 * Verify order summary details
 * @param {Object} expected - Expected values {subtotal, discount, total}
 */
Cypress.Commands.add('verifyOrderSummary', (expected) => {
  if (expected.subtotal !== undefined) {
    cy.get('[data-cy="order-subtotal"]')
      .should('contain', expected.subtotal.toFixed(2));
  }

  if (expected.discount !== undefined) {
    cy.get('[data-cy="total-discounts"]')
      .should('contain', expected.discount.toFixed(2));
  }

  if (expected.total !== undefined) {
    cy.get('[data-cy="order-total"]')
      .should('contain', expected.total.toFixed(2));
  }
});

/**
 * Update cart quantity on checkout page
 * @param {number} newQuantity - New quantity to set
 */
Cypress.Commands.add('updateCartQuantity', (newQuantity) => {
  cy.get('[data-cy="item-quantity"]')
    .should('be.visible')
    .clear()
    .type(newQuantity.toString());

  cy.get('[data-cy="update-cart"]')
    .should('be.visible')
    .click();

  cy.wait(300);
});
