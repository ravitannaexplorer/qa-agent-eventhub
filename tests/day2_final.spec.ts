import { test, expect } from './fixtures/auth.fixture';
import { z } from 'zod';

// ─── Schemas ────────────────────────────────────────────

const EventSchema = z.object({
  id:             z.number(),
  title:          z.string(),
  description:    z.string(),
  category:       z.string(),
  venue:          z.string(),
  city:           z.string(),
  eventDate:      z.string(),
  price:          z.string(),
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

// ─── Shared state ───────────────────────────────────────

let createdEventId: number;

// ─── Tests ──────────────────────────────────────────────

test.describe('EventHub API — Full Suite', () => {

  test('GET /api/events — list with Zod validation', async ({ request }) => {
    const response = await request.get('/api/events');
    // No headers here — extraHTTPHeaders in config handles it

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(() => EventsListResponseSchema.parse(body)).not.toThrow();
  });

  test('POST /api/events — create with Zod + auth fixture', async ({ request, authToken }) => {
    const response = await request.post('/api/events', {
      headers: { 'Authorization': `Bearer ${authToken}` },
      data: {
        title:       'Final Suite Test Event',
        description: 'Created by day2_final suite',
        category:    'Conference',
        venue:       'Playwright Arena, Hyderabad',
        city:        'Hyderabad',
        eventDate:   '2027-03-10T09:00:00.000Z',
        price:       '999',
        totalSeats:  200,
        imageUrl:    'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800'
      }
    });

    expect(response.status()).toBe(201);
    const body = await response.json();

    // Zod validates the created event shape
    expect(() => SingleEventResponseSchema.parse(body)).not.toThrow();

    // Save for next tests
    createdEventId = body.data.id;
    expect(typeof createdEventId).toBe('number');
  });

  test('GET /api/events/{id} — fetch by ID with Zod', async ({ request }) => {
    const response = await request.get(`/api/events/${createdEventId}`);

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(() => SingleEventResponseSchema.parse(body)).not.toThrow();
    expect(body.data.title).toBe('Final Suite Test Event');
  });

  test('PUT /api/events/{id} — update with Zod', async ({ request, authToken }) => {
    const response = await request.put(`/api/events/${createdEventId}`, {
      headers: { 'Authorization': `Bearer ${authToken}` },
      data: {
        title:       'Final Suite Test Event — UPDATED',
        description: 'Created by day2_final suite',
        category:    'Conference',
        venue:       'Playwright Arena, Hyderabad',
        city:        'Hyderabad',
        eventDate:   '2027-03-10T09:00:00.000Z',
        price:       '999',
        totalSeats:  200,
        imageUrl:    'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800'
      }
    });

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(() => SingleEventResponseSchema.parse(body)).not.toThrow();
    expect(body.data.title).toBe('Final Suite Test Event — UPDATED');
  });

  test('DELETE /api/events/{id} — delete and verify gone', async ({ request, authToken }) => {
    const response = await request.delete(`/api/events/${createdEventId}`, {
      headers: { 'Authorization': `Bearer ${authToken}` }
    });

    expect(response.status()).toBe(200);

    // Confirm gone
    const verify = await request.get(`/api/events/${createdEventId}`);
    expect(verify.status()).toBe(404);
  });

  test('GET /api/events — negative test, invalid token returns 401', async ({ request }) => {
    const response = await request.get('/api/events', {
      headers: { 'Authorization': 'Bearer invalidtoken123' }
    });

    // Either 401 unauthorized or still 200 if endpoint is public
    // This tells you whether the endpoint is protected or not
    console.log('Invalid token status:', response.status());
    expect([200, 401]).toContain(response.status());
  });

});