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
- Redis cache layer and rate limiting
- Swagger API docs

## Environment
Use a `.env` file with the values below for local or deployment use.

```env
PORT=5000
HOST=0.0.0.0
JWT_SECRET=your_super_secure_jwt_secret
PAYSTACK_SECRET_KEY=your_paystack_secret_key
PAYSTACK_PUBLIC_KEY=your_paystack_public_key
MONGODB_URI=mongodb+srv://eventful:password@cluster....mongodb.net/?retryWrites=true&w=majority
MONGODB_DB_NAME=eventful
UPSTASH_REDIS_REST_URL=https://your-upstash-instance.upstash.io
UPSTASH_REDIS_REST_TOKEN=your-upstash-token
NODE_ENV=development
PAYSTACK_USE_MOCK=true
```

## Production deployment notes
- Set `NODE_ENV=production` in deployment.
- Set `PAYSTACK_USE_MOCK=false` in production when using real Paystack transactions.
- If `MONGODB_URI` is configured, the app will attempt to use MongoDB. If it is not configured, the app falls back to the in-memory repository mode.
- If Redis config is present, the app uses the configured cache layer; otherwise it falls back to local memory caching.

## Run locally
1. Install dependencies
   ```bash
   npm install
   ```
2. Configure `.env`
3. Start the server
   ```bash
   npm run dev
   ```
4. Open docs: `http://localhost:5000/api/docs`

## Testing
```bash
npm test
```
