// Notice — import from fixture file, NOT from @playwright/test
import { test, expect } from '../fixtures/auth.fixture';

test('auth fixture provides a valid token', async ({ request, authToken }) => {

  console.log('Token received by test:', authToken);

  // Use the token from the fixture — not from .env
  const response = await request.get('/api/events', {
    headers: { 'Authorization': `Bearer ${authToken}` }
  });

  expect(response.status()).toBe(200);
  const body = await response.json();
  expect(body.success).toBe(true);
});