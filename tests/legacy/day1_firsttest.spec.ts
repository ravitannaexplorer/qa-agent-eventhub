/* AI-GENERATED — Review required | Engineer: Gemini | Date: 2026-04-27 */
import { test, expect } from '@playwright/test';

test.describe('Day 1: Full Page Locator Coverage', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('https://rahulshettyacademy.com/AutomationPractice/', { 
        waitUntil: 'domcontentloaded' 
    });
  });

  test('Radio Button - Position Based', async ({ page }) => {
    const radio3 = page.getByRole('radio').nth(2); 
    await radio3.check();
    await expect(radio3).toBeChecked();
  });

  test('Suggestion Class - Placeholder Priority', async ({ page }) => {
    const countryInput = page.getByPlaceholder('Type to Select Countries');
    await countryInput.fill('India');
    await expect(countryInput).toHaveValue('India');
  });

  test('Dropdown - Select Option', async ({ page }) => {
    const dropdown = page.locator('#dropdown-class-example');
    await dropdown.selectOption('option3');
    await expect(dropdown).toHaveValue('option3');
  });

  test('Checkboxes - Using Value/Label Mix', async ({ page }) => {
    const box1 = page.locator('#checkBoxOption1');
    const box2 = page.locator('#checkBoxOption2');
    await box1.check();
    await box2.check();
    await expect(box1).toBeChecked();
    await expect(box2).toBeChecked();
  });

  test('Window/Tab Handling - Promise.all', async ({ page }) => {
    const [newPage] = await Promise.all([
      page.context().waitForEvent('page'),
      page.getByRole('button', { name: 'Open Window' }).click(),
    ]);
    await expect(newPage).toHaveURL(/qaclickacademy/, { timeout: 15000 });
  });

  test('Switch Tab - Link Interaction', async ({ page }) => {
    const [newTab] = await Promise.all([
      page.context().waitForEvent('page'),
      page.getByRole('link', { name: 'Open Tab' }).click(),
    ]);
    await expect(newTab).toHaveURL(/qaclickacademy/, { timeout: 15000 });
  });

  test('Alert/Confirm - Dialog Listener', async ({ page }) => {
    page.once('dialog', d => {
      expect(d.message()).toBe('Hello Tester, Are you sure you want to confirm?');
      d.accept();
    });
    await page.getByPlaceholder('Enter Your Name').fill('Tester');
    await page.getByRole('button', { name: 'Confirm' }).click();
  });

  test('Web Table - Exact Text Matching', async ({ page }) => {
    const table = page.locator('table[name="courses"]'); 
    const row = table.locator('tr').filter({ hasText: 'Appium' });
    const price = row.locator('td').last();
    await expect(price).toHaveText('30');
  });

  test('Show/Hide - Visibility State', async ({ page }) => {
    const textBox = page.getByPlaceholder('Hide/Show Example');
    await page.getByRole('button', { name: 'Hide' }).click();
    await expect(textBox).toBeHidden();
    await page.getByRole('button', { name: 'Show' }).click();
    await expect(textBox).toBeVisible();
  });

  test('Mouse Hover - Action and Navigation', async ({ page }) => {
  // 1. SCROLL FIRST: Get the page into a position where we can actually see a scroll happen
  await page.evaluate(() => window.scrollTo(0, 500));

  // 2. TARGET: Find the hover button
  const hoverBtn = page.getByRole('button', { name: 'Mouse Hover' });
  
  // 3. HOVER: Reveal the menu while the page is stationary
  await hoverBtn.hover();

  // 4. IDENTIFY & CLICK: Use force if the animation is still tricky
  const topOption = page.getByRole('link', { name: 'Top' });
  
  // We ensure it's visible before clicking
  await expect(topOption).toBeVisible();
  await topOption.click({ force: true });

  // 5. VERIFY: Wait for the scroll to return to the top
  await page.waitForFunction(() => window.scrollY === 0, { timeout: 5000 });
  const scrollY = await page.evaluate(() => window.scrollY);
  expect(scrollY).toBe(0);
});

  test('iFrame - Resilient Frame Handling', async ({ page }) => {
    const frame = page.frameLocator('#courses-iframe');
    const contactLink = frame.locator('a[href*="contact"]').first();
    await expect(contactLink).toBeAttached({ timeout: 30000 });
  });
}); // This single brace closes the test.describe