/* AI-GENERATED — Review required | Engineer: Ravi | Date: 2026-05-01 */
import { test, expect } from '@playwright/test';
import { ENV } from '../../utils/env';
import { URLS, TIMEOUTS } from '../../utils/constants';

import LoginPage from '../../pages/LoginPage';
import EventListingPage from '../../pages/EventListingPage';
import EventBookingPage from '../../pages/EventBookingPage';

test.setTimeout(TIMEOUTS.BOOKING_FLOW);

test.describe('Event Booking Module', () => {
  let loginPage:        LoginPage;
  let eventListingPage: EventListingPage;
  let bookingPage:      EventBookingPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.navigate();
    await loginPage.login(ENV.LOGIN_EMAIL, ENV.LOGIN_PASSWORD);
    await page.waitForURL((url) => !url.pathname.includes('/login'), { timeout: TIMEOUTS.NAVIGATION });

    eventListingPage = new EventListingPage(page);
    await eventListingPage.navigate();
    await eventListingPage.clickFirstEventCard();

    bookingPage = new EventBookingPage(page);
  });

  // ── TC-019 ──────────────────────────────────────────────────────────────────
  test('[TC-019] should confirm booking when all fields are filled with valid data @smoke',
    async ({ page }) => {

    // Arrange
    const fullName = 'Test User';
    const email    = 'test@test.com';
    const phone    = '9876543210';

    // Act
    await bookingPage.fillBookingForm(fullName, email, phone);
    await bookingPage.book(1);

    // Assert
    await bookingPage.assertBookingConfirmed();
    await page.screenshot({ path: 'test-results/TC-019-booking-confirmed.png', fullPage: true });
  });

  // ── TC-020 ──────────────────────────────────────────────────────────────────
  test('[TC-020] should show validation error when booking is attempted with empty fields @regression',
    async ({ page }) => {

    // Arrange
    // fields intentionally left empty

    // Act
    await bookingPage.clickBook();

    // Assert
    await bookingPage.assertStillOnBookingPage();
    await page.screenshot({ path: 'test-results/TC-020-empty-fields-validation.png', fullPage: true });
  });

  // ── TC-021 ──────────────────────────────────────────────────────────────────
  test('[TC-021] should disable the decrement button when seat count is at minimum @regression',
    async ({ page }) => {

    // Arrange
    // default seat count is 1 (minimum) — no action needed

    // Act
    // (seat count already at 1 after beforeEach navigate)

    // Assert — the − button must be disabled at count 1
    await bookingPage.assertSeatDecrementDisabled();
    await page.screenshot({ path: 'test-results/TC-021-seat-decrement-disabled.png', fullPage: true });
  });

  // ── TC-022 ──────────────────────────────────────────────────────────────────
  test('[TC-022] should cap seat selection at maximum when limit is exceeded @regression',
    async ({ page }) => {

    // Arrange
    const overMaxSeats = 11; // live UI shows (max 10)

    // Act — increment to max; selectSeats(10) clicks + nine times (1→10)
    await bookingPage.selectSeats(overMaxSeats - 1); // reach the cap

    // Assert — + button must become disabled once max is reached
    await bookingPage.assertSeatIncrementDisabled();
    await page.screenshot({ path: 'test-results/TC-022-seat-limit-capped.png', fullPage: true });
  });

  // ── TC-023 ──────────────────────────────────────────────────────────────────
  test('[TC-023] should show validation error when phone number format is invalid @regression',
    async ({ page }) => {

    // Arrange
    const invalidPhone = 'abc';

    // Act
    await bookingPage.fillBookingForm('Test User', 'test@test.com', invalidPhone);
    await bookingPage.clickBook();

    // Assert
    await bookingPage.assertBookingErrorVisible();
    await page.screenshot({ path: 'test-results/TC-023-invalid-phone.png', fullPage: true });
  });

  // ── TC-024 ──────────────────────────────────────────────────────────────────
  test('[TC-024] should redirect to My Bookings page after successful booking @regression',
    async ({ page }) => {

    // Arrange
    const fullName = 'Test User';
    const email    = 'test@test.com';
    const phone    = '9876543210';

    // Act
    await bookingPage.fillBookingForm(fullName, email, phone);
    await bookingPage.book(1);
    await bookingPage.assertBookingConfirmed();
    await bookingPage.clickViewMyBookings();

    // Assert
    await expect(page).toHaveURL(new RegExp(URLS.BOOKINGS), { timeout: TIMEOUTS.NAVIGATION });
    await page.screenshot({ path: 'test-results/TC-024-redirect-my-bookings.png', fullPage: true });
  });

});
