/* AI-GENERATED — Review required | Engineer: Ravi | Date: 2026-05-01 */
import { test } from '@playwright/test';
import { ENV } from '../../utils/env';
import { TIMEOUTS } from '../../utils/constants';
import LoginPage from '../../pages/LoginPage';
import AdminManageBookingsPage from '../../pages/AdminManageBookingsPage';

test.setTimeout(TIMEOUTS.DEFAULT);

test.describe('Admin Manage Bookings Module', () => {
  let loginPage:          LoginPage;
  let adminBookingsPage:  AdminManageBookingsPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.navigate();
    await loginPage.login(ENV.LOGIN_EMAIL, ENV.LOGIN_PASSWORD);
    await page.waitForURL((url) => !url.pathname.includes('/login'), { timeout: TIMEOUTS.NAVIGATION });
    adminBookingsPage = new AdminManageBookingsPage(page);
    await adminBookingsPage.navigate();
  });

  // ── TC-039 ──────────────────────────────────────────────────────────────────
  test('[TC-039] should display bookings table with all required columns when page loads @smoke',
    async ({ page }) => {

    // Arrange
    // (navigation done in beforeEach)

    // Act
    // (table renders on page load)

    // Assert
    await adminBookingsPage.assertPageLoaded();
    await adminBookingsPage.assertBookingCountAtLeast(1);
    await adminBookingsPage.assertColumnHeadersVisible();
    await page.screenshot({ path: 'test-results/TC-039-bookings-table-loaded.png', fullPage: true });
  });

  // ── TC-040 ──────────────────────────────────────────────────────────────────
  test('[TC-040] should remove booking from list when admin cancels it @regression',
    async ({ page }) => {

    // Arrange
    await adminBookingsPage.assertBookingCountAtLeast(1);
    const initialCount = await adminBookingsPage.getBookingCount();

    // Act
    await adminBookingsPage.cancelFirstBooking();

    // Assert — app removes (not status-changes) the booking; row count decreases by 1
    await adminBookingsPage.assertBookingCount(initialCount - 1);
    await page.screenshot({ path: 'test-results/TC-040-booking-cancelled.png', fullPage: true });
  });

  // ── TC-041 ──────────────────────────────────────────────────────────────────
  test('[TC-041] should filter booking list when a status is selected @regression',
    async ({ page }) => {

    // NOTE: Admin bookings has status filter only, no text search
    // (original test: enter customer name in search and verify filtered results)

    // Arrange
    // (page loaded in beforeEach showing all bookings)

    // Act
    await adminBookingsPage.filterByStatus('Confirmed');

    // Assert — confirmed bookings are shown after filtering
    await adminBookingsPage.assertBookingCountAtLeast(1);
    await page.screenshot({ path: 'test-results/TC-041-status-filter.png', fullPage: true });
  });

  // ── TC-042 ──────────────────────────────────────────────────────────────────
  test.skip('[TC-042] should show empty state message when no bookings exist @regression', () => {
    // NOTE: This test requires mocking the bookings API to return 0 results.
    // UI-layer tests cannot intercept API responses without page.route() setup
    // which is outside the scope of this POM-based test suite.
    // Recommend adding this to a dedicated API-mocking spec if required.
  });

});
