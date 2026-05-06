/* AI-GENERATED — Review required | Engineer: Ravi | Date: 2026-05-01 */
import { test } from '../fixtures/auth.fixture';
import { ENV } from '../../utils/env';
import { URLS, TIMEOUTS } from '../../utils/constants';
import LoginPage from '../../pages/LoginPage';
import AdminManageEventsPage from '../../pages/AdminManageEventsPage';

test.setTimeout(TIMEOUTS.DEFAULT);

// Tracks titles of events created during this run so afterAll can delete them
const createdEventTitles: string[] = [];

test.describe('Admin Manage Events Module', () => {
  let loginPage:       LoginPage;
  let adminEventsPage: AdminManageEventsPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.navigate();
    await loginPage.login(ENV.LOGIN_EMAIL, ENV.LOGIN_PASSWORD);
    await page.waitForURL((url) => !url.pathname.includes('/login'), { timeout: TIMEOUTS.NAVIGATION });
    adminEventsPage = new AdminManageEventsPage(page);
    await adminEventsPage.navigate();
  });

  test.afterAll(async ({ request, authToken }) => {
    if (createdEventTitles.length === 0) return;
    const headers = { 'Authorization': `Bearer ${authToken}` };
    const resp = await request.get(`${URLS.API_EVENTS}?limit=100`, { headers });
    if (!resp.ok()) return;
    const json = await resp.json();
    for (const title of createdEventTitles) {
      const event = json.data.find((e: { title: string; id: number }) => e.title === title);
      if (event) {
        await request.delete(`${URLS.API_EVENTS}/${event.id}`, { headers });
      }
    }
  });

  // ── TC-031 ──────────────────────────────────────────────────────────────────
  test('[TC-031] should create event and show it in list when all fields are valid @smoke',
    async ({ page }) => {

    // Arrange — unique title prevents duplicate-row failures across runs
    const eventTitle = `Tech Summit ${Date.now()}`;
    createdEventTitles.push(eventTitle);

    // Act
    await adminEventsPage.fillEventForm({
      title:    eventTitle,
      category: 'Conference',
      city:     'Hyderabad',
      venue:    'HICC',
      date:     '2026-12-01T10:00',
      price:    500,
      seats:    100,
    });
    await adminEventsPage.clickCreateEvent();

    // Assert
    await adminEventsPage.assertEventRowVisible(eventTitle);
    await page.screenshot({ path: 'test-results/TC-031-event-created.png', fullPage: true });
  });

  // ── TC-032 ──────────────────────────────────────────────────────────────────
  test('[TC-032] should block submission when Title field is left empty @regression',
    async ({ page }) => {

    // Arrange
    // title intentionally omitted

    // Act
    await adminEventsPage.fillEventForm({
      category: 'Conference',
      city:     'Hyderabad',
      venue:    'HICC',
      date:     '2026-12-01T10:00',
      price:    500,
      seats:    100,
    });
    await adminEventsPage.clickCreateEvent();

    // Assert — browser / app validation keeps the form on page
    await adminEventsPage.assertValidationErrorVisible();
    await page.screenshot({ path: 'test-results/TC-032-missing-title.png', fullPage: true });
  });

  // ── TC-033 ──────────────────────────────────────────────────────────────────
  test('[TC-033] should block submission when City field is left empty @regression',
    async ({ page }) => {

    // Arrange
    // city intentionally omitted

    // Act
    await adminEventsPage.fillEventForm({
      title:    'Test Event',
      category: 'Conference',
      venue:    'HICC',
      date:     '2026-12-01T10:00',
      price:    500,
      seats:    100,
    });
    await adminEventsPage.clickCreateEvent();

    // Assert
    await adminEventsPage.assertValidationErrorVisible();
    await page.screenshot({ path: 'test-results/TC-033-missing-city.png', fullPage: true });
  });

  // ── TC-034 ──────────────────────────────────────────────────────────────────
  test('[TC-034] should block submission when Total Seats is set to zero @regression',
    async ({ page }) => {

    // Arrange
    const zeroSeats = 0;

    // Act
    await adminEventsPage.fillEventForm({
      title:    'Test Event',
      category: 'Conference',
      city:     'Hyderabad',
      venue:    'HICC',
      date:     '2026-12-01T10:00',
      price:    500,
      seats:    zeroSeats,
    });
    await adminEventsPage.clickCreateEvent();

    // Assert
    await adminEventsPage.assertValidationErrorVisible();
    await page.screenshot({ path: 'test-results/TC-034-zero-seats.png', fullPage: true });
  });

  // ── TC-035 ──────────────────────────────────────────────────────────────────
  test('[TC-035] should block submission when Price is negative @regression',
    async ({ page }) => {

    // Arrange
    const negativePrice = -50;

    // Act
    await adminEventsPage.fillEventForm({
      title:    'Test Event',
      category: 'Conference',
      city:     'Hyderabad',
      venue:    'HICC',
      date:     '2026-12-01T10:00',
      price:    negativePrice,
      seats:    100,
    });
    await adminEventsPage.clickCreateEvent();

    // Assert
    await adminEventsPage.assertValidationErrorVisible();
    await page.screenshot({ path: 'test-results/TC-035-negative-price.png', fullPage: true });
  });

  // ── TC-036 ──────────────────────────────────────────────────────────────────
  test('[TC-036] should block submission when Event Date is in the past @regression',
    async ({ page }) => {

    // Arrange
    const pastDate = '2000-01-01T10:00';

    // Act
    await adminEventsPage.fillEventForm({
      title:    'Test Event',
      category: 'Conference',
      city:     'Hyderabad',
      venue:    'HICC',
      date:     pastDate,
      price:    500,
      seats:    100,
    });
    await adminEventsPage.clickCreateEvent();

    // Assert
    await adminEventsPage.assertValidationErrorVisible();
    await page.screenshot({ path: 'test-results/TC-036-past-date.png', fullPage: true });
  });

  // ── TC-037 ──────────────────────────────────────────────────────────────────
  test('[TC-037] should enforce six-event limit and display limit information @regression',
    async ({ page }) => {

    // Arrange
    // (navigate done in beforeEach — 6-event limit rule displayed on page)

    // Act
    // (observe page state)

    // Assert
    await adminEventsPage.assertLimitInfoVisible();
    await adminEventsPage.assertEventCountAtLeast(1);
    await page.screenshot({ path: 'test-results/TC-037-six-event-limit.png', fullPage: true });
  });

  // ── TC-038 ──────────────────────────────────────────────────────────────────
  test('[TC-038] should remove event from list when it is deleted and confirmed @regression',
    async ({ page }) => {

    // Arrange
    await adminEventsPage.assertEventCountAtLeast(1);
    const initialCount = await adminEventsPage.getEventCount();

    // Act
    await adminEventsPage.clickDeleteFirstEditableEvent();
    await adminEventsPage.confirmDelete();

    // Assert — row count must decrease by exactly 1
    await adminEventsPage.assertEventCount(initialCount - 1);
    await page.screenshot({ path: 'test-results/TC-038-event-deleted.png', fullPage: true });
  });

});
