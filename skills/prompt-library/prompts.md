# EventHub — Team Task Library

Use the prompts in this file to trigger Claude Code for day-to-day automation tasks.
Always run Claude Code from the project root.

---

## Add tests for a module

Use this when you want to add all test cases for a specific module.

Replace `[MODULE_NAME]` with one of:
`Login` | `EventListing` | `EventBooking` | `AdminManageEvents` | `AdminManageBookings` | `API` | `E2E`

**Prompt to run in Claude Code:**
```
Read AGENT.md and skills/playwright-test-writer/SKILL.md.
Read test-data/test-cases-v4.xlsx and filter by Module = [MODULE_NAME].
For every Enabled:TRUE row, write a test in the correct spec file under tests/ui/ or tests/api/.
Use TC number from TestID column in test name.
Use Priority column to assign @smoke or @regression tag.
Use the existing POM class for this module.
Run npx tsc --noEmit and npx playwright test <file> before finishing.
```

---

## Add test by TC number

Use this when you want to add one specific test case by its ID.

Replace `[TC-XXX]` with the test case ID from test-cases-v4.xlsx.

**Prompt to run in Claude Code:**
```
Read AGENT.md and skills/playwright-test-writer/SKILL.md.
Read test-data/test-cases-v4.xlsx and find row where TestID = [TC-XXX].
Write a test for it in the correct spec file based on its Module column.
Use the TC number in the test name.
Use Priority column to assign @smoke or @regression tag.
Use the existing POM class for that module.
Run npx tsc --noEmit and npx playwright test <file> --grep TC-XXX before finishing.
```

---

## Fix a failing test

Use this when a test is failing and you need Claude Code to diagnose and fix it.

Replace `[TC-XXX]` with the failing test ID.

**Prompt to run in Claude Code:**
```
Read AGENT.md and skills/playwright-test-writer/SKILL.md.
Run npx playwright test --grep [TC-XXX] --headed and observe the failure.
Use Playwright MCP to navigate the live EventHub app and inspect the 
relevant page.
Compare what the test expects vs what the app currently shows.
If it is a locator issue, fix it in the page class.
If it is an assertion issue and the app behaviour is correct, fix the assertion.
If the app has a bug, do not change the assertion — add a comment 
// BUG: [description] and mark the test as test.skip with reason.
Run npx playwright test --grep [TC-XXX] to confirm fix.
```

---

## Add a new page class

Use this when a new module needs a POM class.

Replace `[MODULE_NAME]` with the new module name.
Replace `[URL_PATH]` with the module's URL path e.g. `/checkout`.

**Prompt to run in Claude Code:**
```
Read AGENT.md and skills/playwright-test-writer/SKILL.md.
Use Playwright MCP to navigate to [URL_PATH] on EventHub and inspect 
all interactive elements on the page.
Create pages/[MODULE_NAME]Page.ts using SelfHealingLocator for all 
interactive elements.
Follow selector priority order from SKILL.md.
Each element must have minimum 3 fallback strategies.
Export the class as default export.
Run npx tsc --noEmit to confirm zero errors.
```

---

## Run specific test suites

Commands to run directly in terminal — no Claude Code needed:

```bash
# Smoke suite only
npx playwright test --grep @smoke

# Regression suite only
npx playwright test --grep @regression

# UI tests only
npx playwright test tests/ui/

# API tests only
npx playwright test tests/api/

# E2E tests only
npx playwright test tests/e2e/

# Single test by TC number
npx playwright test --grep TC-XXX

# With visible browser
npx playwright test --headed

# Open last HTML report
npx playwright show-report
```

---

## Regenerate API types and docs

Use this when the EventHub Swagger spec has changed.

**Prompt to run in Claude Code:**
```
Run npm run gen:types to regenerate src/api-client/Api.ts from swagger.json.
Run npm run gen:docs to regenerate docs/api-reference.md.
Run npx tsc --noEmit to confirm zero TypeScript errors after regeneration.
```
