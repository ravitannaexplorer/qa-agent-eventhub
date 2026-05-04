/* AI-GENERATED — Review required | Engineer: Ravi | Date: 2026-05-01 */

export const URLS = {
  // ── UI routes (relative to BASE_URL = https://eventhub.rahulshettyacademy.com) ──
  LOGIN:           '/login',
  EVENTS:          '/events',
  BOOKINGS:        '/bookings',
  ADMIN_EVENTS:    '/admin/events',
  ADMIN_BOOKINGS:  '/admin/bookings',

  // ── API — full absolute URLs (separate domain: api.eventhub.rahulshettyacademy.com) ──
  API_BASE:        'https://api.eventhub.rahulshettyacademy.com/api',
  API_AUTH:        'https://api.eventhub.rahulshettyacademy.com/api/auth/login',
  API_EVENTS:      'https://api.eventhub.rahulshettyacademy.com/api/events',
  API_BOOKINGS:    'https://api.eventhub.rahulshettyacademy.com/api/bookings',
  API_USERS_ME:    'https://api.eventhub.rahulshettyacademy.com/api/users/profile',
} as const;

export const TIMEOUTS = {
  DEFAULT:      30_000,
  BOOKING_FLOW: 60_000,
  NAVIGATION:   15_000,
  ELEMENT:       5_000,
  API:          10_000,
} as const;

export const TAGS = {
  SMOKE:      '@smoke',
  REGRESSION: '@regression',
} as const;

export const TEST_DATA = {
  EXCEL_PATH: './test-data/test-cases-v4.xlsx',
} as const;
