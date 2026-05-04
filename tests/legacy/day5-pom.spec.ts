/* AI-GENERATED — Review required | Engineer: Ravi | Date: 2026-04-30 */
import { test, expect } from '@playwright/test';
import LoginPage from '../../pages/LoginPage';
import EventListingPage from '../../pages/EventListingPage';
import AdminManageEventsPage from '../../pages/AdminManageEventsPage';

test.setTimeout(30_000);

const EMAIL    = process.env.LOGIN_EMAIL    ?? 'ravitanna2015@gmail.com';
const PASSWORD = process.env.LOGIN_PASSWORD ?? 'Ravitanna@2015';

// ── Login module ────────────────────────────────────────────────────────────
test.describe('Login module — POM', () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.navigate();
  });

  test('should login with valid credentials and redirect to events or dashboard', async ({ page }) => {
    await loginPage.login(EMAIL, PASSWORD);
    // App redirects to / (home) after successful login — assert user left the login page
    await expect(page).not.toHaveURL(/\/login/);
  });

  test('should show error for invalid credentials', async () => {
    await loginPage.login('bad@email.com', 'WrongPass123');
    await loginPage.assertErrorMessage('Invalid');
  });

  test('should remain on login page when fields are empty', async () => {
    await loginPage.clickSignIn();
    await loginPage.assertStillOnLoginPage();
  });
});

// ── Event Listing ────────────────────────────────────────────────────────────
test.describe('Event Listing — POM', () => {
  let eventListingPage: EventListingPage;

  test.beforeEach(async ({ page }) => {
    const lp = new LoginPage(page);
    await lp.navigate();
    await lp.login(EMAIL, PASSWORD);
    // Wait for login redirect to complete before navigating further
    await page.waitForURL((url) => url.pathname !== '/login', { timeout: 15_000 });
    eventListingPage = new EventListingPage(page);
    await eventListingPage.navigate();
  });

  test('should load events page with at least one event card', async () => {
    await eventListingPage.assertPageLoaded();
    await eventListingPage.assertEventCountAtLeast(1);
  });

  test('should display multiple event cards on the listing page', async () => {
    await eventListingPage.assertPageLoaded();
    await eventListingPage.assertEventCountAtLeast(2);
  });
});

// ── Admin Manage Events ──────────────────────────────────────────────────────
test.describe('Admin Manage Events — POM', () => {
  let adminPage: AdminManageEventsPage;

  test.beforeEach(async ({ page }) => {
    const lp = new LoginPage(page);
    await lp.navigate();
    await lp.login(EMAIL, PASSWORD);
    await page.waitForURL((url) => url.pathname !== '/login', { timeout: 15_000 });
    adminPage = new AdminManageEventsPage(page);
  });

  test('should load admin events page when logged in as admin', async () => {
    await adminPage.navigate();
    await adminPage.assertPageLoaded();
  });
});

// ── Event Booking ────────────────────────────────────────────────────────────
test.describe('Event Booking — POM', () => {
  test('should navigate to first event detail page from listing', async ({ page }) => {
    const lp = new LoginPage(page);
    await lp.navigate();
    await lp.login(EMAIL, PASSWORD);
    await page.waitForURL((url) => url.pathname !== '/login', { timeout: 15_000 });

    const eventListingPage = new EventListingPage(page);
    await eventListingPage.navigate();
    await eventListingPage.clickFirstEventCard();

    // URL should now be /events/{id} — no longer exactly /events
    await expect(page).toHaveURL(/\/events\/\d+/);
  });
});
