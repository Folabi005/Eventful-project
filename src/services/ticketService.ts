import QRCode from 'qrcode';
import { ticketRepo, eventRepo, paymentRepo } from '../repositories/store';

export const ticketService = {
  purchaseTicket: async (eventId: string, userId: string, paymentReference: string) => {
    const event = eventRepo.findById(eventId);
    if (!event) {
      throw new Error('Event not found');
    }
    const payment = paymentRepo.findByReference(paymentReference);
    if (!payment || payment.userId !== userId || payment.eventId !== eventId) {
      throw new Error('Invalid payment reference for this ticket purchase');
    }
    if (payment.status !== 'completed') {
      throw new Error('Payment must be completed before purchasing a ticket');
    }

    const codePayload = JSON.stringify({ eventId, userId, paymentReference, issuedAt: new Date().toISOString() });
    const qrCodeData = await QRCode.toDataURL(codePayload);
    return ticketRepo.create(eventId, userId, qrCodeData);
  },
  listUserTickets: (userId: string) => ticketRepo.findByUser(userId),
  scanTicket: (ticketId: string) => ticketRepo.markScanned(ticketId),
};
