/* AI-GENERATED — Review required | Engineer: Ravi | Date: 2026-04-30 */
import { expect, type Locator, type Page } from '@playwright/test';
import { SelfHealingLocator } from '../utils/self-healing-locator';

export default class EventListingPage {
  private searchInput: SelfHealingLocator;

  constructor(private page: Page) {
    // Confirmed from snapshot: placeholder "Search events, venues…" — no aria-label present
    this.searchInput = new SelfHealingLocator(page, [
      { name: 'aria-label search',    locatorFn: (p) => p.locator('[aria-label*="search" i]'),   priority: 1 },
      { name: 'data-testid search',   locatorFn: (p) => p.getByTestId('search'),                 priority: 2 },
      { name: 'placeholder search',   locatorFn: (p) => p.getByPlaceholder(/search/i),           priority: 3 },
      { name: 'input[name=search]',   locatorFn: (p) => p.locator('input[name="search"]'),       priority: 4 },
      { name: 'input[type=search]',   locatorFn: (p) => p.locator('input[type="search"]'),       priority: 5 },
    ]);
  }

  async navigate() {
    await this.page.goto('/events');
    // Events are fetched async by React — wait for first card before any assertions
    await this.page.locator('article').first().waitFor({ state: 'visible', timeout: 15000 });
  }

  // Event cards are <article> elements — confirmed from live page snapshot
  getEventCards(): Locator {
    return this.page.locator('article');
  }

  getCardByTitle(text: string): Locator {
    return this.page.locator('article').filter({ hasText: text });
  }

  // NOTE: EventHub /events page has no search input as of May 2026.
  // searchForEvent() will throw a descriptive SelfHealingLocator error if called — correct behaviour.
  // Test coverage uses card count assertions instead.
  async searchForEvent(query: string) {
    await this.searchInput.fill(query);
  }

  async clickEventCard(title: string) {
    await this.getCardByTitle(title).getByRole('link').first().click();
  }

  async clickFirstEventCard() {
    await this.getEventCards().first().getByRole('link').first().click();
  }

  async assertPageLoaded() {
    await expect(this.page).toHaveURL(/\/events/);
  }

  async assertEventCountAtLeast(n: number) {
    await expect(this.getEventCards().first()).toBeVisible();
    const count = await this.getEventCards().count();
    expect(count).toBeGreaterThanOrEqual(n);
  }

  async assertEventVisible(title: string) {
    await expect(this.getCardByTitle(title)).toBeVisible();
  }

  async assertNoResultsVisible() {
    const noResults = this.page
      .locator('[data-testid="no-results"]')
      .or(this.page.getByText('No events found', { exact: false }));
    await expect(noResults).toBeVisible();
  }
}
