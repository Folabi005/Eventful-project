import request from 'supertest';
import app from '../app';

describe('Eventful API', () => {
  let creatorToken = '';
  let eventeeToken = '';
  let eventId = '';
  let ticketId = '';

  beforeAll(() => {
    process.env.JWT_SECRET = 'test-secret';
  });

  it('should register an eventee', async () => {
    const response = await request(app)
      .post('/api/auth/register')
      .send({ email: 'eventee@example.com', password: 'pass1234', role: 'eventee' });

    expect(response.status).toBe(201);
    expect(response.body.user).toMatchObject({ email: 'eventee@example.com', role: 'eventee' });
    expect(response.body.token).toBeDefined();
    eventeeToken = response.body.token;
  });

  it('should register a creator', async () => {
    const response = await request(app)
      .post('/api/auth/register')
      .send({ email: 'creator@example.com', password: 'pass1234', role: 'creator' });

    expect(response.status).toBe(201);
    expect(response.body.user).toMatchObject({ email: 'creator@example.com', role: 'creator' });
    expect(response.body.token).toBeDefined();
    creatorToken = response.body.token;
  });

  it('should create an event as a creator', async () => {
    const response = await request(app)
      .post('/api/events')
      .set('Authorization', `Bearer ${creatorToken}`)
      .send({
        title: 'Concert Night',
        description: 'Live concert experience',
        location: 'City Hall',
        startsAt: '2026-12-01T19:00:00.000Z',
        endsAt: '2026-12-01T22:00:00.000Z',
        priceCents: 2500,
        reminderOptions: ['1 day before'],
      });

    expect(response.status).toBe(201);
    expect(response.body).toMatchObject({ title: 'Concert Night', creatorId: expect.any(String) });
    expect(response.body.shareUrl).toBeDefined();
    eventId = response.body.id;
  });

  it('should list events for attendees', async () => {
    const response = await request(app).get('/api/events');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body).toHaveLength(1);
  });

  it('should initialize payment and purchase a ticket for an event', async () => {
    const initResponse = await request(app)
      .post('/api/payments/initialize')
      .set('Authorization', `Bearer ${eventeeToken}`)
      .send({ eventId, amountCents: 2500 });

    expect(initResponse.status).toBe(201);
    const paymentData = initResponse.body.paymentData;
    expect(paymentData).toHaveProperty('reference');

    const verifyResponse = await request(app).get(`/api/payments/verify?reference=${paymentData.reference}`);
    expect(verifyResponse.status).toBe(200);
    expect(verifyResponse.body.verification.status).toBe(true);

    const purchaseResponse = await request(app)
      .post('/api/tickets/purchase')
      .set('Authorization', `Bearer ${eventeeToken}`)
      .send({ eventId, paymentReference: paymentData.reference });

    expect(purchaseResponse.status).toBe(201);
    expect(purchaseResponse.body).toHaveProperty('qrCodeData');
    expect(purchaseResponse.body.eventId).toBe(eventId);
    ticketId = purchaseResponse.body.id;
  });

  it('should list tickets for the eventee', async () => {
    const response = await request(app)
      .get('/api/tickets/me')
      .set('Authorization', `Bearer ${eventeeToken}`);

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body).toHaveLength(1);
    expect(response.body[0].id).toBe(ticketId);
  });

  it('should scan a ticket successfully', async () => {
    const response = await request(app).post(`/api/tickets/${ticketId}/scan`);
    expect(response.status).toBe(200);
    expect(response.body.scanned).toBe(true);
  });
});
