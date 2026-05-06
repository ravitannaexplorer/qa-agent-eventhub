# EventHub UI Memory
# Last updated: May 2026
# Purpose: Avoid re-navigating pages Claude has already inspected.
# Before using MCP to visit a page, check if it is documented here.

## /login
- Email input: input[type="email"] — label "Email"
- Password input: input[type="password"] — label "Password"  
- Sign In button: button with text "Sign In", type="submit"
- Error message: toast notification via getByText()
- Post-login redirect: goes to home page, not /events

## /events
- Event cards: article elements or .event-card
- No search input exists — only category and city filters
- First card click navigates to /events/:id
- Sandbox notice visible at top

## /events/:id
- Book Tickets heading on right panel
- Seat selector: + and - buttons (not number input)
- Full Name input: placeholder "Your full name"
- Email input: placeholder "you@email.com"
- Phone input: placeholder "+91 98765 43210"
- Confirm Booking button: type="submit"
- Booking confirmation: h3 heading "Booking Confirmed 🎉"

## /bookings
- Booking cards show: ref, event name, date, tickets, status, Cancel Booking button
- Cancel Booking triggers a confirmation dialog
- Empty state text: "no bookings"
- Clear all bookings link visible top right

## /admin/events
- New Event form at top of page
- Required fields: Title, Category, City, Venue, Date, Price, Total Seats
- Date field required — omitting it silently blocks submission
- All Events table below form
- Max 6 custom events limit enforced
- Featured events show as Read-only in Actions column

## /admin/bookings
- Manage Bookings table
- Columns: REF, CUSTOMER, EVENT, QTY, TOTAL, STATUS, DATE, ACTIONS
- Status filter combobox only — no text search input
- Cancel action triggers confirmation dialog

## API
- Base: https://api.eventhub.rahulshettyacademy.com/api
- Auth: POST /auth/login returns { token, user }
- Events: GET /events?limit=100 for full list
- Bookings: POST /bookings requires eventId, quantity, customerName, customerEmail, customerPhone
- price and totalSeats returned as strings not numbers (known API bug)
