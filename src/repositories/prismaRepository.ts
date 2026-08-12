import bcrypt from 'bcryptjs';
import { prisma } from '../config/database';
import type { Role, User, Event, Ticket, Payment, Reminder } from './store';

export const prismaUserRepo = {
  create: async (email: string, password: string, role: Role) => {
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) throw new Error('Email already in use');

    const passwordHash = bcrypt.hashSync(password, 8);
    return prisma.user.create({
      data: { email, passwordHash, role },
    });
  },
  findByEmail: async (email: string) => prisma.user.findUnique({ where: { email } }),
  findById: async (id: string) => prisma.user.findUnique({ where: { id } }),
};

export const prismaEventRepo = {
  create: async (creatorId: string, payload: Omit<Event, 'id' | 'creatorId' | 'shareUrl'>) => {
    return prisma.event.create({
      data: {
        creatorId,
        shareUrl: `https://eventful.example.com/events/${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        ...payload,
        startsAt: new Date(payload.startsAt),
        endsAt: new Date(payload.endsAt),
      },
    });
  },
  findById: async (id: string) => prisma.event.findUnique({ where: { id } }),
  findByCreator: async (creatorId: string) => prisma.event.findMany({ where: { creatorId } }),
  findAll: async () => prisma.event.findMany(),
};

export const prismaTicketRepo = {
  create: async (eventId: string, userId: string, qrCodeData: string) => {
    return prisma.ticket.create({
      data: {
        eventId,
        userId,
        qrCodeData,
      },
    });
  },
  findByUser: async (userId: string) => prisma.ticket.findMany({ where: { userId } }),
  findByEvent: async (eventId: string) => prisma.ticket.findMany({ where: { eventId } }),
  findById: async (id: string) => prisma.ticket.findUnique({ where: { id } }),
  markScanned: async (id: string) => {
    return prisma.ticket.update({
      where: { id },
      data: { scanned: true },
    });
  },
};

export const prismaPaymentRepo = {
  create: async (eventId: string, userId: string, amountCents: number, reference: string) => {
    return prisma.payment.create({
      data: { eventId, userId, amountCents, reference, status: 'initialized' },
    });
  },
  findByCreator: async (creatorId: string) => {
    return prisma.payment.findMany({
      where: {
        event: { creatorId },
      },
    });
  },
  findByUser: async (userId: string) => prisma.payment.findMany({ where: { userId } }),
  findByEvent: async (eventId: string) => prisma.payment.findMany({ where: { eventId } }),
  findByReference: async (reference: string) => prisma.payment.findUnique({ where: { reference } }),
  updateStatus: async (reference: string, status: Payment['status']) => {
    return prisma.payment.update({
      where: { reference },
      data: { status },
    });
  },
};

export const prismaReminderRepo = {
  create: async (userId: string, eventId: string, remindAt: string) => {
    return prisma.reminder.create({
      data: {
        userId,
        eventId,
        remindAt: new Date(remindAt),
      },
    });
  },
  findByUser: async (userId: string) => prisma.reminder.findMany({ where: { userId } }),
  findByEvent: async (eventId: string) => prisma.reminder.findMany({ where: { eventId } }),
  findAll: async () => prisma.reminder.findMany(),
};
