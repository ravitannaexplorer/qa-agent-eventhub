/* AI-GENERATED — Review required | Engineer: Ravi | Date: 2026-04-30 */
import { expect, type Locator, type Page } from '@playwright/test';
import { SelfHealingLocator } from '../utils/self-healing-locator';

export interface EventFormData {
  title?:       string;
  description?: string;
  category?:    string;
  city?:        string;
  venue?:       string;
  date?:        string;   // format: YYYY-MM-DDTHH:MM
  price?:       number | string;
  seats?:       number | string;
  imageUrl?:    string;
}

export default class AdminManageEventsPage {
  // NOTE: the live page has no text search input — add searchInput SHL here if one is added.
  // Confirmed from snapshot: the create button reads "+ Add Event"
  private createEventButton: SelfHealingLocator;
  // Form field locators for the Create Event form
  private titleInput:        SelfHealingLocator;
  private cityInput:         SelfHealingLocator;
  private venueInput:        SelfHealingLocator;
  private dateInput:         SelfHealingLocator;
  private priceInput:        SelfHealingLocator;
  private seatsInput:        SelfHealingLocator;
  private categorySelect:    SelfHealingLocator;

  constructor(private page: Page) {
    this.createEventButton = new SelfHealingLocator(page, [
      { name: 'role button Add Event',     locatorFn: (p) => p.getByRole('button', { name: /add event/i }),    priority: 1 },
      { name: 'role button Create Event',  locatorFn: (p) => p.getByRole('button', { name: /create event/i }), priority: 2 },
      { name: 'role button New Event',     locatorFn: (p) => p.getByRole('button', { name: /new event/i }),     priority: 3 },
      { name: 'data-testid create-event',  locatorFn: (p) => p.getByTestId('create-event'),                     priority: 4 },
      { name: 'aria-label create',         locatorFn: (p) => p.locator('[aria-label*="create" i]'),             priority: 5 },
    ]);

    this.titleInput = new SelfHealingLocator(page, [
      { name: 'role textbox title',      locatorFn: (p) => p.getByRole('textbox', { name: /^title\*?$/i }),   priority: 1 },
      { name: 'label title',             locatorFn: (p) => p.getByLabel(/^title\*?$/i),                        priority: 2 },
      { name: 'placeholder event title', locatorFn: (p) => p.getByPlaceholder(/event title/i),                 priority: 3 },
      { name: 'data-testid title',       locatorFn: (p) => p.getByTestId('event-title'),                       priority: 4 },
    ]);

    this.categorySelect = new SelfHealingLocator(page, [
      { name: 'role combobox category', locatorFn: (p) => p.getByRole('combobox', { name: /category/i }),  priority: 1 },
      { name: 'label category',         locatorFn: (p) => p.getByLabel(/category/i),                        priority: 2 },
      { name: 'data-testid category',   locatorFn: (p) => p.getByTestId('category'),                        priority: 3 },
    ]);

    this.cityInput = new SelfHealingLocator(page, [
      { name: 'role textbox city',   locatorFn: (p) => p.getByRole('textbox', { name: /^city\*?$/i }),    priority: 1 },
      { name: 'label city',          locatorFn: (p) => p.getByLabel(/^city\*?$/i),                         priority: 2 },
      { name: 'placeholder city',    locatorFn: (p) => p.getByPlaceholder(/bangalore/i),                    priority: 3 },
      { name: 'data-testid city',    locatorFn: (p) => p.getByTestId('event-city'),                         priority: 4 },
    ]);

    this.venueInput = new SelfHealingLocator(page, [
      { name: 'role textbox venue',  locatorFn: (p) => p.getByRole('textbox', { name: /^venue\*?$/i }),   priority: 1 },
      { name: 'label venue',         locatorFn: (p) => p.getByLabel(/^venue\*?$/i),                        priority: 2 },
      { name: 'placeholder venue',   locatorFn: (p) => p.getByPlaceholder(/venue name/i),                   priority: 3 },
      { name: 'data-testid venue',   locatorFn: (p) => p.getByTestId('event-venue'),                        priority: 4 },
    ]);

    this.dateInput = new SelfHealingLocator(page, [
      { name: 'role textbox date',   locatorFn: (p) => p.getByRole('textbox', { name: /event date/i }),   priority: 1 },
      { name: 'label event date',    locatorFn: (p) => p.getByLabel(/event date/i),                        priority: 2 },
      { name: 'data-testid date',    locatorFn: (p) => p.getByTestId('event-date'),                        priority: 3 },
      { name: 'input[type=datetime]',locatorFn: (p) => p.locator('input[type="datetime-local"]'),          priority: 4 },
    ]);

    this.priceInput = new SelfHealingLocator(page, [
      { name: 'role spinbutton price', locatorFn: (p) => p.getByRole('spinbutton', { name: /price/i }),    priority: 1 },
      { name: 'label price',           locatorFn: (p) => p.getByLabel(/price/i),                            priority: 2 },
      { name: 'data-testid price',     locatorFn: (p) => p.getByTestId('event-price'),                      priority: 3 },
      { name: 'input[name=price]',     locatorFn: (p) => p.locator('input[name="price"]'),                  priority: 4 },
    ]);

    this.seatsInput = new SelfHealingLocator(page, [
      { name: 'role spinbutton seats', locatorFn: (p) => p.getByRole('spinbutton', { name: /total seats/i }), priority: 1 },
      { name: 'label seats',           locatorFn: (p) => p.getByLabel(/total seats/i),                         priority: 2 },
      { name: 'data-testid seats',     locatorFn: (p) => p.getByTestId('event-seats'),                         priority: 3 },
      { name: 'input[name=seats]',     locatorFn: (p) => p.locator('input[name="seats"]'),                     priority: 4 },
    ]);
  }

  async navigate() {
    await this.page.goto('/admin/events');
  }

  // Event rows are <tr> elements inside the table body — confirmed from live snapshot
  getEventRows(): Locator {
    return this.page.locator('table tbody tr');
  }

  async fillEventForm(data: EventFormData) {
    if (data.title       !== undefined) await this.titleInput.fill(data.title);
    if (data.category    !== undefined) await this.categorySelect.selectOption(data.category);
    if (data.city        !== undefined) await this.cityInput.fill(data.city);
    if (data.venue       !== undefined) await this.venueInput.fill(data.venue);
    if (data.date        !== undefined) await this.dateInput.fill(data.date);
    if (data.price       !== undefined) await this.priceInput.fill(String(data.price));
    if (data.seats       !== undefined) await this.seatsInput.fill(String(data.seats));
    if (data.imageUrl    !== undefined) {
      await this.page.getByRole('textbox', { name: /image url/i }).fill(data.imageUrl);
    }
  }

  async clickCreateEvent() {
    await this.createEventButton.click();
  }

  /**
   * Helper to open the form, fill it, and submit in one go.
   * On the live UI, the form is often embedded at the top, and the
   * submit button is labeled "+ Add Event".
   */
  async createEvent(data: EventFormData) {
    // Fill the fields (they should be visible on the page)
    await this.fillEventForm(data);
    
    // Click the submit button
    await this.clickCreateEvent();
  }

  async clickEditEvent(title: string) {
    await this.getEventRows()
      .filter({ hasText: title })
      .first()
      .getByRole('button', { name: 'Edit' })
      .click();
  }

  async clickDeleteEvent(title: string) {
    await this.getEventRows()
      .filter({ hasText: title })
      .first()
      .getByRole('button', { name: 'Delete' })
      .click();
  }

  // Deletes the first row that has a Delete button (skips read-only Featured rows)
  async clickDeleteFirstEditableEvent() {
    await this.getEventRows()
      .filter({ has: this.page.getByRole('button', { name: /delete/i }) })
      .first()
      .getByRole('button', { name: /delete/i })
      .click();
  }

  async confirmDelete() {
    // Dialog confirm button has data-testid="confirm-dialog-yes" and text "Delete event"
    await this.page.getByTestId('confirm-dialog-yes')
      .or(this.page.getByRole('button', { name: 'Delete event' }))
      .first()
      .click();
  }

  async getEventCount(): Promise<number> {
    return this.getEventRows().count();
  }

  async assertPageLoaded() {
    await expect(this.page).toHaveURL(/\/admin\/events/);
  }

  async assertEventCount(expected: number) {
    await expect(this.getEventRows()).toHaveCount(expected);
  }

  async assertEventCountAtLeast(n: number) {
    await expect(this.getEventRows().first()).toBeVisible();
    const count = await this.getEventRows().count();
    expect(count).toBeGreaterThanOrEqual(n);
  }

  async assertEventRowVisible(title: string) {
    await expect(this.getEventRows().filter({ hasText: title }).first()).toBeVisible();
  }

  async assertEventRowNotVisible(title: string) {
    await expect(this.getEventRows().filter({ hasText: title })).toHaveCount(0);
  }

  async assertLimitInfoVisible() {
    await expect(this.page.getByText(/6 events/i)).toBeVisible();
  }

  async assertValidationErrorVisible() {
    // Form stays on page when validation blocks submission
    await expect(this.page).toHaveURL(/\/admin\/events/);
  }
}
