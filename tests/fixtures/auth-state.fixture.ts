/* AI-GENERATED — Review required | Engineer: Ravi | Date: 2026-05-01 */
import { test as base, expect, type Page } from '@playwright/test';

type AuthStateFixtures = {
  loggedInPage: Page;
};

export const test = base.extend<AuthStateFixtures>({
  loggedInPage: async ({ browser }, use) => {
    const context = await browser.newContext({
      storageState: 'playwright/.auth/user.json',
    });
    const page = await context.newPage();
    await use(page);
    await context.close();
  },
});

export { expect };
