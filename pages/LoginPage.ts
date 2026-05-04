/* AI-GENERATED — Review required | Engineer: Ravi | Date: 2026-04-30 */
import { expect, type Page } from '@playwright/test';
import { SelfHealingLocator } from '../utils/self-healing-locator';

export default class LoginPage {
  private emailInput: SelfHealingLocator;
  private passwordInput: SelfHealingLocator;
  private signInButton: SelfHealingLocator;

  constructor(private page: Page) {
    this.emailInput = new SelfHealingLocator(page, [
      { name: 'role textbox email',   locatorFn: (p) => p.getByRole('textbox', { name: /email/i }),   priority: 1 },
      { name: 'label Email',          locatorFn: (p) => p.getByLabel('Email'),                         priority: 2 },
      { name: 'placeholder email',    locatorFn: (p) => p.getByPlaceholder(/email/i),                  priority: 3 },
      { name: 'data-testid',          locatorFn: (p) => p.getByTestId('email-input'),                  priority: 4 },
      { name: 'input[type="email"]',  locatorFn: (p) => p.locator('input[type="email"]'),              priority: 5 },
    ]);

    this.passwordInput = new SelfHealingLocator(page, [
      { name: 'role textbox password',   locatorFn: (p) => p.getByRole('textbox', { name: /password/i }), priority: 1 },
      { name: 'label Password',          locatorFn: (p) => p.getByLabel('Password'),                       priority: 2 },
      { name: 'placeholder password',    locatorFn: (p) => p.getByPlaceholder(/password/i),                priority: 3 },
      { name: 'data-testid',             locatorFn: (p) => p.getByTestId('password-input'),                priority: 4 },
      { name: 'input[type="password"]',  locatorFn: (p) => p.locator('input[type="password"]'),            priority: 5 },
    ]);

    this.signInButton = new SelfHealingLocator(page, [
      { name: 'role button Sign In',  locatorFn: (p) => p.getByRole('button', { name: /sign in/i }),  priority: 1 },
      { name: 'role button Login',    locatorFn: (p) => p.getByRole('button', { name: /login/i }),    priority: 2 },
      { name: 'data-testid',          locatorFn: (p) => p.getByTestId('login-btn'),                   priority: 3 },
      { name: 'button[type=submit]',  locatorFn: (p) => p.locator('button[type="submit"]'),           priority: 4 },
    ]);
  }

  async navigate() {
    await this.page.goto('/login');
  }

  async fillEmail(email: string | undefined) {
    await this.emailInput.fill(email ?? '');
  }

  async fillPassword(password: string | undefined) {
    await this.passwordInput.fill(password ?? '');
  }

  async clickSignIn() {
    await this.signInButton.click();
  }

  async login(email: string, password: string) {
    await this.fillEmail(email);
    await this.fillPassword(password);
    await this.clickSignIn();
  }

  async assertRedirectedTo(urlPattern: string) {
    await expect(this.page).toHaveURL(urlPattern);
  }

  async assertErrorMessage(message: string) {
    // Error appears in a toast paragraph, not a role="alert" element
    await expect(this.page.getByText(message, { exact: false })).toBeVisible();
  }

  async assertStillOnLoginPage() {
    await expect(this.page).toHaveURL(/\/login/);
  }

  async assertNotOnProtectedPage() {
    await expect(this.page).not.toHaveURL(/\/(events|bookings|dashboard)/);
  }
}
