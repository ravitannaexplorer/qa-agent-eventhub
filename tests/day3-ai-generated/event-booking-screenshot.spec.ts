/* AI-GENERATED — Review required | Engineer: Ravi | Date: 2026-04-29 */
import { test, expect } from '@playwright/test';

test.describe('EventHub Event Booking', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.getByLabel('Email').fill(process.env.USER_EMAIL ?? '');
    await page.getByLabel('Password').fill(process.env.USER_PASSWORD ?? '');
    await page.getByRole('button', { name: 'Sign In' }).click();
    await expect(page).toHaveURL('/');
  });

  test('should confirm booking when complete booking flow is followed', async ({ page }) => {
    // Arrange
    await page.goto('/');
    await expect(page.getByRole('heading', { name: 'Featured Events' })).toBeVisible();

    // Act - navigate to Dilli Diwali Mela via its Book Now link
    await page.getByRole('article')
      .filter({ hasText: 'Dilli Diwali Mela' })
      .getByRole('link', { name: 'Book Now' })
      .click();

    await expect(page.getByRole('heading', { name: 'Dilli Diwali Mela' })).toBeVisible();

    await page.getByLabel('Full Name').fill('Test User');
    await page.getByLabel('Email').fill('test@example.com');
    await page.getByLabel('Phone Number').fill('9876543210');
    await page.getByRole('button', { name: 'Confirm Booking' }).click();

    // Assert
    await expect(page.getByText('Booking Confirmed!')).toBeVisible();
    await expect(page.getByRole('button', { name: 'View My Bookings' })).toBeVisible();
  });

  test('should show validation error when Full Name is left empty on booking form', async ({ page }) => {
    // Arrange
    await page.goto('/events/3');
    await expect(page.getByRole('heading', { name: 'Dilli Diwali Mela' })).toBeVisible();

    // Act - submit form without filling Full Name
    await page.getByLabel('Email').fill('test@example.com');
    await page.getByLabel('Phone Number').fill('9876543210');
    await page.getByRole('button', { name: 'Confirm Booking' }).click();

    // Assert
    await expect(page.getByText('Name must be at least 2 chars')).toBeVisible();
    await expect(page.getByText('Booking Confirmed!')).not.toBeVisible();
  });

  test('should show validation error when Email format is invalid on booking form', async ({ page }) => {
    // Arrange
    await page.goto('/events/3');
    await expect(page.getByRole('heading', { name: 'Dilli Diwali Mela' })).toBeVisible();

    // Act - submit form with a malformed email address
    await page.getByLabel('Full Name').fill('Test User');
    await page.getByLabel('Email').fill('notanemail');
    await page.getByLabel('Phone Number').fill('9876543210');
    await page.getByRole('button', { name: 'Confirm Booking' }).click();

    // Assert
    await expect(page.getByText('Enter a valid email')).toBeVisible();
    await expect(page.getByText('Booking Confirmed!')).not.toBeVisible();
  });

  test('should show validation error when Phone Number is invalid on booking form', async ({ page }) => {
    // Arrange
    await page.goto('/events/3');
    await expect(page.getByRole('heading', { name: 'Dilli Diwali Mela' })).toBeVisible();

    // Act - submit form with a non-numeric phone number
    await page.getByLabel('Full Name').fill('Test User');
    await page.getByLabel('Email').fill('test@example.com');
    await page.getByLabel('Phone Number').fill('abc');
    await page.getByRole('button', { name: 'Confirm Booking' }).click();

    // Assert
    await expect(page.getByText('Enter a valid 10-digit phone')).toBeVisible();
    await expect(page.getByText('Booking Confirmed!')).not.toBeVisible();
  });

  test('should update ticket total when quantity increase and decrease buttons are clicked', async ({ page }) => {
    // Arrange
    await page.goto('/events/3');
    await expect(page.getByRole('heading', { name: 'Dilli Diwali Mela' })).toBeVisible();
    const increaseBtn = page.getByRole('button', { name: '+' });
    const decreaseBtn = page.getByRole('button', { name: '−' }); // U+2212 minus sign

    // Act - increase ticket quantity from 1 to 2
    await increaseBtn.click();

    // Assert - price breakdown shows 2 tickets (unique text, avoids strict-mode on two $600 spans)
    await expect(page.getByText('$300 × 2 tickets')).toBeVisible();

    // Act - decrease ticket quantity back to 1
    await decreaseBtn.click();

    // Assert - price breakdown reverts to 1 ticket
    await expect(page.getByText('$300 × 1 ticket')).toBeVisible();
  });

});
