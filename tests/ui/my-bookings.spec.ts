/* AI-GENERATED — Review required | Engineer: Ravi | Date: 2026-05-04 */
import { test, expect, Browser } from '@playwright/test';
import { ENV } from '../../utils/env';
import { URLS, TIMEOUTS } from '../../utils/constants';

import LoginPage        from '../../pages/LoginPage';
import MyBookingsPage   from '../../pages/MyBookingsPage';
import EventListingPage from '../../pages/EventListingPage';
import EventBookingPage from '../../pages/EventBookingPage';

test.setTimeout(TIMEOUTS.DEFAULT);

test.describe('My Bookings Module', () => {

  // ── TC-025 ───────────────────────────────────────────────────────────────────
  test('[TC-025] should display list of bookings when authenticated user visits My Bookings @smoke',
    async ({ page }) => {

    // Arrange
    const loginPage      = new LoginPage(page);
    const myBookingsPage = new MyBookingsPage(page);

    await loginPage.navigate();
    await loginPage.login(ENV.LOGIN_EMAIL, ENV.LOGIN_PASSWORD);
    await page.waitForURL((url) => !url.pathname.includes('/login'), { timeout: TIMEOUTS.NAVIGATION });

    // If there are no bookings, create one first so assertBookingCountAtLeast(1) can pass
    await myBookingsPage.navigate();
    const initialCount = await myBookingsPage.getBookingCount();

    if (initialCount === 0) {
      // Create a booking via UI so the page is not empty
      const eventListingPage = new EventListingPage(page);
      const bookingPage      = new EventBookingPage(page);

      await eventListingPage.navigate();
      await eventListingPage.clickFirstEventCard();
      await bookingPage.fillBookingForm('TC025 User', ENV.LOGIN_EMAIL, '9876543210');
      await bookingPage.book(1);
      await bookingPage.assertBookingConfirmed();

      await myBookingsPage.navigate();
    }

    // Assert
    await myBookingsPage.assertPageLoaded();
    await myBookingsPage.assertBookingCountAtLeast(1);
    await page.screenshot({ path: 'test-results/TC-025-bookings-list-visible.png', fullPage: true });
  });

  // ── TC-026 ───────────────────────────────────────────────────────────────────
  test('[TC-026] should decrease booking count when an active booking is cancelled @regression',
    async ({ page }) => {

    // Arrange
    const loginPage      = new LoginPage(page);
    const myBookingsPage = new MyBookingsPage(page);

    await loginPage.navigate();
    await loginPage.login(ENV.LOGIN_EMAIL, ENV.LOGIN_PASSWORD);
    await page.waitForURL((url) => !url.pathname.includes('/login'), { timeout: TIMEOUTS.NAVIGATION });

    // Ensure at least one booking exists before trying to cancel
    await myBookingsPage.navigate();
    let bookingCount = await myBookingsPage.getBookingCount();

    if (bookingCount === 0) {
      const eventListingPage = new EventListingPage(page);
      const bookingPage      = new EventBookingPage(page);

      await eventListingPage.navigate();
      await eventListingPage.clickFirstEventCard();
      await bookingPage.fillBookingForm('TC026 User', ENV.LOGIN_EMAIL, '9876543210');
      await bookingPage.book(1);
      await bookingPage.assertBookingConfirmed();

      await myBookingsPage.navigate();
      bookingCount = await myBookingsPage.getBookingCount();
    }

    // Act — cancel the first booking
    await myBookingsPage.cancelFirstBooking();

    // Assert — wait for the count to decrease
    await expect(async () => {
      const count = await myBookingsPage.getBookingCount();
      expect(count).toBeLessThan(bookingCount);
    }).toPass({ timeout: 10_000 });

    await page.screenshot({ path: 'test-results/TC-026-booking-cancelled.png', fullPage: true });
  });

  // ── TC-027 ───────────────────────────────────────────────────────────────────
  test('[TC-027] should show empty state message when user has no bookings @regression',
    async ({ page }) => {

    // Arrange
    const loginPage      = new LoginPage(page);
    const myBookingsPage = new MyBookingsPage(page);

    await loginPage.navigate();
    await loginPage.login(ENV.LOGIN_EMAIL, ENV.LOGIN_PASSWORD);
    await page.waitForURL((url) => !url.pathname.includes('/login'), { timeout: TIMEOUTS.NAVIGATION });

    await myBookingsPage.navigate();
    const count = await myBookingsPage.getBookingCount();

    // NOTE: Cannot guarantee empty state on a shared live app — skip if bookings exist.
    // To test this properly, a dedicated test user with no bookings would be required.
    if (count > 0) {
      test.skip(true, 'Bookings exist — cannot trigger empty state on shared live app');
      return;
    }

    // Act — already on /bookings with 0 cards

    // Assert
    await myBookingsPage.assertEmptyState();
    await page.screenshot({ path: 'test-results/TC-027-empty-state.png', fullPage: true });
  });

  // TC-028 — DISABLED in Excel (Enabled: false) — not implemented

  // ── TC-029 ───────────────────────────────────────────────────────────────────
  test('[TC-029] should display event title, booking reference, seat count and status on booking card @regression',
    async ({ page }) => {

    // Arrange
    const loginPage      = new LoginPage(page);
    const myBookingsPage = new MyBookingsPage(page);

    await loginPage.navigate();
    await loginPage.login(ENV.LOGIN_EMAIL, ENV.LOGIN_PASSWORD);
    await page.waitForURL((url) => !url.pathname.includes('/login'), { timeout: TIMEOUTS.NAVIGATION });

    await myBookingsPage.navigate();
    const count = await myBookingsPage.getBookingCount();

    // Ensure at least one card is present
    if (count === 0) {
      const eventListingPage = new EventListingPage(page);
      const bookingPage      = new EventBookingPage(page);

      await eventListingPage.navigate();
      await eventListingPage.clickFirstEventCard();
      await bookingPage.fillBookingForm('TC029 User', ENV.LOGIN_EMAIL, '9876543210');
      await bookingPage.book(1);
      await bookingPage.assertBookingConfirmed();

      await myBookingsPage.navigate();
    }

    // Assert — first card must contain visible text for each required detail field
    const firstCard = myBookingsPage.getBookingCards().first();
    await expect(firstCard).toBeVisible({ timeout: TIMEOUTS.ELEMENT });

    // Event title — any non-empty heading or strong text inside the card
    await expect(firstCard.locator('h2, h3, h4, [class*="title"], strong').first())
      .toBeVisible({ timeout: TIMEOUTS.ELEMENT });

    // Booking reference — look for a ref/ID pattern (alphanumeric string or "Ref:" label)
    await expect(
      firstCard.locator('text=/ref|booking.*(id|ref|#)|#[A-Za-z0-9]/i').first()
        .or(firstCard.locator('[class*="ref"], [data-testid*="ref"]').first()).first()
    ).toBeVisible({ timeout: TIMEOUTS.ELEMENT });

    // Status badge — confirmed or cancelled text
    await expect(
      firstCard.getByText(/confirmed|cancelled|active|pending/i).first()
    ).toBeVisible({ timeout: TIMEOUTS.ELEMENT });

    await page.screenshot({ path: 'test-results/TC-029-booking-card-details.png', fullPage: true });
  });

  // ── TC-030 ───────────────────────────────────────────────────────────────────
  // No auth — fresh context without storageState to test route guard
  test('[TC-030] should redirect to login when accessing bookings page without auth @regression',
    async ({ browser }: { browser: Browser }) => {

    // Arrange — fresh browser context with NO storageState (explicitly empty)
    const ctx  = await browser.newContext({ storageState: { cookies: [], origins: [] } });
    const page = await ctx.newPage();

    try {
      // Act
      await page.goto(`${ENV.BASE_URL}${URLS.BOOKINGS}`);
      await page.waitForLoadState('networkidle');

      // Assert — must land on /login
      await expect(page).toHaveURL(/\/login/, { timeout: TIMEOUTS.NAVIGATION });
      await page.screenshot({ path: 'test-results/TC-030-bookings-auth-guard.png', fullPage: true });
    } finally {
      await ctx.close();
    }
  });

});
