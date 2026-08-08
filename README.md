# Eventful API

Eventful is a Node.js + TypeScript backend for event ticketing with authentication, QR code ticketing, reminders, analytics, payment integration, and shareability.

## Features
- JWT authentication and role-based authorization
- Event creation and attendance by eventees
- QR code generation for purchased tickets
- Social share links for events
- Reminder configuration for creators and eventees
- Analytics for creators and events
- Paystack-compatible payment flow
- Rate limiting and API docs with Swagger

## Run locally
1. Install dependencies
   ```bash
   npm install
   ```
2. Create `.env` with:
   ```env
   PORT=4000
   JWT_SECRET=your_jwt_secret
   PAYSTACK_SECRET_KEY=your_paystack_secret_key
   ```
3. Start dev server
   ```bash
   npm run dev
   ```
4. Open docs: `http://localhost:4000/api/docs`

## Testing
```bash
npm test
```
