/* AI-GENERATED — Review required | Engineer: Ravi | Date: 2026-04-30 */
import { test, expect } from '@playwright/test';
import type { components } from '../src/api-client/Api';

type AuthResponse = components['schemas']['AuthResponse'];
type Event       = components['schemas']['Event'];
type Booking     = components['schemas']['Booking'];

const API      = 'https://api.eventhub.rahulshettyacademy.com/api';
const TOKEN    = process.env.API_TOKEN ?? '';
const EMAIL    = process.env.USER_EMAIL ?? '';
const PASSWORD = process.env.USER_PASSWORD ?? '';

test.describe('Swagger Typed API Tests', () => {

  // ── Test 1 ─────────────────────────────────────────────────────────────────
  test('POST /auth/login — status 200 with token (string) and userId (number)', async ({ request }) => {
    // Arrange
    const payload = { email: EMAIL, password: PASSWORD };

    // Act
    const resp = await request.post(`${API}/auth/login`, { data: payload });

    // Assert
    expect(resp.status()).toBe(200);
    const body: AuthResponse = await resp.json();
    expect(typeof body.token).toBe('string');
    expect(typeof body.user?.id).toBe('number');
  });

  // ── Test 2 ─────────────────────────────────────────────────────────────────
  test('GET /events — returns array where first item matches Event schema', async ({ request }) => {
    // Arrange — global auth header from playwright.config.ts

    // Act
    const resp = await request.get(`${API}/events`);

    // Assert
    expect(resp.status()).toBe(200);
    const body: { success?: boolean; data?: Event[] } = await resp.json();
    expect(Array.isArray(body.data)).toBe(true);
    expect(body.data!.length).toBeGreaterThan(0);

    const first = body.data![0];
    expect(typeof first.id).toBe('number');
    expect(typeof first.title).toBe('string');
    expect(typeof first.city).toBe('string');
    expect(typeof first.venue).toBe('string');
    expect(typeof first.totalSeats).toBe('number');
    // Swagger spec declares price as float — assert accordingly.
    // If this fails the live API is returning price as a string instead of a number.
    expect(typeof first.price).toBe('number');
  });

  // ── Test 3 ─────────────────────────────────────────────────────────────────
  test('GET /events/:id — single Event has correct field types', async ({ request }) => {
    // Arrange — fetch list to get a real event ID
    const listResp = await request.get(`${API}/events`);
    const listBody: { data?: Event[] } = await listResp.json();
    const eventId = listBody.data![0].id!;

    // Act
    const resp = await request.get(`${API}/events/${eventId}`);

    // Assert
    expect(resp.status()).toBe(200);
    const body: { success?: boolean; data?: Event } = await resp.json();
    const ev = body.data!;
    expect(typeof ev.id).toBe('number');
    expect(typeof ev.title).toBe('string');
    expect(typeof ev.totalSeats).toBe('number');
    // Swagger spec declares price as float — if this fails the API is returning a string.
    expect(typeof ev.price).toBe('number');
  });

  // ── Test 4 ─────────────────────────────────────────────────────────────────
  test('POST /bookings — 201 with Booking shaped response', async ({ request }) => {
    // Arrange — fetch a real event ID first
    const listResp = await request.get(`${API}/events`);
    const listBody: { data?: Event[] } = await listResp.json();
    const eventId = listBody.data![0].id!;

    // Act
    const resp = await request.post(`${API}/bookings`, {
      headers: { Authorization: `Bearer ${TOKEN}` },
      data: {
        eventId,
        customerName: 'Ravi Tanna',
        customerEmail: EMAIL,
        customerPhone: '+91-9876543210',
        quantity: 1,
      },
    });

    // Assert
    expect(resp.status()).toBe(201);
    const body: { success?: boolean; data?: Booking; message?: string } = await resp.json();
    expect(body.success).toBe(true);
    const booking = body.data!;
    expect(typeof booking.id).toBe('number');
    expect(booking.eventId).toBe(eventId);
    expect(typeof booking.quantity).toBe('number');
  });

  // ── Test 5 ─────────────────────────────────────────────────────────────────
  test('GET /bookings — list has correct shape and exposes no sensitive fields', async ({ request }) => {
    // Arrange — global auth header from playwright.config.ts

    // Act
    const resp = await request.get(`${API}/bookings`);

    // Assert
    expect(resp.status()).toBe(200);
    const body: { success?: boolean; data?: Booking[] } = await resp.json();
    expect(Array.isArray(body.data)).toBe(true);
    if (body.data!.length > 0) {
      const b = body.data![0];
      expect(typeof b.id).toBe('number');
      expect(typeof b.eventId).toBe('number');
      expect((b as Record<string, unknown>).password).toBeUndefined();
    }
  });

  // ── Test 6 ─────────────────────────────────────────────────────────────────
  test('GET /bookings without token — returns 401', async ({ request }) => {
    // Arrange — override global auth header with empty string to simulate no token

    // Act
    const resp = await request.get(`${API}/bookings`, {
      headers: { Authorization: '' },
    });

    // Assert
    expect(resp.status()).toBe(401);
  });

});
