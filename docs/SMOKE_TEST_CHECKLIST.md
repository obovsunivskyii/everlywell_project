# Smoke Test Checklist - Volume Discount Feature

## Purpose
This checklist is designed for Product Owners or Release Managers to quickly verify the volume-based discount feature is working correctly before production release.

**⏱️ Estimated Time: 5-7 minutes**

---

## Pre-Requisites
- [ ] Access to staging environment
- [ ] Test account credentials
- [ ] Know the product ID or URL for a test product
- [ ] Confirm volume threshold = 5 items (or check admin settings)

---

## Test Environment Information

**Environment:** Staging
**URL:** https://staging.everlywell.com
**Test Account:** (Use your test account)
**Test Product:** Standard Health Test Kit (or any eligible product)
**Expected Discount:** Price of 1 item free when buying 5+

---

## Critical Path Tests (MUST PASS)

### ✅ Test 1: Volume Discount Applies at Threshold

**Goal:** Verify discount appears when 5 items are added to cart

1. [ ] Navigate to product page
2. [ ] Set quantity to **5**
3. [ ] Click "Add to Cart"
4. [ ] Click on cart icon
5. [ ] Click "Checkout" button
6. [ ] **VERIFY:** "Volume Discount" label is visible
7. [ ] **VERIFY:** Discount amount = Price of 1 item (example: -$49.99)
8. [ ] **VERIFY:** Total = (5 × item price) - discount

**✅ PASS / ❌ FAIL**

**Notes:**
_____________________________________________

---

### ✅ Test 2: No Discount Below Threshold

**Goal:** Verify no discount when less than 5 items

1. [ ] Clear cart (or start fresh)
2. [ ] Add **4 items** to cart
3. [ ] Navigate to checkout
4. [ ] **VERIFY:** NO "Volume Discount" label visible
5. [ ] **VERIFY:** Total = 4 × item price (full price)

**✅ PASS / ❌ FAIL**

**Notes:**
_____________________________________________

---

### ✅ Test 3: Promo Code vs Volume Discount (Better Discount Wins)

**Goal:** Verify the higher savings is applied

**Part A: Weaker Promo Code (Volume Discount Should Win)**

1. [ ] Add **5 items** to cart
2. [ ] Navigate to checkout
3. [ ] Note the volume discount amount (e.g., -$49.99)
4. [ ] Enter promo code: **SAVE10** (10% off - weaker than volume discount)
5. [ ] Click "Apply"
6. [ ] **VERIFY:** Volume discount remains (promo not applied)
7. [ ] **VERIFY:** Message shows "Volume discount provides better savings" (or similar)

**Part B: Stronger Promo Code (Promo Should Win)**

8. [ ] Enter promo code: **SAVE30** (30% off entire order)
9. [ ] Click "Apply"
10. [ ] **VERIFY:** Volume discount disappears
11. [ ] **VERIFY:** Promo discount appears (should be ~30% of subtotal)
12. [ ] **VERIFY:** Total reflects the larger (promo) discount

**✅ PASS / ❌ FAIL**

**Notes:**
_____________________________________________

---

### ✅ Test 4: Admin Configuration Accessible

**Goal:** Verify admins can manage discount settings

1. [ ] Login as admin user
2. [ ] Navigate to: **Admin Panel → Discount Settings** (or /admin/discount-settings)
3. [ ] **VERIFY:** Page loads successfully
4. [ ] **VERIFY:** Following settings are visible and editable:
   - [ ] Volume threshold (number input)
   - [ ] Discount type (dropdown: fixed/percentage)
   - [ ] Discount value (number input)
   - [ ] Enable/Disable toggle
5. [ ] **DO NOT SAVE CHANGES** (unless testing configuration change)

**✅ PASS / ❌ FAIL**

**Notes:**
_____________________________________________

---

## Edge Case Tests (SHOULD PASS)

### ✅ Test 5: Discount Updates When Quantity Changes

**Goal:** Verify discount appears/disappears dynamically

1. [ ] Add **5 items** to cart
2. [ ] Navigate to checkout
3. [ ] **VERIFY:** Volume discount visible
4. [ ] Change quantity to **4**
5. [ ] Click "Update" or wait for auto-update
6. [ ] **VERIFY:** Volume discount disappears
7. [ ] Change quantity back to **5**
8. [ ] **VERIFY:** Volume discount reappears

**✅ PASS / ❌ FAIL**

**Notes:**
_____________________________________________

---

### ✅ Test 6: Discount Persists Across Page Refresh

**Goal:** Verify discount is not lost on refresh

1. [ ] Add **5 items** to cart
2. [ ] Navigate to checkout
3. [ ] **VERIFY:** Volume discount visible
4. [ ] Refresh the page (F5 or Cmd+R)
5. [ ] Wait for page to reload
6. [ ] **VERIFY:** Volume discount still visible
7. [ ] **VERIFY:** Discount amount unchanged

**✅ PASS / ❌ FAIL**

**Notes:**
_____________________________________________

---

## Cross-Browser Quick Check (OPTIONAL)

If time permits, verify on different browsers:

### Chrome
1. [ ] Add 5 items → discount appears ✅
2. [ ] Apply promo code → works correctly ✅

### Safari
1. [ ] Add 5 items → discount appears ✅
2. [ ] Apply promo code → works correctly ✅

### Firefox
1. [ ] Add 5 items → discount appears ✅
2. [ ] Apply promo code → works correctly ✅

**✅ PASS / ❌ FAIL**

**Notes:**
_____________________________________________

---

## Mobile Quick Check (OPTIONAL)

Test on mobile device (iPhone or Android):

1. [ ] Add 5 items to cart (mobile)
2. [ ] Navigate to checkout
3. [ ] **VERIFY:** Discount displays correctly on mobile
4. [ ] **VERIFY:** Touch interactions work
5. [ ] **VERIFY:** No layout issues

**✅ PASS / ❌ FAIL**

**Notes:**
_____________________________________________

---

## Visual & UX Checks

### Discount Display Quality
1. [ ] Discount label is clearly visible (not hidden/cut off)
2. [ ] Discount amount shows correct format (e.g., -$49.99)
3. [ ] Discount is highlighted or differentiated (color, bold)
4. [ ] User understands WHY discount is applied (tooltip/message)

### User Experience
1. [ ] Checkout page loads quickly (<3 seconds)
2. [ ] Discount calculates instantly when cart updates
3. [ ] No confusing error messages
4. [ ] Clear messaging if promo code conflicts with volume discount

**✅ PASS / ❌ FAIL**

**Notes:**
_____________________________________________

---

## Summary & Sign-Off

### Test Results

| Test | Status | Notes |
|------|--------|-------|
| Test 1: Discount at Threshold | ✅ / ❌ | |
| Test 2: No Discount Below Threshold | ✅ / ❌ | |
| Test 3: Promo Code Logic | ✅ / ❌ | |
| Test 4: Admin Configuration | ✅ / ❌ | |
| Test 5: Dynamic Quantity Updates | ✅ / ❌ | |
| Test 6: Persists After Refresh | ✅ / ❌ | |
| **TOTAL PASSED:** | __ / 6 | |

---

### Critical Issues Found

**Issue #1:**
- **Description:** ___________________________________
- **Severity:** 🔴 Critical / 🟡 High / 🟢 Medium / ⚪ Low
- **Blocks Release?** YES / NO

**Issue #2:**
- **Description:** ___________________________________
- **Severity:** 🔴 Critical / 🟡 High / 🟢 Medium / ⚪ Low
- **Blocks Release?** YES / NO

**Issue #3:**
- **Description:** ___________________________________
- **Severity:** 🔴 Critical / 🟡 High / 🟢 Medium / ⚪ Low
- **Blocks Release?** YES / NO

---

### Release Recommendation

**Based on smoke test results:**

- [ ] ✅ **APPROVE RELEASE** - All critical tests passed, feature is ready
- [ ] ⚠️ **APPROVE WITH CONDITIONS** - Minor issues found, can be fixed post-release
- [ ] ❌ **BLOCK RELEASE** - Critical issues found, must be fixed before release

**Conditions/Notes:**
___________________________________________________________
___________________________________________________________
___________________________________________________________

---

### Sign-Off

**Tester Name:** _____________________________
**Date:** _______________
**Time:** _______________
**Environment:** Staging

**Reviewed By (Product Owner):** _____________________________
**Date:** _______________

---

## Quick Reference: Expected Behavior

| Scenario | Expected Behavior |
|----------|------------------|
| 5+ items of same product | Volume discount appears |
| <5 items | No volume discount |
| Weaker promo code | Volume discount stays |
| Stronger promo code | Promo code replaces volume discount |
| Remove promo code | Volume discount reappears (if still 5+ items) |
| Decrease quantity <5 | Volume discount disappears |
| Increase quantity to 5+ | Volume discount appears |
| Page refresh | Discount persists |
| Admin changes settings | Changes take effect immediately |

---

## Troubleshooting

### If Test Fails:

1. **Clear browser cache and cookies** - try again
2. **Check admin settings** - verify feature is enabled
3. **Verify product eligibility** - some products may be excluded
4. **Check environment** - ensure testing on correct environment
5. **Contact QA/Engineering** - if issue persists

### Common Issues:

| Problem | Likely Cause | Solution |
|---------|-------------|----------|
| Discount not appearing | Feature disabled in admin | Enable in admin settings |
| Wrong discount amount | Admin configuration incorrect | Verify admin settings |
| Promo code not working | Invalid code or expired | Check promo code validity |
| Page errors | Browser compatibility | Try different browser |
| Slow loading | Network issue | Refresh and try again |

---

## Emergency Contacts

**QA Lead:** [Name/Email/Phone]
**Engineering On-Call:** [Name/Email/Phone]
**Product Owner:** [Name/Email/Phone]

---

**End of Smoke Test Checklist**
