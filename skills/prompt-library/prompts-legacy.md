# Prompt Library — EventHub Playwright Test Suite

## Project Setup
- App URL     : https://eventhub.rahulshettyacademy.com
- Excel file  : test-data/test-cases-v4.xlsx
- Parser      : utils/excel-reader.ts (already built)
- Skill file  : skills/playwright-test-writer/SKILL.md
- Engineer    : Ravi

---

## Prompt: Build Data-Driven Test Engine — Login Module

### What to do
Read skills/playwright-test-writer/SKILL.md first.
Use Playwright MCP to open the login page and inspect
real selectors before writing any code.

Build TWO files:

---

### FILE 1 — pages/LoginPage.ts (Page Object)

A reusable class that wraps all login page interactions.
Any test — data-driven or manual — imports this class.

The class must have these methods:

  navigate()
    → goes to /login

  fillEmail(email: string)
    → fills the email field

  fillPassword(password: string)
    → fills the password field

  clickSignIn()
    → clicks the Sign In button

  login(email: string, password: string)
    → calls fillEmail + fillPassword + clickSignIn together
    → use this for happy path tests

  assertRedirectedTo(urlPattern: string)
    → asserts page URL matches the pattern

  assertErrorMessage(message: string)
    → asserts error alert contains the message

  assertStillOnLoginPage()
    → asserts URL still contains /login

  assertNotOnProtectedPage()
    → asserts URL does not contain /events, /bookings, /dashboard

Rules for LoginPage.ts:
- Constructor takes page: Page from Playwright
- Use getByLabel or getByRole selectors only — inspect real page first
- Each method does ONE thing only
- Export the class as default

Example of what the class looks like when done:

  export class LoginPage {
    constructor(private page: Page) {}

    async navigate() {
      await this.page.goto('/login')
    }

    async login(email: string, password: string) {
      await this.fillEmail(email)
      await this.fillPassword(password)
      await this.clickSignIn()
    }
    // ... etc
  }

---

### FILE 2 — tests/day4-excel-driven.spec.ts

A spec that uses LoginPage + Excel data together.

Structure:

  import LoginPage from '../pages/LoginPage'
  import { parseExcelTestCases } from '../utils/excel-reader'

  const loginCases = parseExcelTestCases(EXCEL_PATH, { module: 'Login' })

  test.describe('Login Module — Data Driven', () => {

    test.beforeEach(async ({ page }) => {
      loginPage = new LoginPage(page)
      await loginPage.navigate()
    })

    for (const tc of loginCases) {
      test(`[${tc.testId}] ${tc.testName}`, async ({ page }) => {

        // Arrange — already done in beforeEach

        // Act
        await loginPage.fillEmail(tc.inputData.email)
        await loginPage.fillPassword(tc.inputData.password)
        await loginPage.clickSignIn()

        // Assert — based on what InputData contains
        if (tc.inputData.expectedUrl) {
          await loginPage.assertRedirectedTo(tc.inputData.expectedUrl)
        } else if (tc.inputData.expectedError) {
          await loginPage.assertErrorMessage(tc.inputData.expectedError)
        } else {
          await loginPage.assertNotOnProtectedPage()
        }
      })
    }
  })

This way if you want to test TC-002 manually you can write:

  test('manual TC-002 repro', async ({ page }) => {
    const loginPage = new LoginPage(page)
    await loginPage.navigate()
    await loginPage.login('ravitanna2015@gmail.com', 'wrongpassword')
    await loginPage.assertErrorMessage('Invalid email or password')
  })

No Excel needed. The page object works standalone too.

---

### Run command
npx playwright test tests/day4-excel-driven.spec.ts --headed

### Expected result
6 tests named:
[TC-001] Log in with valid credentials
[TC-002] Fail login with wrong password
[TC-003] Fail login with invalid email format
[TC-004] Fail login with both fields empty
[TC-005] Attempt SQL injection in email field
[TC-006] Attempt XSS payload in password field

If any test fails → show exact error, do not fix silently.

---

## Step 4 — Swagger Pipeline

### What to build
Two things:
1. Auto-generate TypeScript types from the Swagger/OpenAPI spec
2. Auto-generate a Markdown API reference doc from the same spec

### Application API details
- Swagger URL : https://api.eventhub.rahulshettyacademy.com/api/docs/
- Bearer Token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjYxMzYsImVtYWlsIjoicmF2aXRhbm5hMjAxNUBnbWFpbC5jb20iLCJpYXQiOjE3NzcyODk5MTEsImV4cCI6MTc3Nzg5NDcxMX0.kMJO5oIgYBqfotPFGduMJ4BkbIjL0lEfXezJRbB0GUM

### TASK 1 — Generate TypeScript types from Swagger

Install the package:
  npm install -D openapi-typescript

Check if the Swagger spec is available as JSON at:
  https://api.eventhub.rahulshettyacademy.com/api/docs/swagger.json
  or
  https://api.eventhub.rahulshettyacademy.com/api/docs/json
  or fetch it directly from the docs page

Run the generator and save output to src/api-client/Api.ts:
  npx openapi-typescript  --output ./src/api-client/Api.ts

If the URL requires auth, download the JSON first using curl with
the Bearer token, save it locally as swagger.json, then run:
  npx openapi-typescript ./swagger.json --output ./src/api-client/Api.ts

Verify Api.ts was created and contains exported types/interfaces.
Print the first 30 lines of the file to confirm it looks correct.

### TASK 2 — Write swagger-to-md script

Create scripts/swagger-to-md.ts

The script must:
1. Fetch the Swagger JSON from the docs URL (use node-fetch or axios)
   If auth is needed, include Bearer token in the request header
2. Parse the JSON to get all endpoints from the paths object
3. For each endpoint write a Markdown section:

   ## METHOD /path
   **Summary:** summary text here
   **Auth required:** Yes / No
   **Parameters:** list any path or query params
   **Request body:** show the schema fields if POST/PUT
   **Response:** show the success response schema

4. Save the output to docs/api-reference.md
5. Print to console: "✅ docs/api-reference.md generated — X endpoints documented"

### TASK 3 — Add npm scripts to package.json

Add these scripts:
  "gen:types" : "openapi-typescript  -o ./src/api-client/Api.ts"
  "gen:docs"  : "ts-node scripts/swagger-to-md.ts"
  "test:all"  : "npm run gen:types && npx playwright test"

### TASK 4 — Verify everything works

Run in order:
  npm run gen:types   → should regenerate Api.ts
  npm run gen:docs    → should regenerate docs/api-reference.md
  npm run test:all    → should generate types then run all tests

Show the console output of each command.
Show the first 20 lines of docs/api-reference.md when done.

### Rules
- Follow skills/playwright-test-writer/SKILL.md
- If Swagger URL is behind auth, handle it gracefully
- If openapi-typescript fails due to spec format issues,
  try fetching the raw JSON and fixing any schema issues first
- Do not hard-code the Bearer token in package.json scripts —
  read it from process.env.API_TOKEN set in .env file

  ---

## Section 4.5 — Swagger Typed API Tests

### What to build
A spec file that imports the auto-generated types from
src/api-client/Api.ts and uses them to validate that real
API responses match the expected schema.

This is NOT data-driven from Excel.
These are static typed tests — one test per key endpoint.
The goal is: if the API changes a field name or type,
TypeScript catches it before the test even runs.

### Read first
- src/api-client/Api.ts — understand what types/schemas exist
- docs/api-reference.md — understand what endpoints exist
- swagger.json — understand request/response shapes

### FILE to create
tests/day4-swagger-api.spec.ts

### What the file must do

Import types from Api.ts:
  import type { components } from '../src/api-client/Api'

Define typed aliases for the schemas you find in Api.ts.
Examples (use the actual schema names from your Api.ts — 
they may differ from these):
  type Event    = components['schemas']['Event']
  type Booking  = components['schemas']['Booking']
  type AuthResponse = components['schemas']['AuthResponse']
  (check Api.ts for the real schema names before writing)

Write one test per key endpoint covering:

  1. POST /api/auth/login — success
     - Send valid credentials
     - Assert status 200
     - Assert response has token field (string)
     - Assert response has userId field (number)
     - Use the AuthResponse type to type the body

  2. GET /api/events — list shape
     - Send request without auth
     - Assert status 200
     - Assert response body is an array or has a data array
     - Assert first item matches Event type shape:
       has id, title, city, venue, price, totalSeats fields
     - Use the Event type to type the body

  3. GET /api/events/:id — single event shape
     - Use a real event ID from your account
     - Assert status 200
     - Assert all required Event fields are present
     - Assert price is a number (not a string)
     - Assert totalSeats is a number

  4. POST /api/bookings — create booking shape
     - Send with valid Bearer token from .env
     - Use a real event ID
     - Assert status 201
     - Assert response has booking id, eventId, seats fields
     - Use Booking type to type the body

  5. GET /api/bookings — list shape
     - Send with valid Bearer token
     - Assert status 200
     - Assert each booking in array has required fields
     - Assert no password or sensitive fields are exposed

  6. GET /api/bookings — no token
     - Send without auth header
     - Assert status 401
     - This proves auth is enforced at schema level

### How to use the Bearer token
Read from environment:
  const TOKEN = process.env.API_TOKEN ?? ''

Pass as header:
  await request.get('/api/bookings', {
    headers: { Authorization: `Bearer ${TOKEN}` }
  })

### Important
Before writing tests, read src/api-client/Api.ts and find
the actual schema names. Do not guess them.
If a schema does not exist in Api.ts for a particular
response, use a plain typed object instead:
  const body: { token: string; userId: number } = await resp.json()

### Run command
npx playwright test tests/day4-swagger-api.spec.ts --headed

### Expected result
6 tests all passing.
If any field assertion fails — that means the real API
response does not match the Swagger spec. Report it,
do not change the assertion to make it pass.

## Day 5 — Self-Healing Locator Library

Create `utils/self-healing-locator.ts` with:
- `Strategy` interface: name, selector, priority (number, lower = tried first)
- `SelfHealingLocator` class constructor takes `Page` and `Strategy[]`, sorts by priority at construction
- `find(timeout = 5000)` method: tries each strategy in order, logs `console.warn` with strategy name and selector when falling back past priority 1, throws descriptive error listing all failed strategies if none work
- `fill(value, timeout?)` convenience method
- `click(timeout?)` convenience method  
- `diagnose(timeout = 3000)` method: returns `{ usedStrategy, selector }` or null — used in self-healing tests

Then rewrite `pages/LoginPage.ts` to use `SelfHealingLocator` for all 3 fields:
- `emailInput`: strategies for aria-label, data-testid, type=email, placeholder, name attr (priorities 1-5)
- `passwordInput`: strategies for aria-label, data-testid, type=password, placeholder, name attr (priorities 1-5)  
- `signInButton`: strategies for button text "Sign in", "Login", data-testid, type=submit, input[type=submit] (priorities 1-5)
- Keep all existing methods: navigate(), fillEmail(), fillPassword(), clickSignIn(), login(), assertRedirectedTo(), assertErrorMessage(), assertStillOnLoginPage(), assertNotOnProtectedPage()

Then create these new page classes:

`pages/EventListingPage.ts`:
- URL: /events
- SelfHealingLocator for searchInput (aria-label, testId, placeholder, name, type=search)
- Methods: navigate(), getEventCards() returns Locator, getCardByTitle(text), searchForEvent(query), clickEventCard(title), clickFirstEventCard()
- Assertions: assertPageLoaded(), assertEventCountAtLeast(n), assertEventVisible(title), assertNoResultsVisible()

`pages/EventBookingPage.ts`:
- SelfHealingLocator for seatCountInput and bookButton
- Methods: selectSeats(count), clickBook(), book(seatCount)
- Assertions: assertBookingConfirmed(), assertBookingErrorVisible(message?), assertEventTitleVisible(title), assertSeatLimitError()

`pages/AdminManageEventsPage.ts`:
- URL: /admin/events
- SelfHealingLocator for searchInput and createEventButton
- Methods: navigate(), getEventRows(), clickCreateEvent(), clickEditEvent(title), clickDeleteEvent(title), confirmDelete()
- Assertions: assertPageLoaded(), assertEventRowVisible(title), assertEventRowNotVisible(title)

`pages/AdminManageBookingsPage.ts`:
- URL: /admin/bookings (check actual EventHub URL — admin dropdown has Manage Bookings)
- SelfHealingLocator for searchInput
- Methods: navigate(), getBookingRows(), searchBooking(query)
- Assertions: assertPageLoaded(), assertBookingVisible(text)

App URL: https://eventhub.rahulshettyacademy.com
All selectors must use SelfHealingLocator fallback chains — no raw page.locator() calls on form fields or buttons.
Add AI-GENERATED review header to every file.

## Day 5 — Test Specs

Create `tests/day5-self-healing.spec.ts`:

Three tests validating SelfHealingLocator behaviour:

1. "should find element using primary strategy and not warn"
   - Navigate to /login
   - Call emailInput.diagnose() — assert usedStrategy === 'label' (priority 1)
   - No assertion on warn — just confirm element was found via priority 1

2. "should warn and fall back to a lower-priority strategy"
   - Create a SelfHealingLocator directly in the test with two strategies:
     priority 1: selector that does NOT exist on the page ('[data-testid="ghost-element"]')
     priority 2: selector that DOES exist ('input[type="password"]')
   - Call find() — expect it to resolve without throwing
   - Spy on console.warn and assert it was called with text containing 'SelfHealing'
   
3. "should throw a descriptive error when all strategies fail"
   - Create a SelfHealingLocator with two strategies, both pointing at selectors
     that don't exist: '[data-testid="does-not-exist"]' and '.also-not-real'
   - Wrap find() in a try/catch — assert the error message contains 'All' and
     contains 'does-not-exist'

---

Create `tests/day5-pom.spec.ts`:

Use LoginPage, EventListingPage, EventBookingPage, AdminManageEventsPage.
Credentials: process.env.LOGIN_EMAIL, process.env.LOGIN_PASSWORD
(with fallback to 'ravitanna2015@gmail.com' / 'Ravitanna@2015' for local dev only)

test.describe('Login module — POM') — beforeEach: new LoginPage(page), navigate()
  - 'should login with valid credentials and redirect to events or dashboard'
    login(email, password) → assertRedirectedTo('/events') or ('/dashboard') — use regex /(events|dashboard)/
  - 'should show error for invalid credentials'
    login('bad@email.com', 'WrongPass123') → assertErrorMessage (any error visible)
  - 'should remain on login page when fields are empty'
    clickSignIn() without filling → assertStillOnLoginPage()

test.describe('Event Listing — POM') — beforeEach: login then navigate to /events
  - 'should load events page with at least one event card'
    assertPageLoaded() + assertEventCountAtLeast(1)
  - 'should show no results for a nonsense search query'
    searchForEvent('xyznonexistentevent99999') → assertNoResultsVisible()

test.describe('Admin Manage Events — POM') — beforeEach: login
  - 'should load admin events page when logged in as admin'
    navigate to /admin/events → assertPageLoaded()
    (if redirected to login, the test will fail clearly — that is correct and expected)

test.describe('Event Booking — POM') — one test:
  - 'should navigate to first event detail page from listing'
    Login → go to /events → clickFirstEventCard() → assert URL changed away from /events

Add AI-GENERATED review header. Wrap every describe block in its own beforeEach.
Use test.setTimeout(30_000) at file level — EventHub can be slow.

