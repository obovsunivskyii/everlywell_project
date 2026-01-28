describe('Volume-Based Discount Feature - TESTS', () => {

  const PRODUCT_PRICE = 49.99;
  const VOLUME_THRESHOLD = 5;

  beforeEach(() => {
    // Clear all cookies and local storage before each test
    cy.clearCookies();
    cy.clearLocalStorage();

    // Navigate to the mock site homepage
    cy.visit('/app.html');

    // Verify the page has loaded successfully
    cy.contains('EverlyWell Health Tests').should('be.visible');
  });

  /**
   * ============================================
   * CATEGORY 1: CORE FUNCTIONALITY
   * ============================================
   */

  describe('Core Functionality', () => {

    it('TEST 1: Should apply volume discount when exactly 5 items added', () => {
      const quantity = VOLUME_THRESHOLD;
      const expectedDiscount = PRODUCT_PRICE;
      const expectedTotal = (PRODUCT_PRICE * quantity) - expectedDiscount;

      cy.log(`Adding ${quantity} items to cart to meet the volume discount threshold`);
      cy.addProductToCart('test-kit-standard', quantity);

      cy.log('Navigating to checkout page to verify discount calculation');
      cy.navigateToCheckout();

      cy.log('Verifying that volume discount is visible in the order summary');
      cy.get('[data-cy="volume-discount"]')
        .should('be.visible')
        .and('contain', 'Volume Discount');

      cy.log(`Verifying discount amount equals one item price ($${expectedDiscount.toFixed(2)})`);
      cy.get('[data-cy="volume-discount-amount"]')
        .should('contain', expectedDiscount.toFixed(2));

      cy.log(`Verifying final order total is $${expectedTotal.toFixed(2)} after discount applied`);
      cy.get('[data-cy="order-total"]')
        .should('contain', expectedTotal.toFixed(2));
    });

    it('TEST 2: Should NOT apply discount when less than 5 items', () => {
      const quantity = VOLUME_THRESHOLD - 1;
      const expectedTotal = PRODUCT_PRICE * quantity;

      cy.log(`Adding only ${quantity} items to cart (below threshold of ${VOLUME_THRESHOLD})`);
      cy.addProductToCart('test-kit-standard', quantity);

      cy.log('Navigating to checkout to verify no discount is applied');
      cy.navigateToCheckout();

      cy.log('Verifying that volume discount is NOT present in the order summary');
      cy.get('[data-cy="volume-discount"]').should('not.exist');

      cy.log(`Verifying order total is full price ($${expectedTotal.toFixed(2)}) without any discount`);
      cy.get('[data-cy="order-total"]')
        .should('contain', expectedTotal.toFixed(2));
    });

    it('TEST 3: Should apply discount when more than 5 items', () => {
      const quantity = VOLUME_THRESHOLD + 2;
      const expectedDiscount = PRODUCT_PRICE; // Still only 1 item free
      const expectedTotal = (PRODUCT_PRICE * quantity) - expectedDiscount;

      cy.log(`Adding ${quantity} items to cart (exceeding threshold of ${VOLUME_THRESHOLD})`);
      cy.addProductToCart('test-kit-standard', quantity);

      cy.log('Navigating to checkout to verify discount is still applied');
      cy.navigateToCheckout();

      cy.log('Verifying that volume discount is visible even with quantity above threshold');
      cy.get('[data-cy="volume-discount"]').should('be.visible');

      cy.log('Verifying discount amount remains for only 1 item regardless of excess quantity');
      cy.get('[data-cy="volume-discount-amount"]')
        .should('contain', expectedDiscount.toFixed(2));

      cy.log(`Verifying correct order total of $${expectedTotal.toFixed(2)} with single item discount`);
      cy.get('[data-cy="order-total"]')
        .should('contain', expectedTotal.toFixed(2));
    });
  });

  /**
   * ============================================
   * CATEGORY 2: PROMO CODE INTERACTION
   * ============================================
   */

  describe('Promo Code Interaction', () => {

    it('TEST 4: Volume discount should stay when promo code is weaker', () => {
      const quantity = VOLUME_THRESHOLD;
      const volumeDiscount = PRODUCT_PRICE; // ~$50
      const subtotal = PRODUCT_PRICE * quantity;
      const expectedTotal = subtotal - volumeDiscount;

      cy.log(`Adding ${quantity} items to cart and proceeding to checkout`);
      cy.addProductToCart('test-kit-standard', quantity);
      cy.navigateToCheckout();

      cy.log('Verifying volume discount is automatically applied at checkout');
      cy.get('[data-cy="volume-discount"]').should('be.visible');

      cy.log('Applying weaker promo code SAVE10 (10% discount) to test discount precedence');
      cy.applyPromoCode('SAVE10');

      cy.log('Verifying volume discount remains active since it provides better savings');
      cy.get('[data-cy="volume-discount"]').should('be.visible');

      cy.log('Verifying system displays message indicating volume discount is better');
      cy.get('[data-cy="promo-code-status"]')
        .should('contain', 'Volume discount provides better savings');

      cy.log(`Verifying order total uses volume discount ($${expectedTotal.toFixed(2)}), not promo code`);
      cy.get('[data-cy="order-total"]')
        .should('contain', expectedTotal.toFixed(2));
    });

    it('TEST 5: Promo code should replace volume discount when stronger', () => {
      const quantity = VOLUME_THRESHOLD;
      const subtotal = PRODUCT_PRICE * quantity;
      const promoDiscount = subtotal * 0.30; // 30% ≈ $75
      const expectedTotal = subtotal - promoDiscount;

      cy.log(`Adding ${quantity} items to cart and proceeding to checkout`);
      cy.addProductToCart('test-kit-standard', quantity);
      cy.navigateToCheckout();

      cy.log('Verifying volume discount is initially applied before promo code');
      cy.get('[data-cy="volume-discount"]').should('be.visible');

      cy.log('Applying stronger promo code SAVE30 (30% discount) to test discount replacement');
      cy.applyPromoCode('SAVE30');

      cy.log('Verifying volume discount is removed when stronger promo code is applied');
      cy.get('[data-cy="volume-discount"]').should('not.exist');

      cy.log(`Verifying promo discount is now applied with amount of $${promoDiscount.toFixed(2)}`);
      cy.get('[data-cy="promo-discount"]').should('be.visible');
      cy.get('[data-cy="promo-discount-amount"]')
        .should('contain', promoDiscount.toFixed(2));

      cy.log(`Verifying order total uses promo discount ($${expectedTotal.toFixed(2)}) instead of volume`);
      cy.get('[data-cy="order-total"]')
        .should('contain', expectedTotal.toFixed(2));
    });

    it('TEST 6: Volume discount should return when promo is removed', () => {
      const quantity = VOLUME_THRESHOLD;
      const volumeDiscount = PRODUCT_PRICE;

      cy.log(`Adding ${quantity} items to cart and proceeding to checkout`);
      cy.addProductToCart('test-kit-standard', quantity);
      cy.navigateToCheckout();

      cy.log('Applying strong promo code SAVE30 to replace volume discount temporarily');
      cy.applyPromoCode('SAVE30');
      cy.get('[data-cy="promo-discount"]').should('be.visible');

      cy.log('Removing promo code to test if volume discount automatically returns');
      cy.get('[data-cy="remove-promo-button"]').click();
      cy.wait(300);

      cy.log('Verifying volume discount automatically returns after promo code removal');
      cy.get('[data-cy="volume-discount"]').should('be.visible');
      cy.get('[data-cy="volume-discount-amount"]')
        .should('contain', volumeDiscount.toFixed(2));
    });
  });

  /**
   * ============================================
   * CATEGORY 3: DYNAMIC CART BEHAVIOR
   * ============================================
   */

  describe('Dynamic Cart Behavior', () => {

    it('TEST 7: Discount should appear when quantity increases to threshold', () => {
      const initialQty = VOLUME_THRESHOLD - 1;
      const newQty = VOLUME_THRESHOLD;

      cy.log(`Adding ${initialQty} items to cart (one below threshold of ${VOLUME_THRESHOLD})`);
      cy.addProductToCart('test-kit-standard', initialQty);
      cy.navigateToCheckout();

      cy.log('Verifying discount is not yet applied since threshold is not met');
      cy.get('[data-cy="volume-discount"]').should('not.exist');

      cy.log('Verifying progress indicator shows how many more items needed for discount');
      cy.get('[data-cy="volume-discount-progress"]')
        .should('be.visible')
        .and('contain', 'Add 1 more');

      cy.log(`Increasing cart quantity to ${newQty} to meet the volume discount threshold`);
      cy.updateCartQuantity(newQty);

      cy.log('Verifying discount automatically appears after reaching threshold quantity');
      cy.get('[data-cy="volume-discount"]').should('be.visible');

      cy.log('Verifying progress indicator disappears once discount threshold is achieved');
      cy.get('[data-cy="volume-discount-progress"]').should('not.exist');
    });

    it('TEST 8: Discount should disappear when quantity decreases below threshold', () => {
      const initialQty = VOLUME_THRESHOLD;
      const newQty = VOLUME_THRESHOLD - 1;

      cy.log(`Adding ${initialQty} items to cart (meeting threshold with discount applied)`);
      cy.addProductToCart('test-kit-standard', initialQty);
      cy.navigateToCheckout();

      cy.log('Verifying volume discount is initially present in cart');
      cy.get('[data-cy="volume-discount"]').should('be.visible');

      cy.log(`Decreasing cart quantity to ${newQty} (below threshold of ${VOLUME_THRESHOLD})`);
      cy.updateCartQuantity(newQty);

      cy.log('Verifying discount automatically disappears after going below threshold');
      cy.get('[data-cy="volume-discount"]').should('not.exist');

      cy.log('Verifying progress indicator reappears showing items needed to regain discount');
      cy.get('[data-cy="volume-discount-progress"]')
        .should('be.visible');
    });
  });

  /**
   * ============================================
   * CATEGORY 4: ADMIN CONFIGURATION PANEL
   * ============================================
   */

  describe('Admin Configuration', () => {

    it('TEST 9: Admin should be able to access discount settings', () => {
      cy.log('Logging in as admin user to access configuration panel');
      cy.loginAsAdmin();

      cy.log('Verifying admin dashboard loaded successfully after authentication');
      cy.get('[data-cy="admin-panel"]').should('be.visible');

      cy.log('Navigating to discount settings page using client-side routing');
      cy.window().then((win) => {
        win.navigate('admin-settings');
      });

      cy.log('Verifying discount settings configuration panel is visible and loaded');
      cy.get('[data-cy="discount-settings-panel"]').should('be.visible');

      cy.log('Verifying all key configuration fields are present and accessible');
      cy.get('[data-cy="volume-threshold-input"]').should('be.visible');
      cy.get('[data-cy="discount-type"]').should('be.visible');
      cy.get('[data-cy="volume-discount-enabled"]').should('be.visible');
    });

    it('TEST 10: Admin should be able to save discount settings', () => {
      const newThreshold = 3;

      cy.log('Logging in as admin to modify discount configuration');
      cy.loginAsAdmin();

      cy.log('Navigating to discount settings configuration page');
      cy.window().then((win) => {
        win.navigate('admin-settings');
      });

      cy.log(`Changing volume threshold from ${VOLUME_THRESHOLD} to ${newThreshold} items`);
      cy.get('[data-cy="volume-threshold-input"]')
        .clear()
        .type(newThreshold.toString());

      cy.log('Saving new discount configuration to persistent storage');
      cy.get('[data-cy="save-discount-settings"]').click();

      cy.log('Verifying success message confirms settings were saved successfully');
      cy.get('[data-cy="settings-saved-message"]')
        .should('be.visible')
        .and('contain', 'successfully');

      cy.log('Logging out from admin panel to test customer experience');
      cy.logout();

      cy.log(`Testing new threshold as customer by adding ${newThreshold} items`);
      cy.visit('/app.html');
      cy.addProductToCart('test-kit-standard', newThreshold);
      cy.navigateToCheckout();

      cy.log(`Verifying discount now applies at new threshold of ${newThreshold} items`);
      cy.get('[data-cy="volume-discount"]').should('be.visible');
    });
  });
});
