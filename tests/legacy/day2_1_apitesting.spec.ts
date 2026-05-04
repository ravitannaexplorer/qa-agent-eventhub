import { test, expect } from '@playwright/test';

test('GET /api/events returns a list', async ({ request }) => {
  
  const response = await request.get('/api/events');
  // ↑ No headers here — config sends Authorization automatically

  // 1. Status
  expect(response.status()).toBe(200);

  const body = await response.json();

  // 2. Top-level shape
  expect(body.success).toBe(true);
  expect(Array.isArray(body.data)).toBe(true);
  expect(body.data.length).toBeGreaterThan(0);

  // 3. First event — field by field
  const event = body.data[0];
  expect(typeof event.id).toBe('number');
  expect(typeof event.title).toBe('string');
  expect(event.title.length).toBeGreaterThan(0);
  expect(typeof event.category).toBe('string');
  expect(typeof event.city).toBe('string');
  expect(typeof event.price).toBe('string');
  expect(typeof event.totalSeats).toBe('number');
  expect(typeof event.availableSeats).toBe('number');
  expect(typeof event.isStatic).toBe('boolean');

  // 4. Pagination block
  expect(typeof body.pagination.total).toBe('number');
  expect(body.pagination.page).toBe(1);
});