import { test, expect } from '../fixtures/auth.fixture';

// This ID is shared across all tests in this file
let createdEventId: number;

test.describe('Events CRUD', () => {

  // ─── CREATE ───────────────────────────────────────────
  test('POST /api/events — creates a new event', async ({ request, authToken }) => {

    const response = await request.post('/api/events', {
      headers: { 'Authorization': `Bearer ${authToken}` },
      data: {
        title: 'Playwright Test Event',
        description: 'Created by automated test',
        category: 'Conference',
        venue: 'Test Venue, Hyderabad',
        city: 'Hyderabad',
        eventDate: '2027-01-15T09:00:00.000Z',
        price: '500',
        totalSeats: 100,
        imageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800'
      }
    });

    console.log('POST status:', response.status());
    const body = await response.json();
    console.log('POST response:', body);

    expect(response.status()).toBe(201);
    expect(body.success).toBe(true);
    expect(typeof body.data.id).toBe('number');
    expect(body.data.title).toBe('Playwright Test Event');
    expect(body.data.city).toBe('Hyderabad');

    // Save ID for next tests
    createdEventId = body.data.id;
    console.log('Created event ID:', createdEventId);
  });

  // ─── READ ─────────────────────────────────────────────
  test('GET /api/events/{id} — fetches the created event', async ({ request, authToken }) => {

    const response = await request.get(`/api/events/${createdEventId}`, {
      headers: { 'Authorization': `Bearer ${authToken}` }
    });

    console.log('GET by ID status:', response.status());
    const body = await response.json();
    console.log('GET by ID response:', body);

    expect(response.status()).toBe(200);
    expect(body.success).toBe(true);
    expect(body.data.id).toBe(createdEventId);
    expect(body.data.title).toBe('Playwright Test Event');
  });

  // ─── UPDATE ───────────────────────────────────────────
  test('PUT /api/events/{id} — updates the event title', async ({ request, authToken }) => {

    const response = await request.put(`/api/events/${createdEventId}`, {
      headers: { 'Authorization': `Bearer ${authToken}` },
      data: {
        title: 'Playwright Test Event — UPDATED',
        description: 'Created by automated test',
        category: 'Conference',
        venue: 'Test Venue, Hyderabad',
        city: 'Hyderabad',
        eventDate: '2027-01-15T09:00:00.000Z',
        price: '500',
        totalSeats: 100,
        imageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800'
      }
    });

    console.log('PUT status:', response.status());
    const body = await response.json();
    console.log('PUT response:', body);

    expect(response.status()).toBe(200);
    expect(body.success).toBe(true);
    expect(body.data.title).toBe('Playwright Test Event — UPDATED');
  });

  // ─── DELETE ───────────────────────────────────────────
  test('DELETE /api/events/{id} — deletes the event', async ({ request, authToken }) => {

    const response = await request.delete(`/api/events/${createdEventId}`, {
      headers: { 'Authorization': `Bearer ${authToken}` }
    });

    console.log('DELETE status:', response.status());
    const body = await response.json();
    console.log('DELETE response:', body);

    expect(response.status()).toBe(200);

    // Confirm it's really gone — GET should now return 404
    const verify = await request.get(`/api/events/${createdEventId}`, {
      headers: { 'Authorization': `Bearer ${authToken}` }
    });

    expect(verify.status()).toBe(404);
  });

});