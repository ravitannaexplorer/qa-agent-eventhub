# EventHub API

> Version: 1.0.0

REST API for the EventHub ticket booking platform.

All event and booking operations are available here. Booking creation is atomic — seats are decremented in the same database transaction.

---

## POST /auth/register
**Summary:** Register a new user
**Auth required:** No

**Parameters:** None

**Request body:**
- `email` (string)
- `password` (string)

**Response:**
- `success` (boolean)
- `token` (string)
- `user` (object)

---

## POST /auth/login
**Summary:** Log in with existing credentials
**Auth required:** No

**Parameters:** None

**Request body:**
- `email` (string)
- `password` (string)

**Response:**
- `success` (boolean)
- `token` (string)
- `user` (object)

---

## GET /auth/me
**Summary:** Get the currently authenticated user
**Auth required:** Yes

**Parameters:** None

**Request body:** None

**Response:**
- `success` (boolean)
- `user` (object)

---

## GET /bookings
**Summary:** List all bookings
**Auth required:** No

**Parameters:**
- `eventId` (query) — Filter bookings by event ID
- `status` (query) — Filter by booking status
- `page` (query) — Page number
- `limit` (query) — Number of bookings per page

**Request body:** None

**Response:**
- `success` (boolean)
- `data` (array)
- `pagination` (object)

---

## POST /bookings
**Summary:** Create a booking (buy tickets)
**Auth required:** No

**Parameters:** None

**Request body:**
- `eventId` (integer)
- `customerName` (string)
- `customerEmail` (string)
- `customerPhone` (string)
- `quantity` (integer)

**Response:**
- `success` (boolean)
- `data` (object)
- `message` (string)

---

## GET /bookings/ref/{ref}
**Summary:** Look up a booking by reference code
**Auth required:** No

**Parameters:**
- `ref` (path) *(required)* — Booking reference code

**Request body:** None

**Response:**
- `success` (boolean)
- `data` (object)

---

## GET /bookings/{id}
**Summary:** Get a single booking by ID
**Auth required:** No

**Parameters:**
- `id` (path) *(required)* — Numeric booking ID

**Request body:** None

**Response:**
- `success` (boolean)
- `data` (object)

---

## DELETE /bookings/{id}
**Summary:** Cancel a booking
**Auth required:** No

**Parameters:**
- `id` (path) *(required)* — Numeric ID of the booking to cancel

**Request body:** None

**Response:**
- `success` (boolean)
- `message` (string)

---

## GET /events
**Summary:** List all events
**Auth required:** No

**Parameters:**
- `category` (query) — Filter events by category
- `city` (query) — Filter events by city
- `search` (query) — Search events by title, description, or venue
- `page` (query) — Page number
- `limit` (query) — Number of events per page

**Request body:** None

**Response:**
- `success` (boolean)
- `data` (array)
- `pagination` (object)

---

## POST /events
**Summary:** Create a new event
**Auth required:** No

**Parameters:** None

**Request body:**
- `title` (string)
- `description` (string)
- `category` (string)
- `venue` (string)
- `city` (string)
- `eventDate` (string)
- `price` (number)
- `totalSeats` (integer)
- `imageUrl` (string)

**Response:**
- `success` (boolean)
- `data` (object)
- `message` (string)

---

## GET /events/{id}
**Summary:** Get a single event by ID
**Auth required:** No

**Parameters:**
- `id` (path) *(required)* — Numeric ID of the event

**Request body:** None

**Response:**
- `success` (boolean)
- `data` (object)

---

## PUT /events/{id}
**Summary:** Update an event
**Auth required:** No

**Parameters:**
- `id` (path) *(required)* — Numeric ID of the event to update

**Request body:**
- `title` (string)
- `description` (string)
- `category` (string)
- `venue` (string)
- `city` (string)
- `eventDate` (string)
- `price` (number)
- `totalSeats` (integer)
- `imageUrl` (string)

**Response:**
- `success` (boolean)
- `data` (object)
- `message` (string)

---

## DELETE /events/{id}
**Summary:** Delete an event
**Auth required:** No

**Parameters:**
- `id` (path) *(required)* — Numeric ID of the event to delete

**Request body:** None

**Response:**
- `success` (boolean)
- `message` (string)

---

## GET /health
**Summary:** API health check
**Auth required:** No

**Parameters:** None

**Request body:** None

**Response:**
- `status` (string)
- `timestamp` (string)
- `dbStatus` (string)

---

## GET /config
**Summary:** Get public feature flags
**Auth required:** No

**Parameters:** None

**Request body:** None

**Response:**
- `showExploreLinks` (boolean)

---
