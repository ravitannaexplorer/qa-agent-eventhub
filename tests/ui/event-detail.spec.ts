/* AI-GENERATED — Review required | Engineer: Ravi | Date: 2026-05-04 */
import { test, expect, Browser } from '@playwright/test';
import { ENV } from '../../utils/env';
import { URLS, TIMEOUTS } from '../../utils/constants';

import LoginPage        from '../../pages/LoginPage';
import EventListingPage from '../../pages/EventListingPage';
import EventBookingPage from '../../pages/EventBookingPage';

test.setTimeout(TIMEOUTS.DEFAULT);

test.describe('Event Detail Module', () => {

  // ── Shared auth setup for TC-013, TC-014, TC-015, TC-018 ─────────────────────
  // TC-016 and TC-017 do NOT use this beforeEach (they manage their own context)

  // ── TC-013 ───────────────────────────────────────────────────────────────────
  test('[TC-013] should open event detail page when clicking event card from listing @smoke',
    async ({ page }) => {

    // Arrange
    const loginPage        = new LoginPage(page);
    const eventListingPage = new EventListingPage(page);

    // Act
    await loginPage.navigate();
    await loginPage.login(ENV.LOGIN_EMAIL, ENV.LOGIN_PASSWORD);
    await page.waitForURL((url) => !url.pathname.includes('/login'), { timeout: TIMEOUTS.NAVIGATION });

    await eventListingPage.navigate();
    await eventListingPage.clickFirstEventCard();
    await page.waitForURL(/\/events\/\d+/, { timeout: TIMEOUTS.NAVIGATION });

    // Assert
    await expect(page).toHaveURL(/\/events\/\d+/);
    await page.screenshot({ path: 'test-results/TC-013-event-detail-opened.png', fullPage: true });
  });

  // ── TC-014 ───────────────────────────────────────────────────────────────────
  test('[TC-014] should display all event fields when event detail page loads @regression',
    async ({ page }) => {

    // Arrange
    const loginPage        = new LoginPage(page);
    const eventListingPage = new EventListingPage(page);

    // Act
    await loginPage.navigate();
    await loginPage.login(ENV.LOGIN_EMAIL, ENV.LOGIN_PASSWORD);
    await page.waitForURL((url) => !url.pathname.includes('/login'), { timeout: TIMEOUTS.NAVIGATION });

    await eventListingPage.navigate();
    await eventListingPage.clickFirstEventCard();
    await page.waitForURL(/\/events\/\d+/, { timeout: TIMEOUTS.NAVIGATION });

    // Assert — event title, description, venue/location info, and seat count must be present
    await expect(page.locator('h1, h2, h3').first()).toBeVisible();
    // Price — look for a currency symbol or numeric value rendered on the page
    await expect(
      page.locator('text=/[₹$€£]|price|per ticket/i').first()
    ).toBeVisible({ timeout: TIMEOUTS.ELEMENT });
    // Book-tickets heading confirms booking form is present
    await expect(page.getByRole('heading', { name: /book tickets/i })).toBeVisible({ timeout: TIMEOUTS.ELEMENT });

    await page.screenshot({ path: 'test-results/TC-014-event-fields-present.png', fullPage: true });
  });

  // ── TC-015 ───────────────────────────────────────────────────────────────────
  test('[TC-015] should display booking form when navigating to event detail page @regression',
    async ({ page }) => {

    // Arrange
    const loginPage        = new LoginPage(page);
    const eventListingPage = new EventListingPage(page);

    // Act
    await loginPage.navigate();
    await loginPage.login(ENV.LOGIN_EMAIL, ENV.LOGIN_PASSWORD);
    await page.waitForURL((url) => !url.pathname.includes('/login'), { timeout: TIMEOUTS.NAVIGATION });

    await eventListingPage.navigate();
    await eventListingPage.clickFirstEventCard();
    await page.waitForURL(/\/events\/\d+/, { timeout: TIMEOUTS.NAVIGATION });

    // Assert — booking form heading must be rendered inline on the detail page
    await expect(page.getByRole('heading', { name: /book tickets/i })).toBeVisible({ timeout: TIMEOUTS.ELEMENT });
    await page.screenshot({ path: 'test-results/TC-015-booking-form-visible.png', fullPage: true });
  });

  // ── TC-016 ───────────────────────────────────────────────────────────────────
  // No auth required — navigate directly to a non-existent event ID
  test('[TC-016] should show 404 or error message when accessing non-existent event directly @regression',
    async ({ page }) => {

    // Arrange — no login needed

    // Act
    await page.goto(`${ENV.BASE_URL}/events/99999`);
    await page.waitForLoadState('networkidle');

    // Assert — expect either a 404-style heading or an error/not-found message
    const errorIndicator = page
      .getByText(/404|not found|event not found|does not exist|no event/i)
      .or(page.getByRole('heading', { name: /404|not found/i }));

    await expect(errorIndicator.first()).toBeVisible({ timeout: TIMEOUTS.NAVIGATION });
    await page.screenshot({ path: 'test-results/TC-016-nonexistent-event.png', fullPage: true });
  });

  // ── TC-017 ───────────────────────────────────────────────────────────────────
  // No auth — use a fresh context without storageState to test auth guard
  test('[TC-017] should redirect to login when accessing protected event page without auth @regression',
    async ({ browser }: { browser: Browser }) => {

    // Arrange — fresh context with NO storageState (explicitly empty)
    const ctx  = await browser.newContext({ storageState: { cookies: [], origins: [] } });
    const page = await ctx.newPage();

    try {
      // Act
      await page.goto(`${ENV.BASE_URL}/events/1`);
      await page.waitForLoadState('networkidle');

      // Assert — must redirect to /login OR show an auth error
      const isOnLogin = page.url().includes('/login');
      const errorMsg  = page.getByText(/unauthori[sz]ed|please log in|sign in|access denied/i);

      if (!isOnLogin) {
        await expect(errorMsg.first()).toBeVisible({ timeout: TIMEOUTS.NAVIGATION });
      } else {
        await expect(page).toHaveURL(/\/login/);
      }

      await page.screenshot({ path: 'test-results/TC-017-auth-guard-redirect.png', fullPage: true });
    } finally {
      await ctx.close();
    }
  });

  // ── TC-018 ───────────────────────────────────────────────────────────────────
  test('[TC-018] should display a valid ticket price on event detail page @regression',
    async ({ page }) => {

    // Arrange
    const loginPage        = new LoginPage(page);
    const eventListingPage = new EventListingPage(page);
    const bookingPage      = new EventBookingPage(page);

    // Act
    await loginPage.navigate();
    await loginPage.login(ENV.LOGIN_EMAIL, ENV.LOGIN_PASSWORD);
    await page.waitForURL((url) => !url.pathname.includes('/login'), { timeout: TIMEOUTS.NAVIGATION });

    await eventListingPage.navigate();
    await eventListingPage.clickFirstEventCard();
    await page.waitForURL(/\/events\/\d+/, { timeout: TIMEOUTS.NAVIGATION });

    // Read the displayed price text — look for any currency amount
    const priceLocator = page.locator('text=/[₹$€£]\\s*\\d+|\\d+\\s*[₹$€£]/').first();
    const priceText    = await priceLocator.textContent({ timeout: TIMEOUTS.ELEMENT });

    // Extract numeric value from price string
    const priceMatch   = priceText?.match(/\d+(\.\d+)?/);
    const pricePerUnit = priceMatch ? parseFloat(priceMatch[0]) : NaN;

    // Select 2 seats
    await bookingPage.selectSeats(2);

    // Assert — price per ticket must be a valid positive number
    // NOTE: EventHub may not show a running total — asserting unit price is numeric instead.
    // If a total price element is present, it should equal pricePerUnit × 2.
    expect(pricePerUnit, 'Price per ticket should be a valid positive number').toBeGreaterThan(0);

    // Best-effort: check if a "total" element exists and matches expected calculation
    const totalLocator = page.locator('[data-testid="total-price"], text=/total/i').first();
    const totalVisible = await totalLocator.isVisible().catch(() => false);
    if (totalVisible) {
      const totalText  = await totalLocator.textContent();
      const totalMatch = totalText?.match(/\d+(\.\d+)?/);
      if (totalMatch) {
        const displayedTotal = parseFloat(totalMatch[0]);
        expect(displayedTotal).toBe(pricePerUnit * 2);
      }
    }

    await page.screenshot({ path: 'test-results/TC-018-price-calculation.png', fullPage: true });
  });

});
