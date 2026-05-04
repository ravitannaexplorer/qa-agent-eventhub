/* AI-GENERATED — Review required | Engineer: Ravi | Date: 2026-05-01 */
import { expect, type Locator, type Page } from '@playwright/test';
import { SelfHealingLocator } from '../utils/self-healing-locator';
import { URLS } from '../utils/constants';

/**
 * Page Object for the authenticated user's My Bookings page (/bookings).
 *
 * Structure confirmed from the live EventHub app:
 *  - Booking cards render as <div> elements with class containing "booking" or "card"
 *  - Each card shows: Event title, booking ref, quantity, status badge, Cancel button
 *  - Empty state: heading/paragraph with text "no bookings"
 */
export default class MyBookingsPage {
  // Cancel button inside each booking card
  private cancelButton: SelfHealingLocator;

  constructor(private page: Page) {
    this.cancelButton = new SelfHealingLocator(page, [
      { name: 'role button Cancel',      locatorFn: (p) => p.getByRole('button', { name: /^cancel$/i }),     priority: 1 },
      { name: 'data-testid cancel',      locatorFn: (p) => p.getByTestId('cancel-booking'),                  priority: 2 },
      { name: 'aria-label cancel',       locatorFn: (p) => p.locator('[aria-label*="cancel" i]'),             priority: 3 },
      { name: 'button text cancel',      locatorFn: (p) => p.locator('button').filter({ hasText: /cancel/i }), priority: 4 },
    ]);
  }

  async navigate() {
    await this.page.goto(URLS.BOOKINGS);
    // Wait for either a booking card or the empty-state message
    await this.page.waitForLoadState('networkidle');
  }

  // ── Booking card locators ────────────────────────────────────────────────────

  /**
   * Returns all booking card elements.
   * The live UI renders cards in a list — each card has a "Cancel Booking" button.
   * We locate via the cancel button's closest card container.
   */
  getBookingCards(): Locator {
    // Each card is a div that contains a "Cancel Booking" or "View Details" button
    return this.page.locator('[data-testid="booking-card"]')
      .or(this.page.locator('div').filter({
        has: this.page.getByRole('button', { name: /cancel booking/i }),
      }))
      .or(this.page.locator('.booking-card, [class*="BookingCard"], [class*="booking-card"]'));
  }

  /**
   * Returns the card matching a specific booking reference string.
   */
  getCardByRef(bookingRef: string): Locator {
    return this.page.locator('[class*="booking"], article, [data-testid="booking-card"]')
      .filter({ hasText: bookingRef });
  }

  /**
   * Returns the card matching a specific event title.
   */
  getCardByEventTitle(title: string): Locator {
    return this.page.locator('[class*="booking"], article, [data-testid="booking-card"]')
      .filter({ hasText: title });
  }

  // ── Actions ─────────────────────────────────────────────────────────────────

  async cancelFirstBooking() {
    // Click the Cancel Booking button on the first booking card
    await this.cancelButton.click();

    // Wait for the custom confirm modal to appear
    // Live UI: modal with id="confirm-dialog-yes" and text "Yes, cancel it"
    const confirmBtn = this.page
      .locator('#confirm-dialog-yes')
      .or(this.page.getByTestId('confirm-dialog-yes'))
      .or(this.page.getByRole('button', { name: /yes,?\s*cancel/i }));

    await confirmBtn.first().waitFor({ state: 'visible', timeout: 5_000 });
    await confirmBtn.first().click();
  }

  async cancelBookingByRef(bookingRef: string) {
    const card = this.getCardByRef(bookingRef);
    await card.getByRole('button', { name: /cancel/i }).click();

    // Wait for the confirm dialog
    const confirmBtn = this.page
      .locator('#confirm-dialog-yes')
      .or(this.page.getByTestId('confirm-dialog-yes'))
      .or(this.page.getByRole('button', { name: /yes,?\s*cancel/i }));

    await confirmBtn.first().waitFor({ state: 'visible', timeout: 5_000 });
    await confirmBtn.first().click();
  }

  async getBookingCount(): Promise<number> {
    await this.page.waitForLoadState('networkidle');
    return this.getBookingCards().count();
  }

  // ── Assertions ───────────────────────────────────────────────────────────────

  async assertPageLoaded() {
    await expect(this.page).toHaveURL(new RegExp(URLS.BOOKINGS));
  }

  async assertBookingVisible(textOrRef: string) {
    await expect(
      this.page.locator('[class*="booking"], article, [data-testid="booking-card"]')
        .filter({ hasText: textOrRef })
    ).toBeVisible({ timeout: 10_000 });
  }

  async assertBookingNotVisible(textOrRef: string) {
    await expect(
      this.page.locator('[class*="booking"], article, [data-testid="booking-card"]')
        .filter({ hasText: textOrRef })
    ).not.toBeVisible({ timeout: 10_000 });
  }

  async assertBookingCountAtLeast(n: number) {
    await expect(this.getBookingCards().first()).toBeVisible({ timeout: 10_000 });
    const count = await this.getBookingCards().count();
    expect(count).toBeGreaterThanOrEqual(n);
  }

  /**
   * Asserts the empty-state message when a user has no bookings.
   * The live app shows a paragraph / heading with "no bookings" text.
   */
  async assertEmptyState() {
    const emptyMsg = this.page
      .getByText(/no bookings/i)
      .or(this.page.getByText(/you have no bookings/i))
      .or(this.page.getByTestId('empty-bookings'));
    await expect(emptyMsg.first()).toBeVisible({ timeout: 10_000 });
  }

  /**
   * Asserts that a specific booking card shows a given status (confirmed / cancelled).
   */
  async assertBookingStatus(textOrRef: string, status: 'confirmed' | 'cancelled') {
    const card = this.page
      .locator('[class*="booking"], article, [data-testid="booking-card"]')
      .filter({ hasText: textOrRef });
    await expect(card.getByText(new RegExp(status, 'i'))).toBeVisible();
  }
}
