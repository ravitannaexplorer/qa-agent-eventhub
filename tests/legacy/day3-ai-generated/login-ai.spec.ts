/* AI-GENERATED — Review required | Engineer: Ravi | Date: 2026-04-29 */
import { test, expect } from '@playwright/test';

test.describe('EventHub Login', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
  });

  test('should redirect to home when login succeeds with valid credentials', async ({ page }) => {
    // Arrange
    const email = page.getByLabel('Email');
    const password = page.getByLabel('Password');
    const signInBtn = page.getByRole('button', { name: 'Sign In' });

    // Act
    await email.fill('ravitanna2015@gmail.com');
    await password.fill('Ravitanna@2015');
    await signInBtn.click();

    // Assert
    await expect(page).toHaveURL('/');
    await expect(page.getByText('ravitanna2015@gmail.com')).toBeVisible();
  });

  test('should show validation error when email format is invalid', async ({ page }) => {
    // Arrange
    const email = page.getByLabel('Email');
    const password = page.getByLabel('Password');
    const signInBtn = page.getByRole('button', { name: 'Sign In' });

    // Act
    await email.fill('notanemail');
    await password.fill('somepassword');
    await signInBtn.click();

    // Assert
    await expect(page.getByText('Enter a valid email')).toBeVisible();
    await expect(page).toHaveURL('/login');
  });

  test('should show error toast when password is wrong', async ({ page }) => {
    // Arrange
    const email = page.getByLabel('Email');
    const password = page.getByLabel('Password');
    const signInBtn = page.getByRole('button', { name: 'Sign In' });

    // Act
    await email.fill('ravitanna2015@gmail.com');
    await password.fill('WrongPassword123');
    await signInBtn.click();

    // Assert
    await expect(page.getByText('Invalid email or password')).toBeVisible();
    await expect(page).toHaveURL('/login');
  });

  test('should show validation errors when form is submitted with empty fields', async ({ page }) => {
    // Arrange
    const signInBtn = page.getByRole('button', { name: 'Sign In' });

    // Act
    await signInBtn.click();

    // Assert
    await expect(page.getByText('Enter a valid email')).toBeVisible();
    await expect(page.getByText('Password must be at least 6 characters')).toBeVisible();
    await expect(page).toHaveURL('/login');
  });
});
