import { test, expect } from '@playwright/test';
import { z } from 'zod';

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

const PaginationSchema = z.object({
  total:      z.number(),
  page:       z.number(),
  limit:      z.number(),
  totalPages: z.number(),
});

const EventsResponseSchema = z.object({
  success:    z.boolean(),
  data:       z.array(EventSchema),
  pagination: PaginationSchema,
});

test('GET /api/events — Zod validates full response', async ({ request }) => {
  const response = await request.get('/api/events');
  expect(response.status()).toBe(200);
  const body = await response.json();
  expect(() => EventsResponseSchema.parse(body)).not.toThrow();
});

test('GET /api/events/{id} — Zod validates single event', async ({ request }) => {
  const response = await request.get('/api/events/1');
  expect(response.status()).toBe(200);
  const body = await response.json();

  const SingleEventResponse = z.object({
    success: z.boolean(),
    data:    EventSchema,
  });

  expect(() => SingleEventResponse.parse(body)).not.toThrow();
});