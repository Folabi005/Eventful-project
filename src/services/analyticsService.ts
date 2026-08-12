import { eventRepo, ticketRepo, paymentRepo } from '../repositories/store';
import { cacheService } from './cacheService';

type EventStats = {
  eventId: string;
  attendeeCount: number;
  ticketsSold: number;
  scannedCount: number;
  paymentsProcessed: number;
  totalRevenueCents: number;
};

type CreatorStats = {
  creatorId: string;
  totalAttendees: number;
  totalTicketsSold: number;
  totalScanned: number;
  totalPayments: number;
  totalRevenueCents: number;
  eventDetails: Array<{
    eventId: string;
    title: string;
    ticketsSold: number;
    revenueCents: number;
  }>;
};

const CREATOR_ANALYTICS_CACHE_KEY = 'creator_analytics';

export const analyticsService = {
  eventStats: (eventId: string): EventStats => {
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
  creatorStats: (creatorId: string): CreatorStats => {
    const cacheKey = `${CREATOR_ANALYTICS_CACHE_KEY}_${creatorId}`;
    const cached = cacheService.get<CreatorStats>(cacheKey);
    if (cached) return cached;

    const events = eventRepo.findByCreator(creatorId);
    const eventIds = events.map((event) => event.id);
    const allTickets = eventIds.flatMap((id) => ticketRepo.findByEvent(id));
    const allPayments = paymentRepo.findByCreator(creatorId);
    const result: CreatorStats = {
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
