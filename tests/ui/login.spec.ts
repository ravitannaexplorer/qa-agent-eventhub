/* AI-GENERATED — Review required | Engineer: Ravi | Date: 2026-05-01 */
import { test, expect } from '@playwright/test';
import { ENV } from '../../utils/env';
import { TIMEOUTS } from '../../utils/constants';
import LoginPage from '../../pages/LoginPage';

test.setTimeout(TIMEOUTS.DEFAULT);

const EMAIL    = ENV.LOGIN_EMAIL;
const PASSWORD = ENV.LOGIN_PASSWORD;

test.describe('Login Module', () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.navigate();
  });

  // ── TC-001 ──────────────────────────────────────────────────────────────────
  test('[TC-001] should redirect away from login when valid credentials are entered @smoke',
    async ({ page }) => {

    // Arrange
    const email    = EMAIL;
    const password = PASSWORD;

    // Act
    await loginPage.login(email, password);

    // Assert
    await expect(page).not.toHaveURL(/\/login/, { timeout: TIMEOUTS.NAVIGATION });
    await page.screenshot({ path: 'test-results/TC-001-login-success.png', fullPage: true });
  });

  // ── TC-002 ──────────────────────────────────────────────────────────────────
  test('[TC-002] should show error when login is attempted with wrong password @regression',
    async ({ page }) => {

    // Arrange
    const wrongPassword = 'wrongpassword';

    // Act
    await loginPage.login(EMAIL, wrongPassword);

    // Assert
    await loginPage.assertErrorMessage('Invalid');
    await page.screenshot({ path: 'test-results/TC-002-wrong-password.png', fullPage: true });
  });

  // ── TC-003 ──────────────────────────────────────────────────────────────────
  test('[TC-003] should stay on login page when email format is invalid @regression',
    async ({ page }) => {

    // Arrange
    const invalidEmail = 'notanemail';

    // Act
    await loginPage.login(invalidEmail, PASSWORD);

    // Assert
    await loginPage.assertStillOnLoginPage();
    await page.screenshot({ path: 'test-results/TC-003-invalid-email.png', fullPage: true });
  });

  // ── TC-004 ──────────────────────────────────────────────────────────────────
  test('[TC-004] should stay on login page when both fields are left empty @regression',
    async ({ page }) => {

    // Arrange
    // fields intentionally left empty

    // Act
    await loginPage.clickSignIn();

    // Assert
    await loginPage.assertStillOnLoginPage();
    await page.screenshot({ path: 'test-results/TC-004-empty-fields.png', fullPage: true });
  });

  // ── TC-005 ──────────────────────────────────────────────────────────────────
  test('[TC-005] should reject SQL injection input in email field safely @regression',
    async ({ page }) => {

    // Arrange
    const sqlPayload = "' OR '1'='1";

    // Act
    await loginPage.login(sqlPayload, PASSWORD);

    // Assert
    await loginPage.assertStillOnLoginPage();
    await page.screenshot({ path: 'test-results/TC-005-sql-injection.png', fullPage: true });
  });

  // ── TC-006 ──────────────────────────────────────────────────────────────────
  test('[TC-006] should reject XSS payload in password field without executing script @regression',
    async ({ page }) => {

    // Arrange
    const xssPayload = '<script>alert(1)</script>';

    // Act
    await loginPage.login(EMAIL, xssPayload);

    // Assert
    // DEMO FAILURE — revert after demo
    await expect(page).toHaveURL('/dashboard');
    await page.screenshot({ path: 'test-results/TC-006-xss-payload.png', fullPage: true });
  });

});
