import bcrypt from 'bcryptjs';

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

export const userRepo = {
  create: (email: string, password: string, role: Role) => {
    const existing = users.find((u) => u.email === email);
    if (existing) {
      throw new Error('Email already in use');
    }
    const passwordHash = bcrypt.hashSync(password, 8);
    const user: User = { id: uuid(), email, passwordHash, role };
    users.push(user);
    return user;
  },
  findByEmail: (email: string) => users.find((u) => u.email === email),
  findById: (id: string) => users.find((u) => u.id === id),
};

export const eventRepo = {
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

export const ticketRepo = {
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

export const paymentRepo = {
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

export const reminderRepo = {
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

export const store = { users, events, tickets, reminders, payments };
