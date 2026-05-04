# Playwright Test Writer Skill

## What this skill does
Generates production-ready Playwright TypeScript test files for the EventHub 
application. Read this file in full before writing a single line of test code.

## Framework overview — know this before writing anything

### Folder structure
tests/
  ui/           ← browser tests, one file per module
  api/          ← API tests, no browser
  e2e/          ← full end-to-end flows
  legacy/       ← old day* files, never touch these

pages/          ← Page Object Model classes, one per module
utils/
  self-healing-locator.ts  ← ALWAYS use this in page classes
  excel-reader.ts          ← parses test-data/test-cases-v4.xlsx
  constants.ts             ← all URLs, timeouts, shared strings
  env.ts                   ← all process.env access goes here
test-data/
  test-cases-v4.xlsx       ← source of truth for all test cases

### Page classes that exist — use them, do not duplicate
pages/LoginPage.ts
pages/EventListingPage.ts
pages/EventBookingPage.ts
pages/AdminManageEventsPage.ts
pages/AdminManageBookingsPage.ts

---

## Non-negotiable rules

1. ALWAYS include TC number and tag in every test name:
   '[TC-001] should [action] when [condition] @smoke'
   '[TC-002] should [action] when [condition] @regression'
   Never write a test without a TC number from test-cases-v4.xlsx.

2. ALWAYS use Page Object Model — never use raw locators in test files.
   CORRECT:   await loginPage.login(EMAIL, PASSWORD)
   WRONG:     await page.getByLabel('Email').fill('test@example.com')

3. ALWAYS use SelfHealingLocator in page classes — never raw page.locator()
   for form fields or interactive elements.

4. ALWAYS wrap tests in test.describe() with module name matching the 
   folder — 'Login Module', 'Event Listing', 'Event Booking' etc.

5. ALWAYS add review header at top of every generated file:
   /* AI-GENERATED — Review required | Engineer: Ravi | Date: YYYY-MM-DD */

6. NEVER hard-code URLs, credentials, or timeouts — use:
   - URLs and timeouts → utils/constants.ts
   - Credentials → utils/env.ts
   - Base URL → playwright.config.ts baseURL

7. ALWAYS follow AAA structure with blank lines between sections:
   // Arrange
   // Act  
   // Assert

8. ALWAYS import from '@playwright/test', never from 'playwright'.

9. ALWAYS use stored auth state for UI tests that require login.
   Do not repeat the login flow in every test — use the auth fixture.

10. ALWAYS add a deliberate screenshot on key assertion steps:
    await page.screenshot({ 
      path: `test-results/[TC-XXX]-description.png`, 
      fullPage: true 
    });

11. NEVER modify files in tests/legacy/ — those are preserved as-is.

12. NEVER modify existing passing tests without being explicitly asked.

---

## Tagging rules — apply strictly

@smoke    — one critical test per module, app must be alive
            maximum 7-8 smoke tests total across entire suite
            must complete in under 5 minutes

@regression — major flows, happy path + key edge cases
              nightly run candidate
              covers all enabled High and Medium priority cases from Excel

A test can only have ONE tag — either @smoke or @regression, not both.
High priority in Excel → @regression minimum, consider @smoke if it's 
the single most critical case for that module.

---

## TC number convention

Every test maps to a row in test-data/test-cases-v4.xlsx.
Test name format: '[TC-XXX] should [action] when [condition] @tag'

Examples:
  '[TC-001] should redirect to home when login succeeds with valid credentials @smoke'
  '[TC-003] should show error when login attempted with wrong password @regression'
  '[TC-015] should display event cards when events page loads @smoke'

---

## Selector priority order — follow strictly in page classes

1. getByRole()        — best, accessibility-tied
2. getByLabel()       — form fields with labels
3. getByPlaceholder() — inputs without labels
4. getByTestId()      — data-testid attributes
5. getByText()        — visible text content
6. locator('css')     — absolute last resort only

Each element in a page class must have minimum 3 strategies in 
SelfHealingLocator — primary + at least 2 fallbacks.

---

## File location rules

New UI test for Login module    → tests/ui/login.spec.ts
New UI test for Booking module  → tests/ui/event-booking.spec.ts
New API test for Events         → tests/api/events.spec.ts
New E2E flow                    → tests/e2e/book-event-flow.spec.ts
New page class                  → pages/[ModuleName]Page.ts

---

## Import rules

In test files:
import { test, expect } from '@playwright/test';
import { ENV } from '../utils/env';
import { TIMEOUTS, URLS } from '../utils/constants';
import LoginPage from '../pages/LoginPage';

In page classes:
import { Page, expect } from '@playwright/test';
import { SelfHealingLocator } from '../utils/self-healing-locator';

---

## Output format

Return ONLY the TypeScript file content.
No explanations, no markdown fences, no preamble — just the file.

---

## Worked example

INPUT: 'Write test for TC-001 — valid login redirects away from login page'

OUTPUT:
/* AI-GENERATED — Review required | Engineer: Ravi | Date: 2026-05-01 */
import { test, expect } from '@playwright/test';
import { ENV } from '../utils/env';
import LoginPage from '../pages/LoginPage';

test.describe('Login Module', () => {

  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.navigate();
  });

  test('[TC-001] should redirect away from login when credentials are valid @smoke',
    async ({ page }) => {

    // Arrange
    const email    = ENV.LOGIN_EMAIL;
    const password = ENV.LOGIN_PASSWORD;

    // Act
    await loginPage.login(email, password);

    // Assert
    await expect(page).not.toHaveURL(/\/login/);
    await page.screenshot({
      path: 'test-results/TC-001-login-success.png',
      fullPage: true
    });
  });
