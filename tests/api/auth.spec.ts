/* AI-GENERATED — Review required | Engineer: Ravi | Date: 2026-05-01 */
import { test, expect } from '@playwright/test';
import { z } from 'zod';
import { ENV } from '../../utils/env';
import { URLS, TIMEOUTS } from '../../utils/constants';

/**
 * Auth API behaviour (confirmed from swagger.json):
 *   POST /auth/login → 200  valid credentials
 *   POST /auth/login → 400  wrong password (invalid credentials)
 *   POST /auth/login → 404  email not registered (user not found)
 */

test.setTimeout(TIMEOUTS.DEFAULT);

// ─── Schemas ─────────────────────────────────────────────────────────────────

const AuthResponseSchema = z.object({
  success: z.boolean(),
  token:   z.string(),
  user:    z.object({
    id:    z.number(),
    email: z.string(),
  }),
});

// ─── Suite ───────────────────────────────────────────────────────────────────

test.describe('Auth API', () => {

  // ── TC-043 ──────────────────────────────────────────────────────────────────
  test('[TC-043] should return 200 and a JWT token when credentials are valid @smoke',
    async ({ request }) => {

    // Arrange
    const body = { email: ENV.LOGIN_EMAIL, password: ENV.LOGIN_PASSWORD };

    // Act
    const resp = await request.post(URLS.API_AUTH, { data: body });

    // Assert
    expect(resp.status()).toBe(200);
    const json = await resp.json();
    expect(() => AuthResponseSchema.parse(json)).not.toThrow();
    expect(json.token.length).toBeGreaterThan(0);
  });

  // ── TC-044 ──────────────────────────────────────────────────────────────────
  // API returns 400 for wrong password (incorrect credentials for known email)
  // API returns 404 for unknown email (user not found) — both mean failure
  test('[TC-044] should return 400 when password is incorrect for a valid email @regression',
    async ({ request }) => {

    // Arrange — use the correct email but a deliberately wrong password
    const body = { email: ENV.LOGIN_EMAIL, password: 'WrongPassword!999' };

    // Act
    const resp = await request.post(URLS.API_AUTH, { data: body });

    // Assert — swagger documents 400 for wrong password
    expect(resp.status()).toBe(400);
    const json = await resp.json();
    expect(json.success).toBe(false);
  });

  // ── TC-045 ──────────────────────────────────────────────────────────────────
  test('[TC-045] should return 400 when request body is empty @regression',
    async ({ request }) => {

    // Arrange — empty object omits both required fields (email + password)
    const body = {};

    // Act
    const resp = await request.post(URLS.API_AUTH, { data: body });

    // Assert
    expect(resp.status()).toBe(400);
    const json = await resp.json();
    expect(json.success).toBe(false);
  });

  // ── TC-064 ──────────────────────────────────────────────────────────────────
  test('[TC-064] should return 201 and a JWT token when registering a new user @regression',
    async ({ request }) => {

    // Arrange — unique email using timestamp
    const email = `testuser_${Date.now()}@example.com`;
    const body  = { email, password: 'StrongPassword123!' };

    // Act
    const resp = await request.post(`${URLS.API_BASE}/auth/register`, { data: body });

    // Assert
    expect(resp.status()).toBe(201);
    const json = await resp.json();
    expect(json.success).toBe(true);
    expect(json.token).toBeDefined();
    expect(json.user.email).toBe(email);
  });

});
