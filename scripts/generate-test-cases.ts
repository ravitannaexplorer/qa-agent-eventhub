import * as ExcelJS from 'exceljs';
import * as path from 'path';

interface TestCase {
    TestID: string;
    Module: string;
    TestName: string;
    Priority: 'High' | 'Medium' | 'Low';
    InputData: string;
    Steps: string;
    ExpectedResult: string;
    TestType: 'UI' | 'API' | 'E2E';
    Enabled: boolean;
}

const testCases: TestCase[] = [
    // --- LOGIN MODULE ---
    {
        TestID: 'TC-001', Module: 'Login', Priority: 'High', TestType: 'UI', Enabled: true,
        TestName: 'Log in with valid credentials',
        InputData: JSON.stringify({ "url": "/login", "email": "ravitanna2015@gmail.com", "password": "Ravitanna@2015", "expectedUrl": "/" }),
        Steps: 'Navigate to login page|Enter valid email|Enter valid password|Click Sign In button',
        ExpectedResult: 'User is redirected to / dashboard and username is visible in the header'
    },
    {
        TestID: 'TC-002', Module: 'Login', Priority: 'High', TestType: 'UI', Enabled: true,
        TestName: 'Fail login with wrong password',
        InputData: JSON.stringify({ "url": "/login", "email": "ravitanna2015@gmail.com", "password": "wrongpassword" }),
        Steps: 'Navigate to login page|Enter valid email|Enter wrong password|Click Sign In button',
        ExpectedResult: 'Shows error "Invalid email or password" and stays on login page'
    },
    {
        TestID: 'TC-003', Module: 'Login', Priority: 'Medium', TestType: 'UI', Enabled: true,
        TestName: 'Fail login with invalid email format',
        InputData: JSON.stringify({ "url": "/login", "email": "notanemail", "password": "Ravitanna@2015" }),
        Steps: 'Navigate to login page|Enter invalid email|Enter valid password|Click Sign In button',
        ExpectedResult: 'Shows validation error "Enter a valid email"'
    },
    {
        TestID: 'TC-004', Module: 'Login', Priority: 'Low', TestType: 'UI', Enabled: true,
        TestName: 'Fail login with both fields empty',
        InputData: JSON.stringify({ "url": "/login", "email": "", "password": "" }),
        Steps: 'Navigate to login page|Leave fields empty|Click Sign In button',
        ExpectedResult: 'Shows validation errors for both fields'
    },
    {
        TestID: 'TC-005', Module: 'Login', Priority: 'High', TestType: 'UI', Enabled: true,
        TestName: 'Attempt SQL injection in email field',
        InputData: JSON.stringify({ "url": "/login", "email": "' OR '1'='1", "password": "Ravitanna@2015" }),
        Steps: 'Navigate to login page|Enter SQL injection string in email|Enter password|Click Sign In',
        ExpectedResult: 'System handles input safely and rejects login'
    },
    {
        TestID: 'TC-006', Module: 'Login', Priority: 'High', TestType: 'UI', Enabled: true,
        TestName: 'Attempt XSS payload in password field',
        InputData: JSON.stringify({ "url": "/login", "email": "ravitanna2015@gmail.com", "password": "<script>alert(1)</script>" }),
        Steps: 'Navigate to login page|Enter valid email|Enter XSS in password|Click Sign In',
        ExpectedResult: 'System handles input safely, rejects login, no script executes'
    },

    // --- EVENT LISTING MODULE ---
    {
        TestID: 'TC-007', Module: 'EventListing', Priority: 'High', TestType: 'UI', Enabled: true,
        TestName: 'View default event listing on home page',
        InputData: JSON.stringify({ "url": "/" }),
        Steps: 'Navigate to home page|Scroll through events',
        ExpectedResult: 'Multiple event cards are visible with title, date, price, and image'
    },
    {
        TestID: 'TC-008', Module: 'EventListing', Priority: 'High', TestType: 'UI', Enabled: true,
        TestName: 'Search for an existing event',
        InputData: JSON.stringify({ "keyword": "music" }),
        Steps: 'Navigate to home page|Type keyword in search bar|Press enter or wait for filter',
        ExpectedResult: 'List updates to show only events matching the keyword'
    },
    {
        TestID: 'TC-009', Module: 'EventListing', Priority: 'Medium', TestType: 'UI', Enabled: true,
        TestName: 'Search for a non-existent event',
        InputData: JSON.stringify({ "keyword": "zzzznotexist" }),
        Steps: 'Navigate to home page|Type non-existent keyword in search bar',
        ExpectedResult: 'Empty state message is displayed indicating no results found'
    },
    {
        TestID: 'TC-010', Module: 'EventListing', Priority: 'Medium', TestType: 'UI', Enabled: true,
        TestName: 'Clear search results',
        InputData: JSON.stringify({ "keyword": "music" }),
        Steps: 'Navigate to home page|Search for keyword|Clear search input',
        ExpectedResult: 'All events are displayed again'
    },
    {
        TestID: 'TC-011', Module: 'EventListing', Priority: 'Medium', TestType: 'UI', Enabled: true,
        TestName: 'Navigate using pagination',
        InputData: JSON.stringify({ "action": "next_page" }),
        Steps: 'Navigate to home page|Scroll to pagination|Click Next',
        ExpectedResult: 'Next page of events loads successfully'
    },
    {
        TestID: 'TC-012', Module: 'EventListing', Priority: 'Low', TestType: 'UI', Enabled: false,
        TestName: 'Search with extremely long string',
        InputData: JSON.stringify({ "keyword": "A".repeat(500) }),
        Steps: 'Navigate to home page|Paste 500 character string into search',
        ExpectedResult: 'Currently disabled - Search input crashes with long strings'
    },

    // --- EVENT DETAIL MODULE ---
    {
        TestID: 'TC-013', Module: 'EventDetail', Priority: 'High', TestType: 'UI', Enabled: true,
        TestName: 'View event details from listing',
        InputData: JSON.stringify({ "eventId": 1 }),
        Steps: 'Navigate to home page|Click on an event card',
        ExpectedResult: 'Event detail page opens with full description, available seats, and Book Now button'
    },
    {
        TestID: 'TC-014', Module: 'EventDetail', Priority: 'Medium', TestType: 'UI', Enabled: true,
        TestName: 'Verify all event fields are present',
        InputData: JSON.stringify({ "eventId": 1 }),
        Steps: 'Navigate to event detail page',
        ExpectedResult: 'Title, Date, Location, Category, Price, and Description are all visible'
    },
    {
        TestID: 'TC-015', Module: 'EventDetail', Priority: 'Medium', TestType: 'UI', Enabled: true,
        TestName: 'Navigate to booking form',
        InputData: JSON.stringify({ "eventId": 1 }),
        Steps: 'Navigate to event detail|Click Book Now button',
        ExpectedResult: 'Booking form/modal opens'
    },
    {
        TestID: 'TC-016', Module: 'EventDetail', Priority: 'Low', TestType: 'UI', Enabled: true,
        TestName: 'Access non-existent event detail directly',
        InputData: JSON.stringify({ "url": "/events/99999" }),
        Steps: 'Navigate directly to non-existent event URL',
        ExpectedResult: '404 error page or Not Found message is displayed'
    },
    {
        TestID: 'TC-017', Module: 'EventDetail', Priority: 'Low', TestType: 'UI', Enabled: true,
        TestName: 'Access protected event directly without auth',
        InputData: JSON.stringify({ "url": "/events/1" }),
        Steps: 'Log out|Navigate to event detail URL',
        ExpectedResult: 'Redirected to login page'
    },
    {
        TestID: 'TC-018', Module: 'EventDetail', Priority: 'High', TestType: 'UI', Enabled: true,
        TestName: 'Verify ticket price calculation logic on detail page',
        InputData: JSON.stringify({ "eventId": 1, "quantity": 3 }),
        Steps: 'Open event detail|Increase ticket quantity to 3',
        ExpectedResult: 'Total price updates correctly (Quantity * Unit Price)'
    },

    // --- EVENT BOOKING MODULE ---
    {
        TestID: 'TC-019', Module: 'EventBooking', Priority: 'High', TestType: 'UI', Enabled: true,
        TestName: 'Book an event successfully',
        InputData: JSON.stringify({ "fullName": "Test User", "email": "test@test.com", "phone": "9876543210", "seats": 1 }),
        Steps: 'Open booking form|Fill all fields|Click Confirm Booking',
        ExpectedResult: 'Booking confirmation shown with reference number'
    },
    {
        TestID: 'TC-020', Module: 'EventBooking', Priority: 'High', TestType: 'UI', Enabled: true,
        TestName: 'Fail booking with empty fields',
        InputData: JSON.stringify({ "fullName": "", "email": "", "phone": "", "seats": 1 }),
        Steps: 'Open booking form|Leave fields empty|Click Confirm Booking',
        ExpectedResult: 'Validation errors appear for Name, Email, and Phone'
    },
    {
        TestID: 'TC-021', Module: 'EventBooking', Priority: 'Medium', TestType: 'UI', Enabled: true,
        TestName: 'Fail booking with zero seats',
        InputData: JSON.stringify({ "seats": 0 }),
        Steps: 'Open booking form|Decrease seats to 0|Attempt to book',
        ExpectedResult: 'Button is disabled or error indicates at least 1 seat is required'
    },
    {
        TestID: 'TC-022', Module: 'EventBooking', Priority: 'High', TestType: 'UI', Enabled: true,
        TestName: 'Fail booking beyond available seats limit',
        InputData: JSON.stringify({ "seats": 999 }),
        Steps: 'Open booking form|Try to input more seats than available',
        ExpectedResult: 'Input is restricted or validation error appears'
    },
    {
        TestID: 'TC-023', Module: 'EventBooking', Priority: 'Medium', TestType: 'UI', Enabled: true,
        TestName: 'Fail booking with invalid phone format',
        InputData: JSON.stringify({ "fullName": "Test User", "email": "test@test.com", "phone": "abc", "seats": 1 }),
        Steps: 'Open booking form|Enter invalid phone|Click Confirm Booking',
        ExpectedResult: 'Validation error "Enter a valid 10-digit phone"'
    },
    {
        TestID: 'TC-024', Module: 'EventBooking', Priority: 'High', TestType: 'UI', Enabled: true,
        TestName: 'Verify booking confirmation redirects to My Bookings',
        InputData: JSON.stringify({ "action": "click_view_bookings" }),
        Steps: 'Complete booking|Click View My Bookings button on confirmation',
        ExpectedResult: 'User is redirected to /bookings'
    },

    // --- BOOKING HISTORY MODULE ---
    {
        TestID: 'TC-025', Module: 'BookingHistory', Priority: 'High', TestType: 'UI', Enabled: true,
        TestName: 'View list of user bookings',
        InputData: JSON.stringify({ "url": "/bookings" }),
        Steps: 'Navigate to My Bookings page',
        ExpectedResult: 'List of booked events is displayed'
    },
    {
        TestID: 'TC-026', Module: 'BookingHistory', Priority: 'High', TestType: 'UI', Enabled: true,
        TestName: 'Cancel an active booking',
        InputData: JSON.stringify({ "action": "cancel" }),
        Steps: 'Navigate to My Bookings|Click Cancel on an active booking|Confirm dialog',
        ExpectedResult: 'Booking status changes to Cancelled or is removed from list'
    },
    {
        TestID: 'TC-027', Module: 'BookingHistory', Priority: 'Medium', TestType: 'UI', Enabled: true,
        TestName: 'Verify empty state when no bookings exist',
        InputData: JSON.stringify({ "url": "/bookings", "mockBookings": [] }),
        Steps: 'Login|Mock API to return empty bookings|Navigate to My Bookings',
        ExpectedResult: 'Shows message indicating no bookings found'
    },
    {
        TestID: 'TC-028', Module: 'BookingHistory', Priority: 'Low', TestType: 'UI', Enabled: false,
        TestName: 'Cancel a booking and decline dialog',
        InputData: JSON.stringify({ "action": "cancel_dismiss" }),
        Steps: 'Navigate to My Bookings|Click Cancel|Click No in dialog',
        ExpectedResult: 'Disabled - Dialog currently has no NO button'
    },
    {
        TestID: 'TC-029', Module: 'BookingHistory', Priority: 'Medium', TestType: 'UI', Enabled: true,
        TestName: 'Verify booking details on history card',
        InputData: JSON.stringify({ "check": "details" }),
        Steps: 'Navigate to My Bookings|Review a booking card',
        ExpectedResult: 'Event name, date, seats, and reference number are correct'
    },
    {
        TestID: 'TC-030', Module: 'BookingHistory', Priority: 'High', TestType: 'UI', Enabled: true,
        TestName: 'Direct access to bookings without auth',
        InputData: JSON.stringify({ "url": "/bookings" }),
        Steps: 'Log out|Navigate to /bookings directly',
        ExpectedResult: 'Redirected to login page'
    },

        // --- ADMIN MANAGE EVENTS MODULE ---
    {
        TestID: 'TC-031', Module: 'AdminManageEvents', Priority: 'High', TestType: 'UI', Enabled: true,
        TestName: 'Create event with all valid fields',
        InputData: JSON.stringify({ "url": "/admin/events", "title": "Tech Summit 2026", "category": "Conference", "city": "Hyderabad", "venue": "HICC", "date": "2026-12-01T10:00", "price": 500, "seats": 100, "imageUrl": "https://example.com/img.jpg", "expectedSuccess": true }),
        Steps: 'Login as admin|Navigate to Admin > Manage Events|Fill Title field|Fill Category|Fill City|Fill Venue|Fill Date|Fill Price|Fill Total Seats|Click Submit|Verify success message',
        ExpectedResult: 'Event "Tech Summit 2026" appears in the events list and is visible on the public Events page'
    },
    {
        TestID: 'TC-032', Module: 'AdminManageEvents', Priority: 'High', TestType: 'UI', Enabled: true,
        TestName: 'Create event with missing Title',
        InputData: JSON.stringify({ "url": "/admin/events", "title": "", "category": "Conference", "city": "Hyderabad", "venue": "HICC", "expectedError": "Title is required" }),
        Steps: 'Navigate to Admin > Manage Events|Leave Title empty|Fill other required fields|Click Submit',
        ExpectedResult: 'Validation error appears indicating Title is required'
    },
    {
        TestID: 'TC-033', Module: 'AdminManageEvents', Priority: 'High', TestType: 'UI', Enabled: true,
        TestName: 'Create event with missing City',
        InputData: JSON.stringify({ "url": "/admin/events", "title": "Test Event", "category": "Conference", "city": "", "venue": "HICC", "expectedError": "City is required" }),
        Steps: 'Navigate to Admin > Manage Events|Leave City empty|Fill other required fields|Click Submit',
        ExpectedResult: 'Validation error appears indicating City is required'
    },
    {
        TestID: 'TC-034', Module: 'AdminManageEvents', Priority: 'High', TestType: 'UI', Enabled: true,
        TestName: 'Create event with 0 seats',
        InputData: JSON.stringify({ "url": "/admin/events", "title": "Test Event", "seats": 0, "expectedError": "Seats must be greater than 0" }),
        Steps: 'Navigate to Admin > Manage Events|Enter 0 for Total Seats|Click Submit',
        ExpectedResult: 'Validation error prevents event creation for 0 seats'
    },
    {
        TestID: 'TC-035', Module: 'AdminManageEvents', Priority: 'Medium', TestType: 'UI', Enabled: true,
        TestName: 'Create event with negative price',
        InputData: JSON.stringify({ "url": "/admin/events", "title": "Test Event", "price": -50, "expectedError": "Price cannot be negative" }),
        Steps: 'Navigate to Admin > Manage Events|Enter -50 for Price|Click Submit',
        ExpectedResult: 'Validation error prevents event creation for negative price'
    },
    {
        TestID: 'TC-036', Module: 'AdminManageEvents', Priority: 'Medium', TestType: 'UI', Enabled: true,
        TestName: 'Create event with past date',
        InputData: JSON.stringify({ "url": "/admin/events", "title": "Test Event", "date": "2000-01-01T10:00", "expectedError": "Date cannot be in the past" }),
        Steps: 'Navigate to Admin > Manage Events|Enter past date for Event Date|Click Submit',
        ExpectedResult: 'Validation error prevents event creation with past date'
    },
    {
        TestID: 'TC-037', Module: 'AdminManageEvents', Priority: 'High', TestType: 'UI', Enabled: true,
        TestName: 'Behaviour at 6-event limit',
        InputData: JSON.stringify({ "url": "/admin/events", "currentEventCount": 6, "expectedBehaviour": "oldest event replaced or warning shown" }),
        Steps: 'Ensure 6 events exist|Create 7th event|Observe system response',
        ExpectedResult: 'System handles the 6-event limit safely according to business rules'
    },
    {
        TestID: 'TC-038', Module: 'AdminManageEvents', Priority: 'High', TestType: 'UI', Enabled: true,
        TestName: 'Delete existing event',
        InputData: JSON.stringify({ "url": "/admin/events", "action": "delete" }),
        Steps: 'Navigate to Admin > Manage Events|Click Delete on an event|Confirm deletion',
        ExpectedResult: 'Event is removed from the admin list and public page'
    },
    
    // --- ADMIN MANAGE BOOKINGS MODULE ---
    {
        TestID: 'TC-039', Module: 'AdminManageBookings', Priority: 'High', TestType: 'UI', Enabled: true,
        TestName: 'View all bookings as admin',
        InputData: JSON.stringify({ "url": "/admin/bookings" }),
        Steps: 'Navigate to Admin > Manage Bookings',
        ExpectedResult: 'List of all user bookings is displayed with REF, CUSTOMER, EVENT, QTY, TOTAL, STATUS, DATE, ACTIONS columns'
    },
    {
        TestID: 'TC-040', Module: 'AdminManageBookings', Priority: 'High', TestType: 'UI', Enabled: true,
        TestName: 'Cancel a booking as admin',
        InputData: JSON.stringify({ "url": "/admin/bookings", "action": "cancel" }),
        Steps: 'Navigate to Admin > Manage Bookings|Find an active booking|Click Cancel in Actions column|Confirm',
        ExpectedResult: 'Booking status updates to Cancelled'
    },
    {
        TestID: 'TC-041', Module: 'AdminManageBookings', Priority: 'Medium', TestType: 'UI', Enabled: true,
        TestName: 'Filter or search bookings',
        InputData: JSON.stringify({ "url": "/admin/bookings", "search": "Test User" }),
        Steps: 'Navigate to Admin > Manage Bookings|Enter customer name in search',
        ExpectedResult: 'Booking list is filtered to show only matching customer records'
    },
    {
        TestID: 'TC-042', Module: 'AdminManageBookings', Priority: 'Low', TestType: 'UI', Enabled: true,
        TestName: 'Empty state when no bookings exist',
        InputData: JSON.stringify({ "url": "/admin/bookings", "mockBookings": [] }),
        Steps: 'Mock API to return 0 bookings|Navigate to Admin > Manage Bookings',
        ExpectedResult: 'Message indicating no bookings available is shown'
    },

// --- API MODULE ---
    {
        TestID: 'TC-043', Module: 'API', Priority: 'High', TestType: 'API', Enabled: true,
        TestName: 'POST /api/auth/login - Success',
        InputData: JSON.stringify({ "method": "POST", "endpoint": "/api/auth/login", "authRequired": false, "body": { "email": "ravitanna2015@gmail.com", "password": "Ravitanna@2015" }, "expectedStatus": 200 }),
        Steps: 'Send POST request to login endpoint with valid credentials',
        ExpectedResult: 'Returns 200 OK with JWT token'
    },
    {
        TestID: 'TC-044', Module: 'API', Priority: 'High', TestType: 'API', Enabled: true,
        TestName: 'POST /api/auth/login - Invalid Credentials',
        InputData: JSON.stringify({ "method": "POST", "endpoint": "/api/auth/login", "authRequired": false, "body": { "email": "wrong", "password": "wrong" }, "expectedStatus": 401 }),
        Steps: 'Send POST request to login endpoint with wrong credentials',
        ExpectedResult: 'Returns 401 Unauthorized'
    },
    {
        TestID: 'TC-045', Module: 'API', Priority: 'High', TestType: 'API', Enabled: true,
        TestName: 'POST /api/auth/login - Empty Body',
        InputData: JSON.stringify({ "method": "POST", "endpoint": "/api/auth/login", "authRequired": false, "body": {}, "expectedStatus": 400 }),
        Steps: 'Send POST request to login endpoint with empty body',
        ExpectedResult: 'Returns 400 Bad Request with validation errors'
    },
    {
        TestID: 'TC-046', Module: 'API', Priority: 'High', TestType: 'API', Enabled: true,
        TestName: 'GET /api/events - Success (No Auth)',
        InputData: JSON.stringify({ "method": "GET", "endpoint": "/api/events", "authRequired": false, "expectedStatus": 200 }),
        Steps: 'Send GET request to events endpoint without token',
        ExpectedResult: 'Returns 200 OK with array of events and pagination'
    },
    {
        TestID: 'TC-047', Module: 'API', Priority: 'Medium', TestType: 'API', Enabled: true,
        TestName: 'GET /api/events/{id} - Existing Event',
        InputData: JSON.stringify({ "method": "GET", "endpoint": "/api/events/1", "authRequired": false, "expectedStatus": 200 }),
        Steps: 'Send GET request for specific event ID',
        ExpectedResult: 'Returns 200 OK with event detail object'
    },
    {
        TestID: 'TC-048', Module: 'API', Priority: 'High', TestType: 'API', Enabled: true,
        TestName: 'GET /api/events/{id} - Non-existent Event',
        InputData: JSON.stringify({ "method": "GET", "endpoint": "/api/events/99999", "authRequired": false, "expectedStatus": 404 }),
        Steps: 'Send GET request for invalid event ID',
        ExpectedResult: 'Returns 404 Not Found'
    },
    {
        TestID: 'TC-049', Module: 'API', Priority: 'High', TestType: 'API', Enabled: true,
        TestName: 'GET /api/bookings - With Valid Token',
        InputData: JSON.stringify({ "method": "GET", "endpoint": "/api/bookings", "authRequired": true, "expectedStatus": 200 }),
        Steps: 'Send GET request to bookings with Bearer token',
        ExpectedResult: 'Returns 200 OK with user bookings array'
    },
    {
        TestID: 'TC-050', Module: 'API', Priority: 'High', TestType: 'API', Enabled: true,
        TestName: 'GET /api/bookings - Missing Token',
        InputData: JSON.stringify({ "method": "GET", "endpoint": "/api/bookings", "authRequired": false, "expectedStatus": 401 }),
        Steps: 'Send GET request to bookings without token',
        ExpectedResult: 'Returns 401 Unauthorized'
    },
    {
        TestID: 'TC-051', Module: 'API', Priority: 'High', TestType: 'API', Enabled: true,
        TestName: 'POST /api/bookings - Create Booking Success',
        InputData: JSON.stringify({ "method": "POST", "endpoint": "/api/bookings", "authRequired": true, "body": { "eventId": 1, "seats": 2 }, "expectedStatus": 201 }),
        Steps: 'Send POST to bookings with valid body and token',
        ExpectedResult: 'Returns 201 Created with booking confirmation'
    },
    {
        TestID: 'TC-052', Module: 'API', Priority: 'High', TestType: 'API', Enabled: true,
        TestName: 'POST /api/bookings - Invalid Event ID',
        InputData: JSON.stringify({ "method": "POST", "endpoint": "/api/bookings", "authRequired": true, "body": { "eventId": 99999, "seats": 2 }, "expectedStatus": 404 }),
        Steps: 'Send POST to bookings for non-existent event',
        ExpectedResult: 'Returns 404 Not Found'
    },
    {
        TestID: 'TC-053', Module: 'API', Priority: 'Medium', TestType: 'API', Enabled: true,
        TestName: 'DELETE /api/bookings/{id}/cancel - Success',
        InputData: JSON.stringify({ "method": "DELETE", "endpoint": "/api/bookings/1/cancel", "authRequired": true, "expectedStatus": 200 }),
        Steps: 'Send DELETE to cancel a booking',
        ExpectedResult: 'Returns 200 OK'
    },
    {
        TestID: 'TC-054', Module: 'API', Priority: 'Medium', TestType: 'API', Enabled: true,
        TestName: 'GET /api/users/profile - Success',
        InputData: JSON.stringify({ "method": "GET", "endpoint": "/api/users/profile", "authRequired": true, "expectedStatus": 200 }),
        Steps: 'Send GET to profile with token',
        ExpectedResult: 'Returns 200 OK with user details'
    },
    {
        TestID: 'TC-055', Module: 'API', Priority: 'Medium', TestType: 'API', Enabled: true,
        TestName: 'PUT /api/users/profile - Update Name',
        InputData: JSON.stringify({ "method": "PUT", "endpoint": "/api/users/profile", "authRequired": true, "body": { "name": "API Update" }, "expectedStatus": 200 }),
        Steps: 'Send PUT to update profile',
        ExpectedResult: 'Returns 200 OK with updated details'
    },
    {
        TestID: 'TC-056', Module: 'API', Priority: 'High', TestType: 'API', Enabled: true,
        TestName: 'Security - Expired Token',
        InputData: JSON.stringify({ "method": "GET", "endpoint": "/api/bookings", "authRequired": true, "token": "expired_jwt", "expectedStatus": 401 }),
        Steps: 'Send request with expired Bearer token',
        ExpectedResult: 'Returns 401 Unauthorized'
    },
    {
        TestID: 'TC-057', Module: 'API', Priority: 'High', TestType: 'API', Enabled: false,
        TestName: 'Security - Malformed Token',
        InputData: JSON.stringify({ "method": "GET", "endpoint": "/api/bookings", "authRequired": true, "token": "invalidtoken123", "expectedStatus": 401 }),
        Steps: 'Send request with malformed Bearer token',
        ExpectedResult: 'Disabled - Backend currently returns 500 instead of 401'
    },
    {
        TestID: 'TC-058', Module: 'API', Priority: 'High', TestType: 'API', Enabled: true,
        TestName: 'POST /api/bookings - Zero Seats Boundary',
        InputData: JSON.stringify({ "method": "POST", "endpoint": "/api/bookings", "authRequired": true, "body": { "eventId": 1, "seats": 0 }, "expectedStatus": 400 }),
        Steps: 'Send POST with zero seats',
        ExpectedResult: 'Returns 400 Bad Request'
    },
    {
        TestID: 'TC-059', Module: 'API', Priority: 'High', TestType: 'API', Enabled: true,
        TestName: 'POST /api/bookings - Negative Seats Boundary',
        InputData: JSON.stringify({ "method": "POST", "endpoint": "/api/bookings", "authRequired": true, "body": { "eventId": 1, "seats": -5 }, "expectedStatus": 400 }),
        Steps: 'Send POST with negative seats',
        ExpectedResult: 'Returns 400 Bad Request'
    },

    {
        TestID: 'TC-060', Module: 'API', Priority: 'High', TestType: 'API', Enabled: true,
        TestName: 'POST /api/events - Create Event Success',
        InputData: JSON.stringify({ "method": "POST", "endpoint": "/api/events", "authRequired": true, "body": { "title": "New Event", "city": "Hyderabad", "totalSeats": 100 }, "expectedStatus": 201 }),
        Steps: 'Send POST to events endpoint with valid body',
        ExpectedResult: 'Returns 201 Created with event details'
    },
    {
        TestID: 'TC-061', Module: 'API', Priority: 'High', TestType: 'API', Enabled: true,
        TestName: 'PUT /api/events/{id} - Update Event Success',
        InputData: JSON.stringify({ "method": "PUT", "endpoint": "/api/events/1", "authRequired": true, "body": { "title": "Updated Event" }, "expectedStatus": 200 }),
        Steps: 'Send PUT to events endpoint with updated body',
        ExpectedResult: 'Returns 200 OK with updated event details'
    },
    {
        TestID: 'TC-062', Module: 'API', Priority: 'High', TestType: 'API', Enabled: true,
        TestName: 'DELETE /api/events/{id} - Delete Event Success',
        InputData: JSON.stringify({ "method": "DELETE", "endpoint": "/api/events/1", "authRequired": true, "expectedStatus": 200 }),
        Steps: 'Send DELETE to events endpoint',
        ExpectedResult: 'Returns 200 OK and event is deleted'
    },
    {
        TestID: 'TC-063', Module: 'API', Priority: 'Medium', TestType: 'API', Enabled: true,
        TestName: 'GET /api/bookings/{id} - Fetch Single Booking',
        InputData: JSON.stringify({ "method": "GET", "endpoint": "/api/bookings/1", "authRequired": true, "expectedStatus": 200 }),
        Steps: 'Send GET request for specific booking ID',
        ExpectedResult: 'Returns 200 OK with booking detail object'
    },
    {
        TestID: 'TC-064', Module: 'API', Priority: 'Low', TestType: 'API', Enabled: false,
        TestName: 'POST /api/auth/register - Register new user',
        InputData: JSON.stringify({ "method": "POST", "endpoint": "/api/auth/register", "authRequired": false, "body": { "email": "new@test.com", "password": "pass" }, "expectedStatus": 201 }),
        Steps: 'Send POST request to register endpoint',
        ExpectedResult: 'Disabled - Registration endpoint not exposed in current phase'
    },
    {
        TestID: 'TC-065', Module: 'API', Priority: 'Medium', TestType: 'API', Enabled: true,
        TestName: 'PUT /api/events/{id} - Unauthorized Update',
        InputData: JSON.stringify({ "method": "PUT", "endpoint": "/api/events/1", "authRequired": false, "body": { "title": "Hacked" }, "expectedStatus": 401 }),
        Steps: 'Send PUT to events endpoint without token',
        ExpectedResult: 'Returns 401 Unauthorized'
    },
    {
        TestID: 'TC-066', Module: 'API', Priority: 'Medium', TestType: 'API', Enabled: true,
        TestName: 'DELETE /api/events/{id} - Unauthorized Delete',
        InputData: JSON.stringify({ "method": "DELETE", "endpoint": "/api/events/1", "authRequired": false, "expectedStatus": 401 }),
        Steps: 'Send DELETE to events endpoint without token',
        ExpectedResult: 'Returns 401 Unauthorized'
    },

    // --- E2E MODULE ---
    {
        TestID: 'TC-067', Module: 'E2E', Priority: 'High', TestType: 'E2E', Enabled: true,
        TestName: 'Login -> Book Event -> Cancel Booking',
        InputData: JSON.stringify({ "url": "/", "loginEmail": "ravitanna2015@gmail.com", "loginPassword": "Ravitanna@2015", "eventId": 1, "seats": 2 }),
        Steps: 'Login via UI|Navigate to event|Book event|Navigate to bookings|Cancel booking',
        ExpectedResult: 'Full flow completes without errors'
    },
    {
        TestID: 'TC-068', Module: 'E2E', Priority: 'High', TestType: 'E2E', Enabled: true,
        TestName: 'Create Event via Admin UI -> Verify event appears via API GET /api/events',
        InputData: JSON.stringify({ "url": "/admin/events", "title": "E2E Admin Test Event", "category": "Conference" }),
        Steps: 'Login via UI|Navigate to Admin > Manage Events|Create event|Send GET request to /api/events',
        ExpectedResult: 'API response includes the newly created E2E Admin Test Event'
    },
    {
        TestID: 'TC-069', Module: 'E2E', Priority: 'High', TestType: 'E2E', Enabled: true,
        TestName: 'Create Booking via API -> Verify in UI',
        InputData: JSON.stringify({ "url": "/bookings", "eventId": 1, "seats": 1 }),
        Steps: 'Send POST to create booking via API|Login to UI|Navigate to My Bookings',
        ExpectedResult: 'The API-created booking is visible in the UI list'
    },
    {
        TestID: 'TC-070', Module: 'E2E', Priority: 'High', TestType: 'E2E', Enabled: true,
        TestName: 'Search Event -> Detail -> Booking Modal',
        InputData: JSON.stringify({ "url": "/", "search": "Mela", "expectedEvent": "Dilli Diwali Mela" }),
        Steps: 'Search for event|Click on result|Verify detail page loads|Click Book Now',
        ExpectedResult: 'Booking modal opens for the correct event found via search'
    }
];

async function generateExcel() {
    const workbook = new ExcelJS.Workbook();
    
    // Create Summary Sheet
    const summarySheet = workbook.addWorksheet('Summary');
    
    // Title
    summarySheet.mergeCells('A1:H1');
    const titleCell = summarySheet.getCell('A1');
    titleCell.value = "EventHub Test Suite — generated on " + new Date().toISOString().split('T')[0];
    titleCell.font = { bold: true, size: 14 };
    
    // Headers for summary
    summarySheet.getRow(3).values = ['Module', 'Sheet Name', 'Total Cases', 'High', 'Medium', 'Low', 'Enabled', 'Disabled'];
    const summaryHeaderRow = summarySheet.getRow(3);
    summaryHeaderRow.font = { bold: true, color: { argb: 'FFFFFFFF' } };
    summaryHeaderRow.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF4472C4' } };
    
    const modules = [...new Set(testCases.map(tc => tc.Module))];
    let rowNum = 4;
    let totals = { total: 0, high: 0, medium: 0, low: 0, enabled: 0, disabled: 0 };
    
    for (const mod of modules) {
        const modCases = testCases.filter(tc => tc.Module === mod);
        
        // Add Module Sheet
        const modSheet = workbook.addWorksheet(mod);
        modSheet.views = [{ state: 'frozen', ySplit: 1 }];
        
        modSheet.columns = [
            { header: 'TestID', key: 'TestID', width: 12 },
            { header: 'Module', key: 'Module', width: 15 },
            { header: 'TestName', key: 'TestName', width: 40 },
            { header: 'Priority', key: 'Priority', width: 10 },
            { header: 'InputData', key: 'InputData', width: 50 },
            { header: 'Steps', key: 'Steps', width: 50 },
            { header: 'ExpectedResult', key: 'ExpectedResult', width: 40 },
            { header: 'TestType', key: 'TestType', width: 10 },
            { header: 'Enabled', key: 'Enabled', width: 10 }
        ];
        
        // Format Header
        const modHeader = modSheet.getRow(1);
        modHeader.font = { bold: true, color: { argb: 'FFFFFFFF' } };
        modHeader.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF4472C4' } };
        
        let sheetRowIdx = 2;
        for (const tc of modCases) {
            const row = modSheet.addRow(tc);
            
            // Alternate shading
            if (sheetRowIdx % 2 === 0) {
                row.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF2F2F2' } };
            }
            
            // Text wrap
            row.getCell('InputData').alignment = { wrapText: true };
            row.getCell('Steps').alignment = { wrapText: true };
            
            // Priority colors
            const priorityCell = row.getCell('Priority');
            if (tc.Priority === 'High') priorityCell.font = { color: { argb: 'FFFF0000' } };
            else if (tc.Priority === 'Medium') priorityCell.font = { color: { argb: 'FFFF9900' } };
            else if (tc.Priority === 'Low') priorityCell.font = { color: { argb: 'FF008000' } };
            
            // Enabled colors
            const enabledCell = row.getCell('Enabled');
            if (tc.Enabled) {
                enabledCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFC6EFCE' } };
            } else {
                enabledCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFC7CE' } };
            }
            
            sheetRowIdx++;
        }
        
        // Summary stats
        const high = modCases.filter(t => t.Priority === 'High').length;
        const medium = modCases.filter(t => t.Priority === 'Medium').length;
        const low = modCases.filter(t => t.Priority === 'Low').length;
        const enabled = modCases.filter(t => t.Enabled).length;
        const disabled = modCases.filter(t => !t.Enabled).length;
        
        summarySheet.getRow(rowNum++).values = [mod, mod, modCases.length, high, medium, low, enabled, disabled];
        
        totals.total += modCases.length;
        totals.high += high;
        totals.medium += medium;
        totals.low += low;
        totals.enabled += enabled;
        totals.disabled += disabled;
    }
    
    // Summary Totals Row
    const totalsRow = summarySheet.getRow(rowNum);
    totalsRow.values = ['TOTALS', '', totals.total, totals.high, totals.medium, totals.low, totals.enabled, totals.disabled];
    totalsRow.font = { bold: true };
    
    // Format summary columns width
    summarySheet.columns.forEach(col => { col.width = 15; });
    
    const outPath = path.join(__dirname, '..', 'test-data', 'test-cases-v4.xlsx');
    await workbook.xlsx.writeFile(outPath);
    
    console.log("Excel file generated successfully at: " + outPath);
    console.log('--- Summary ---');
    for(const mod of modules) {
        console.log(mod + ": " + testCases.filter(tc => tc.Module === mod).length + " cases");
    }
    console.log("Grand Total: " + totals.total + " test cases");
}

generateExcel().catch(console.error);
