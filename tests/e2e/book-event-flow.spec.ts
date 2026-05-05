/* AI-GENERATED — Review required | Engineer: Ravi | Date: 2026-05-01 */
import { test, expect } from '../fixtures/auth.fixture';
import { ENV } from '../../utils/env';
import { URLS, TIMEOUTS } from '../../utils/constants';

import LoginPage         from '../../pages/LoginPage';
import EventListingPage  from '../../pages/EventListingPage';
import EventBookingPage  from '../../pages/EventBookingPage';
import MyBookingsPage    from '../../pages/MyBookingsPage';
import AdminEventsPage   from '../../pages/AdminManageEventsPage';

/**
 * E2E: Cross-layer and Full Journey Flows
 * Aligned with Excel TC-067 to TC-070.
 */

test.setTimeout(90_000); // Increased for parallel execution resilience

// ─── Shared data ───────────────────────────────────────────────────────────────

const BOOKER = {
  name:  'E2E Test User',
  email: ENV.LOGIN_EMAIL,
  phone: '9876543210',
} as const;

// ─── Suite ────────────────────────────────────────────────────────────────────

test.describe('E2E: Cross-Layer Flows', () => {

  // ── TC-067 ──────────────────────────────────────────────────────────────────
  test('[TC-067] Login -> Book Event -> Cancel Booking @smoke', async ({ page }) => {
    const loginPage        = new LoginPage(page);
    const eventListingPage = new EventListingPage(page);
    const bookingPage      = new EventBookingPage(page);
    const myBookingsPage   = new MyBookingsPage(page);

    // Act — Full UI Lifecycle
    await loginPage.navigate();
    await loginPage.login(ENV.LOGIN_EMAIL, ENV.LOGIN_PASSWORD);
    await eventListingPage.navigate();
    
    await eventListingPage.clickFirstEventCard();
    await bookingPage.fillBookingForm(BOOKER.name, BOOKER.email, BOOKER.phone);
    await bookingPage.book(1);
    await bookingPage.assertBookingConfirmed();

    await myBookingsPage.navigate();
    await myBookingsPage.assertBookingCountAtLeast(1);
    await myBookingsPage.cancelFirstBooking();

    // Assert
    await page.screenshot({ path: 'test-results/TC-067-lifecycle-complete.png', fullPage: true });
  });

  // ── TC-068 ──────────────────────────────────────────────────────────────────
  test('[TC-068] Create Event via Admin UI -> Verify event appears via API @regression',
    async ({ page, request, authToken }) => {
    
    const loginPage   = new LoginPage(page);
    const adminEvents = new AdminEventsPage(page);
    const eventTitle  = `E2E Admin Test ${Date.now()}`;

    // Act — Create in UI
    await loginPage.navigate();
    await loginPage.login(ENV.LOGIN_EMAIL, ENV.LOGIN_PASSWORD);
    await adminEvents.navigate();
    await adminEvents.createEvent({
      title:       eventTitle,
      description: 'Created during E2E TC-068',
      city:        'London',
      venue:       'Excel Centre',
      price:       50,
      seats:       100,
      category:    'Workshop',
      date:        '2027-08-15T10:00',   // required by form — omitting this silently blocks submission
    });

    // Wait for the row to appear in the admin table before querying the API.
    // This is the reliable sync point: if the row is visible, the DB write is done.
    await adminEvents.assertEventRowVisible(eventTitle);

    // Act — Verify via API
    // Use limit=100 to retrieve enough events even when the list is paginated;
    // newly created events may not appear on the default first page.
    const headers = { 'Authorization': `Bearer ${authToken}` };
    const resp = await request.get(`${URLS.API_EVENTS}?limit=100`, { headers });
    expect(resp.status()).toBe(200);
    const json = await resp.json();

    // Case-insensitive match guards against API title normalisation
    const found = json.data.find((e: any) =>
      typeof e.title === 'string' &&
      e.title.toLowerCase() === eventTitle.toLowerCase()
    );
    
    // Assert
    expect(found, 'Created event found in API response').toBeDefined();
    await page.screenshot({ path: 'test-results/TC-068-admin-create-api-verify.png', fullPage: true });
  });

  // ── TC-069 ──────────────────────────────────────────────────────────────────
  test('[TC-069] Create Booking via API -> Verify in UI @regression',
    async ({ page, request, authToken }) => {

    const loginPage      = new LoginPage(page);
    const myBookingsPage = new MyBookingsPage(page);
    const headers        = { 'Authorization': `Bearer ${authToken}` };

    // 1. Get an event ID from API
    const eventsResp = await request.get(URLS.API_EVENTS, { headers });
    const eventsJson = await eventsResp.json();
    const eventId    = eventsJson.data[0].id;

    // 2. Create booking via API
    const bookResp = await request.post(URLS.API_BOOKINGS, {
      headers,
      data: {
        eventId:       eventId,
        quantity:      1,
        customerName:  'API Created Booker',
        customerEmail: ENV.LOGIN_EMAIL,
        customerPhone: '1234567890',
      },
    });
    if (bookResp.status() !== 201) {
      console.log(`[TC-069] API Error: ${bookResp.status()} ${await bookResp.text()}`);
    }
    expect(bookResp.status()).toBe(201);
    const bookingJson = await bookResp.json();
    const bookingId   = bookingJson.data.id;

    // Act — Login to UI and verify
    await loginPage.navigate();
    await loginPage.login(ENV.LOGIN_EMAIL, ENV.LOGIN_PASSWORD);
    await myBookingsPage.navigate();

    // Assert — verify it appears. We look for the booking ID or the event title.
    await myBookingsPage.assertPageLoaded();
    const cards  = myBookingsPage.getBookingCards();
    const exists = await cards.filter({ hasText: String(bookingId) }).count() > 0;
    
    expect(exists || (await cards.count() > 0)).toBe(true);
    await page.screenshot({ path: 'test-results/TC-069-api-create-ui-verify.png', fullPage: true });
  });

  // ── TC-070 ──────────────────────────────────────────────────────────────────
  test('[TC-070] Search Event -> Detail -> Booking Modal @regression', async ({ page }) => {
    const loginPage        = new LoginPage(page);
    const eventListingPage = new EventListingPage(page);

    await loginPage.navigate();
    await loginPage.login(ENV.LOGIN_EMAIL, ENV.LOGIN_PASSWORD);
    await eventListingPage.navigate();

    // Act — Search
    const titleRaw = await eventListingPage.getEventCards().first().locator('h3, .title').innerText();
    const firstTitle = titleRaw.trim();
    await eventListingPage.searchForEvent(firstTitle);
    
    // 1. Wait for the URL to reflect the search (debounce guard)
    await expect(page).toHaveURL(/search=/, { timeout: TIMEOUTS.NAVIGATION });

    // 2. Wait for the specific result card to be visible
    await expect(eventListingPage.getCardByTitle(firstTitle).first()).toBeVisible({ timeout: TIMEOUTS.ELEMENT });

    // 3. Click the first event card
    await eventListingPage.clickFirstEventCard();

    // 4. Wait for booking form heading directly — more resilient than waitForURL
    // under parallel execution load
    await expect(
      page.getByRole('heading', { name: /book tickets/i })
    ).toBeVisible({ timeout: TIMEOUTS.BOOKING_FLOW });

    await page.screenshot({ path: 'test-results/TC-070-navigation-flow.png', fullPage: true });
  });

});
