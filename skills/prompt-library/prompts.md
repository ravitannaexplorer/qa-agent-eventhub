Here's the COMPLETE prompts.md file to paste:
markdown

# Prompt Library for AI Test Generation

## Template 1: Basic Feature Test

Generate a Playwright test for [FEATURE_NAME] on EventHub:

APPLICATION: EventHub - Event booking platform BASE URL: https://eventhub.rahulshettyacademy.com/ CREDENTIALS: ravitanna2015@gmail.com / Ravitanna@2015

USER FLOW:

    [Step 1 description]
    [Step 2 description]
    [Step 3 description]

VALIDATION POINTS:

    [What to verify after each step]

EDGE CASES TO COVER:

    [Edge case 1]
    [Edge case 2]

Follow skills/playwright-test-writer/SKILL.md strictly.


## Template 2: Login Test (Generic)

Generate a Playwright test for Login functionality on EventHub:

APPLICATION: EventHub BASE URL: https://eventhub.rahulshettyacademy.com/ FEATURE: User Login

TEST CASES:

    Valid login - Success path
        Email: ravitanna2015@gmail.com
        Password: Ravitanna@2015
        Expected: Redirect to dashboard, user greeting visible
    Invalid email format
        Email: invalid-email
        Expected: Validation error shown, form not submitted
    Wrong password
        Email: ravitanna2015@gmail.com
        Password: WrongPass123
        Expected: "Invalid credentials" error

CONSTRAINTS:

    Read and follow skills/playwright-test-writer/SKILL.md
    Use getByPlaceholder() for email/password fields
    Use getByRole() for buttons
    Include beforeEach for navigation
    Add review header

OUTPUT: Complete runnable .spec.ts file


## Template 3: Form Validation Test

Generate form validation tests for [FORM_NAME]:

FORM FIELDS:

    [Field 1]: [Type] - [Validation rules]
    [Field 2]: [Type] - [Validation rules]

TEST SCENARIOS:

    All fields valid → form submits
    [Field X] empty → show "[Error message]"
    [Field Y] invalid format → show "[Error message]"
    Multiple errors → show all simultaneously

Use getByLabel() for fields, getByRole() for buttons.
Follow skills/playwright-test-writer/SKILL.md.


## Template 4: Screenshot to Test

I've attached a screenshot of [PAGE_NAME] from EventHub.

Please analyze and generate:

    Complete Playwright test covering the main user flow
    3 edge-case tests for form/interaction validation
    Recommended data-testid attributes (as comments)

Assume login is already handled in beforeEach hook. Base URL: https://eventhub.rahulshettyacademy.com/ Follow skills/playwright-test-writer/SKILL.md.


## Template 5: EventHub Login Test (With Actual Selectors from Antigravity)

Generate a Playwright test for Login functionality on EventHub:

APPLICATION: EventHub - Event booking platform BASE URL: https://eventhub.rahulshettyacademy.com/ FEATURE: User Authentication - Login

SELECTORS DISCOVERED BY ANTIGRAVITY:

    Email field: id=#email, placeholder='you@email.com', label='Email'
    Password field: id=#password, placeholder='••••••', label='Password'
    Login button: id=#login-btn, text='Sign In'
    Post-login behavior: User stays at https://eventhub.rahulshettyacademy.com/

TEST CASES TO GENERATE:

    Valid login - Success path
        Email: ravitanna2015@gmail.com
        Password: Ravitanna@2015
        Expected: Login succeeds, stays at same URL, user profile/greeting/welcome message visible
    Invalid email format
        Email: invalid-email (no @ symbol)
        Expected: Validation error shown OR form doesn't submit
    Wrong password
        Email: ravitanna2015@gmail.com
        Password: WrongPass123
        Expected: Error message displayed (e.g., "Invalid credentials", "Login failed")
    Empty fields
        Email: empty
        Password: empty
        Expected: Validation errors for both fields OR submit button disabled

CONSTRAINTS - FOLLOW STRICTLY:

    Read skills/playwright-test-writer/SKILL.md FIRST before writing any code
    PREFER semantic selectors over ID selectors:
        Use getByLabel('Email') instead of locator('#email')
        Use getByLabel('Password') instead of locator('#password')
        Use getByRole('button', { name: 'Sign In' }) instead of locator('#login-btn')
    Include test.describe('User Authentication') wrapper
    Include test.beforeEach() for navigation to base URL
    Add /* AI-GENERATED — Review required | Engineer: | Date: */ header at top
    Follow AAA structure (Arrange-Act-Assert) with blank lines between sections
    Import from '@playwright/test' NOT from 'playwright'
    Test names MUST follow: 'should [action] when [condition]'
    NO hardcoded waits (no page.waitForTimeout())
    Use specific assertions: toBeVisible(), toHaveURL(), toContainText()
    Add comments explaining what each assertion verifies

OUTPUT FORMAT:
Return ONLY the complete TypeScript file content.
No explanations before or after the code.
No markdown code fences (no ```typescript).
Just the raw .ts file content ready to save as: tests/day3-ai-generated/login-ai.spec.ts


## Master Prompt Template (Most Detailed)

You are an expert QA automation engineer specializing in Playwright (TypeScript).
Generate a complete, runnable Playwright test file for the following:

APPLICATION: EventHub - Event booking platform BASE URL: https://eventhub.rahulshettyacademy.com/ FEATURE: [Feature name, e.g. 'User Registration']

TEST CASES TO COVER:

    [Happy path description]
    [Error / edge case description]
    [Boundary condition]

CONSTRAINTS:

    Use getByRole() and getByLabel() selectors — avoid CSS/XPath
    Add data-testid where needed and note them in comments
    Include beforeEach for shared setup
    TypeScript strict-mode compatible
    Add /* AI-GENERATED — Review required */ header comment

Follow skills/playwright-test-writer/SKILL.md strictly.

