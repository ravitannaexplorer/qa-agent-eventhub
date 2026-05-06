/* AI-GENERATED — Review required | Engineer: Ravi | Date: 2026-04-30 */
import { expect, type Page } from '@playwright/test';
import { SelfHealingLocator } from '../utils/self-healing-locator';

export default class EventBookingPage {
  // The live UI uses +/− buttons for seat count, not a text input.
  // seatCountInput targets the increment "+" button as priority 1,
  // with fallbacks for if the UI later changes to a number input.
  private seatCountInput: SelfHealingLocator;
  private bookButton:     SelfHealingLocator;
  private fullNameInput:  SelfHealingLocator;
  private emailInput:     SelfHealingLocator;
  private phoneInput:     SelfHealingLocator;

  constructor(private page: Page) {
    this.seatCountInput = new SelfHealingLocator(page, [
      { name: 'role button +',       locatorFn: (p) => p.getByRole('button', { name: '+' }),        priority: 1 },
      { name: 'input[type=number]',  locatorFn: (p) => p.locator('input[type="number"]'),           priority: 2 },
      { name: 'data-testid qty',     locatorFn: (p) => p.getByTestId('quantity'),                   priority: 3 },
      { name: 'aria-label seat',     locatorFn: (p) => p.locator('[aria-label*="seat" i]'),         priority: 4 },
      { name: 'aria-label quantity', locatorFn: (p) => p.locator('[aria-label*="quantity" i]'),     priority: 5 },
    ]);

    this.bookButton = new SelfHealingLocator(page, [
      { name: 'role button Confirm Booking', locatorFn: (p) => p.getByRole('button', { name: /confirm booking/i }), priority: 1 },
      { name: 'role button Book',            locatorFn: (p) => p.getByRole('button', { name: /^book$/i }),           priority: 2 },
      { name: 'data-testid book-button',     locatorFn: (p) => p.getByTestId('book-button'),                         priority: 3 },
      { name: 'role button Buy Tickets',     locatorFn: (p) => p.getByRole('button', { name: /buy tickets/i }),      priority: 4 },
      { name: 'button[type=submit]',         locatorFn: (p) => p.locator('button[type="submit"]'),                   priority: 5 },
    ]);

    this.fullNameInput = new SelfHealingLocator(page, [
      { name: 'role textbox full name',   locatorFn: (p) => p.getByRole('textbox', { name: /full name/i }),   priority: 1 },
      { name: 'label full name',          locatorFn: (p) => p.getByLabel(/full name/i),                        priority: 2 },
      { name: 'placeholder your name',    locatorFn: (p) => p.getByPlaceholder(/your full name/i),             priority: 3 },
      { name: 'data-testid full-name',    locatorFn: (p) => p.getByTestId('full-name'),                        priority: 4 },
    ]);

    this.emailInput = new SelfHealingLocator(page, [
      { name: 'role textbox email',       locatorFn: (p) => p.getByRole('textbox', { name: /^email\*?$/i }),   priority: 1 },
      { name: 'label email',              locatorFn: (p) => p.getByLabel(/^email\*?$/i),                        priority: 2 },
      { name: 'placeholder you@email',    locatorFn: (p) => p.getByPlaceholder(/you@email/i),                   priority: 3 },
      { name: 'data-testid email',        locatorFn: (p) => p.getByTestId('email'),                             priority: 4 },
    ]);

    this.phoneInput = new SelfHealingLocator(page, [
      { name: 'role textbox phone',       locatorFn: (p) => p.getByRole('textbox', { name: /phone/i }),        priority: 1 },
      { name: 'label phone',              locatorFn: (p) => p.getByLabel(/phone/i),                             priority: 2 },
      { name: 'placeholder +91',          locatorFn: (p) => p.getByPlaceholder(/\+91/i),                        priority: 3 },
      { name: 'data-testid phone',        locatorFn: (p) => p.getByTestId('phone'),                             priority: 4 },
    ]);
  }

  // Increments the seat count from the default of 1 up to the requested count.
  // Uses the +/− button UI as-is on the live page.
  async selectSeats(count: number) {
    if (count <= 1) return;
    for (let i = 1; i < count; i++) {
      await this.seatCountInput.click();
    }
  }

  async fillBookingForm(fullName: string, email: string, phone: string) {
    await this.fullNameInput.fill(fullName);
    await this.emailInput.fill(email);
    await this.phoneInput.fill(phone);
  }

  async clickBook() {
    await this.bookButton.click();
  }

  async book(seatCount: number) {
    await this.selectSeats(seatCount);
    await this.clickBook();
  }

  async clickViewMyBookings() {
    const target = this.page.getByRole('link', { name: /view.*bookings/i })
      .or(this.page.getByRole('button', { name: /view.*bookings/i }));
    await target.first().click();
  }

  async assertBookingConfirmed() {
    // Confirmation renders as a heading, not role="alert"
    await expect(
      this.page.getByRole('heading', { name: /booking confirmed/i })
    ).toBeVisible({ timeout: 10_000 });
  }

  async assertBookingErrorVisible(message?: string) {
    const alert = this.page.getByRole('alert');
    await expect(alert).toBeVisible();
    if (message) {
      await expect(alert).toContainText(message);
    }
  }

  async assertSeatDecrementDisabled() {
    await expect(this.page.getByRole('button', { name: '−' })).toBeDisabled();
  }

  async assertSeatIncrementDisabled() {
    await expect(this.page.getByRole('button', { name: '+' })).toBeDisabled();
  }

  async assertEventTitleVisible(title: string) {
    await expect(this.page.locator('h1, h2, h3').filter({ hasText: title }).first()).toBeVisible();
  }

  async assertSeatLimitError() {
    await expect(this.page.getByRole('alert')).toBeVisible();
  }

  async assertStillOnBookingPage() {
    await expect(this.page).toHaveURL(/\/events\/\d+/);
  }
}
