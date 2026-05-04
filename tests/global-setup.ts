/* AI-GENERATED — Review required | Engineer: Ravi | Date: 2026-05-01 */
import { chromium, test as setup } from '@playwright/test';
import * as fs from 'fs';
import { URLS } from '../utils/constants';
import { ENV } from '../utils/env';

const AUTH_FILE = 'playwright/.auth/user.json';

async function authenticate(): Promise<void> {
  fs.mkdirSync('playwright/.auth', { recursive: true });

  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  await page.goto(ENV.BASE_URL + URLS.LOGIN);
  await page.getByRole('textbox', { name: /email/i }).fill(ENV.LOGIN_EMAIL);
  await page.locator('input[type="password"]').fill(ENV.LOGIN_PASSWORD);
  await page.getByRole('button', { name: /sign in/i }).click();

  // waitForURL can miss the redirect if it fires before the listener attaches;
  // fall back to checking the current URL when a timeout occurs.
  try {
    await page.waitForURL((url) => !url.pathname.includes('/login'), { timeout: 30_000 });
  } catch {
    if (page.url().includes('/login')) {
      throw new Error(
        `[Global Setup] Still on login page after 30 s. ` +
        `Current URL: ${page.url()} — check credentials or site availability.`
      );
    }
    // redirect already happened — continue
  }

  await context.storageState({ path: AUTH_FILE });
  await browser.close();

  console.log('[Global Setup] Auth state saved → playwright/.auth/user.json');
}

// Called by the 'setup' project in playwright.config.ts (project-based setup)
setup('authenticate', async () => {
  await authenticate();
});

export default authenticate;
