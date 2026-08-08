import { eventRepo, ticketRepo, paymentRepo } from '../repositories/store';
import { cacheService } from './cacheService';

const CREATOR_ANALYTICS_CACHE_KEY = 'creator_analytics';

export const analyticsService = {
  eventStats: (eventId: string) => {
    const event = eventRepo.findById(eventId);
    if (!event) {
      throw new Error('Event not found');
    }
    const tickets = ticketRepo.findByEvent(eventId);
    const payments = paymentRepo.findByEvent(eventId);
    return {
      eventId,
      attendeeCount: tickets.length,
      ticketsSold: tickets.length,
      scannedCount: tickets.filter((ticket) => ticket.scanned).length,
      paymentsProcessed: payments.length,
      totalRevenueCents: payments.reduce((sum, payment) => sum + payment.amountCents, 0),
    };
  },
  creatorStats: (creatorId: string) => {
    const cacheKey = `${CREATOR_ANALYTICS_CACHE_KEY}_${creatorId}`;
    const cached = cacheService.get<ReturnType<typeof analyticsService.creatorStats>>(cacheKey);
    if (cached) return cached;

    const events = eventRepo.findByCreator(creatorId);
    const eventIds = events.map((event) => event.id);
    const allTickets = eventIds.flatMap((id) => ticketRepo.findByEvent(id));
    const allPayments = paymentRepo.findByCreator(creatorId);
    const result = {
      creatorId,
      totalAttendees: allTickets.length,
      totalTicketsSold: allTickets.length,
      totalScanned: allTickets.filter((ticket) => ticket.scanned).length,
      totalPayments: allPayments.length,
      totalRevenueCents: allPayments.reduce((sum, payment) => sum + payment.amountCents, 0),
      eventDetails: events.map((event) => ({
        eventId: event.id,
        title: event.title,
        ticketsSold: ticketRepo.findByEvent(event.id).length,
        revenueCents: paymentRepo.findByEvent(event.id).reduce((sum, payment) => sum + payment.amountCents, 0),
      })),
    };

    cacheService.set(cacheKey, result, 10_000);
    return result;
  },
};
