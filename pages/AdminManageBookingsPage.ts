/* AI-GENERATED — Review required | Engineer: Ravi | Date: 2026-04-30 */
import { expect, type Locator, type Page } from '@playwright/test';
import { SelfHealingLocator } from '../utils/self-healing-locator';

export default class AdminManageBookingsPage {
  // NOTE: the live page has a status filter combobox, not a text search input.
  // Strategies are ready for when a text search is added to the UI.
  private searchInput:    SelfHealingLocator;
  private statusFilter:   SelfHealingLocator;

  constructor(private page: Page) {
    this.searchInput = new SelfHealingLocator(page, [
      { name: 'aria-label search',    locatorFn: (p) => p.locator('[aria-label*="search" i]'),   priority: 1 },
      { name: 'data-testid search',   locatorFn: (p) => p.getByTestId('search'),                 priority: 2 },
      { name: 'placeholder search',   locatorFn: (p) => p.getByPlaceholder(/search/i),           priority: 3 },
      { name: 'input[name=search]',   locatorFn: (p) => p.locator('input[name="search"]'),       priority: 4 },
      { name: 'input[type=search]',   locatorFn: (p) => p.locator('input[type="search"]'),       priority: 5 },
    ]);

    this.statusFilter = new SelfHealingLocator(page, [
      { name: 'role combobox status', locatorFn: (p) => p.getByRole('combobox'),                            priority: 1 },
      { name: 'data-testid filter',   locatorFn: (p) => p.getByTestId('status-filter'),                     priority: 2 },
      { name: 'label status',         locatorFn: (p) => p.getByLabel(/status/i),                            priority: 3 },
      { name: 'select[name=status]',  locatorFn: (p) => p.locator('select[name="status"]'),                 priority: 4 },
    ]);
  }

  async navigate() {
    await this.page.goto('/admin/bookings');
  }

  // Booking rows are <tr> elements inside the table body — confirmed from live snapshot
  getBookingRows(): Locator {
    return this.page.locator('table tbody tr');
  }

  async searchBooking(query: string) {
    await this.searchInput.fill(query);
  }

  async filterByStatus(status: string) {
    await this.statusFilter.selectOption(status);
  }

  // Clicks Cancel on the first bookable row, then confirms the dialog
  async cancelFirstBooking() {
    await this.getBookingRows()
      .filter({ has: this.page.getByRole('button', { name: 'Cancel' }) })
      .first()
      .getByRole('button', { name: 'Cancel' })
      .click();
    // Dialog: "Cancel this booking?" — confirmed from live snapshot
    await this.page.getByTestId('confirm-dialog-yes')
      .or(this.page.getByRole('button', { name: /yes.*cancel/i }))
      .first()
      .click();
  }

  async getBookingCount(): Promise<number> {
    return this.getBookingRows().count();
  }

  async assertPageLoaded() {
    await expect(this.page).toHaveURL(/\/admin\/bookings/);
  }

  async assertBookingCount(expected: number) {
    await expect(this.getBookingRows()).toHaveCount(expected);
  }

  async assertBookingCountAtLeast(n: number) {
    await expect(this.getBookingRows().first()).toBeVisible();
    const count = await this.getBookingRows().count();
    expect(count).toBeGreaterThanOrEqual(n);
  }

  async assertBookingVisible(text: string) {
    await expect(this.getBookingRows().filter({ hasText: text }).first()).toBeVisible();
  }

  async assertColumnHeadersVisible() {
    const headers = ['Ref', 'Customer', 'Event', 'Qty', 'Total', 'Status', 'Date', 'Actions'];
    for (const header of headers) {
      await expect(this.page.getByRole('columnheader', { name: header })).toBeVisible();
    }
  }

  // Asserts the status cell of the first booking row contains the expected text
  async assertFirstBookingStatus(expected: string) {
    const firstRow = this.getBookingRows().first();
    await expect(firstRow).toContainText(new RegExp(expected, 'i'));
  }
}
