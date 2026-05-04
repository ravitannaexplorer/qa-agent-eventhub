/* AI-GENERATED — Review required | Engineer: Ravi | Date: 2026-05-01 */
import { test as base, request } from '@playwright/test';
import { URLS } from '../../utils/constants';

// ─── Fixture types ────────────────────────────────────────────────────────────

type AuthFixtures = {
  authToken: string;
};

// ─── Auth fixture ─────────────────────────────────────────────────────────────

/**
 * Provides a valid JWT `authToken` to any test that declares it.
 *
 * Uses the API domain (api.eventhub.rahulshettyacademy.com) — separate from the
 * UI base URL. The request context is created without baseURL so the absolute
 * URLS.API_AUTH constant is used directly.
 */
export const test = base.extend<AuthFixtures>({

  authToken: async ({}, use) => {

    // SETUP — create an isolated request context pointed at the API domain
    const ctx = await request.newContext({
      baseURL: URLS.API_BASE,
    });

    const resp = await ctx.post(URLS.API_AUTH, {
      data: {
        email:    process.env.LOGIN_EMAIL    ?? process.env.USER_EMAIL,
        password: process.env.LOGIN_PASSWORD ?? process.env.USER_PASSWORD,
      },
    });

    const body = await resp.json();

    if (!body.token) {
      throw new Error(
        `[auth.fixture] Login failed — status ${resp.status()}, body: ${JSON.stringify(body)}`
      );
    }

    const token: string = body.token;

    // HAND OFF — test runs here with the token
    await use(token);

    // CLEANUP
    await ctx.dispose();
  },

});

export { expect } from '@playwright/test';