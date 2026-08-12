import bcrypt from 'bcryptjs';
import { isPrismaReady } from '../config/database';
import {
  prismaUserRepo,
  prismaEventRepo,
  prismaTicketRepo,
  prismaPaymentRepo,
  prismaReminderRepo,
} from './prismaRepository';

export type Role = 'creator' | 'eventee';

export interface User {
  id: string;
  email: string;
  passwordHash: string;
  role: Role;
}

export interface Event {
  id: string;
  creatorId: string;
  title: string;
  description: string;
  location: string;
  startsAt: string;
  endsAt: string;
  priceCents: number;
  reminderOptions: string[];
  shareUrl: string;
}

export interface Ticket {
  id: string;
  eventId: string;
  userId: string;
  purchasedAt: string;
  qrCodeData: string;
  scanned: boolean;
}

export interface Reminder {
  id: string;
  userId: string;
  eventId: string;
  remindAt: string;
}

export interface Payment {
  id: string;
  eventId: string;
  userId: string;
  amountCents: number;
  status: 'initialized' | 'completed' | 'failed';
  reference: string;
  initializedAt: string;
}

const users: User[] = [];
const events: Event[] = [];
const tickets: Ticket[] = [];
const reminders: Reminder[] = [];
const payments: Payment[] = [];

function uuid() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

const memoryUserRepo = {
  create: (email: string, password: string, role: Role) => {
    const existing = users.find((u) => u.email === email);
    if (existing) throw new Error('Email already in use');
    const passwordHash = bcrypt.hashSync(password, 8);
    const user: User = { id: uuid(), email, passwordHash, role };
    users.push(user);
    return user;
  },
  findByEmail: (email: string) => users.find((u) => u.email === email),
  findById: (id: string) => users.find((u) => u.id === id),
};

const memoryEventRepo = {
  create: (creatorId: string, payload: Omit<Event, 'id' | 'creatorId' | 'shareUrl'>) => {
    const event: Event = {
      id: uuid(),
      creatorId,
      shareUrl: `https://eventful.example.com/events/${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      ...payload,
    };
    events.push(event);
    return event;
  },
  findById: (id: string) => events.find((event) => event.id === id),
  findByCreator: (creatorId: string) => events.filter((event) => event.creatorId === creatorId),
  findAll: () => [...events],
};

const memoryTicketRepo = {
  create: (eventId: string, userId: string, qrCodeData: string) => {
    const ticket: Ticket = {
      id: uuid(),
      eventId,
      userId,
      purchasedAt: new Date().toISOString(),
      qrCodeData,
      scanned: false,
    };
    tickets.push(ticket);
    return ticket;
  },
  findByUser: (userId: string) => tickets.filter((ticket) => ticket.userId === userId),
  findByEvent: (eventId: string) => tickets.filter((ticket) => ticket.eventId === eventId),
  findById: (id: string) => tickets.find((ticket) => ticket.id === id),
  markScanned: (id: string) => {
    const ticket = tickets.find((ticket) => ticket.id === id);
    if (!ticket) return null;
    ticket.scanned = true;
    return ticket;
  },
};

const memoryPaymentRepo = {
  create: (eventId: string, userId: string, amountCents: number, reference: string) => {
    const payment: Payment = {
      id: uuid(),
      eventId,
      userId,
      amountCents,
      status: 'initialized',
      reference,
      initializedAt: new Date().toISOString(),
    };
    payments.push(payment);
    return payment;
  },
  findByCreator: (creatorId: string) => {
    const creatorEvents = events.filter((event) => event.creatorId === creatorId).map((event) => event.id);
    return payments.filter((payment) => creatorEvents.includes(payment.eventId));
  },
  findByUser: (userId: string) => payments.filter((payment) => payment.userId === userId),
  findByEvent: (eventId: string) => payments.filter((payment) => payment.eventId === eventId),
  findByReference: (reference: string) => payments.find((payment) => payment.reference === reference),
  updateStatus: (reference: string, status: Payment['status']) => {
    const payment = payments.find((payment) => payment.reference === reference);
    if (!payment) return null;
    payment.status = status;
    return payment;
  },
};

const memoryReminderRepo = {
  create: (userId: string, eventId: string, remindAt: string) => {
    const reminder: Reminder = {
      id: uuid(),
      userId,
      eventId,
      remindAt,
    };
    reminders.push(reminder);
    return reminder;
  },
  findByUser: (userId: string) => reminders.filter((reminder) => reminder.userId === userId),
  findByEvent: (eventId: string) => reminders.filter((reminder) => reminder.eventId === eventId),
  findAll: () => [...reminders],
};

export const userRepo: any = {
  create: (...args: Parameters<typeof memoryUserRepo.create>) =>
    isPrismaReady() ? prismaUserRepo.create(...args) : memoryUserRepo.create(...args),
  findByEmail: (...args: Parameters<typeof memoryUserRepo.findByEmail>) =>
    isPrismaReady() ? prismaUserRepo.findByEmail(...args) : memoryUserRepo.findByEmail(...args),
  findById: (...args: Parameters<typeof memoryUserRepo.findById>) =>
    isPrismaReady() ? prismaUserRepo.findById(...args) : memoryUserRepo.findById(...args),
};

export const eventRepo: any = {
  create: (...args: Parameters<typeof memoryEventRepo.create>) =>
    isPrismaReady() ? prismaEventRepo.create(...args) : memoryEventRepo.create(...args),
  findById: (...args: Parameters<typeof memoryEventRepo.findById>) =>
    isPrismaReady() ? prismaEventRepo.findById(...args) : memoryEventRepo.findById(...args),
  findByCreator: (...args: Parameters<typeof memoryEventRepo.findByCreator>) =>
    isPrismaReady() ? prismaEventRepo.findByCreator(...args) : memoryEventRepo.findByCreator(...args),
  findAll: (...args: Parameters<typeof memoryEventRepo.findAll>) =>
    isPrismaReady() ? prismaEventRepo.findAll(...args) : memoryEventRepo.findAll(...args),
};

export const ticketRepo: any = {
  create: (...args: Parameters<typeof memoryTicketRepo.create>) =>
    isPrismaReady() ? prismaTicketRepo.create(...args) : memoryTicketRepo.create(...args),
  findByUser: (...args: Parameters<typeof memoryTicketRepo.findByUser>) =>
    isPrismaReady() ? prismaTicketRepo.findByUser(...args) : memoryTicketRepo.findByUser(...args),
  findByEvent: (...args: Parameters<typeof memoryTicketRepo.findByEvent>) =>
    isPrismaReady() ? prismaTicketRepo.findByEvent(...args) : memoryTicketRepo.findByEvent(...args),
  findById: (...args: Parameters<typeof memoryTicketRepo.findById>) =>
    isPrismaReady() ? prismaTicketRepo.findById(...args) : memoryTicketRepo.findById(...args),
  markScanned: (...args: Parameters<typeof memoryTicketRepo.markScanned>) =>
    isPrismaReady() ? prismaTicketRepo.markScanned(...args) : memoryTicketRepo.markScanned(...args),
};

export const paymentRepo: any = {
  create: (...args: Parameters<typeof memoryPaymentRepo.create>) =>
    isPrismaReady() ? prismaPaymentRepo.create(...args) : memoryPaymentRepo.create(...args),
  findByCreator: (...args: Parameters<typeof memoryPaymentRepo.findByCreator>) =>
    isPrismaReady() ? prismaPaymentRepo.findByCreator(...args) : memoryPaymentRepo.findByCreator(...args),
  findByUser: (...args: Parameters<typeof memoryPaymentRepo.findByUser>) =>
    isPrismaReady() ? prismaPaymentRepo.findByUser(...args) : memoryPaymentRepo.findByUser(...args),
  findByEvent: (...args: Parameters<typeof memoryPaymentRepo.findByEvent>) =>
    isPrismaReady() ? prismaPaymentRepo.findByEvent(...args) : memoryPaymentRepo.findByEvent(...args),
  findByReference: (...args: Parameters<typeof memoryPaymentRepo.findByReference>) =>
    isPrismaReady() ? prismaPaymentRepo.findByReference(...args) : memoryPaymentRepo.findByReference(...args),
  updateStatus: (...args: Parameters<typeof memoryPaymentRepo.updateStatus>) =>
    isPrismaReady() ? prismaPaymentRepo.updateStatus(...args) : memoryPaymentRepo.updateStatus(...args),
};

export const reminderRepo: any = {
  create: (...args: Parameters<typeof memoryReminderRepo.create>) =>
    isPrismaReady() ? prismaReminderRepo.create(...args) : memoryReminderRepo.create(...args),
  findByUser: (...args: Parameters<typeof memoryReminderRepo.findByUser>) =>
    isPrismaReady() ? prismaReminderRepo.findByUser(...args) : memoryReminderRepo.findByUser(...args),
  findByEvent: (...args: Parameters<typeof memoryReminderRepo.findByEvent>) =>
    isPrismaReady() ? prismaReminderRepo.findByEvent(...args) : memoryReminderRepo.findByEvent(...args),
  findAll: (...args: Parameters<typeof memoryReminderRepo.findAll>) =>
    isPrismaReady() ? prismaReminderRepo.findAll(...args) : memoryReminderRepo.findAll(...args),
};

export const store = { users, events, tickets, reminders, payments };
