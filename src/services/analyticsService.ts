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
    const event = eventRepo.findById(eventId) as any;
    if (!event) {
      throw new Error('Event not found');
    }
    const tickets: any[] = (ticketRepo.findByEvent(eventId) as any[]) || [];
    const payments: any[] = (paymentRepo.findByEvent(eventId) as any[]) || [];
    return {
      eventId,
      attendeeCount: tickets.length,
      ticketsSold: tickets.length,
      scannedCount: tickets.filter((ticket: any) => ticket.scanned).length,
      paymentsProcessed: payments.length,
      totalRevenueCents: payments.reduce((sum: number, payment: any) => sum + payment.amountCents, 0),
    };
  },
  creatorStats: (creatorId: string): CreatorStats => {
    const cacheKey = `${CREATOR_ANALYTICS_CACHE_KEY}_${creatorId}`;
    const cached = cacheService.get<CreatorStats>(cacheKey);
    if (cached) return cached;

    const events: any[] = (eventRepo.findByCreator(creatorId) as any[]) || [];
    const eventIds = events.map((event: any) => event.id);
    const allTickets: any[] = eventIds.flatMap((id: string) => ticketRepo.findByEvent(id) as any[]);
    const allPayments: any[] = (paymentRepo.findByCreator(creatorId) as any[]) || [];
    const result: CreatorStats = {
      creatorId,
      totalAttendees: allTickets.length,
      totalTicketsSold: allTickets.length,
      totalScanned: allTickets.filter((ticket: any) => ticket.scanned).length,
      totalPayments: allPayments.length,
      totalRevenueCents: allPayments.reduce((sum: number, payment: any) => sum + payment.amountCents, 0),
      eventDetails: events.map((event: any) => ({
        eventId: event.id,
        title: event.title,
        ticketsSold: (ticketRepo.findByEvent(event.id) as any[]).length,
        revenueCents: (paymentRepo.findByEvent(event.id) as any[]).reduce((sum: number, payment: any) => sum + payment.amountCents, 0),
      })),
    };

    cacheService.set(cacheKey, result, 10_000);
    return result;
  },
};
