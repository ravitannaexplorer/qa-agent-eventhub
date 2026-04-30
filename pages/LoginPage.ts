/* AI-GENERATED — Review required | Engineer: Ravi | Date: 2026-04-30 */
import { expect, Page } from '@playwright/test';

export default class LoginPage {
  constructor(private page: Page) {}

  async navigate() {
    await this.page.goto('/login');
  }

  async fillEmail(email: string | undefined) {
    await this.page.getByLabel('Email').fill(email ?? '');
  }

  async fillPassword(password: string | undefined) {
    await this.page.getByLabel('Password').fill(password ?? '');
  }

  async clickSignIn() {
    await this.page.getByRole('button', { name: 'Sign In' }).click();
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
    await expect(this.page.getByRole('alert')).toContainText(message);
  }

  async assertStillOnLoginPage() {
    await expect(this.page).toHaveURL(/\/login/);
  }

  async assertNotOnProtectedPage() {
    await expect(this.page).not.toHaveURL(/\/(events|bookings|dashboard)/);
  }
}


