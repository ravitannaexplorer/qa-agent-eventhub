import { test as base, request } from '@playwright/test';

// Define what our fixture provides to tests
type AuthFixtures = {
  authToken: string;
};

export const test = base.extend<AuthFixtures>({

  authToken: async ({}, use) => {

    // SETUP — runs before your test
    const ctx = await request.newContext({
      baseURL: process.env.BASE_URL
    });

    const resp = await ctx.post('/api/auth/login', {
      data: {
        email: process.env.USER_EMAIL,
        password: process.env.USER_PASSWORD
      }
    });

    console.log('Login status:', resp.status());
    const body = await resp.json();
    console.log('Login response:', body);  // ← see what field holds the token

    const token = body.token; // we'll confirm this field name from the log

    // HAND OFF — test runs here with the token
    await use(token);

    // CLEANUP — runs after test finishes
    await ctx.dispose();
  }

});

export { expect } from '@playwright/test';