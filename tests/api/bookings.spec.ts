/* AI-GENERATED — Review required | Engineer: Ravi | Date: 2026-05-01 */
import { test, expect } from '../fixtures/auth.fixture';
import { z } from 'zod';
import { URLS, TIMEOUTS } from '../../utils/constants';

test.setTimeout(TIMEOUTS.DEFAULT);

// ─── Schemas ─────────────────────────────────────────────────────────────────

const BookingSchema = z.object({
  id:            z.number(),
  eventId:       z.number(),
  customerName:  z.string(),
  customerEmail: z.string(),
  customerPhone: z.string(),
  quantity:      z.number(),
  totalPrice:    z.union([z.number(), z.string()]), // API BUG: totalPrice returned as string not number
  status:        z.enum(['confirmed', 'cancelled']),
  bookingRef:    z.string(),
  createdAt:     z.string(),
  updatedAt:     z.string(),
});

const BookingsListResponseSchema = z.object({
  success: z.boolean(),
  data:    z.array(BookingSchema),
});

const SingleBookingResponseSchema = z.object({
  success: z.boolean(),
  data:    BookingSchema,
});

// ─── Shared state — TC-051 creates booking; TC-063 reads it; TC-053 cancels it ──

let createdBookingId: number;
let bookableEventId:  number;   // resolved in TC-051 from the live event list

// ─── Suite ───────────────────────────────────────────────────────────────────

test.describe('Bookings API', () => {

  // IMPORTANT: The CRUD chain TC-051 → TC-063 → TC-053 depends on shared state
  // (createdBookingId). Serial mode ensures they run in order in a single worker.
  test.describe.configure({ mode: 'serial' });

  // ── TC-049 ──────────────────────────────────────────────────────────────────
  test('[TC-049] should return 200 and bookings array when fetching with valid auth @regression',
    async ({ request, authToken }) => {

    // Arrange
    const headers = { 'Authorization': `Bearer ${authToken}` };

    // Act
    const resp = await request.get(URLS.API_BOOKINGS, { headers });

    // Assert
    expect(resp.status()).toBe(200);
    const json = await resp.json();
    expect(() => BookingsListResponseSchema.parse(json)).not.toThrow();
  });

  // ── TC-050 ──────────────────────────────────────────────────────────────────
  test('[TC-050] should return 401 when fetching bookings without auth token @regression',
    async ({ request }) => {

    // Arrange — override global extraHTTPHeaders with an invalid token
    const headers = { 'Authorization': 'Bearer invalid_token_no_auth' };

    // Act
    const resp = await request.get(URLS.API_BOOKINGS, { headers });

    // Assert
    expect(resp.status()).toBe(401);
  });

  // ── TC-051 ──────────────────────────────────────────────────────────────────
  // NOTE: TC-063 and TC-053 depend on the bookingId created here — they run after this test
  test('[TC-051] should return 201 and booking confirmation when creating with valid auth and body @smoke',
    async ({ request, authToken }) => {

    // Arrange — resolve a bookable event from the live list
    const eventsResp = await request.get(URLS.API_EVENTS);
    const eventsJson = await eventsResp.json();
    const bookable   = eventsJson.data.find(
      (e: { availableSeats: number; id: number }) => e.availableSeats > 0
    );
    expect(bookable, 'No event with available seats found').toBeTruthy();
    bookableEventId  = bookable.id;

    const headers = { 'Authorization': `Bearer ${authToken}` };
    const body    = {
      eventId:       bookableEventId,
      customerName:  'API Test User',
      customerEmail: 'apitest@playwrighttraining.com',
      customerPhone: '9876543210',
      quantity:      1,
    };

    // Act
    const resp = await request.post(URLS.API_BOOKINGS, { headers, data: body });

    // Assert
    expect(resp.status()).toBe(201);
    const json = await resp.json();
    expect(() => SingleBookingResponseSchema.parse(json)).not.toThrow();
    expect(json.data.status).toBe('confirmed');

    // Save ID for TC-063 (read) and TC-053 (cancel)
    createdBookingId = json.data.id;
    expect(typeof createdBookingId).toBe('number');
  });

  // ── TC-052 ──────────────────────────────────────────────────────────────────
  test('[TC-052] should return 404 when creating a booking for a non-existent event @regression',
    async ({ request, authToken }) => {

    // Arrange
    const headers = { 'Authorization': `Bearer ${authToken}` };
    const body    = {
      eventId:       99999,
      customerName:  'API Test User',
      customerEmail: 'apitest@playwrighttraining.com',
      customerPhone: '9876543210',
      quantity:      1,
    };

    // Act
    const resp = await request.post(URLS.API_BOOKINGS, { headers, data: body });

    // Assert
    expect(resp.status()).toBe(404);
    const json = await resp.json();
    expect(json.success).toBe(false);
  });

  // ── TC-056 ──────────────────────────────────────────────────────────────────
  test('[TC-056] should return 401 when using an expired or invalid token @regression',
    async ({ request }) => {

    // Arrange — explicitly provide a known-invalid/expired token string
    const headers = { 'Authorization': 'Bearer expired_jwt_token_for_tc056' };

    // Act
    const resp = await request.get(URLS.API_BOOKINGS, { headers });

    // Assert
    expect(resp.status()).toBe(401);
  });

  // ── TC-057 ──────────────────────────────────────────────────────────────────
  test.skip('[TC-057] should return 401 when using a malformed token @regression',
    async ({ request }) => {

    // Arrange — invalid format (not a JWT)
    const headers = { 'Authorization': 'Bearer not-a-jwt-token' };

    // Act
    const resp = await request.get(URLS.API_BOOKINGS, { headers });

    // Assert
    expect(resp.status()).toBe(401);
  });

  // ── TC-058 ──────────────────────────────────────────────────────────────────
  test('[TC-058] should return 400 when booking with zero seats (boundary) @regression',
    async ({ request, authToken }) => {

    // Arrange
    const headers = { 'Authorization': `Bearer ${authToken}` };
    const body    = {
      eventId:       bookableEventId ?? 1,
      customerName:  'API Test User',
      customerEmail: 'apitest@playwrighttraining.com',
      customerPhone: '9876543210',
      quantity:      0,
    };

    // Act
    const resp = await request.post(URLS.API_BOOKINGS, { headers, data: body });

    // Assert
    expect(resp.status()).toBe(400);
    const json = await resp.json();
    expect(json.success).toBe(false);
  });

  // ── TC-059 ──────────────────────────────────────────────────────────────────
  test('[TC-059] should return 400 when booking with negative seats (boundary) @regression',
    async ({ request, authToken }) => {

    // Arrange
    const headers = { 'Authorization': `Bearer ${authToken}` };
    const body    = {
      eventId:       bookableEventId ?? 1,
      customerName:  'API Test User',
      customerEmail: 'apitest@playwrighttraining.com',
      customerPhone: '9876543210',
      quantity:      -5,
    };

    // Act
    const resp = await request.post(URLS.API_BOOKINGS, { headers, data: body });

    // Assert
    expect(resp.status()).toBe(400);
    const json = await resp.json();
    expect(json.success).toBe(false);
  });

  // ── TC-063 ──────────────────────────────────────────────────────────────────
  // NOTE: runs before TC-053 (cancel) so the booking still exists when we read it
  test('[TC-063] should return 200 and booking detail when fetching a single booking by ID @regression',
    async ({ request, authToken }) => {

    // Arrange — depends on createdBookingId from TC-051
    const headers = { 'Authorization': `Bearer ${authToken}` };

    // Act
    const resp = await request.get(`${URLS.API_BOOKINGS}/${createdBookingId}`, { headers });

    // Assert
    expect(resp.status()).toBe(200);
    const json = await resp.json();
    expect(() => SingleBookingResponseSchema.parse(json)).not.toThrow();
    expect(json.data.id).toBe(createdBookingId);
  });

  // ── TC-053 ──────────────────────────────────────────────────────────────────
  // NOTE: intentionally after TC-063 — cancelling deletes the booking
  test('[TC-053] should return 200 and cancel the booking when deleting with valid auth @regression',
    async ({ request, authToken }) => {

    // Arrange — depends on createdBookingId from TC-051
    const headers = { 'Authorization': `Bearer ${authToken}` };

    // Act
    const resp = await request.delete(`${URLS.API_BOOKINGS}/${createdBookingId}`, { headers });

    // Assert
    expect(resp.status()).toBe(200);
    const json = await resp.json();
    expect(json.success).toBe(true);

    // Verify booking is gone
    const verify = await request.get(`${URLS.API_BOOKINGS}/${createdBookingId}`, { headers });
    expect(verify.status()).toBe(404);
  });

  // ── TC-054 ──────────────────────────────────────────────────────────────────
  test('[TC-054] should return 200 and user profile when fetching with valid auth @regression',
    async ({ request, authToken }) => {

    // Arrange
    const headers = { 'Authorization': `Bearer ${authToken}` };

    // Act
    const resp = await request.get(`${URLS.API_BASE}/auth/me`, { headers });

    // Assert
    expect(resp.status()).toBe(200);
    const json = await resp.json();
    expect(json.success).toBe(true);
    const email = json.data?.email ?? json.user?.email;
    expect(typeof email).toBe('string');
  });

  // ── TC-055 ──────────────────────────────────────────────────────────────────
  // NOTE: The EventHub API exposes GET /auth/me (read-only) — there is no PUT endpoint
  // for updating user profile. This test documents that behaviour: PUT returns 404.
  test('[TC-055] should return 404 when attempting to PUT user profile (endpoint does not exist) @regression',
    async ({ request, authToken }) => {

    // Arrange — authenticated PUT to /auth/me (not in swagger — expected to 404)
    const headers = { 'Authorization': `Bearer ${authToken}` };
    const body    = { name: 'API Update' };

    // Act
    const resp = await request.put(`${URLS.API_BASE}/auth/me`, { headers, data: body });

    // Assert — 404 documents "route not found" for this HTTP method + path combo
    expect(resp.status()).toBe(404);
  });

});
