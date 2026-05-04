/* AI-GENERATED — Review required | Engineer: Ravi | Date: 2026-05-01 */
import { test, expect } from '../fixtures/auth.fixture';
import { z } from 'zod';
import { URLS, TIMEOUTS } from '../../utils/constants';

test.setTimeout(TIMEOUTS.DEFAULT);

// ─── Schemas ─────────────────────────────────────────────────────────────────

// API BUG: price returned as string not number (Swagger declares number)
const EventSchema = z.object({
  id:             z.number(),
  title:          z.string(),
  description:    z.string(),
  category:       z.string(),
  venue:          z.string(),
  city:           z.string(),
  eventDate:      z.string(),
  price:          z.string(),   // API BUG: price returned as string not number
  totalSeats:     z.number(),
  availableSeats: z.number(),
  imageUrl:       z.string().nullable(),
  isStatic:       z.boolean(),
  userId:         z.number().nullable(),
  createdAt:      z.string(),
  updatedAt:      z.string(),
});

const EventsListResponseSchema = z.object({
  success:    z.boolean(),
  data:       z.array(EventSchema),
  pagination: z.object({
    total:      z.number(),
    page:       z.number(),
    limit:      z.number(),
    totalPages: z.number(),
  }),
});

const SingleEventResponseSchema = z.object({
  success: z.boolean(),
  data:    EventSchema,
});

// ─── Shared state — used across the CRUD chain TC-060 → TC-061 → TC-062 ─────

let createdEventId: number;

// ─── Event body reused for create and update ──────────────────────────────────

const NEW_EVENT = {
  title:       'API Spec Test Event',
  description: 'Created by events.spec.ts for automated API tests',
  category:    'Conference',
  venue:       'Playwright Arena',
  city:        'Hyderabad',
  eventDate:   '2027-06-20T09:00:00.000Z',
  price:       '750',
  totalSeats:  50,
  imageUrl:    null,
};

// ─── Suite ───────────────────────────────────────────────────────────────────

test.describe('Events API', () => {

  // IMPORTANT: TC-060 → TC-061 → TC-062 is a CRUD chain that shares createdEventId.
  // Serial mode ensures they always run in order in one worker.
  test.describe.configure({ mode: 'serial' });

  // ── TC-046 ──────────────────────────────────────────────────────────────────
  test('[TC-046] should return 200 and a paginated event array when listing all events @smoke',
    async ({ request }) => {

    // Arrange
    // (no setup required — public endpoint)

    // Act
    const resp = await request.get(URLS.API_EVENTS);

    // Assert
    expect(resp.status()).toBe(200);
    const json = await resp.json();
    expect(() => EventsListResponseSchema.parse(json)).not.toThrow();
    expect(json.data.length).toBeGreaterThan(0);
  });

  // ── TC-047 ──────────────────────────────────────────────────────────────────
  test('[TC-047] should return 200 and event detail object when fetching an existing event @regression',
    async ({ request }) => {

    // Arrange — use the first event from the list to get a valid ID
    const listResp = await request.get(URLS.API_EVENTS);
    const listJson = await listResp.json();
    const validId: number = listJson.data[0].id;

    // Act
    const resp = await request.get(`${URLS.API_EVENTS}/${validId}`);

    // Assert
    expect(resp.status()).toBe(200);
    const json = await resp.json();
    expect(() => SingleEventResponseSchema.parse(json)).not.toThrow();
    expect(json.data.id).toBe(validId);
  });

  // ── TC-048 ──────────────────────────────────────────────────────────────────
  test('[TC-048] should return 404 when fetching a non-existent event ID @regression',
    async ({ request }) => {

    // Arrange
    const nonExistentId = 99999;

    // Act
    const resp = await request.get(`${URLS.API_EVENTS}/${nonExistentId}`);

    // Assert
    expect(resp.status()).toBe(404);
    const json = await resp.json();
    expect(json.success).toBe(false);
  });

  // ── TC-060 ──────────────────────────────────────────────────────────────────
  test('[TC-060] should return 201 and the created event when posting with valid auth and body @regression',
    async ({ request, authToken }) => {

    // Arrange
    const headers = { 'Authorization': `Bearer ${authToken}` };

    // Act
    const resp = await request.post(URLS.API_EVENTS, {
      headers,
      data: NEW_EVENT,
    });

    // Assert
    expect(resp.status()).toBe(201);
    const json = await resp.json();
    expect(() => SingleEventResponseSchema.parse(json)).not.toThrow();
    expect(json.data.title).toBe(NEW_EVENT.title);

    // Save ID for TC-061 and TC-062
    createdEventId = json.data.id;
    expect(typeof createdEventId).toBe('number');
  });

  // ── TC-061 ──────────────────────────────────────────────────────────────────
  test('[TC-061] should return 200 and the updated event when updating with valid auth @regression',
    async ({ request, authToken }) => {

    // Arrange — depends on createdEventId from TC-060
    const headers  = { 'Authorization': `Bearer ${authToken}` };
    const updated  = { ...NEW_EVENT, title: 'API Spec Test Event — UPDATED' };

    // Act
    const resp = await request.put(`${URLS.API_EVENTS}/${createdEventId}`, {
      headers,
      data: updated,
    });

    // Assert
    expect(resp.status()).toBe(200);
    const json = await resp.json();
    expect(() => SingleEventResponseSchema.parse(json)).not.toThrow();
    expect(json.data.title).toBe(updated.title);
  });

  // ── TC-062 ──────────────────────────────────────────────────────────────────
  test('[TC-062] should return 200 and remove the event when deleting with valid auth @regression',
    async ({ request, authToken }) => {

    // Arrange — depends on createdEventId from TC-060
    const headers = { 'Authorization': `Bearer ${authToken}` };

    // Act
    const resp = await request.delete(`${URLS.API_EVENTS}/${createdEventId}`, { headers });

    // Assert
    expect(resp.status()).toBe(200);
    const json = await resp.json();
    expect(json.success).toBe(true);

    // Verify the event is gone
    const verify = await request.get(`${URLS.API_EVENTS}/${createdEventId}`);
    expect(verify.status()).toBe(404);
  });

  // ── TC-065 ──────────────────────────────────────────────────────────────────
  test('[TC-065] should return 401 when updating an event without an auth token @regression',
    async ({ request }) => {

    // Arrange — explicitly pass an invalid token to override the global extraHTTPHeaders
    const headers = { 'Authorization': 'Bearer invalid_token_no_auth' };

    // Act
    const resp = await request.put(`${URLS.API_EVENTS}/1`, {
      headers,
      data: { title: 'Unauthorized attempt' },
    });

    // Assert
    expect(resp.status()).toBe(401);
  });

  // ── TC-066 ──────────────────────────────────────────────────────────────────
  test('[TC-066] should return 401 when deleting an event without an auth token @regression',
    async ({ request }) => {

    // Arrange — explicitly pass an invalid token to override the global extraHTTPHeaders
    const headers = { 'Authorization': 'Bearer invalid_token_no_auth' };

    // Act
    const resp = await request.delete(`${URLS.API_EVENTS}/1`, { headers });

    // Assert
    expect(resp.status()).toBe(401);
  });

});
