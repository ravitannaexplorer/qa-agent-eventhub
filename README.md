# EventHub Playwright Automation Framework

Production-grade test automation for the EventHub web application.

[![Playwright Tests](https://github.com/ravitanna-jeavio/2.Playwright-Training/actions/workflows/playwright.yml/badge.svg)](https://github.com/ravitanna-jeavio/2.Playwright-Training/actions/workflows/playwright.yml)

---

## Tech Stack

- **Playwright + TypeScript** — browser automation and test runner
- **Zod** — API response schema validation
- **ExcelJS** — data-driven test case parsing from Excel
- **GitHub Actions** — CI/CD pipeline with scheduled and manual runs

---

## Project Structure

```
tests/
  ui/           # Browser tests, one spec file per module
  api/          # API-only tests, no browser launched
  e2e/          # Full end-to-end flows across multiple modules
  legacy/       # Preserved day* training files — never modify
  fixtures/     # Shared Playwright fixtures (auth, storage state)
pages/          # Page Object Model classes, one per UI module
utils/          # Shared helpers: locators, env, constants, Excel reader
scripts/        # Code-generation scripts (OpenAPI types, API docs)
test-data/      # test-cases-v4.xlsx — source of truth for all test cases
prompt-library/ # Operational prompts for AI-assisted test creation
skills/         # AI skill definitions (test writer rules, selector order)
.github/        # GitHub Actions CI workflow
```

---

## Prerequisites

- Node.js 18+
- npm
- Git

---

## Getting Started

```bash
# 1. Clone the repository
git clone <repo-url>
cd 2.Playwright\ Training

# 2. Install dependencies
npm ci

# 3. Install Playwright browsers
npx playwright install --with-deps

# 4. Configure environment
cp .env.example .env
# Open .env and fill in BASE_URL, LOGIN_EMAIL, LOGIN_PASSWORD, API_TOKEN

# 5. Save auth state (run once — re-run if your session expires)
npm run setup
```

After step 5, `playwright/.auth/user.json` will exist and all UI tests will start pre-authenticated.

---

## Running Tests

```bash
# Save auth state (once before running UI/E2E tests)
npm run setup

# Smoke suite — critical path, completes in under 5 minutes
npm run test:smoke

# Regression suite — full coverage, nightly candidate
npm run test:regression

# By layer
npm run test:ui
npm run test:api
npm run test:e2e

# Run with visible browser (useful for debugging)
npm run test:headed

# Step through a test interactively
npm run test:debug

# Run everything
npm run test:all

# Open the last HTML report
npm run report
```

---

## Test Coverage

| Range | Module | Layer | Tag | Count |
|-------|--------|-------|-----|-------|
| TC-001 – TC-006 | Login | UI | @smoke + @regression | 6 |
| TC-007 – TC-012 | Event Listing | UI | @smoke + @regression | 6 |
| TC-013 – TC-018 | Event Booking (form) | UI | @smoke + @regression | 6 |
| TC-019 – TC-024 | Event Booking (flow) | UI | @smoke + @regression | 6 |
| TC-025 – TC-032 | Admin Manage Events | UI | @smoke + @regression | 8 |
| TC-033 – TC-037 | Admin Manage Bookings | UI | @smoke + @regression | 5 |
| TC-043 – TC-045 | Auth API | API | @smoke + @regression | 3 |
| TC-046 – TC-048 | Events API (read) | API | @smoke + @regression | 3 |
| TC-049 – TC-056 | Bookings API | API | @smoke + @regression | 8 |
| TC-058 – TC-059 | Bookings API (boundary) | API | @regression | 2 |
| TC-060 – TC-063 | Events + Bookings CRUD | API | @regression | 5 |
| TC-065 – TC-066 | Events API (auth guard) | API | @regression | 2 |
| TC-067 – TC-070 | Book-Event End-to-End | E2E | @smoke + @regression | 4 |

**Total: 70 tests** across 10 spec files | 3 layers (UI / API / E2E)

---

## Adding a New Test

### Workflow A — Add tests for an entire module

1. Open `prompt-library/prompts.md`
2. Find the section **"Add tests for a module"**
3. Follow the prompt instructions with Claude Code — provide the module name
4. Claude will read `test-data/test-cases-v4.xlsx`, filter by module, and generate all enabled test cases

### Workflow B — Add a single test by TC number

1. Open `prompt-library/prompts.md`
2. Find the section **"Add test by TC number"**
3. Provide the TC number (e.g. TC-042) to Claude Code
4. Claude will look up the row in the Excel file and generate the test

> Both workflows produce tests that comply with all framework conventions automatically.

---

## Test Tagging Strategy

| Tag | When to use | Target runtime |
|-----|-------------|----------------|
| `@smoke` | One critical test per module — app must be alive | Under 5 minutes total |
| `@regression` | Major flows, happy path + key edge cases | Nightly run |

A test can only carry **one** tag — never both.

---

## Framework Conventions

- **TC number in every test name** — format: `[TC-001] should ... when ... @smoke`
- **Page Object Model** — never use raw locators in test files; always go through a page class
- **SelfHealingLocator** — all page classes use priority-ordered fallback chains so tests survive minor UI changes
- **Credentials** — always read from `utils/env.ts`; never hardcode emails or passwords
- **URLs and timeouts** — always read from `utils/constants.ts`; never hardcode strings or numbers
- **AAA structure** — every test body uses `// Arrange`, `// Act`, `// Assert` sections with blank lines between
- **Screenshots on key assertions** — `await page.screenshot({ path: 'test-results/TC-XXX-description.png', fullPage: true })`
- **API tests use absolute URLs** — the API runs on `api.eventhub.rahulshettyacademy.com`, separate from the UI domain
- **CRUD chain tests use `test.describe.configure({ mode: 'serial' })`** — to preserve shared state between dependent tests

---

## CI/CD

### Smoke Job (push / PR)
Runs on every push and pull request to `main`/`master`. Executes the `@smoke` suite only (~5 minutes). Fast feedback for developers.

### Full Job (scheduled / manual)
- **Schedule**: 7:00 am IST (01:30 UTC) Monday–Friday
- **Manual**: Go to Actions tab → Playwright Tests → Run workflow → choose suite
- Suite options: `all`, `smoke`, `regression`, `ui`, `api`, `e2e`

Both jobs upload the HTML report and `test-results/results.json` as downloadable artifacts. All secrets (`BASE_URL`, `LOGIN_EMAIL`, `LOGIN_PASSWORD`, `API_TOKEN`) are stored in GitHub repository secrets — they are never committed to the codebase.

---

## Key Files Quick Reference

| File | Purpose |
|------|---------|
| `test-data/test-cases-v4.xlsx` | Source of truth for all test cases — TC numbers, steps, expected results |
| `utils/self-healing-locator.ts` | Locator fallback engine — tries strategies in priority order |
| `utils/constants.ts` | All URLs (UI relative + API absolute), timeouts, and shared strings |
| `utils/env.ts` | Safe `process.env` access with validation and local-dev fallbacks |
| `tests/global-setup.ts` | Runs once before all tests to save browser auth state |
| `tests/fixtures/auth.fixture.ts` | Provides `authToken` JWT to API tests via `test.extend` |
| `AGENT.md` | AI agent instructions — read this before every session |
| `skills/playwright-test-writer/SKILL.md` | AI code generation rules — selector order, tagging, file locations |
| `prompt-library/prompts.md` | Operational prompts for AI-assisted test creation |
